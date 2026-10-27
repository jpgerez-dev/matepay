import { useCallback, useEffect, useState } from 'react';
import { Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import type { AliasRecord } from '../../shared/matepay';
import { api, Balances, MatePayConfig } from '../lib/api';

let configPromise: Promise<MatePayConfig> | null = null;

export function useMatePayConfig(): MatePayConfig | null {
  const [config, setConfig] = useState<MatePayConfig | null>(null);
  useEffect(() => {
    configPromise ??= api.config().catch((err) => {
      configPromise = null;
      throw err;
    });
    configPromise.then(setConfig).catch(() => {});
  }, []);
  return config;
}

/** Saldo real (devnet) y alias de la wallet conectada. */
export function useWalletAccount() {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() ?? null;
  const [balances, setBalances] = useState<Balances | null>(null);
  const [alias, setAlias] = useState<AliasRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      const [b, a] = await Promise.all([api.balance(address), api.aliasOf(address)]);
      setBalances(b);
      setAlias(a);
    } catch {
      // El RPC público de devnet a veces tarda: mantenemos el último dato.
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    setBalances(null);
    setAlias(null);
    if (!address) return;
    refresh();
    const interval = setInterval(refresh, 20_000);
    return () => clearInterval(interval);
  }, [address, refresh]);

  return { address, balances, alias, loading, refresh, setAlias };
}

export type PayStep = 'idle' | 'building' | 'signing' | 'sending' | 'done' | 'error';

type PayParams =
  | { paymentRequestId: string }
  | { recipient: string; amountUsdc: number; reference?: string; memo?: string };

function friendlyError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (/reject|cancel|denied/i.test(message)) return 'Cancelaste la firma en tu wallet.';
  return message || 'No se pudo completar el pago.';
}

/**
 * Pago gasless: el server arma la transacción con MatePay como fee payer,
 * el usuario solo firma la transferencia de USDC y el server la envía a devnet.
 */
export function useGaslessPayment() {
  const { publicKey, signTransaction } = useWallet();
  const [step, setStep] = useState<PayStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  const pay = useCallback(
    async (params: PayParams): Promise<string | null> => {
      if (!publicKey || !signTransaction) {
        setError('Conectá tu wallet para pagar.');
        setStep('error');
        return null;
      }
      setError(null);
      setSignature(null);
      try {
        setStep('building');
        const { transaction } = await api.buildTransfer({ payer: publicKey.toBase58(), ...params });

        setStep('signing');
        const signed = await signTransaction(Transaction.from(Buffer.from(transaction, 'base64')));

        setStep('sending');
        const result = await api.submitTransfer(Buffer.from(signed.serialize()).toString('base64'));
        setSignature(result.signature);
        setStep('done');
        return result.signature;
      } catch (err) {
        setError(friendlyError(err));
        setStep('error');
        return null;
      }
    },
    [publicKey, signTransaction]
  );

  const reset = useCallback(() => {
    setStep('idle');
    setError(null);
    setSignature(null);
  }, []);

  return { pay, step, error, signature, reset };
}
