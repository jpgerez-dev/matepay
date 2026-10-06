import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Store,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Zap,
  Volume2,
  VolumeX,
  TrendingUp,
  RotateCcw,
} from 'lucide-react';
import {
  getLiveCriptoRate,
  convertArsToUsdc,
  ExchangeRate,
} from '../services/currencyService';
import { SolanaPayQr } from './SolanaPayQr';

// Generador de sonido sutil de cobro con Web Audio API (100% nativo, sin dependencias)
function playPaymentChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Acorde agradable ascendente C6 -> G6
    osc1.frequency.setValueAtTime(1046.5, now);
    osc1.frequency.exponentialRampToValueAtTime(1567.98, now + 0.12);

    osc2.frequency.setValueAtTime(1318.5, now);
    osc2.frequency.exponentialRampToValueAtTime(2093.0, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch {
    // Si el navegador bloquea audio sin interacción, ignorar
  }
}

export const LiveDemo: React.FC = () => {
  // Cotización en vivo
  const [rate, setRate] = useState<ExchangeRate>({
    compra: 1210,
    venta: 1240,
    casa: 'cripto',
    nombre: 'Dólar Cripto',
    fechaActualizacion: new Date().toISOString(),
    fuente: 'DolarAPI en vivo',
  });

  // Estado del Comercio
  const [merchantAmountArs, setMerchantAmountArs] = useState<string>('4500');
  const [merchantStep, setMerchantStep] = useState<'input' | 'qr' | 'paid'>('qr');
  const merchantAlias = '@cafemartinez';
  const merchantPubKey = '7xKXtg2CW87d97TXJSD8j9P4mZ7a8B3cDevnetDemo1';

  // Estado del Cliente
  const [clientWallet, setClientWallet] = useState({
    alias: '@roblesmaximo',
    address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    usdcBalance: 85.5,
    solBalance: 0.0, // 0 SOL: Demuestra el superpoder Gasless
  });
  const [clientStep, setClientStep] = useState<'scan' | 'confirming' | 'paid'>('scan');
  const [txReceipt, setTxReceipt] = useState<any>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Cargar cotización
  useEffect(() => {
    getLiveCriptoRate().then(setRate);
  }, []);

  const numArs = Number(merchantAmountArs) || 0;
  const numUsdc = convertArsToUsdc(numArs, rate.venta);

  // Acción: Cliente Paga en 1 Segundo
  const handleClientPay = async () => {
    setClientStep('confirming');

    // Simular el viaje en Devnet (600ms de red + Fee-Payer subsidio)
    await new Promise((r) => setTimeout(r, 700));

    const receipt = {
      amountUsdc: numUsdc,
      amountArs: numArs,
      recipient: merchantAlias,
      txSignature: '5KnP' + Math.random().toString(36).substring(2, 10) + '...devnet',
      timestamp: new Date().toLocaleTimeString('es-AR'),
    };

    setTxReceipt(receipt);
    setClientWallet((prev) => ({
      ...prev,
      usdcBalance: Number((prev.usdcBalance - numUsdc).toFixed(2)),
    }));

    // Actualizar ambas pantallas al instante en sincronía
    setClientStep('paid');
    setMerchantStep('paid');

    if (soundEnabled) {
      playPaymentChime();
    }
  };

  // Reiniciar la demo para volver a probar
  const handleResetDemo = () => {
    setMerchantStep('input');
    setClientStep('scan');
    setTxReceipt(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Presentación para el Jurado */}
      <div className="p-6 bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Simulador de Demo en Vivo · Sincronización en 1 Segundo</span>
          </div>
          <h2 className="font-['Syne'] text-2xl font-bold text-white">
            MatePay Live Demo (Comercio ⇄ Cliente)
          </h2>
          <p className="text-xs md:text-sm text-slate-300">
            A la izquierda el mostrador del comerciante; a la derecha el celular del cliente sin saldo en SOL.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800/80 border border-slate-700 rounded-lg hover:text-white transition-colors cursor-pointer"
            title="Activar/Desactivar sonido de cobro"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>Audio OFF</span>
              </>
            )}
          </button>

          <button
            onClick={handleResetDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Demo</span>
          </button>
        </div>
      </div>

      {/* Grid de Dos Dispositivos Simulados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ================= DISPOSITIVO 1: COMERCIO (POS) ================= */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
          {/* Header del Dispositivo */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-purple-400" />
              <span className="font-['Syne'] text-sm font-bold text-white">
                1. Mostrador del Comercio ({merchantAlias})
              </span>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950/70 border border-purple-800/60 px-2 py-0.5 rounded">
              POS Express
            </span>
          </div>

          {/* Estado A: Ingreso de monto */}
          {merchantStep === 'input' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl text-center space-y-1 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">Monto en Pesos:</span>
                <div className="flex items-center justify-center text-3xl font-extrabold text-white font-['Syne']">
                  ${Number(merchantAmountArs).toLocaleString('es-AR')}
                </div>
                <div className="text-xs text-purple-300 font-mono">
                  ≈ {numUsdc.toFixed(2)} USDC ($1.240 ARS)
                </div>
              </div>

              {/* Botones de preset */}
              <div className="grid grid-cols-3 gap-2">
                {[2500, 4500, 8000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMerchantAmountArs(String(val))}
                    className={`py-2 text-xs font-mono rounded-xl border transition-colors cursor-pointer ${
                      merchantAmountArs === String(val)
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:text-white'
                    }`}
                  >
                    ${val.toLocaleString('es-AR')}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setMerchantStep('qr')}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Generar QR de Cobro
              </button>
            </div>
          )}

          {/* Estado B: QR Activo */}
          {merchantStep === 'qr' && (
            <div className="space-y-4 text-center">
              <SolanaPayQr
                recipient={merchantPubKey}
                amountUsdc={numUsdc}
                amountArs={numArs}
                label={merchantAlias}
                message="Consumo Café"
              />

              <div className="p-2.5 bg-purple-950/30 border border-purple-900/50 rounded-xl flex items-center justify-center gap-2 text-xs text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>Esperando que el cliente confirme el pago...</span>
              </div>
            </div>
          )}

          {/* Estado C: Pago Recibido */}
          {merchantStep === 'paid' && txReceipt && (
            <div className="p-6 bg-emerald-950/30 border border-emerald-800/60 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase">
                  ¡Cobro Exitoso en 0.4s!
                </span>
                <h3 className="font-['Syne'] text-2xl font-bold text-white">
                  +{txReceipt.amountUsdc.toFixed(2)} USDC
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  ${txReceipt.amountArs.toLocaleString('es-AR')} ARS acreditados
                </p>
              </div>

              <div className="text-[11px] font-mono text-slate-400 p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                Firma Devnet: {txReceipt.txSignature}
              </div>

              <button
                onClick={() => setMerchantStep('input')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Nuevo Cobro
              </button>
            </div>
          )}
        </div>

        {/* ================= DISPOSITIVO 2: CLIENTE (BILLETERA) ================= */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
          {/* Header del Dispositivo */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="font-['Syne'] text-sm font-bold text-white">
                2. Celular del Cliente ({clientWallet.alias})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
                Saldo: 0.00 SOL (Sin Gas)
              </span>
            </div>
          </div>

          {clientStep !== 'paid' ? (
            <div className="space-y-4">
              {/* Saldo del usuario */}
              <div className="p-3.5 bg-slate-950 rounded-2xl flex items-center justify-between border border-slate-800 text-xs">
                <span className="text-slate-400">Saldo Disponible:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {clientWallet.usdcBalance.toFixed(2)} USDC
                </span>
              </div>

              {/* Tarjeta del Pago detectado */}
              <div className="p-4 bg-slate-950/90 border border-purple-900/50 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Destino del QR:</span>
                  <span className="font-semibold text-purple-300">{merchantAlias}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Monto en Pesos:</span>
                  <span className="font-mono text-white">${numArs.toLocaleString('es-AR')} ARS</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-1 border-t border-slate-800">
                  <span className="text-slate-200">Total a Pagar:</span>
                  <span className="font-mono text-purple-400 text-base">
                    {numUsdc.toFixed(2)} USDC
                  </span>
                </div>
              </div>

              {/* Banner Gasless */}
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex items-center gap-2 text-[11px] text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Comisión subsidiada ($0 SOL)</strong> por MatePay Fee-Payer.
                </span>
              </div>

              {/* Botón de Pago del Cliente */}
              <button
                onClick={handleClientPay}
                disabled={clientStep === 'confirming'}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-['Syne'] font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {clientStep === 'confirming' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transaccionando en Solana Devnet...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Confirmar Pago de {numUsdc.toFixed(2)} USDC</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-6 bg-slate-950/80 border border-emerald-800/60 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase">
                  Pago Enviado con Éxito
                </span>
                <h3 className="font-['Syne'] text-2xl font-bold text-white">
                  -{txReceipt.amountUsdc.toFixed(2)} USDC
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Nuevo saldo: {clientWallet.usdcBalance.toFixed(2)} USDC
                </p>
              </div>

              <div className="text-[11px] font-mono text-slate-400 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                Gas gastado: 0.00 SOL (Subsidiado)
              </div>

              <button
                onClick={() => setClientStep('scan')}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Listo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
