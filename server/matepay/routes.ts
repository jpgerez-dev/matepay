import { Express, Request, Response } from 'express';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {
  ALIAS_PATTERN,
  AliasRecord,
  HistoryItem,
  PaymentRequestDto,
  aliasRegistrationMessage,
  normalizeAlias,
} from '../../shared/matepay';
import { HttpError, asyncHandler, rateLimit } from './http';
import { JsonStore } from './store';
import {
  MAX_PAYMENT_USDC,
  USDC_MINT,
  buildGaslessUsdcTransfer,
  connection,
  demoMerchant,
  feePayer,
  fromBaseUnits,
  getBalances,
  parsePublicKey,
  submitSignedTransaction,
  toBaseUnits,
  usdcAta,
  usdcDeltaFor,
  usdcDeltas,
} from './solana';

type PaymentRequest = Omit<PaymentRequestDto, 'solanaPayUrl' | 'mode'>;

const PAYMENT_REQUEST_TTL_MS = 15 * 60 * 1000;
const ALIAS_SIGNATURE_TTL_MS = 5 * 60 * 1000;

const aliases = new JsonStore<AliasRecord>('aliases', {
  '@cafedelaesquina': {
    alias: '@cafedelaesquina',
    address: demoMerchant.publicKey.toBase58(),
    label: 'Café de la Esquina (comercio demo)',
    createdAt: new Date(0).toISOString(),
    demo: true,
  },
});
const paymentRequests = new JsonStore<PaymentRequest>('payment-requests');

function aliasOf(address: string | null): string | null {
  if (!address) return null;
  return aliases.values().find((a) => a.address === address)?.alias ?? null;
}

function roundUsdc(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) throw new HttpError(400, 'El monto tiene que ser mayor a cero.');
  if (num > MAX_PAYMENT_USDC) throw new HttpError(400, `El monto máximo es ${MAX_PAYMENT_USDC} USDC.`);
  return Math.round(num * 100) / 100;
}

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// Si la app está publicada en HTTPS usamos transaction request (gasless también desde Phantom mobile);
// en local caemos a transfer request, que cualquier wallet entiende pero cobra el gas al cliente.
function withSolanaPayUrl(pr: PaymentRequest): PaymentRequestDto {
  const appUrl = process.env.APP_URL?.replace(/\/$/, '');
  if (appUrl?.startsWith('https://')) {
    return {
      ...pr,
      mode: 'transaction-request',
      solanaPayUrl: `solana:${encodeURIComponent(`${appUrl}/api/solana-pay/${pr.id}`)}`,
    };
  }
  const query = [
    `amount=${pr.amountUsdc.toFixed(2)}`,
    `spl-token=${USDC_MINT.toBase58()}`,
    `reference=${pr.reference}`,
    `label=${encodeURIComponent(pr.recipientLabel)}`,
    `message=${encodeURIComponent(pr.message || 'Cobro MatePay')}`,
  ].join('&');
  return { ...pr, mode: 'transfer-request', solanaPayUrl: `solana:${pr.recipient}?${query}` };
}

function getPaymentRequest(id: string): PaymentRequest {
  const pr = paymentRequests.get(id);
  if (!pr) throw new HttpError(404, 'No encontramos ese cobro.');
  return pr;
}

const inflightChecks = new Map<string, Promise<PaymentRequest>>();

// Busca en la cadena una transferencia que use la reference del cobro y valida monto, token y destino.
function refreshPaymentStatus(pr: PaymentRequest): Promise<PaymentRequest> {
  if (pr.status !== 'pending') return Promise.resolve(pr);
  const existing = inflightChecks.get(pr.id);
  if (existing) return existing;

  const check = (async () => {
    const expected = toBaseUnits(pr.amountUsdc);
    const signatures = await connection.getSignaturesForAddress(
      new PublicKey(pr.reference),
      { limit: 20 },
      'confirmed'
    );

    for (const info of signatures.reverse()) {
      if (info.err) continue;
      const tx = await connection.getParsedTransaction(info.signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      });
      if (!tx?.meta) continue;
      if (usdcDeltaFor(tx, pr.recipient) < expected) continue;

      const payer = [...usdcDeltas(tx)].find(([, delta]) => delta < 0n)?.[0];
      const confirmed: PaymentRequest = {
        ...pr,
        status: 'confirmed',
        signature: info.signature,
        payer,
        confirmedAt: new Date((tx.blockTime ?? Date.now() / 1000) * 1000).toISOString(),
      };
      paymentRequests.set(pr.id, confirmed);
      return confirmed;
    }

    if (Date.now() - Date.parse(pr.createdAt) > PAYMENT_REQUEST_TTL_MS) {
      const expired: PaymentRequest = { ...pr, status: 'expired' };
      paymentRequests.set(pr.id, expired);
      return expired;
    }
    return pr;
  })().finally(() => inflightChecks.delete(pr.id));

  inflightChecks.set(pr.id, check);
  return check;
}

let feePayerBalanceCache = { value: 0, at: 0 };
async function feePayerSol(): Promise<number> {
  if (Date.now() - feePayerBalanceCache.at > 30_000) {
    feePayerBalanceCache = {
      value: (await connection.getBalance(feePayer.publicKey)) / LAMPORTS_PER_SOL,
      at: Date.now(),
    };
  }
  return feePayerBalanceCache.value;
}

export function registerMatePayRoutes(app: Express) {
  const writeLimit = rateLimit(30, 60_000);

  app.get(
    '/api/matepay/config',
    asyncHandler(async (_req, res) => {
      res.json({
        cluster: 'devnet',
        usdcMint: USDC_MINT.toBase58(),
        feePayer: feePayer.publicKey.toBase58(),
        feePayerSol: await feePayerSol(),
        maxPaymentUsdc: MAX_PAYMENT_USDC,
        demoMerchant: { alias: '@cafedelaesquina', address: demoMerchant.publicKey.toBase58() },
        solanaPayMode: process.env.APP_URL?.startsWith('https://') ? 'transaction-request' : 'transfer-request',
      });
    })
  );

  app.get(
    '/api/matepay/balance/:address',
    asyncHandler(async (req, res) => {
      const owner = parsePublicKey(req.params.address, 'la wallet');
      res.json(await getBalances(owner));
    })
  );

  // --- Alias ---

  app.get('/api/matepay/aliases', (_req: Request, res: Response) => {
    res.json(aliases.values());
  });

  app.get('/api/matepay/alias/:alias', (req: Request, res: Response) => {
    const alias = normalizeAlias(req.params.alias);
    const record = aliases.get(alias);
    if (!record) {
      res.status(404).json({ error: `No existe el alias ${alias}.` });
      return;
    }
    res.json(record);
  });

  app.get('/api/matepay/alias-of/:address', (req: Request, res: Response) => {
    const record = aliases.values().find((a) => a.address === req.params.address);
    res.json(record ?? null);
  });

  app.post(
    '/api/matepay/alias',
    writeLimit,
    asyncHandler(async (req, res) => {
      const alias = normalizeAlias(String(req.body.alias ?? ''));
      if (!ALIAS_PATTERN.test(alias)) {
        throw new HttpError(400, 'El alias tiene que tener entre 3 y 20 caracteres: letras, números o guión bajo.');
      }
      const owner = parsePublicKey(req.body.address, 'la wallet');
      const issuedAt = String(req.body.issuedAt ?? '');
      const issued = Date.parse(issuedAt);
      if (!issued || Math.abs(Date.now() - issued) > ALIAS_SIGNATURE_TTL_MS) {
        throw new HttpError(400, 'La firma venció. Volvé a intentarlo.');
      }

      let signature: Uint8Array;
      try {
        signature = bs58.decode(String(req.body.signature ?? ''));
      } catch {
        throw new HttpError(400, 'Firma inválida.');
      }
      const message = new TextEncoder().encode(
        aliasRegistrationMessage(alias, owner.toBase58(), issuedAt)
      );
      if (!nacl.sign.detached.verify(message, signature, owner.toBytes())) {
        throw new HttpError(401, 'La firma no corresponde a esa wallet.');
      }

      const existing = aliases.get(alias);
      if (existing && existing.address !== owner.toBase58()) {
        throw new HttpError(409, `${alias} ya está tomado. Probá con otro.`);
      }

      // Una wallet, un alias: si ya tenía otro, se reemplaza.
      for (const record of aliases.values()) {
        if (record.address === owner.toBase58() && record.alias !== alias) aliases.delete(record.alias);
      }

      const record: AliasRecord = {
        alias,
        address: owner.toBase58(),
        label: cleanText(req.body.label, 40) || alias,
        createdAt: new Date().toISOString(),
      };
      aliases.set(alias, record);
      res.json(record);
    })
  );

  // --- Pagos gasless ---

  app.post(
    '/api/matepay/tx/build',
    writeLimit,
    asyncHandler(async (req, res) => {
      const payer = parsePublicKey(req.body.payer, 'la wallet que paga');

      // Si paga un cobro del POS, monto y destino salen del cobro, no de lo que mande el cliente.
      if (req.body.paymentRequestId) {
        const pr = await refreshPaymentStatus(getPaymentRequest(String(req.body.paymentRequestId)));
        if (pr.status !== 'pending') {
          throw new HttpError(409, pr.status === 'confirmed' ? 'Ese cobro ya fue pagado.' : 'Ese cobro venció.');
        }
        const transaction = await buildGaslessUsdcTransfer({
          payer,
          recipient: new PublicKey(pr.recipient),
          amountUsdc: pr.amountUsdc,
          reference: new PublicKey(pr.reference),
          memo: pr.message ? `MatePay: ${pr.message}` : 'MatePay',
        });
        res.json({ transaction });
        return;
      }

      const recipient = parsePublicKey(req.body.recipient, 'el destinatario');
      const transaction = await buildGaslessUsdcTransfer({
        payer,
        recipient,
        amountUsdc: roundUsdc(req.body.amountUsdc),
        reference: req.body.reference ? parsePublicKey(req.body.reference, 'la referencia') : undefined,
        memo: cleanText(req.body.memo, 100) || 'MatePay',
      });
      res.json({ transaction });
    })
  );

  app.post(
    '/api/matepay/tx/submit',
    writeLimit,
    asyncHandler(async (req, res) => {
      const signature = await submitSignedTransaction(req.body.transaction);
      res.json({ signature });
    })
  );

  // --- Cobros del POS ---

  app.post(
    '/api/matepay/payment-requests',
    writeLimit,
    asyncHandler(async (req, res) => {
      const recipient = parsePublicKey(req.body.recipient, 'la wallet del comercio');
      if (recipient.equals(feePayer.publicKey)) throw new HttpError(400, 'Esa wallet no puede cobrar.');

      const reference = Keypair.generate().publicKey.toBase58();
      const pr: PaymentRequest = {
        id: reference,
        reference,
        recipient: recipient.toBase58(),
        recipientLabel: cleanText(req.body.recipientLabel, 40) || aliasOf(recipient.toBase58()) || 'Comercio MatePay',
        amountUsdc: roundUsdc(req.body.amountUsdc),
        amountArs: Math.max(0, Math.round(Number(req.body.amountArs) || 0)),
        rateArs: Number(req.body.rateArs) || 0,
        message: cleanText(req.body.message, 60),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      paymentRequests.set(pr.id, pr);
      res.json(withSolanaPayUrl(pr));
    })
  );

  app.get(
    '/api/matepay/payment-requests/:id',
    asyncHandler(async (req, res) => {
      const pr = await refreshPaymentStatus(getPaymentRequest(req.params.id));
      res.json(withSolanaPayUrl(pr));
    })
  );

  app.get(
    '/api/matepay/history/:address',
    asyncHandler(async (req, res) => {
      const owner = parsePublicKey(req.params.address, 'la wallet');
      const ownerStr = owner.toBase58();
      const signatures = await connection.getSignaturesForAddress(usdcAta(owner), { limit: 15 });
      if (signatures.length === 0) {
        res.json([]);
        return;
      }

      const txs = await connection.getParsedTransactions(
        signatures.map((s) => s.signature),
        { maxSupportedTransactionVersion: 0 }
      );

      const items: HistoryItem[] = signatures.map((info, i) => {
        const tx = txs[i];
        if (!tx?.meta) {
          return { signature: info.signature, blockTime: info.blockTime ?? null, amountUsdc: 0, counterparty: null, counterpartyAlias: null, failed: !!info.err };
        }
        const deltas = usdcDeltas(tx);
        const mine = deltas.get(ownerStr) ?? 0n;
        const counterparty =
          [...deltas].find(([o, d]) => o !== ownerStr && (mine < 0n ? d > 0n : d < 0n))?.[0] ?? null;
        return {
          signature: info.signature,
          blockTime: info.blockTime ?? null,
          amountUsdc: fromBaseUnits(mine),
          counterparty,
          counterpartyAlias: aliasOf(counterparty),
          failed: !!info.err,
        };
      });
      res.json(items);
    })
  );

  // --- Solana Pay Transaction Request (lo que lee Phantom al escanear el QR) ---

  const allowWallets = (_req: Request, res: Response, next: () => void) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  };

  app.options('/api/solana-pay/:id', allowWallets, (_req: Request, res: Response) => {
    res.sendStatus(204);
  });

  app.get('/api/solana-pay/:id', allowWallets, (req: Request, res: Response) => {
    const appUrl = process.env.APP_URL?.replace(/\/$/, '') ?? `${req.protocol}://${req.get('host')}`;
    res.json({ label: 'MatePay', icon: `${appUrl}/matepay-icon.svg` });
  });

  app.post(
    '/api/solana-pay/:id',
    allowWallets,
    writeLimit,
    asyncHandler(async (req, res) => {
      const pr = await refreshPaymentStatus(getPaymentRequest(req.params.id));
      if (pr.status !== 'pending') throw new HttpError(409, 'Este cobro ya no está disponible.');
      const payer = parsePublicKey(req.body.account, 'la wallet');
      const transaction = await buildGaslessUsdcTransfer({
        payer,
        recipient: new PublicKey(pr.recipient),
        amountUsdc: pr.amountUsdc,
        reference: new PublicKey(pr.reference),
        memo: pr.message ? `MatePay: ${pr.message}` : 'MatePay',
      });
      res.json({
        transaction,
        message: `Pagás ${pr.amountUsdc.toFixed(2)} USDC a ${pr.recipientLabel}. MatePay cubre la comisión de red.`,
      });
    })
  );
}
