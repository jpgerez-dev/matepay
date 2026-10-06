import React, { useState } from 'react';
import {
  Search,
  Layers,
  Sparkles,
  ArrowRight,
  Code2,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
  X,
  Zap,
} from 'lucide-react';
import { HACKATHON_PROJECTS, ProjectIdea } from '../data/hackathonData';

interface ProjectSelectorProps {
  onSelectProjectForChat: (project: ProjectIdea) => void;
  onNavigateToAnalyzer: () => void;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  onSelectProjectForChat,
  onNavigateToAnalyzer,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProject, setActiveModalProject] = useState<ProjectIdea | null>(null);

  const tracks = [
    { id: 'all', label: 'Todos los Tracks' },
    { id: 'Consumer & Blinks', label: 'Consumer & Blinks' },
    { id: 'Pagos & LATAM', label: 'Pagos & LATAM' },
    { id: 'AI x Solana', label: 'AI x Solana' },
    { id: 'Gaming & DePIN', label: 'Gaming & DePIN' },
    { id: 'DeFi Visual', label: 'DeFi Visual' },
  ];

  const filteredProjects = HACKATHON_PROJECTS.filter((project) => {
    const matchesTrack = selectedTrack === 'all' || project.track === selectedTrack;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.solution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTrack && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Presentation */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#131927] to-slate-950 border border-slate-800 p-8 md:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Hackathon Colosseum x Superteam Argentina</span>
            <span aria-hidden="true">·</span>
            <span>Perfil: Diseño Multimedial & Full Stack</span>
          </div>

          <h1 className="font-['Syne'] text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
            Selección Estratégica de Proyectos para la Hackathon
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Hola <strong className="text-white">Maximo</strong>. En Colosseum compiten cientos de desarrolladores backend, pero casi ninguno domina la <strong>experiencia sensorial, narrativa visual e interacción multimedia</strong>. Tu combinación de <em>Diseño Multimedial + Full Stack</em> es tu mayor ventaja competitiva ante los jueces.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Solana Actions & Blinks</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Three.js & Canvas Interactivo</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Anchor & Token Extensions</span>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-purple-600/10 via-indigo-600/5 to-transparent pointer-events-none" />
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Segmented controls (interactive buttons with handlers) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
          {tracks.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedTrack === track.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por tecnología, track o idea..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className="group relative flex flex-col justify-between bg-slate-900/70 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-xl"
          >
            <div className="space-y-4">
              {/* Media image if present */}
              {project.image && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white">
                    <span className="font-mono text-[11px] bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-700/60">
                      {project.badge}
                    </span>
                  </div>
                </div>
              )}

              {/* Title & Metadata without static pill sandwich */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-purple-400 font-medium">{project.track}</span>
                  <span aria-hidden="true">·</span>
                  <span>Dificultad: {project.difficulty}</span>
                </div>
                <h3 className="font-['Syne'] text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {project.subtitle}
                </p>
              </div>

              {/* Problem / Solution preview */}
              <div className="space-y-2 text-xs text-slate-400">
                <p>
                  <strong className="text-slate-200">Problema: </strong>
                  {project.problem}
                </p>
                <p>
                  <strong className="text-slate-200">Solución: </strong>
                  {project.solution}
                </p>
              </div>

              {/* Multimedia Edge Highlight */}
              <div className="p-3 bg-purple-950/20 border border-purple-900/40 rounded-xl space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tu ventaja diferencial en Diseño Multimedial:</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {project.multimediaEdge}
                </p>
              </div>

              {/* Prueba de la planilla (Kit Superteam Arg) */}
              <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1 text-xs">
                <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  Prueba de la Planilla (Superteam Arg):
                </span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {project.planillaTest}
                </p>
              </div>

              {/* Tech Stack tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono text-slate-400">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-slate-800/70 text-slate-300 px-2 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveModalProject(project)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer py-1"
              >
                <span>Ver Plan de MVP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectProjectForChat(project)}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Abrir chat con el mentor precargando este proyecto"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Consultar Mentor</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-8 space-y-3">
          <p className="text-slate-400 text-sm">No se encontraron proyectos con ese criterio.</p>
          <button
            onClick={() => {
              setSelectedTrack('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-medium text-purple-300 bg-slate-900 border border-purple-800/60 rounded-lg hover:bg-slate-800"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Project Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f141f] border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span className="text-purple-400 font-medium">{activeModalProject.track}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeModalProject.badge}</span>
                </div>
                <h2 className="font-['Syne'] text-2xl font-bold text-white">
                  {activeModalProject.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveModalProject(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-semibold text-white mb-1">Pitch Hook (Apertura ante el jurado):</h4>
                <p className="italic text-purple-300 bg-purple-950/30 p-3 rounded-xl border border-purple-900/50">
                  {activeModalProject.pitchHook}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">Integración Técnica con Solana:</h4>
                <p className="text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  {activeModalProject.solanaIntegration}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Cronograma de Ejecución para la Hackathon (3 Semanas):</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                    <span className="font-mono text-purple-400 font-semibold block mb-0.5">Semana 1: Core & Arquitectura</span>
                    <p className="text-slate-400 text-xs">{activeModalProject.mvpTimeline.week1}</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                    <span className="font-mono text-purple-400 font-semibold block mb-0.5">Semana 2: Integración Solana & Smart Contracts</span>
                    <p className="text-slate-400 text-xs">{activeModalProject.mvpTimeline.week2}</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl">
                    <span className="font-mono text-purple-400 font-semibold block mb-0.5">Semana 3: Pulido Visual, Demo Video & Pitch Deck</span>
                    <p className="text-slate-400 text-xs">{activeModalProject.mvpTimeline.week3}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">Alineación con Criterios de Colosseum:</h4>
                <p className="text-slate-400">
                  {activeModalProject.colosseumFit}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  const proj = activeModalProject;
                  setActiveModalProject(null);
                  onSelectProjectForChat(proj);
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Profundizar con el Mentor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
