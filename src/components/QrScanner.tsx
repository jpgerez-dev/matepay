import React, { useEffect, useId, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, CameraOff } from 'lucide-react';

interface QrScannerProps {
  onScan: (text: string) => void;
  onClose: () => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScan, onClose }) => {
  const elementId = `qr-reader-${useId().replace(/:/g, '')}`;
  const [error, setError] = useState<string | null>(null);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  useEffect(() => {
    const scanner = new Html5Qrcode(elementId, { verbose: false });
    let handled = false;
    const started = scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (text) => {
          if (handled) return;
          handled = true;
          onScanRef.current(text);
        },
        () => {}
      )
      .catch(() => {
        setError(
          'No pudimos abrir la cámara. Revisá los permisos del navegador (la cámara solo anda en HTTPS o localhost).'
        );
      });

    return () => {
      started.then(() => {
        if (scanner.isScanning) scanner.stop().then(() => scanner.clear()).catch(() => {});
      });
    };
  }, [elementId]);

  return (
    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-300 font-medium">Apuntá al QR del comercio</span>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          aria-label="Cerrar cámara"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error ? (
        <div className="flex items-start gap-2 p-3 text-xs text-amber-300 bg-amber-950/30 border border-amber-800/50 rounded-xl">
          <CameraOff className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      ) : (
        <div id={elementId} className="w-full overflow-hidden rounded-xl" />
      )}
    </div>
  );
};
