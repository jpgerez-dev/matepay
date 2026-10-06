import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Zap,
  RefreshCw,
  QrCode,
  DollarSign,
  Copy,
  ExternalLink,
} from 'lucide-react';
import {
  getLiveCriptoRate,
  convertArsToUsdc,
  convertUsdcToArs,
  formatARS,
  formatUSDC,
  ExchangeRate,
} from '../services/currencyService';

interface ClientPayProps {
  onPaymentComplete?: (receipt: any) => void;
}

export const ClientPay: React.FC<ClientPayProps> = ({ onPaymentComplete }) => {
  // Alias y Billetera de Destino
  const [targetInput, setTargetInput] = useState<string>('@cafemartinez');
  const [resolvedAddress, setResolvedAddress] = useState<string>(
    '7xKXtg2CW87d97TXJSD8j9P4mZ7a8B3cDevnetDemo1'
  );
  const [targetLabel, setTargetLabel] = useState<string>('Café Martinez San Martín');

  // Montos
  const [amountArs, setAmountArs] = useState<string>('4500');
  const [amountUsdc, setAmountUsdc] = useState<number>(3.63);

  // Cotización
  const [rate, setRate] = useState<ExchangeRate>({
    compra: 1210,
    venta: 1240,
    casa: 'cripto',
    nombre: 'Dólar Cripto',
    fechaActualizacion: new Date().toISOString(),
    fuente: 'DolarAPI',
  });

  // Estado de la Billetera del Cliente (Devnet)
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [userWallet, setUserWallet] = useState<{
    address: string;
    alias: string;
    usdcBalance: number;
    solBalance: number;
  }>({
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    alias: '@roblesmaximo',
    usdcBalance: 85.5,
    solBalance: 0.0, // NOTAR: 0.0 SOL! Para demostrar el superpoder Gasless
  });

  // Estado de procesamiento del pago
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'preparing' | 'subsidizing' | 'success' | 'error'
  >('idle');
  const [receipt, setReceipt] = useState<any>(null);

  // Aliases predefinidos en Argentina
  const knownAliases: Record<string, { address: string; label: string }> = {
    '@cafemartinez': {
      address: '7xKXtg2CW87d97TXJSD8j9P4mZ7a8B3cDevnetDemo1',
      label: 'Café Martinez San Martín',
    },
    '@montero': {
      address: '4uQeVj5tqViQh7yVWzmKb7P3n9A8B6cDevnetMauricio',
      label: 'Mauricio Montero (Full Stack Lead)',
    },
    '@juanpi': {
      address: '3mK9tg5VW87d97TXJSD8j9P4mZ7a8B3cDevnetJuanPablo',
      label: 'Juan Pablo Gerez (Frontend Lead)',
    },
    '@maximo': {
      address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      label: 'Máximo Robles (Diseño Multimedial)',
    },
    '@superteamarg': {
      address: 'SuperteamArgDevnetPublicAddress11111111111111',
      label: 'Superteam Argentina Hackathon Treasury',
    },
  };

  // Cargar cotización
  useEffect(() => {
    getLiveCriptoRate().then((r) => {
      setRate(r);
      const usdc = convertArsToUsdc(Number(amountArs) || 0, r.venta);
      setAmountUsdc(usdc);
    });
  }, []);

  // Recalcular montos al tipear pesos
  const handleAmountArsChange = (val: string) => {
    setAmountArs(val);
    const num = Number(val) || 0;
    const usdc = convertArsToUsdc(num, rate.venta);
    setAmountUsdc(usdc);
  };

  // Resolver alias al tipear
  useEffect(() => {
    const clean = targetInput.trim().toLowerCase();
    if (knownAliases[clean]) {
      setResolvedAddress(knownAliases[clean].address);
      setTargetLabel(knownAliases[clean].label);
    } else if (clean.startsWith('solana:')) {
      // Parsear Solana Pay URL
      try {
        const url = new URL(clean);
        const recipient = url.pathname;
        const amount = url.searchParams.get('amount');
        const label = url.searchParams.get('label');
        if (recipient) setResolvedAddress(recipient);
        if (label) setTargetLabel(decodeURIComponent(label));
        if (amount) {
          const usdcVal = Number(amount);
          setAmountUsdc(usdcVal);
          setAmountArs(String(convertUsdcToArs(usdcVal, rate.venta)));
        }
      } catch {
        // Ignorar si no es URL completa
      }
    } else if (clean.length > 30) {
      setResolvedAddress(clean);
      setTargetLabel('Billetera Solana (' + clean.slice(0, 4) + '...' + clean.slice(-4) + ')');
    }
  }, [targetInput, rate.venta]);

  // Ejecución de Pago Gasless en Solana Devnet
  const handleConfirmPayment = async () => {
    setPaymentStatus('preparing');

    // Paso 1: Preparar transacción
    await new Promise((r) => setTimeout(r, 600));
    setPaymentStatus('subsidizing'); // Fee-Payer subsidia la comisión de SOL

    // Paso 2: Fee Payer subsidia y firma
    await new Promise((r) => setTimeout(r, 800));

    // Paso 3: Confirmación en Devnet
    const newReceipt = {
      amountUsdc,
      amountArs: Number(amountArs),
      recipientLabel: targetLabel,
      recipientAddress: resolvedAddress,
      payerAddress: userWallet.address,
      payerAlias: userWallet.alias,
      timestamp: new Date().toLocaleTimeString('es-AR'),
      date: new Date().toLocaleDateString('es-AR'),
      txSignature: '5KnP' + Math.random().toString(36).substring(2, 12) + 'DevnetUSDC',
      network: 'Solana Devnet',
      feePaidBy: 'MatePay Fee-Payer (0 SOL cobrado al usuario)',
    };

    // Descontar saldo simulado
    setUserWallet((prev) => ({
      ...prev,
      usdcBalance: Number((prev.usdcBalance - amountUsdc).toFixed(2)),
    }));

    setReceipt(newReceipt);
    setPaymentStatus('success');
    if (onPaymentComplete) onPaymentComplete(newReceipt);
  };

  const handleReset = () => {
    setPaymentStatus('idle');
    setReceipt(null);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Estado 1 & 2: Formulario de Pago del Cliente */}
      {paymentStatus !== 'success' ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Header del Cliente y Billetera */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-800/70 flex items-center justify-center text-purple-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Syne'] text-sm font-bold text-white">
                    {userWallet.alias}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-1.5 py-0.2 rounded">
                    Conectado
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Saldo: <strong className="text-white">{userWallet.usdcBalance.toFixed(2)} USDC</strong> ·{' '}
                  <span className="text-amber-400/90">{userWallet.solBalance.toFixed(2)} SOL</span>
                </p>
              </div>
            </div>

            {/* Badge de Red */}
            <span className="text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-800/60 px-2.5 py-1 rounded-lg">
              Solana Devnet
            </span>
          </div>

          {/* Destinatario: Alias o Dirección */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Pagar a (Alias o Solana Pay QR):</span>
              <span className="text-[11px] text-purple-400 font-normal">
                Verificado por MatePay
              </span>
            </label>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="Ej: @cafemartinez, @mauricio, o pega solana:..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
              />
            </div>

            {/* Atajos de Aliases conocidos */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-500">Contactos rápidos:</span>
              {Object.keys(knownAliases).map((alias) => (
                <button
                  key={alias}
                  type="button"
                  onClick={() => setTargetInput(alias)}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    targetInput === alias
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {alias}
                </button>
              ))}
            </div>

            {/* Tarjeta de Destinatario Confirmado */}
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-0.5 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">Destino identificado:</span>
              <p className="font-semibold text-white">{targetLabel}</p>
              <p className="font-mono text-[11px] text-slate-500 truncate">{resolvedAddress}</p>
            </div>
          </div>

          {/* Montos a Enviar */}
          <div className="p-5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Monto a Transferir
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* En Pesos */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Monto en Pesos (ARS):</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                  <input
                    type="number"
                    value={amountArs}
                    onChange={(e) => handleAmountArsChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-7 pr-3 py-2 text-sm text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* En USDC */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Debitar en USDC:</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={`${amountUsdc.toFixed(2)} USDC`}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-sm text-purple-300 font-mono font-bold cursor-default"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-mono text-center">
              Cotización: 1 USDC = ${rate.venta.toLocaleString('es-AR')} ARS (DolarAPI en vivo)
            </p>
          </div>

          {/* Banner Explicativo: Por qué es Gasless / Sin Comisiones en SOL */}
          <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="block text-emerald-200">
                Pago 100% Subsidiado por MatePay (Gasless)
              </strong>
              <p className="text-[11px] text-emerald-400/90 leading-relaxed">
                No necesitás tener SOL en tu cuenta para pagar la comisión de red. MatePay Fee-Payer cubre el costo en Devnet para que pagues únicamente tus USDC.
              </p>
            </div>
          </div>

          {/* Botón de Confirmación */}
          <button
            onClick={handleConfirmPayment}
            disabled={amountUsdc <= 0 || paymentStatus !== 'idle'}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 disabled:opacity-40 text-white font-['Syne'] font-bold text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {paymentStatus === 'preparing' && (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Construyendo transacción en Devnet...</span>
              </>
            )}
            {paymentStatus === 'subsidizing' && (
              <>
                <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
                <span>Firmando con Fee-Payer (Sin costo de SOL)...</span>
              </>
            )}
            {paymentStatus === 'idle' && (
              <>
                <span>Pagar {amountUsdc.toFixed(2)} USDC a {targetLabel}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      ) : (
        /* Estado 3: Comprobante de Pago Confirmado para el Cliente */
        <div className="bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 border border-emerald-800/80 rounded-2xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              ¡Transferencia Exitosa en 0.4s!
            </span>
            <h3 className="font-['Syne'] text-3xl font-extrabold text-white">
              -{receipt.amountUsdc.toFixed(2)} USDC
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Equivalente a ${receipt.amountArs.toLocaleString('es-AR')} ARS
            </p>
          </div>

          {/* Ticket de Detalle */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-left space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Destinatario:</span>
              <span className="text-purple-300 font-semibold">{receipt.recipientLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fecha y Hora:</span>
              <span className="text-white">{receipt.date} - {receipt.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Comisión de Red (SOL):</span>
              <span className="text-emerald-400 font-semibold">Gratis ($0.00 SOL)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fee-Payer:</span>
              <span className="text-slate-400">{receipt.feePaidBy}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-500">Firma Devnet:</span>
              <span className="text-slate-400 truncate max-w-[180px]">{receipt.txSignature}</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3.5 px-6 bg-purple-600 hover:bg-purple-500 text-white font-['Syne'] font-bold text-sm rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Realizar Otro Pago
          </button>
        </div>
      )}
    </div>
  );
};
