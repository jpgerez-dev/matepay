import React, { useEffect, useState } from 'react';
import { QrCode, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';

interface SolanaPayQrProps {
  url: string;
  amountUsdc: number;
  amountArs: number;
  recipientLabel: string;
  mode: 'transaction-request' | 'transfer-request';
}

export const SolanaPayQr: React.FC<SolanaPayQrProps> = ({
  url,
  amountUsdc,
  amountArs,
  recipientLabel,
  mode,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(url, {
      width: 320,
      margin: 1.5,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    })
      .then((dataUrl) => {
        if (isMounted) setQrDataUrl(dataUrl);
      })
      .catch((err) => console.error('Error generando QR de Solana Pay:', err));
    return () => {
      isMounted = false;
    };
  }, [url]);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="relative p-4 bg-white rounded-2xl shadow-xl border border-slate-200">
        {qrDataUrl ? (
          <img
            src={qrDataUrl}
            alt="Código QR de Solana Pay"
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
          />
        ) : (
          <div className="w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center bg-slate-100 rounded-lg text-slate-400">
            <QrCode className="w-12 h-12 animate-pulse mb-2 text-purple-600" />
            <span className="text-xs font-medium">Generando QR...</span>
          </div>
        )}
      </div>

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
        <p className="text-[11px] text-slate-500 font-mono">Cobra: {recipientLabel}</p>
        <p className="text-[11px] text-slate-500 max-w-xs">
          {mode === 'transaction-request'
            ? 'Escaneable con MatePay o Phantom: la comisión la paga MatePay.'
            : 'Escaneá con MatePay para pagar sin SOL. Desde otra wallet el cliente paga la comisión.'}
        </p>
      </div>

      <button
        onClick={copyUrl}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>¡Link copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Copiar link de pago</span>
          </>
        )}
      </button>
    </div>
  );
};
