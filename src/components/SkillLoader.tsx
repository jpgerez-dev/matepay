import React, { useState } from 'react';
import {
  Github,
  Download,
  CheckCircle2,
  FileText,
  Plus,
  BookOpen,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  Eye,
  X,
} from 'lucide-react';
import { SkillItem, BUILT_IN_SKILLS } from '../data/hackathonData';

interface SkillLoaderProps {
  skills: SkillItem[];
  activeSkill: SkillItem | null;
  onSetActiveSkill: (skill: SkillItem | null) => void;
  onAddSkill: (newSkill: SkillItem) => void;
  onDeleteSkill: (id: string) => void;
}

export const SkillLoader: React.FC<SkillLoaderProps> = ({
  skills,
  activeSkill,
  onSetActiveSkill,
  onAddSkill,
  onDeleteSkill,
}) => {
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Manual paste state
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualContent, setManualContent] = useState<string>('');
  const [manualTags, setManualTags] = useState<string>('');

  // View skill state
  const [viewingSkill, setViewingSkill] = useState<SkillItem | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleFetchGithubSkill = async () => {
    if (!githubUrl.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/github-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: githubUrl }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error al descargar la skill desde GitHub.');
      }

      const data = await response.json();
      const newSkill: SkillItem = {
        id: `gh-${Date.now()}`,
        title: data.title || 'Skill de GitHub',
        source: data.source || githubUrl,
        type: 'github',
        description: `Importada desde GitHub (${data.source || githubUrl})`,
        content: data.content,
        tags: ['GitHub', 'Superteam Arg', 'Custom'],
      };

      onAddSkill(newSkill);
      onSetActiveSkill(newSkill);
      setSuccessMsg(`¡Skill "${newSkill.title}" importada y activada exitosamente!`);
      setGithubUrl('');
    } catch (err: any) {
      console.error('Fetch skill error:', err);
      setError(err.message || 'Error al conectar con GitHub.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveManualSkill = () => {
    if (!manualTitle.trim() || !manualContent.trim()) {
      setError('Por favor completa el título y el contenido de la skill.');
      return;
    }

    const tagsArray = manualTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newSkill: SkillItem = {
      id: `manual-${Date.now()}`,
      title: manualTitle.trim(),
      source: 'Cargada Manualmente',
      type: 'manual',
      description: 'Skill cargada manualmente por el usuario',
      content: manualContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['Manual', 'Hackathon'],
    };

    onAddSkill(newSkill);
    onSetActiveSkill(newSkill);
    setManualTitle('');
    setManualContent('');
    setManualTags('');
    setIsManualModalOpen(false);
    setSuccessMsg(`Skill "${newSkill.title}" guardada y activada.`);
  };

  const copyContent = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="p-6 md:p-8 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
              <Github className="w-4 h-4 text-purple-400" />
              <span>Gestión de Skills & Directrices Externas</span>
              <span aria-hidden="true">·</span>
              <span>GitHub Importer</span>
            </div>
            <h2 className="font-['Syne'] text-2xl md:text-3xl font-bold text-white">
              Cargar Skills de GitHub para la Hackathon
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
              Carga las directrices, documentos o skills proporcionados por Superteam Argentina o el repositorio de la hackathon. Al activar una skill, el Mentor con IA usará automáticamente todo su contenido para orientar tus decisiones y código.
            </p>
          </div>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center gap-1.5 self-start md:self-auto transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pegar Texto / Markdown</span>
          </button>
        </div>

        {/* GitHub Loader Box */}
        <div className="p-4 bg-slate-950/70 border border-slate-800/90 rounded-xl space-y-3">
          <label className="text-xs font-medium text-slate-300 block">
            Ingresa la URL del repositorio o archivo de GitHub:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Github className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="Ej: https://github.com/superteamarg/hackathon-guidelines o enlace raw a SKILL.md"
                className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleFetchGithubSkill}
              disabled={isLoading || !githubUrl.trim()}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Descargando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Importar Skill</span>
                </>
              )}
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
            <span>Ejemplos rápidos:</span>
            <button
              onClick={() => setGithubUrl('https://raw.githubusercontent.com/superteamarg/solana-bootcamp/main/README.md')}
              className="text-purple-400 hover:underline cursor-pointer"
            >
              Solana Bootcamp Arg
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setGithubUrl('https://github.com/solana-developers/program-examples')}
              className="text-purple-400 hover:underline cursor-pointer"
            >
              Solana Program Examples
            </button>
          </div>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Skills y Directrices Disponibles ({skills.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            {activeSkill ? `Activa: ${activeSkill.title}` : 'Ninguna activa (usando configuración general)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => {
            const isActive = activeSkill?.id === skill.id;
            return (
              <div
                key={skill.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-purple-950/20 border-purple-600/80 shadow-lg shadow-purple-950/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-purple-400 truncate max-w-[160px]">
                      {skill.source}
                    </span>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Activa</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onSetActiveSkill(skill)}
                        className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                      >
                        Activar
                      </button>
                    )}
                  </div>

                  <h4 className="font-['Syne'] text-base font-bold text-white line-clamp-1">
                    {skill.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setViewingSkill(skill)}
                    className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Directrices</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <button
                        onClick={() => onSetActiveSkill(null)}
                        className="text-slate-400 hover:text-rose-400 text-[11px] cursor-pointer"
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => onSetActiveSkill(skill)}
                        className="px-2.5 py-1 text-[11px] bg-purple-600 hover:bg-purple-500 text-white rounded-md cursor-pointer"
                      >
                        Usar en Chat
                      </button>
                    )}

                    {skill.type !== 'built-in' && (
                      <button
                        onClick={() => onDeleteSkill(skill.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded cursor-pointer"
                        title="Eliminar skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Paste Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f141f] border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-['Syne'] text-lg font-bold text-white">
                Cargar Skill o Directriz Manualmente
              </h3>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Título de la Skill:
                </label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Ej: Guía de Solana Blinks - Superteam Arg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Etiquetas (separadas por coma):
                </label>
                <input
                  type="text"
                  value={manualTags}
                  onChange={(e) => setManualTags(e.target.value)}
                  placeholder="Ej: Solana, Blinks, Frontend, UI/UX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Contenido de la Skill (Markdown o texto):
                </label>
                <textarea
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Pega aquí el contenido del archivo SKILL.md o las instrucciones que te compartieron..."
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveManualSkill}
                className="px-4 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-xl"
              >
                Guardar y Activar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Skill Modal */}
      {viewingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f141f] border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-purple-400">{viewingSkill.source}</span>
                <h3 className="font-['Syne'] text-xl font-bold text-white">{viewingSkill.title}</h3>
              </div>
              <button
                onClick={() => setViewingSkill(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-950/80 border border-slate-800/80 rounded-xl text-xs md:text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {viewingSkill.content}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => copyContent(viewingSkill.content)}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white py-1 px-3 bg-slate-850 border border-slate-700 rounded-lg cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? '¡Copiado!' : 'Copiar texto'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingSkill(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    onSetActiveSkill(viewingSkill);
                    setViewingSkill(null);
                  }}
                  className="px-4 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-xl cursor-pointer"
                >
                  Activar en Asistente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
