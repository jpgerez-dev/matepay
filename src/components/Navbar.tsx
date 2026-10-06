import React from 'react';
import { Sparkles, Terminal, CheckCircle2, Download } from 'lucide-react';
import { SkillItem } from '../data/hackathonData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeSkill: SkillItem | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeSkill,
}) => {
  const navItems = [
    { id: 'demo', label: '⚡ Demo en Vivo' },
    { id: 'pos', label: 'Cobro POS' },
    { id: 'client-pay', label: 'Pagar (Cliente)' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'chat', label: 'Chat Mentor' },
    { id: 'analyzer', label: 'Analizador' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark as per Top Bar contract */}
        <button
          onClick={() => setActiveTab('pos')}
          className="text-left font-['Syne'] text-lg font-bold tracking-tight text-white hover:text-purple-400 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>MatePay</span>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/70 border border-purple-800/60 px-1.5 py-0.2 rounded font-normal">
            Solana Pay
          </span>
        </button>

        {/* Zone 2: 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors cursor-pointer relative py-1 text-sm ${
                  isActive
                    ? 'text-purple-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <a
            href="/matepay-colosseum-workspace.zip"
            download="matepay-colosseum-workspace.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            title="Descargar ZIP completo para abrir en Antigravity"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Mudar a Antigravity (ZIP)</span>
          </a>

          {activeSkill ? (
            <button
              onClick={() => setActiveTab('skills')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-800/80 rounded-lg hover:bg-emerald-900/60 transition-colors whitespace-nowrap cursor-pointer"
              title={`Skill activa: ${activeSkill.title}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="max-w-[120px] truncate">{activeSkill.title}</span>
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
};
