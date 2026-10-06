import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertCircle,
  Layers,
  Presentation,
  Cpu,
  FileCode,
} from 'lucide-react';

export const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [analysisMode, setAnalysisMode] = useState<'design' | 'pitch' | 'architecture' | 'general'>('design');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Paste from clipboard support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (PNG, JPG, WebP).');
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const runAnalysis = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
          analysisMode,
          prompt: customPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar la imagen con Gemini.');
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error('Image analysis error:', err);
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const modes = [
    {
      id: 'design',
      title: 'Auditoría UI/UX Multimedia',
      desc: 'Jerarquía tipográfica, estética, contraste y microinteracciones',
      icon: Layers,
    },
    {
      id: 'pitch',
      title: 'Pitch Deck / Diapositiva',
      desc: 'Claridad en 5s, balance visual y punch narrativo',
      icon: Presentation,
    },
    {
      id: 'architecture',
      title: 'Arquitectura Solana & Flujo',
      desc: 'Flujo de billetera, RPCs, contratos y seguridad',
      icon: Cpu,
    },
    {
      id: 'general',
      title: 'Boceto a Implementación',
      desc: 'Convierte bocetos o wireframes a código React/Solana',
      icon: FileCode,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Modelo: gemini-3.1-pro-preview</span>
            <span aria-hidden="true">·</span>
            <span>Image Understanding Activo</span>
          </div>
          <h2 className="font-['Syne'] text-2xl font-bold text-white">
            Analizador Visual de Diseños y Pitch Decks
          </h2>
          <p className="text-slate-400 text-xs md:text-sm">
            Sube capturas de Figma, bocetos a mano, diapositivas de presentación o diagramas de arquitectura para recibir feedback de nivel jurado de Colosseum.
          </p>
        </div>

        {selectedImage && (
          <button
            onClick={() => {
              setSelectedImage(null);
              setAnalysisResult(null);
            }}
            className="px-3.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-850 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors self-start md:self-auto cursor-pointer"
          >
            Subir otra imagen
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Uploader & Controls */}
        <div className="lg:col-span-5 space-y-4">
          {!selectedImage ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-800 hover:border-purple-500/80 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-900/40 hover:bg-slate-900/70 transition-colors cursor-pointer min-h-[320px]"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Arrastra tu imagen o haz clic para subir
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mb-3">
                PNG, JPG o WebP. También puedes pegar una captura directamente desde el portapapeles con <kbd className="px-1.5 py-0.5 bg-slate-800 text-[10px] rounded font-mono text-slate-300">Ctrl + V</kbd>.
              </p>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
              <span className="text-xs text-purple-400 font-medium">Explorar archivos</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3] flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Previsualización para análisis"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 block">
                  Modo de Análisis:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {modes.map((m) => {
                    const Icon = m.icon;
                    const isSelected = analysisMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setAnalysisMode(m.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-950/50 border-purple-600 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                          <span className="text-xs font-semibold">{m.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{m.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Prompt */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 block">
                  Pregunta específica (opcional):
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ej: ¿Qué elementos le faltan a esta pantalla para tener calidad comercial y cómo optimizar la llamada a la acción en Solana?"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 resize-none focus:outline-none"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analizando con gemini-3.1-pro-preview...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analizar Imagen con Gemini</span>
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Column: Analysis Results */}
        <div className="lg:col-span-7">
          <div className="h-full min-h-[420px] bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-['Syne'] text-base font-bold text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>Informe de Evaluación del Mentor</span>
                </h3>
                {analysisResult && (
                  <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                    gemini-3.1-pro-preview
                  </span>
                )}
              </div>

              {isAnalyzing ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                  <p className="text-sm text-slate-300 font-medium">
                    Analizando imagen con visión multimodal profunda...
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Evaluando composición visual, jerarquía UI, consistencia de diseño y aplicabilidad para Colosseum.
                  </p>
                </div>
              ) : analysisResult ? (
                <div className="prose prose-invert max-w-none text-xs md:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans space-y-3">
                  {analysisResult}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                  <ImageIcon className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-slate-400 font-medium">Aún no has analizado ninguna imagen.</p>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Sube una maqueta, slide o boceto para recibir recomendaciones detalladas generadas con gemini-3.1-pro-preview.
                  </p>
                </div>
              )}
            </div>

            {analysisResult && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Evaluación orientada al jurado de Colosseum</span>
                <button
                  onClick={() => navigator.clipboard.writeText(analysisResult)}
                  className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
                >
                  Copiar análisis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
