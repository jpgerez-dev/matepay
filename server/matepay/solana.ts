import fs from 'fs';
import path from 'path';
import bs58 from 'bs58';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedTransactionWithMeta,
  PublicKey,
  TokenBalance,
  Transaction,
  TransactionInstruction,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { HttpError } from './http';

// Genesis hash de devnet: si el RPC apunta a otra red el server se niega a arrancar.
const DEVNET_GENESIS_HASH = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

// USDC de Circle en devnet (faucet: https://faucet.circle.com)
export const USDC_MINT = new PublicKey(
  process.env.USDC_MINT || '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
);
export const USDC_DECIMALS = 6;
export const MAX_PAYMENT_USDC = Number(process.env.MAX_PAYMENT_USDC) || 1000;

export const connection = new Connection(
  process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
  'confirmed'
);

const KEYS_DIR = path.resolve('.keys');

// Carga una wallet de devnet desde env (base58 o array JSON) o la genera en .keys/ (fuera de git).
function loadOrCreateKeypair(name: string, envVar: string): Keypair {
  const fromEnv = process.env[envVar]?.trim();
  if (fromEnv) {
    const bytes = fromEnv.startsWith('[')
      ? Uint8Array.from(JSON.parse(fromEnv))
      : bs58.decode(fromEnv);
    return Keypair.fromSecretKey(bytes);
  }

  const file = path.join(KEYS_DIR, `${name}.json`);
  if (fs.existsSync(file)) {
    return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(file, 'utf8'))));
  }

  const keypair = Keypair.generate();
  fs.mkdirSync(KEYS_DIR, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(Array.from(keypair.secretKey)));
  console.log(`[matepay] Wallet devnet "${name}" creada en ${file}: ${keypair.publicKey.toBase58()}`);
  return keypair;
}

export const feePayer = loadOrCreateKeypair('fee-payer', 'FEE_PAYER_SECRET_KEY');
// Comercio de demo: solo recibe cobros, su clave nunca firma nada en el server.
export const demoMerchant = loadOrCreateKeypair('demo-merchant', 'DEMO_MERCHANT_SECRET_KEY');

export async function assertDevnet() {
  const genesis = await connection.getGenesisHash();
  if (genesis !== DEVNET_GENESIS_HASH) {
    throw new Error(`El RPC configurado no es devnet (genesis ${genesis}). MatePay corre SOLO en devnet.`);
  }
}

export async function ensureFeePayerFunded(): Promise<number> {
  const balance = await connection.getBalance(feePayer.publicKey);
  if (balance >= 0.2 * LAMPORTS_PER_SOL) return balance;

  try {
    const signature = await connection.requestAirdrop(feePayer.publicKey, LAMPORTS_PER_SOL);
    const latest = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ signature, ...latest });
    console.log('[matepay] Airdrop de 1 SOL devnet al fee-payer OK');
  } catch {
    console.warn(
      `[matepay] El faucet rechazó el airdrop automático. Cargá SOL devnet a ${feePayer.publicKey.toBase58()} en https://faucet.solana.com`
    );
  }
  return connection.getBalance(feePayer.publicKey);
}

export function parsePublicKey(value: unknown, field: string): PublicKey {
  if (typeof value !== 'string' || !value.trim()) {
    throw new HttpError(400, `Falta ${field}.`);
  }
  try {
    return new PublicKey(value.trim());
  } catch {
    throw new HttpError(400, `${field} no es una dirección de Solana válida.`);
  }
}

export function toBaseUnits(amountUsdc: number): bigint {
  return BigInt(Math.round(amountUsdc * 10 ** USDC_DECIMALS));
}

export function fromBaseUnits(units: bigint): number {
  return Number(units) / 10 ** USDC_DECIMALS;
}

export function usdcAta(owner: PublicKey): PublicKey {
  return getAssociatedTokenAddressSync(USDC_MINT, owner, true);
}

export async function getBalances(owner: PublicKey) {
  const [lamports, usdc] = await Promise.all([
    connection.getBalance(owner),
    connection
      .getTokenAccountBalance(usdcAta(owner))
      .then((r) => Number(r.value.uiAmountString ?? 0))
      .catch(() => 0),
  ]);
  return { sol: lamports / LAMPORTS_PER_SOL, usdc };
}

interface BuildTransferParams {
  payer: PublicKey;
  recipient: PublicKey;
  amountUsdc: number;
  reference?: PublicKey;
  memo?: string;
}

/**
 * Arma una transferencia de USDC donde MatePay paga la comisión de red (fee payer)
 * y la firma parcialmente. El cliente solo firma como dueño de los USDC.
 */
export async function buildGaslessUsdcTransfer({
  payer,
  recipient,
  amountUsdc,
  reference,
  memo,
}: BuildTransferParams): Promise<string> {
  // Crítico: si el fee-payer fuese el pagador, su firma autorizaría mover sus propios fondos.
  if (payer.equals(feePayer.publicKey) || recipient.equals(feePayer.publicKey)) {
    throw new HttpError(400, 'Esa dirección no puede usarse en un pago.');
  }
  if (payer.equals(recipient)) {
    throw new HttpError(400, 'No podés pagarte a vos mismo.');
  }
  if (!Number.isFinite(amountUsdc) || amountUsdc <= 0) {
    throw new HttpError(400, 'El monto tiene que ser mayor a cero.');
  }
  if (amountUsdc > MAX_PAYMENT_USDC) {
    throw new HttpError(400, `El monto máximo por pago es ${MAX_PAYMENT_USDC} USDC.`);
  }
  const units = toBaseUnits(amountUsdc);
  if (units <= 0n) throw new HttpError(400, 'El monto es demasiado chico.');

  const payerAta = usdcAta(payer);
  const recipientAta = usdcAta(recipient);
  const [payerAccount, recipientAtaInfo] = await Promise.all([
    getAccount(connection, payerAta).catch(() => null),
    connection.getAccountInfo(recipientAta),
  ]);

  if (!payerAccount) {
    throw new HttpError(
      400,
      'Tu wallet todavía no tiene USDC de devnet. Pedilos gratis en faucet.circle.com (red Solana Devnet).'
    );
  }
  if (payerAccount.amount < units) {
    throw new HttpError(
      400,
      `Saldo insuficiente: tenés ${fromBaseUnits(payerAccount.amount).toFixed(2)} USDC y el pago es de ${amountUsdc.toFixed(2)} USDC.`
    );
  }

  const instructions: TransactionInstruction[] = [];
  if (!recipientAtaInfo) {
    // El destinatario nunca recibió USDC: MatePay le crea la cuenta y paga la renta.
    instructions.push(
      createAssociatedTokenAccountIdempotentInstruction(
        feePayer.publicKey,
        recipientAta,
        recipient,
        USDC_MINT
      )
    );
  }

  const transferIx = createTransferCheckedInstruction(
    payerAta,
    USDC_MINT,
    recipientAta,
    payer,
    units,
    USDC_DECIMALS
  );
  if (reference) {
    // Convención de Solana Pay: la reference va como cuenta de solo lectura para encontrar el pago después.
    transferIx.keys.push({ pubkey: reference, isSigner: false, isWritable: false });
  }
  instructions.push(transferIx);

  if (memo) {
    instructions.push(
      new TransactionInstruction({
        programId: MEMO_PROGRAM_ID,
        keys: [],
        data: Buffer.from(memo.slice(0, 120), 'utf8'),
      })
    );
  }

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  const tx = new Transaction({ feePayer: feePayer.publicKey, blockhash, lastValidBlockHeight }).add(
    ...instructions
  );
  tx.partialSign(feePayer);

  return tx.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64');
}

/**
 * Recibe la transacción ya firmada por el cliente, verifica que la haya armado MatePay
 * (la firma del fee-payer cubre el mensaje entero) y la envía a devnet.
 */
export async function submitSignedTransaction(base64: unknown): Promise<string> {
  if (typeof base64 !== 'string') throw new HttpError(400, 'Falta la transacción firmada.');

  let tx: Transaction;
  try {
    tx = Transaction.from(Buffer.from(base64, 'base64'));
  } catch {
    throw new HttpError(400, 'La transacción no tiene un formato válido.');
  }

  if (!tx.feePayer?.equals(feePayer.publicKey)) {
    throw new HttpError(400, 'Esta transacción no fue preparada por MatePay.');
  }
  if (!tx.verifySignatures()) {
    throw new HttpError(400, 'La transacción no está firmada correctamente.');
  }

  let signature: string;
  try {
    signature = await connection.sendRawTransaction(tx.serialize());
  } catch (err: any) {
    console.warn('[matepay] Simulación rechazada:', err?.message);
    throw new HttpError(400, 'La red rechazó la transacción. Puede que haya expirado: probá pagar de nuevo.');
  }

  const lastValidBlockHeight = (await connection.getBlockHeight()) + 150;
  const result = await connection.confirmTransaction(
    { signature, blockhash: tx.recentBlockhash!, lastValidBlockHeight },
    'confirmed'
  );
  if (result.value.err) {
    throw new HttpError(400, 'La transacción falló en la red.');
  }
  return signature;
}

// Cuánto cambió el saldo de USDC de `owner` en una transacción (en unidades base).
export function usdcDeltaFor(tx: ParsedTransactionWithMeta, owner: string): bigint {
  const mint = USDC_MINT.toBase58();
  const sum = (balances: TokenBalance[] | null | undefined) =>
    (balances ?? [])
      .filter((b) => b.owner === owner && b.mint === mint)
      .reduce((acc, b) => acc + BigInt(b.uiTokenAmount.amount), 0n);
  return sum(tx.meta?.postTokenBalances) - sum(tx.meta?.preTokenBalances);
}

// Dueños cuyo saldo de USDC cambió en la transacción, con su delta.
export function usdcDeltas(tx: ParsedTransactionWithMeta): Map<string, bigint> {
  const mint = USDC_MINT.toBase58();
  const owners = new Set<string>();
  for (const b of [...(tx.meta?.preTokenBalances ?? []), ...(tx.meta?.postTokenBalances ?? [])]) {
    if (b.mint === mint && b.owner) owners.add(b.owner);
  }
  const deltas = new Map<string, bigint>();
  for (const owner of owners) deltas.set(owner, usdcDeltaFor(tx, owner));
  return deltas;
}
