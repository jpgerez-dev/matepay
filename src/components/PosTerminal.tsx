import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  DollarSign,
  TrendingUp,
  Store,
  Delete,
  X,
  Clock,
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
import { SolanaPayQr } from './SolanaPayQr';

interface PosTerminalProps {
  merchantAlias?: string;
  merchantPublicKey?: string;
}

export const PosTerminal: React.FC<PosTerminalProps> = ({
  merchantAlias = '@cafemartinez',
  merchantPublicKey = '7xKXtg2CW87d97TXJSD8j9P4mZ7a8B3cDevnetDemo1',
}) => {
  // Estados de la cotización
  const [rate, setRate] = useState<ExchangeRate>({
    compra: 1210,
    venta: 1240,
    casa: 'cripto',
    nombre: 'Dólar Cripto (USDC)',
    fechaActualizacion: new Date().toISOString(),
    fuente: 'Cargando...',
  });
  const [isRefreshingRate, setIsRefreshingRate] = useState<boolean>(false);

  // Estados del flujo del cobro: 'input' | 'qr' | 'success'
  const [step, setStep] = useState<'input' | 'qr' | 'success'>('input');
  const [rawAmountArs, setRawAmountArs] = useState<string>('0');
  const [description, setDescription] = useState<string>('Café y tostadas');

  // Transacción confirmada
  const [lastPayment, setLastPayment] = useState<{
    amountUsdc: number;
    amountArs: number;
    timestamp: string;
    signature: string;
  } | null>(null);

  // Cargar cotización en vivo al montar
  const updateRates = async () => {
    setIsRefreshingRate(true);
    try {
      const liveRate = await getLiveCriptoRate();
      setRate(liveRate);
    } finally {
      setIsRefreshingRate(false);
    }
  };

  useEffect(() => {
    updateRates();
    // Actualizar cada 60 segundos automáticamente
    const interval = setInterval(updateRates, 60000);
    return () => clearInterval(interval);
  }, []);

  const numAmountArs = Number(rawAmountArs) || 0;
  const numAmountUsdc = convertArsToUsdc(numAmountArs, rate.venta);

  // Manejador del teclado numérico en pantalla
  const handleKeypadPress = (val: string) => {
    if (val === 'C') {
      setRawAmountArs('0');
      return;
    }
    if (val === 'DEL') {
      if (rawAmountArs.length <= 1) {
        setRawAmountArs('0');
      } else {
        setRawAmountArs(rawAmountArs.slice(0, -1));
      }
      return;
    }

    // Agregar dígitos
    if (rawAmountArs === '0') {
      if (val === '00') return;
      setRawAmountArs(val);
    } else {
      if (rawAmountArs.length >= 8) return; // Limitar longitud
      setRawAmountArs(rawAmountArs + val);
    }
  };

  const addPreset = (addVal: number) => {
    const current = Number(rawAmountArs) || 0;
    setRawAmountArs(String(current + addVal));
  };

  const handleSimulatePayment = () => {
    setLastPayment({
      amountUsdc: numAmountUsdc,
      amountArs: numAmountArs,
      timestamp: new Date().toLocaleTimeString('es-AR'),
      signature: '5Knp...' + Math.random().toString(36).substring(2, 10) + '...devnet',
    });
    setStep('success');
  };

  const resetAll = () => {
    setRawAmountArs('0');
    setStep('input');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Tarjeta de Encabezado del Comercio */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Syne'] text-sm font-bold text-white">
                MatePay POS Express
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/70 px-1.5 py-0.2 rounded">
                Devnet
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Comercio: <span className="text-purple-300 font-semibold">{merchantAlias}</span>
            </p>
          </div>
        </div>

        {/* Cotización en vivo con botón de refresh */}
        <div className="flex items-center gap-2 text-right">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dólar Cripto:</span>
            </div>
            <p className="font-mono text-xs font-bold text-white tabular-nums">
              ${rate.venta.toLocaleString('es-AR')} ARS
            </p>
          </div>

          <button
            onClick={updateRates}
            disabled={isRefreshingRate}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Actualizar cotización de DolarAPI"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshingRate ? 'animate-spin text-purple-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* VISTA 1: INGRESO DE MONTO Y TECLADO */}
      {step === 'input' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Display de Monto en ARS y conversión en USDC */}
          <div className="p-6 bg-slate-950/90 border border-slate-800/90 rounded-2xl text-center space-y-2 relative overflow-hidden">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
              Monto a Cobrar (Pesos Argentinos)
            </span>

            {/* Monto en Pesos */}
            <div className="flex items-center justify-center gap-1 text-white">
              <span className="font-['Syne'] text-2xl text-purple-400 font-bold">$</span>
              <span className="font-['Syne'] text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums">
                {Number(rawAmountArs).toLocaleString('es-AR')}
              </span>
            </div>

            {/* Conversión automática a USDC */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/50 border border-purple-800/60 rounded-xl text-purple-300 font-mono text-sm">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Equivale a: <strong className="text-white font-bold">{numAmountUsdc.toFixed(2)} USDC</strong>
              </span>
            </div>
          </div>

          {/* Presets Rápidos */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium">Montos rápidos comunes:</span>
            <div className="grid grid-cols-4 gap-2">
              {[1000, 2500, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => addPreset(preset)}
                  className="py-2 text-xs font-mono font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl transition-colors cursor-pointer"
                >
                  +${preset.toLocaleString('es-AR')}
                </button>
              ))}
            </div>
          </div>

          {/* Teclado Numérico Táctil */}
          <div className="grid grid-cols-3 gap-2.5">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '00'].map((key) => {
              const isClear = key === 'C';
              return (
                <button
                  key={key}
                  onClick={() => handleKeypadPress(key)}
                  className={`h-14 rounded-xl font-['Syne'] text-lg font-bold transition-all active:scale-95 cursor-pointer shadow-sm flex items-center justify-center ${
                    isClear
                      ? 'bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60'
                      : 'bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>

          {/* Botón de Borrar último dígito */}
          <div className="flex justify-end">
            <button
              onClick={() => handleKeypadPress('DEL')}
              className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 border border-slate-700/60 cursor-pointer"
            >
              <Delete className="w-4 h-4" />
              <span>Borrar dígito</span>
            </button>
          </div>

          {/* Concepto del cobro */}
          <div>
            <label className="text-xs text-slate-400 block mb-1">Concepto o detalle (opcional):</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: 2 Cafés + Tostadas"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Botón Principal Generar Cobro */}
          <button
            onClick={() => setStep('qr')}
            disabled={numAmountArs <= 0}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-['Syne'] font-bold text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <span>Generar Cobro QR de {numAmountUsdc.toFixed(2)} USDC</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* VISTA 2: PANTALLA DEL CÓDIGO QR SOLANA PAY */}
      {step === 'qr' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
                Solana Pay QR Activo
              </span>
              <h3 className="font-['Syne'] text-lg font-bold text-white">
                Mostrá el QR al Cliente
              </h3>
            </div>
            <button
              onClick={() => setStep('input')}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Volver a modificar monto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Render del código QR */}
          <SolanaPayQr
            recipient={merchantPublicKey}
            amountUsdc={numAmountUsdc}
            amountArs={numAmountArs}
            label={merchantAlias}
            message={description}
            onPaymentSimulated={handleSimulatePayment}
          />

          {/* Indicador de Espera */}
          <div className="p-3 bg-purple-950/30 border border-purple-900/50 rounded-xl flex items-center justify-center gap-2 text-xs text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>Esperando confirmación en Solana Devnet...</span>
          </div>

          <div className="text-center">
            <button
              onClick={() => setStep('input')}
              className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              ← Cancelar o cambiar monto
            </button>
          </div>
        </div>
      )}

      {/* VISTA 3: PANTALLA DE PAGO CONFIRMADO */}
      {step === 'success' && lastPayment && (
        <div className="bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-950 border border-emerald-800/80 rounded-2xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Checkmark animado grande */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
              ¡Transacción Confirmada en Devnet!
            </span>
            <h3 className="font-['Syne'] text-3xl font-extrabold text-white">
              +{lastPayment.amountUsdc.toFixed(2)} USDC
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Equivalente a ${lastPayment.amountArs.toLocaleString('es-AR')} ARS
            </p>
          </div>

          {/* Ticket de Resumen */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-left space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Hora:</span>
              <span className="text-white">{lastPayment.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Destino:</span>
              <span className="text-purple-300">{merchantAlias}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Concepto:</span>
              <span className="text-white">{description || 'Cobro POS'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Firma:</span>
              <span className="text-slate-400 truncate max-w-[180px]">{lastPayment.signature}</span>
            </div>
          </div>

          {/* Botón Nuevo Cobro */}
          <button
            onClick={resetAll}
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-['Syne'] font-bold text-sm rounded-xl shadow-lg transition-colors cursor-pointer"
          >
            Nuevo Cobro
          </button>
        </div>
      )}
    </div>
  );
};
