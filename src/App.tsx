import React, { useState } from 'react';
import { Navbar, SHOW_STUDIO } from './components/Navbar';
import { ProjectSelector } from './components/ProjectSelector';
import { ChatMentor } from './components/ChatMentor';
import { ImageAnalyzer } from './components/ImageAnalyzer';
import { SkillLoader } from './components/SkillLoader';
import { JudgingCriteria } from './components/JudgingCriteria';
import { PosTerminal } from './components/PosTerminal';
import { ClientPay } from './components/ClientPay';
import { LiveDemo } from './components/LiveDemo';
import { Account } from './components/Account';
import { BUILT_IN_SKILLS, SkillItem, ProjectIdea } from './data/hackathonData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('demo');
  const [skills, setSkills] = useState<SkillItem[]>(BUILT_IN_SKILLS);
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(BUILT_IN_SKILLS[0]);
  const [initialProjectForChat, setInitialProjectForChat] = useState<ProjectIdea | null>(null);

  const handleSelectProjectForChat = (project: ProjectIdea) => {
    setInitialProjectForChat(project);
    setActiveTab('chat');
  };

  const handleAddSkill = (newSkill: SkillItem) => {
    setSkills((prev) => [newSkill, ...prev]);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
    if (activeSkill?.id === id) {
      setActiveSkill(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Bar adheres to 3-zone contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'demo' && <LiveDemo />}

        {activeTab === 'pos' && <PosTerminal />}

        {activeTab === 'client-pay' && <ClientPay />}

        {activeTab === 'account' && <Account />}

        {SHOW_STUDIO && activeTab === 'projects' && (
          <ProjectSelector
            onSelectProjectForChat={handleSelectProjectForChat}
            onNavigateToAnalyzer={() => setActiveTab('analyzer')}
          />
        )}

        {SHOW_STUDIO && activeTab === 'chat' && (
          <ChatMentor
            activeSkill={activeSkill}
            initialProjectContext={initialProjectForChat}
            onClearInitialProjectContext={() => setInitialProjectForChat(null)}
          />
        )}

        {SHOW_STUDIO && activeTab === 'analyzer' && <ImageAnalyzer />}

        {SHOW_STUDIO && activeTab === 'skills' && (
          <SkillLoader
            skills={skills}
            activeSkill={activeSkill}
            onSetActiveSkill={setActiveSkill}
            onAddSkill={handleAddSkill}
            onDeleteSkill={handleDeleteSkill}
          />
        )}

        {SHOW_STUDIO && activeTab === 'criteria' && <JudgingCriteria />}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/60 bg-slate-950/60 px-6 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>MatePay · Pagos en USDC con Solana Pay · Solo devnet: la plata es de prueba</span>
          <span>Montero · Gerez · Robles — Colosseum x Superteam Argentina</span>
        </div>
      </footer>
    </div>
  );
}
