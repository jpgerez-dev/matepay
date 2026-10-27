// Código compartido entre el server y el front: si cambia acá, cambia en los dos lados.

export const ALIAS_PATTERN = /^@[a-z0-9_]{3,20}$/;
const BASE58_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function normalizeAlias(raw: string): string {
  const clean = raw.trim().toLowerCase();
  return clean.startsWith('@') ? clean : `@${clean}`;
}

// Mensaje que la wallet firma para demostrar que es dueña de la dirección al registrar un alias.
export function aliasRegistrationMessage(alias: string, address: string, issuedAt: string): string {
  return [
    'MatePay (Solana devnet)',
    `Registrar alias ${alias}`,
    `Wallet: ${address}`,
    `Fecha: ${issuedAt}`,
  ].join('\n');
}

export type PaymentTarget =
  | { kind: 'alias'; alias: string }
  | { kind: 'address'; address: string }
  | {
      kind: 'transfer-request';
      recipient: string;
      amount?: number;
      reference?: string;
      label?: string;
      message?: string;
    }
  | { kind: 'payment-request'; id: string };

/**
 * Interpreta lo que el cliente escribe o escanea: @alias, dirección,
 * link de Solana Pay (transfer request) o link de cobro de MatePay (transaction request).
 * Nunca pasa a minúsculas las direcciones: base58 distingue mayúsculas.
 */
export function parsePaymentTarget(raw: string): PaymentTarget | null {
  const input = raw.trim();
  if (!input) return null;

  if (input.startsWith('@') || /^[a-z0-9_]{3,20}$/.test(input)) {
    const alias = normalizeAlias(input);
    return ALIAS_PATTERN.test(alias) ? { kind: 'alias', alias } : null;
  }

  if (BASE58_ADDRESS.test(input)) return { kind: 'address', address: input };

  if (!input.toLowerCase().startsWith('solana:')) return null;
  const body = input.slice('solana:'.length);

  // Transaction request: solana:<https-url-encodeada>
  const decoded = safeDecode(body);
  if (/^https?:\/\//i.test(decoded)) {
    const match = new URL(decoded).pathname.match(/\/api\/solana-pay\/([1-9A-HJ-NP-Za-km-z]{32,44})$/);
    return match ? { kind: 'payment-request', id: match[1] } : null;
  }

  // Transfer request: solana:<recipient>?amount=..&reference=..&label=..
  const [recipient, query = ''] = body.split('?');
  if (!BASE58_ADDRESS.test(recipient)) return null;
  const params = new URLSearchParams(query);
  const amount = params.get('amount');
  return {
    kind: 'transfer-request',
    recipient,
    amount: amount ? Number(amount) : undefined,
    reference: params.get('reference') ?? undefined,
    label: params.get('label') ?? undefined,
    message: params.get('message') ?? undefined,
  };
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export interface PaymentRequestDto {
  id: string;
  reference: string;
  recipient: string;
  recipientLabel: string;
  amountUsdc: number;
  amountArs: number;
  rateArs: number;
  message: string;
  status: 'pending' | 'confirmed' | 'expired';
  signature?: string;
  payer?: string;
  createdAt: string;
  confirmedAt?: string;
  solanaPayUrl: string;
  mode: 'transaction-request' | 'transfer-request';
}

export interface AliasRecord {
  alias: string;
  address: string;
  label: string;
  createdAt: string;
  demo?: boolean;
}

export interface HistoryItem {
  signature: string;
  blockTime: number | null;
  amountUsdc: number;
  counterparty: string | null;
  counterpartyAlias: string | null;
  failed: boolean;
}
