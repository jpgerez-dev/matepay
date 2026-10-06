import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Video, Sparkles, ExternalLink } from 'lucide-react';

export const JudgingCriteria: React.FC = () => {
  const criteria = [
    {
      percentage: '30%',
      title: 'Producto y Utilidad Real',
      desc: '¿Resuelve un problema tangible para usuarios reales en Web3 o en el mundo real? Se premian proyectos con un caso de uso evidente y modelos sostenibles.',
      tips: [
        'Enfócate en un solo dolor bien resuelto antes que en 10 funciones mediocres.',
        'Explica con claridad quién es tu usuario final (ej: creadores de contenido, usuarios de remesas en Argentina, gamers).',
      ],
    },
    {
      percentage: '25%',
      title: 'Ejecución Técnica & Robustez',
      desc: '¿El software funciona de verdad? ¿Está desplegado en Devnet/Mainnet? ¿La arquitectura es limpia y maneja errores?',
      tips: [
        'Asegura que tu demo en vivo nunca crashee ante el jurado.',
        'Documenta el README de GitHub con instrucciones paso a paso para correr el proyecto localmente.',
      ],
    },
    {
      percentage: '20%',
      title: 'Integración Nativa con Solana',
      desc: '¿Aprovecha de forma insustituible las ventajas de Solana (alta velocidad, comisiones casi nulas, Solana Blinks, Token-2022, cNFTs)?',
      tips: [
        'Si tu app podría correr igual en una base de datos SQL Web2 tradicional, el jurado bajará la nota.',
        'Destaca en tu pitch por qué Solana es el motor fundamental del producto.',
      ],
    },
    {
      percentage: '15%',
      title: 'UI/UX & Experiencia de Usuario',
      desc: 'Claridad visual, accesibilidad, feedback inmediato de transacciones y diseño atractivo que elimine la fricción cripto.',
      tips: [
        '¡Aquí tienes tu mayor ventaja competitiva como estudiante de Diseño Multimedial!',
        'Reemplaza las pantallas de carga aburridas por animaciones fluidas y microinteracciones de confirmación.',
      ],
    },
    {
      percentage: '10%',
      title: 'Calidad del Pitch & Video Demo',
      desc: 'Un video de máximo 3 minutos impecablemente editado, con audio nítido y demostración del producto en funcionamiento.',
      tips: [
        'No gastes más de 30 segundos en la introducción o diapositivas estáticas.',
        'Dedica al menos 90 segundos a mostrar la aplicación funcionando en vivo.',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-8 bg-gradient-to-br from-slate-900 via-[#131927] to-slate-950 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
          <Award className="w-4 h-4 text-purple-400" />
          <span>Rúbrica Oficial de Evaluación</span>
          <span aria-hidden="true">·</span>
          <span>Colosseum Global & Superteam Argentina</span>
        </div>
        <h2 className="font-['Syne'] text-3xl font-bold text-white">
          Cómo Evalúan los Jueces en Colosseum
        </h2>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
          Para maximizar tus posibilidades de ganar premios globales y los bounties regionales de Superteam Argentina, tu proyecto debe alinearse milimétricamente con esta rúbrica.
        </p>
      </div>

      {/* Grid of criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {criteria.map((item, index) => (
          <div
            key={index}
            className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-purple-400">
                  {item.percentage}
                </span>
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  Criterio {index + 1}
                </span>
              </div>

              <h3 className="font-['Syne'] text-lg font-bold text-white">
                {item.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1.5 text-[11px]">
              <span className="font-semibold text-purple-300 block mb-1">
                Consejo clave:
              </span>
              {item.tips.map((tip, tipIdx) => (
                <div key={tipIdx} className="flex items-start gap-1.5 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Superteam Arg Specific Box */}
        <div className="p-6 bg-gradient-to-br from-purple-950/30 to-indigo-950/30 border border-purple-800/60 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Superteam Argentina Bounties</span>
            </div>
            <h3 className="font-['Syne'] text-lg font-bold text-white">
              El Factor Local en Argentina
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Superteam Argentina apoya a los constructores locales con mentorías directas, premios adicionales y acceso a la comunidad. Muestra cómo tu solución impacta en la comunidad de habla hispana o resuelve problemas reales de adopción cotidiana.
            </p>
          </div>

          <div className="p-3 bg-purple-900/30 border border-purple-700/40 rounded-xl text-xs text-purple-200">
            <strong>Checklist final:</strong> Código en GitHub público, video demo en YouTube/Loom (sin contraseña), y formulario de entrega en Colosseum completado 24 horas antes del cierre.
          </div>
        </div>
      </div>
    </div>
  );
};
