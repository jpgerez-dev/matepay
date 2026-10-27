// Smoke test de la API de MatePay contra un server corriendo (devnet).
// Uso: npx tsx scripts/smoke-test.ts [http://localhost:3000]
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Keypair, Transaction } from '@solana/web3.js';
import { aliasRegistrationMessage } from '../shared/matepay';

const BASE = process.argv[2] || 'http://localhost:3000';
let failures = 0;

async function call(path: string, body?: unknown) {
  const res = await fetch(BASE + path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, body: await res.json() };
}

function check(name: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${ok ? '' : ` -> ${JSON.stringify(detail)}`}`);
  if (!ok) failures++;
}

const config = (await call('/api/matepay/config')).body;
check('config devnet', config.cluster === 'devnet', config);

// Alias firmado por una wallet nueva
const user = Keypair.generate();
const alias = `@smoke_${Date.now().toString(36)}`;
const issuedAt = new Date().toISOString();
const message = aliasRegistrationMessage(alias, user.publicKey.toBase58(), issuedAt);
const signature = bs58.encode(nacl.sign.detached(new TextEncoder().encode(message), user.secretKey));

const reg = await call('/api/matepay/alias', {
  alias,
  address: user.publicKey.toBase58(),
  label: 'Smoke test',
  issuedAt,
  signature,
});
check('registrar alias con firma válida', reg.status === 200, reg.body);
check('resolver alias', (await call(`/api/matepay/alias/${alias.slice(1)}`)).body.address === user.publicKey.toBase58());

const intruder = Keypair.generate();
const steal = await call('/api/matepay/alias', {
  alias,
  address: intruder.publicKey.toBase58(),
  label: 'x',
  issuedAt,
  signature, // firma de otra wallet
});
check('rechaza firma de otra wallet', steal.status === 401, steal.body);

// Cobro + transacción gasless
const pr = (
  await call('/api/matepay/payment-requests', {
    recipient: config.demoMerchant.address,
    amountUsdc: 1.5,
    amountArs: 1860,
    rateArs: 1240,
    message: 'smoke test ñandú',
  })
).body;
check('crear cobro', pr.status === 'pending' && pr.solanaPayUrl.startsWith('solana:'), pr);

const noUsdc = await call('/api/matepay/tx/build', { payer: user.publicKey.toBase58(), paymentRequestId: pr.id });
check('wallet sin USDC recibe error claro', noUsdc.status === 400 && /faucet/.test(noUsdc.body.error), noUsdc.body);

const selfPay = await call('/api/matepay/tx/build', {
  payer: config.feePayer,
  recipient: config.demoMerchant.address,
  amountUsdc: 1,
});
check('fee-payer no puede ser pagador', selfPay.status === 400, selfPay.body);

const unsigned = await call('/api/matepay/tx/submit', { transaction: 'AAAA' });
check('submit rechaza basura', unsigned.status === 400, unsigned.body);

// Si se pasa una wallet con USDC devnet, valida la estructura de la tx armada (no la firma ni la envía).
const payerWithUsdc = process.env.SMOKE_PAYER;
if (payerWithUsdc) {
  const built = await call('/api/matepay/tx/build', { payer: payerWithUsdc, paymentRequestId: pr.id });
  check('armar tx gasless', built.status === 200, built.body);
  if (built.status === 200) {
    const tx = Transaction.from(Buffer.from(built.body.transaction, 'base64'));
    const feeSig = tx.signatures.find((s) => s.publicKey.toBase58() === config.feePayer);
    check('fee payer = MatePay', tx.feePayer?.toBase58() === config.feePayer);
    check('MatePay ya firmó', !!feeSig?.signature);
    check(
      'firma del fee payer válida',
      !!feeSig?.signature && nacl.sign.detached.verify(tx.serializeMessage(), feeSig.signature, feeSig.publicKey.toBytes())
    );
    check(
      'reference incluida',
      tx.instructions.some((ix) => ix.keys.some((k) => k.pubkey.toBase58() === pr.reference))
    );
  }
}

console.log(failures ? `\n${failures} fallas` : '\nTodo OK');
process.exit(failures ? 1 : 0);
