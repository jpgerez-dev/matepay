import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Cpu,
  Layers,
  Award,
  BookOpen,
  Trash2,
} from 'lucide-react';
import { SkillItem, ProjectIdea } from '../data/hackathonData';

interface Message {
  role: 'user' | 'model';
  content: string;
  modelUsed?: string;
}

interface ChatMentorProps {
  activeSkill: SkillItem | null;
  initialProjectContext?: ProjectIdea | null;
  onClearInitialProjectContext?: () => void;
}

export const ChatMentor: React.FC<ChatMentorProps> = ({
  activeSkill,
  initialProjectContext,
  onClearInitialProjectContext,
}) => {
  const [role, setRole] = useState<'mentor' | 'architect' | 'designer' | 'pitch'>('mentor');
  const [model, setModel] = useState<string>('gemini-3.5-flash');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: `¡Buenas Máximo! Un gustazo. Acá tu compañero de equipo y mentor para la hackathon **Colosseum Crypto World's Fair x Superteam Argentina**, con el kit oficial \`workspace-colosseum\` cargado y activo.

Como sos estudiante de **Licenciatura en Diseño Multimedial** y estás metiéndole al **desarrollo full stack**, tenés una ventaja gigante: el 95% de los proyectos son técnicamente funcionales pero visualmente toscos e imposibles de entender en 3 minutos.

Recordá las reglas maestras de la sede:
1. **"Construir es barato con IA; elegir qué construir no."**
2. **La prueba de la planilla:** si la idea andaría igual con un Excel y Mercado Pago, todavía no necesita Solana.
3. **Modo devnet siempre** (nada de plata real ni mainnet).

Podés usar directamente los comandos del kit acá abajo (\`/solana-tuc-idea\`, \`/solana-tuc-validar\`, \`/solana-tuc-mvp\`, etc.) o preguntarme lo que necesites. ¿Arrancamos?`,
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // If a project context was passed from ProjectSelector, prompt immediately or pre-fill
  useEffect(() => {
    if (initialProjectContext) {
      const prompt = `Hola Mentor. Me interesa profundizar en el proyecto "${initialProjectContext.title}" (${initialProjectContext.track}).
      
Problema: ${initialProjectContext.problem}
Solución: ${initialProjectContext.solution}

Como estudiante de Diseño Multimedial + Full Stack, ¿cómo me recomiendas estructurar la arquitectura técnica y el Wow-Factor visual para ganar en Colosseum y destacar ante Superteam Argentina?`;

      setInputMessage(prompt);
      if (onClearInitialProjectContext) {
        onClearInitialProjectContext();
      }
    }
  }, [initialProjectContext, onClearInitialProjectContext]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    const updatedMessages: Message[] = [
      ...messages,
      { role: 'user', content: userText },
    ];

    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          role,
          model,
          activeSkillContext: activeSkill ? activeSkill.content : '',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al comunicarse con el servidor.');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: data.reply,
          modelUsed: data.modelUsed,
        },
      ]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: `⚠️ Hubo un error al procesar tu mensaje: ${error.message}. Por favor intenta de nuevo.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'model',
        content:
          'Historial reiniciado. ¿Sobre qué aspecto de la hackathon te gustaría consultar ahora?',
        modelUsed: model,
      },
    ]);
  };

  const roleDefinitions = [
    {
      id: 'mentor',
      title: 'Mentor Colosseum',
      desc: 'Estrategia general y criterios de evaluación',
      icon: Award,
    },
    {
      id: 'architect',
      title: 'Arquitecto Full Stack',
      desc: 'Solana, Anchor, Blinks & Web3.js',
      icon: Cpu,
    },
    {
      id: 'designer',
      title: 'Director Multimedia & UX',
      desc: 'Three.js, animaciones y micro-interacciones',
      icon: Layers,
    },
    {
      id: 'pitch',
      title: 'Pitch & Demo Coach',
      desc: 'Narrativa, guion de 3 min y presentación',
      icon: Zap,
    },
  ];

  const quickPrompts = [
    '¿Cómo estructurar mi MVP en 3 semanas para no quedarme sin tiempo?',
    '¿Qué valoran más los jueces de Colosseum y Superteam Arg en la demo?',
    '¿Cómo integrar Solana Blinks o Actions en un proyecto de diseño multimedia?',
    'Escribe un guión de pitch de 3 minutos para el proyecto SolMotion.',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[640px] bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Controls Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 space-y-3">
        {/* Roles row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-xl overflow-x-auto">
            {roleDefinitions.map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={r.desc}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{r.title}</span>
                </button>
              );
            })}
          </div>

          {/* Model Selector & Active Skill Badge */}
          <div className="flex items-center gap-2">
            {activeSkill && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-800/80 px-2.5 py-1 rounded-lg">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px] max-w-[130px] truncate">
                  Skill: {activeSkill.title}
                </span>
              </div>
            )}

            {/* Model Selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 hidden lg:inline">Modelo:</span>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500 font-mono"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (General & Rápido)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Razonamiento Complejo)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Veloz)</option>
              </select>
            </div>

            <button
              onClick={clearChat}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reiniciar conversación"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Thread (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-purple-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`relative max-w-[85%] md:max-w-[78%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-purple-600/90 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 text-[11px] opacity-75">
                  <span className="font-mono">
                    {isUser ? 'Maximo Robles' : 'Mentor Colosseum'}
                  </span>
                  {!isUser && msg.modelUsed && (
                    <span className="font-mono text-[10px] text-purple-300">
                      {msg.modelUsed}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="whitespace-pre-wrap font-sans space-y-2">
                  {msg.content}
                </div>

                {/* Copy button */}
                <button
                  onClick={() => copyToClipboard(msg.content, index)}
                  className="absolute bottom-2 right-2 text-slate-400 hover:text-white p-1 rounded transition-colors opacity-60 hover:opacity-100"
                  title="Copiar respuesta"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-purple-400 border border-slate-700 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Pensando con {model}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Kit Commands Bar (workspace-colosseum) */}
      <div className="px-4 py-2 bg-purple-950/25 border-t border-purple-900/40 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        <span className="text-[11px] font-mono text-purple-300 font-semibold whitespace-nowrap flex items-center gap-1">
          Kit Tucumán:
        </span>
        {[
          { cmd: '/solana-tuc-status', label: 'Status' },
          { cmd: '/solana-tuc-idea', label: 'Idea' },
          { cmd: '/solana-tuc-validar', label: 'Validar' },
          { cmd: '/solana-tuc-mvp', label: 'MVP' },
          { cmd: '/solana-tuc-planificar', label: 'Plan' },
          { cmd: '/solana-tuc-pitch', label: 'Pitch' },
        ].map((item) => (
          <button
            key={item.cmd}
            type="button"
            onClick={() => setInputMessage(item.cmd)}
            className="px-2 py-0.5 text-[11px] font-mono font-medium text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/50 rounded transition-colors whitespace-nowrap cursor-pointer"
            title={`Comando del kit: ${item.cmd}`}
          >
            {item.cmd}
          </button>
        ))}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[11px] text-slate-500 whitespace-nowrap">Sugerencias:</span>
        {quickPrompts.map((promptText, i) => (
          <button
            key={i}
            onClick={() => setInputMessage(promptText)}
            className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-3"
        >
          <div className="flex-1 bg-slate-950 border border-slate-800 focus-within:border-purple-500 rounded-xl transition-colors">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregúntale al mentor sobre selección de proyectos, código de Solana, arquitectura o diseño..."
              rows={2}
              className="w-full bg-transparent px-3.5 py-2.5 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 resize-none focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="h-10 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 font-medium text-xs"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
