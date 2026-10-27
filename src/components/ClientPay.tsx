import React, { useEffect, useState } from 'react';
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Search,
  Zap,
  RefreshCw,
  QrCode,
  ExternalLink,
  BadgeCheck,
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  getLiveCriptoRate,
  convertArsToUsdc,
  convertUsdcToArs,
  ExchangeRate,
} from '../services/currencyService';
import { AliasRecord, PaymentRequestDto, parsePaymentTarget } from '../../shared/matepay';
import { api, explorerTxUrl, shortAddress } from '../lib/api';
import { useGaslessPayment, useWalletAccount } from '../hooks/useMatePay';
import { QrScanner } from './QrScanner';

interface ClientPayProps {
  initialTarget?: string;
  onPaid?: (signature: string) => void;
}

interface ResolvedTarget {
  address: string;
  label: string;
  verifiedAlias?: string;
  reference?: string;
  fixedAmountUsdc?: number;
  paymentRequest?: PaymentRequestDto;
}

interface Receipt {
  signature: string;
  amountUsdc: number;
  amountArs: number;
  recipientLabel: string;
  at: Date;
}

const STEP_LABELS = {
  building: 'Armando la transacción...',
  signing: 'Confirmá en tu wallet...',
  sending: 'Enviando a Solana devnet...',
} as const;

export const ClientPay: React.FC<ClientPayProps> = ({ initialTarget = '', onPaid }) => {
  const { connected } = useWallet();
  const account = useWalletAccount();
  const payment = useGaslessPayment();

  const [targetInput, setTargetInput] = useState(initialTarget);
  const [target, setTarget] = useState<ResolvedTarget | null>(null);
  const [resolveError, setResolveError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [contacts, setContacts] = useState<AliasRecord[]>([]);
  const [scannerOpen, setScannerOpen] = useState(false);

  const [amountArs, setAmountArs] = useState('');
  const [rate, setRate] = useState<ExchangeRate | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  useEffect(() => {
    getLiveCriptoRate().then(setRate);
    api.aliases().then(setContacts).catch(() => {});
  }, []);

  useEffect(() => setTargetInput(initialTarget), [initialTarget]);

  // Resolver lo que escribe o escanea el cliente, con un pequeño debounce.
  useEffect(() => {
    setTarget(null);
    setResolveError(null);
    const parsed = parsePaymentTarget(targetInput);
    if (!targetInput.trim()) return;
    if (!parsed) {
      setResolveError('Escribí un @alias, una dirección de Solana o escaneá un QR.');
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setResolving(true);
      try {
        let resolved: ResolvedTarget;
        if (parsed.kind === 'alias') {
          const record = await api.resolveAlias(parsed.alias);
          resolved = { address: record.address, label: record.label, verifiedAlias: record.alias };
        } else if (parsed.kind === 'address') {
          resolved = { address: parsed.address, label: `Wallet ${shortAddress(parsed.address)}` };
        } else if (parsed.kind === 'payment-request') {
          const pr = await api.paymentRequest(parsed.id);
          if (pr.status === 'confirmed') throw new Error('Este cobro ya fue pagado.');
          if (pr.status === 'expired') throw new Error('Este cobro venció. Pedile al comercio uno nuevo.');
          resolved = {
            address: pr.recipient,
            label: pr.recipientLabel,
            fixedAmountUsdc: pr.amountUsdc,
            paymentRequest: pr,
          };
        } else {
          resolved = {
            address: parsed.recipient,
            label: parsed.label || `Wallet ${shortAddress(parsed.recipient)}`,
            reference: parsed.reference,
            fixedAmountUsdc: parsed.amount,
          };
          // Si es un cobro de MatePay, usamos los datos del server (monto y destino verificados).
          if (parsed.reference) {
            const pr = await api.paymentRequest(parsed.reference).catch(() => null);
            if (pr?.status === 'confirmed') throw new Error('Este cobro ya fue pagado.');
            if (pr?.status === 'pending') {
              resolved = { address: pr.recipient, label: pr.recipientLabel, fixedAmountUsdc: pr.amountUsdc, paymentRequest: pr };
            }
          }
        }
        if (!resolved.verifiedAlias) {
          const known = await api.aliasOf(resolved.address).catch(() => null);
          if (known) resolved.verifiedAlias = known.alias;
        }
        if (!cancelled) setTarget(resolved);
      } catch (err) {
        if (!cancelled) setResolveError(err instanceof Error ? err.message : 'No pudimos resolver el destino.');
      } finally {
        if (!cancelled) setResolving(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [targetInput]);

  const rateVenta = rate?.venta ?? 0;
  const amountUsdc = target?.fixedAmountUsdc ?? convertArsToUsdc(Number(amountArs) || 0, rateVenta);
  const displayArs =
    target?.paymentRequest?.amountArs ||
    (target?.fixedAmountUsdc ? convertUsdcToArs(target.fixedAmountUsdc, rateVenta) : Number(amountArs) || 0);

  const usdcBalance = account.balances?.usdc ?? 0;
  const insufficient = account.balances !== null && amountUsdc > usdcBalance;
  const isPaying = payment.step === 'building' || payment.step === 'signing' || payment.step === 'sending';
  const isOwnWallet = target?.address === account.address;
  const canPay = connected && target && amountUsdc > 0 && !insufficient && !isPaying && !isOwnWallet;

  const handlePay = async () => {
    if (!target) return;
    const signature = await payment.pay(
      target.paymentRequest
        ? { paymentRequestId: target.paymentRequest.id }
        : { recipient: target.address, amountUsdc, reference: target.reference, memo: `MatePay a ${target.label}` }
    );
    if (!signature) return;
    setReceipt({ signature, amountUsdc, amountArs: displayArs, recipientLabel: target.label, at: new Date() });
    account.refresh();
    onPaid?.(signature);
  };

  const handleReset = () => {
    payment.reset();
    setReceipt(null);
    setTargetInput('');
    setAmountArs('');
  };

  if (receipt) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 border border-emerald-800/80 rounded-2xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              Pago confirmado en Solana devnet
            </span>
            <h3 className="font-['Syne'] text-3xl font-extrabold text-white">
              -{receipt.amountUsdc.toFixed(2)} USDC
            </h3>
            {receipt.amountArs > 0 && (
              <p className="text-xs text-slate-400 font-mono">
                Equivalente a ${receipt.amountArs.toLocaleString('es-AR')} ARS
              </p>
            )}
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-left space-y-2 text-xs font-mono text-slate-300">
            <Row label="Destinatario" value={receipt.recipientLabel} highlight />
            <Row label="Fecha y hora" value={receipt.at.toLocaleString('es-AR')} />
            <Row label="Comisión de red" value="La pagó MatePay (0 SOL para vos)" />
            <div className="flex justify-between gap-3 pt-1 border-t border-slate-800">
              <span className="text-slate-500 shrink-0">Firma</span>
              <a
                href={explorerTxUrl(receipt.signature)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-purple-300 hover:text-purple-200 truncate"
              >
                <span className="truncate">{shortAddress(receipt.signature)}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3.5 px-6 bg-purple-600 hover:bg-purple-500 text-white font-['Syne'] font-bold text-sm rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Hacer otro pago
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        {/* Wallet del cliente */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-xl bg-purple-950/80 border border-purple-800/70 flex items-center justify-center text-purple-400">
              <Wallet className="w-4 h-4" />
            </div>
            {connected && account.address ? (
              <div className="min-w-0">
                <span className="font-['Syne'] text-sm font-bold text-white block truncate">
                  {account.alias?.alias ?? shortAddress(account.address)}
                </span>
                <p className="text-[11px] text-slate-400 font-mono">
                  {account.balances ? (
                    <>
                      <strong className="text-white">{account.balances.usdc.toFixed(2)} USDC</strong> ·{' '}
                      <span className="text-amber-400/90">{account.balances.sol.toFixed(3)} SOL</span>
                    </>
                  ) : (
                    'Cargando saldo...'
                  )}
                </p>
              </div>
            ) : (
              <span className="text-sm text-slate-300">Conectá tu wallet para pagar</span>
            )}
          </div>
          <WalletMultiButton />
        </div>

        {/* Destinatario */}
        <div className="space-y-2">
          <label htmlFor="pay-target" className="text-xs font-medium text-slate-300 block">
            ¿A quién le pagás?
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="pay-target"
                type="text"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="@alias, dirección o link solana:"
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono"
              />
            </div>
            <button
              type="button"
              onClick={() => setScannerOpen((v) => !v)}
              className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 cursor-pointer"
              aria-label="Escanear QR"
              title="Escanear QR"
            >
              <QrCode className="w-5 h-5" />
            </button>
          </div>

          {scannerOpen && (
            <QrScanner
              onScan={(text) => {
                setTargetInput(text);
                setScannerOpen(false);
              }}
              onClose={() => setScannerOpen(false)}
            />
          )}

          {contacts.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500">Alias registrados:</span>
              {contacts
                .filter((c) => c.address !== account.address)
                .slice(0, 6)
                .map((c) => (
                  <button
                    key={c.alias}
                    type="button"
                    onClick={() => setTargetInput(c.alias)}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      targetInput === c.alias ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.alias}
                  </button>
                ))}
            </div>
          )}

          {resolving && <p className="text-[11px] text-slate-500">Buscando destino...</p>}
          {resolveError && (
            <p className="flex items-center gap-1.5 text-[11px] text-rose-300">
              <AlertCircle className="w-3.5 h-3.5" /> {resolveError}
            </p>
          )}
          {target && (
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-0.5 text-xs">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-white">{target.label}</p>
                {target.verifiedAlias && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-1.5 rounded">
                    <BadgeCheck className="w-3 h-3" /> {target.verifiedAlias}
                  </span>
                )}
              </div>
              <p className="font-mono text-[11px] text-slate-500 break-all">{target.address}</p>
              {!target.verifiedAlias && (
                <p className="text-[11px] text-amber-300/90 pt-1">
                  Esta dirección no tiene alias registrado: verificá que sea la correcta.
                </p>
              )}
              {isOwnWallet && <p className="text-[11px] text-rose-300 pt-1">Es tu propia wallet.</p>}
            </div>
          )}
        </div>

        {/* Monto */}
        <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Monto</span>
          {target?.fixedAmountUsdc ? (
            <div className="text-center space-y-1">
              <p className="font-['Syne'] text-3xl font-extrabold text-white">{target.fixedAmountUsdc.toFixed(2)} USDC</p>
              {displayArs > 0 && (
                <p className="text-xs text-slate-400 font-mono">≈ ${displayArs.toLocaleString('es-AR')} ARS</p>
              )}
              <p className="text-[11px] text-slate-500">Monto fijado por el comercio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pay-ars" className="text-[11px] text-slate-400 block mb-1">
                  En pesos (ARS)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                  <input
                    id="pay-ars"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={amountArs}
                    onChange={(e) => setAmountArs(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-7 pr-3 py-2 text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Se debitan</span>
                <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-purple-300 font-mono font-bold">
                  {amountUsdc.toFixed(2)} USDC
                </div>
              </div>
            </div>
          )}
          {rate && (
            <p className="text-[11px] text-slate-500 font-mono text-center">
              1 USDC = ${rate.venta.toLocaleString('es-AR')} ARS · {rate.fuente}
            </p>
          )}
        </div>

        {insufficient && (
          <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs text-amber-200">
            No te alcanza el saldo ({usdcBalance.toFixed(2)} USDC). Pedí USDC de prueba en{' '}
            <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="underline">
              faucet.circle.com
            </a>{' '}
            eligiendo Solana Devnet.
          </div>
        )}

        <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-400/90 leading-relaxed">
            <strong className="text-emerald-200">No necesitás SOL.</strong> MatePay paga la comisión de red: tu wallet
            solo firma la transferencia de USDC.
          </p>
        </div>

        {payment.error && (
          <p className="flex items-center gap-1.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" /> {payment.error}
          </p>
        )}

        {connected ? (
          <button
            onClick={handlePay}
            disabled={!canPay}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-['Syne'] font-bold text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isPaying ? (
              <>
                {payment.step === 'signing' ? (
                  <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
                ) : (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                )}
                <span>{STEP_LABELS[payment.step as keyof typeof STEP_LABELS]}</span>
              </>
            ) : (
              <>
                <span className="truncate">
                  Pagar {amountUsdc.toFixed(2)} USDC{target ? ` a ${target.label}` : ''}
                </span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </>
            )}
          </button>
        ) : (
          <div className="flex justify-center">
            <WalletMultiButton />
          </div>
        )}
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between gap-3">
    <span className="text-slate-500 shrink-0">{label}</span>
    <span className={`text-right ${highlight ? 'text-purple-300 font-semibold' : 'text-white'}`}>{value}</span>
  </div>
);
