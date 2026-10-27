import type { AliasRecord, HistoryItem, PaymentRequestDto } from '../../shared/matepay';

export interface MatePayConfig {
  cluster: 'devnet';
  usdcMint: string;
  feePayer: string;
  feePayerSol: number;
  maxPaymentUsdc: number;
  demoMerchant: { alias: string; address: string };
  solanaPayMode: 'transaction-request' | 'transfer-request';
}

export interface Balances {
  sol: number;
  usdc: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Error ${res.status}`);
  return body as T;
}

const post = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) });

export const api = {
  config: () => request<MatePayConfig>('/api/matepay/config'),
  balance: (address: string) => request<Balances>(`/api/matepay/balance/${address}`),
  history: (address: string) => request<HistoryItem[]>(`/api/matepay/history/${address}`),

  aliases: () => request<AliasRecord[]>('/api/matepay/aliases'),
  resolveAlias: (alias: string) =>
    request<AliasRecord>(`/api/matepay/alias/${encodeURIComponent(alias)}`),
  aliasOf: (address: string) => request<AliasRecord | null>(`/api/matepay/alias-of/${address}`),
  registerAlias: (body: {
    alias: string;
    address: string;
    label: string;
    issuedAt: string;
    signature: string;
  }) => post<AliasRecord>('/api/matepay/alias', body),

  buildTransfer: (body: {
    payer: string;
    paymentRequestId?: string;
    recipient?: string;
    amountUsdc?: number;
    reference?: string;
    memo?: string;
  }) => post<{ transaction: string }>('/api/matepay/tx/build', body),
  submitTransfer: (transaction: string) =>
    post<{ signature: string }>('/api/matepay/tx/submit', { transaction }),

  createPaymentRequest: (body: {
    recipient: string;
    recipientLabel?: string;
    amountUsdc: number;
    amountArs: number;
    rateArs: number;
    message: string;
  }) => post<PaymentRequestDto>('/api/matepay/payment-requests', body),
  paymentRequest: (id: string) => request<PaymentRequestDto>(`/api/matepay/payment-requests/${id}`),
};

export const explorerTxUrl = (signature: string) =>
  `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

export const explorerAddressUrl = (address: string) =>
  `https://explorer.solana.com/address/${address}?cluster=devnet`;

export const shortAddress = (address: string) => `${address.slice(0, 4)}…${address.slice(-4)}`;
