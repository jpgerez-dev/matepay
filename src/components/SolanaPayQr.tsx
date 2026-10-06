import React, { useEffect, useState, useRef } from 'react';
import { QrCode, CheckCircle2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface SolanaPayQrProps {
  recipient: string;
  amountUsdc: number;
  amountArs: number;
  label?: string;
  message?: string;
  reference?: string;
  onPaymentSimulated?: () => void;
}

export const SolanaPayQr: React.FC<SolanaPayQrProps> = ({
  recipient,
  amountUsdc,
  amountArs,
  label = 'MatePay Express',
  message = 'Cobro en comercio',
  reference = 'MatePayRef' + Math.floor(Math.random() * 1000000),
  onPaymentSimulated,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Mint oficial de USDC en Solana Devnet:
  const USDC_DEVNET_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';

  // URL estándar de Solana Pay para SPL Tokens
  const solanaPayUrl = `solana:${recipient}?amount=${amountUsdc}&spl-token=${USDC_DEVNET_MINT}&reference=${reference}&label=${encodeURIComponent(
    label
  )}&message=${encodeURIComponent(message)}`;

  useEffect(() => {
    let isMounted = true;

    // Generar código QR de alta resolución con estética oscura
    QRCode.toDataURL(solanaPayUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generando QR de Solana Pay:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [solanaPayUrl]);

  const copyUrl = () => {
    navigator.clipboard.writeText(solanaPayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      {/* Contenedor del QR de alta resolución */}
      <div className="relative p-4 bg-white rounded-2xl shadow-xl border border-slate-200 group">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Código QR Solana Pay"
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
          />
        ) : (
          <div className="w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center bg-slate-100 rounded-lg text-slate-400">
            <QrCode className="w-12 h-12 animate-pulse mb-2 text-purple-600" />
            <span className="text-xs font-medium">Generando QR de Solana Pay...</span>
          </div>
        )}

        {/* Badge distintivo de Solana Pay en el centro */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 p-2 rounded-xl border border-slate-800 shadow-lg pointer-events-none">
          <span className="font-['Syne'] font-extrabold text-xs text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
            SOL
          </span>
        </div>
      </div>

      {/* Montos y Detalles */}
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="font-['Syne'] text-2xl font-bold text-white tabular-nums tracking-tight">
            {amountUsdc.toFixed(2)} USDC
          </span>
          <span className="text-xs font-mono text-purple-400 bg-purple-950/70 border border-purple-800/80 px-2 py-0.5 rounded">
            Devnet
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Equivalente a: <strong className="text-slate-200">${amountArs.toLocaleString('es-AR')} ARS</strong>
        </p>
        <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">
          Destino: {recipient}
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={copyUrl}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>¡URL Copiada!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copiar Solana Pay URL</span>
            </>
          )}
        </button>

        {onPaymentSimulated && (
          <button
            onClick={onPaymentSimulated}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors cursor-pointer"
            title="Simula que el cliente escaneó y confirmó el pago desde Phantom"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simular Pago Exitoso</span>
          </button>
        )}
      </div>
    </div>
  );
};
