import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Las herramientas internas del equipo (chat con Gemini, analizador, skills) quedan fuera
// del producto salvo que se active VITE_SHOW_STUDIO=true.
export const SHOW_STUDIO = import.meta.env.VITE_SHOW_STUDIO === 'true';

const PRODUCT_TABS = [
  { id: 'demo', label: 'Demo en vivo' },
  { id: 'pos', label: 'Cobrar' },
  { id: 'client-pay', label: 'Pagar' },
  { id: 'account', label: 'Mi cuenta' },
];

const STUDIO_TABS = [
  { id: 'projects', label: 'Proyectos' },
  { id: 'chat', label: 'Mentor' },
  { id: 'analyzer', label: 'Analizador' },
  { id: 'skills', label: 'Skills' },
];

export const NAV_TABS = SHOW_STUDIO ? [...PRODUCT_TABS, ...STUDIO_TABS] : PRODUCT_TABS;

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => setActiveTab('demo')}
          className="text-left font-['Syne'] text-lg font-bold tracking-tight text-white hover:text-purple-400 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>MatePay</span>
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/70 border border-purple-800/60 px-1.5 rounded font-normal">
            devnet
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_TABS.map((item) => (
            <TabButton key={item.id} {...item} active={activeTab === item.id} onClick={setActiveTab} />
          ))}
        </nav>

        <WalletMultiButton />
      </div>

      {/* Pestañas en celular */}
      <nav className="md:hidden flex gap-5 overflow-x-auto px-4 pb-2 text-sm font-medium">
        {NAV_TABS.map((item) => (
          <TabButton key={item.id} {...item} active={activeTab === item.id} onClick={setActiveTab} />
        ))}
      </nav>
    </header>
  );
};

const TabButton: React.FC<{ id: string; label: string; active: boolean; onClick: (id: string) => void }> = ({
  id,
  label,
  active,
  onClick,
}) => (
  <button
    onClick={() => onClick(id)}
    className={`relative py-1 whitespace-nowrap transition-colors cursor-pointer ${
      active ? 'text-purple-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    {label}
    {active && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
    )}
  </button>
);
