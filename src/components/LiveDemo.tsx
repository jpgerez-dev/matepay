import React, { useState } from 'react';
import { Smartphone, Store, Volume2, VolumeX, Info } from 'lucide-react';
import type { PaymentRequestDto } from '../../shared/matepay';
import { useMatePayConfig } from '../hooks/useMatePay';
import { PosTerminal } from './PosTerminal';
import { ClientPay } from './ClientPay';

export const LiveDemo: React.FC = () => {
  const config = useMatePayConfig();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeRequest, setActiveRequest] = useState<PaymentRequestDto | null>(null);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-emerald-950/40 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Transacciones reales en Solana devnet</span>
          </div>
          <h2 className="font-['Syne'] text-2xl font-bold text-white">MatePay en vivo: comercio ⇄ cliente</h2>
          <p className="text-xs md:text-sm text-slate-300">
            A la izquierda, el mostrador de {config?.demoMerchant.alias ?? 'un comercio demo'}. A la derecha, tu wallet:
            pagás en USDC sin tener SOL.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-800/80 border border-slate-700 rounded-lg hover:text-white transition-colors cursor-pointer"
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
      </div>

      <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p>
          Para probar necesitás Phantom en modo devnet (Configuración → Developer settings → Testnet mode) y USDC de
          prueba de{' '}
          <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="text-purple-300 underline">
            faucet.circle.com
          </a>{' '}
          (Solana Devnet). No hace falta SOL.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 font-['Syne'] text-sm font-bold text-white">
            <Store className="w-4 h-4 text-purple-400" /> 1. Mostrador del comercio
          </h3>
          {config ? (
            <PosTerminal
              merchant={{
                address: config.demoMerchant.address,
                alias: config.demoMerchant.alias,
                label: 'Café de la Esquina',
              }}
              initialAmountArs="4500"
              soundEnabled={soundEnabled}
              // Al confirmarse el cobro el cliente queda montado para mostrar su comprobante.
              onRequestCreated={(pr) => pr && setActiveRequest(pr)}
            />
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-900/60 border border-slate-800 rounded-2xl">
              Conectando con el servidor de MatePay...
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="flex items-center gap-2 font-['Syne'] text-sm font-bold text-white">
            <Smartphone className="w-4 h-4 text-emerald-400" /> 2. Celular del cliente
          </h3>
          {activeRequest ? (
            <ClientPay key={activeRequest.id} initialTarget={activeRequest.solanaPayUrl} />
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl">
              Generá un cobro en el mostrador y el cliente lo va a “escanear” acá.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
