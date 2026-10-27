import React, { useEffect, useState } from 'react';
import bs58 from 'bs58';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  AtSign,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Droplets,
} from 'lucide-react';
import { ALIAS_PATTERN, HistoryItem, aliasRegistrationMessage, normalizeAlias } from '../../shared/matepay';
import { api, explorerAddressUrl, explorerTxUrl, shortAddress } from '../lib/api';
import { useWalletAccount } from '../hooks/useMatePay';

export const Account: React.FC = () => {
  const { connected, signMessage } = useWallet();
  const account = useWalletAccount();

  const [aliasInput, setAliasInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [aliasError, setAliasError] = useState<string | null>(null);
  const [aliasSaved, setAliasSaved] = useState(false);

  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async () => {
    if (!account.address) return;
    setHistoryLoading(true);
    try {
      setHistory(await api.history(account.address));
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    setHistory(null);
    loadHistory();
  }, [account.address]);

  useEffect(() => {
    setAliasInput(account.alias?.alias ?? '');
    setLabelInput(account.alias?.label ?? '');
  }, [account.alias?.alias]);

  const registerAlias = async () => {
    if (!account.address || !signMessage) {
      setAliasError('Tu wallet no permite firmar mensajes.');
      return;
    }
    const alias = normalizeAlias(aliasInput);
    if (!ALIAS_PATTERN.test(alias)) {
      setAliasError('Entre 3 y 20 caracteres: letras minúsculas, números o guión bajo.');
      return;
    }
    setSaving(true);
    setAliasError(null);
    setAliasSaved(false);
    try {
      const issuedAt = new Date().toISOString();
      const message = aliasRegistrationMessage(alias, account.address, issuedAt);
      const signature = await signMessage(new TextEncoder().encode(message));
      const record = await api.registerAlias({
        alias,
        address: account.address,
        label: labelInput,
        issuedAt,
        signature: bs58.encode(signature),
      });
      account.setAlias(record);
      setAliasSaved(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setAliasError(/reject|cancel/i.test(msg) ? 'Cancelaste la firma.' : msg);
    } finally {
      setSaving(false);
    }
  };

  if (!connected || !account.address) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-4">
        <h2 className="font-['Syne'] text-xl font-bold text-white">Tu cuenta MatePay</h2>
        <p className="text-sm text-slate-400">
          Conectá tu wallet de Solana (devnet) para ver tu saldo, tus movimientos y registrar tu @alias.
        </p>
        <div className="flex justify-center">
          <WalletMultiButton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Saldo */}
      <section className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Saldo en devnet</span>
            <p className="font-['Syne'] text-3xl font-extrabold text-white">
              {account.balances ? `${account.balances.usdc.toFixed(2)} USDC` : '—'}
            </p>
            <p className="text-xs text-slate-500 font-mono">
              {account.balances ? `${account.balances.sol.toFixed(3)} SOL (no lo necesitás para pagar)` : 'Cargando...'}
            </p>
          </div>
          <button
            onClick={() => {
              account.refresh();
              loadHistory();
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
            aria-label="Actualizar"
          >
            <RefreshCw className={`w-4 h-4 ${account.loading || historyLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <a
          href={explorerAddressUrl(account.address)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-300 break-all"
        >
          {account.address} <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
        {account.balances?.usdc === 0 && (
          <div className="flex items-start gap-2 p-3 bg-sky-950/30 border border-sky-800/50 rounded-xl text-xs text-sky-200">
            <Droplets className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Todavía no tenés USDC de prueba. Pedilos gratis en{' '}
              <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="underline">
                faucet.circle.com
              </a>{' '}
              (elegí Solana Devnet y pegá tu dirección).
            </p>
          </div>
        )}
      </section>

      {/* Alias */}
      <section className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <div>
          <h3 className="flex items-center gap-2 font-['Syne'] text-base font-bold text-white">
            <AtSign className="w-4 h-4 text-purple-400" /> Tu alias
          </h3>
          <p className="text-xs text-slate-400">
            Para que te paguen escribiendo @alias en lugar de una dirección larga. Lo firmás con tu wallet, así nadie
            puede registrar un alias a tu nombre.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="alias" className="text-[11px] text-slate-400 block mb-1">
              Alias
            </label>
            <input
              id="alias"
              value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value.toLowerCase())}
              placeholder="@tunombre"
              autoComplete="off"
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="alias-label" className="text-[11px] text-slate-400 block mb-1">
              Nombre visible
            </label>
            <input
              id="alias-label"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder="Ej: Kiosco Don Pepe"
              maxLength={40}
              className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
            />
          </div>
        </div>
        {aliasError && (
          <p className="flex items-center gap-1.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" /> {aliasError}
          </p>
        )}
        {aliasSaved && account.alias && (
          <p className="flex items-center gap-1.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Listo: ya te pueden pagar a {account.alias.alias}.
          </p>
        )}
        <button
          onClick={registerAlias}
          disabled={saving || !aliasInput.trim()}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl cursor-pointer"
        >
          {saving ? 'Firmá en tu wallet...' : account.alias ? 'Actualizar alias' : 'Registrar alias'}
        </button>
      </section>

      {/* Movimientos */}
      <section className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
        <h3 className="font-['Syne'] text-base font-bold text-white">Movimientos en USDC</h3>
        {history === null ? (
          <p className="text-xs text-slate-500">Cargando...</p>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-500">Todavía no hay movimientos.</p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {history.map((item) => {
              const incoming = item.amountUsdc > 0;
              return (
                <li key={item.signature} className="py-2.5 flex items-center gap-3 text-xs">
                  <span
                    className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${
                      incoming ? 'bg-emerald-950/60 text-emerald-400' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {incoming ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">
                      {item.failed
                        ? 'Transacción fallida'
                        : `${incoming ? 'De' : 'A'} ${item.counterpartyAlias ?? (item.counterparty ? shortAddress(item.counterparty) : 'desconocido')}`}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.blockTime ? new Date(item.blockTime * 1000).toLocaleString('es-AR') : 'Pendiente'}
                    </p>
                  </div>
                  <a
                    href={explorerTxUrl(item.signature)}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-mono font-semibold flex items-center gap-1 ${
                      incoming ? 'text-emerald-300' : 'text-slate-200'
                    }`}
                  >
                    {incoming ? '+' : ''}
                    {item.amountUsdc.toFixed(2)}
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};
