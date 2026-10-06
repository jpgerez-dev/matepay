export interface ProjectIdea {
  id: string;
  title: string;
  subtitle: string;
  track: 'Consumer & Blinks' | 'Pagos & LATAM' | 'AI x Solana' | 'Gaming & DePIN' | 'DeFi Visual';
  badge: string;
  problem: string;
  solution: string;
  multimediaEdge: string;
  solanaIntegration: string;
  pitchHook: string;
  colosseumFit: string;
  difficulty: 'Media' | 'Media-Alta' | 'Alta';
  techStack: string[];
  mvpTimeline: {
    week1: string;
    week2: string;
    week3: string;
  };
  image?: string;
  planillaTest: string; // "La prueba de la planilla" from workspace-colosseum
}

export interface SkillItem {
  id: string;
  title: string;
  source: string;
  type: 'built-in' | 'github' | 'manual';
  description: string;
  content: string;
  tags: string[];
  isDefault?: boolean;
}

export const HACKATHON_PROJECTS: ProjectIdea[] = [
  {
    id: 'solmotion-blinks',
    title: 'SolMotion Studio & Blinks',
    subtitle: 'Suite de micro-animaciones interactivas y canvas generativo monetizable en X con Solana Blinks',
    track: 'Consumer & Blinks',
    badge: 'Máximo Impacto Visual',
    problem: 'El 90% de los creadores de contenido multimedia no pueden monetizar assets interactivos o animaciones directamente en redes sociales sin mandar al usuario a páginas externas llenas de fricción.',
    solution: 'Una plataforma web donde diseñadores multimediales publican mini-experiencias interactivas (WebGL/Canvas) que se pueden compartir como Solana Actions y Blinks en Twitter/X o Farcaster, permitiendo a los usuarios interactuar y apoyar o coleccionar el asset con 1 click.',
    multimediaEdge: 'Aprovecha al 100% tu formación en diseño multimedial: shaders en WebGL, sonido háptico, micro-interacciones cinematográficas y storytelling visual que cautivará inmediatamente a los jueces de Colosseum.',
    solanaIntegration: 'Solana Actions & Blinks (spec oficial Dialect), micro-transacciones en USDC/SOL con comisiones casi nulas, y minteo ultra-económico con Solana State Compression (cNFTs) en devnet.',
    pitchHook: '"Transformamos el arte multimedia interactivo en transacciones de 1 solo clic directo en el feed de X con Solana Blinks."',
    colosseumFit: 'Colosseum y la Fundación Solana están impulsando masivamente el ecosistema de Blinks y aplicaciones de consumo directo con gran UX.',
    difficulty: 'Media',
    techStack: ['React', 'Three.js / Canvas', '@solana/actions', '@solana/web3.js', 'Tailwind CSS'],
    mvpTimeline: {
      week1: 'Editor de canvas multimedia básico y exportador de metadata compatible con el estándar Action/Blink.',
      week2: 'Integración del endpoint API de Solana Action (unfurl de X) y pagos en Devnet.',
      week3: 'Diseño de la landing de showcase, 3 demos interactivas pulidas y video de pitch de 3 minutos.',
    },
    image: '/src/assets/images/project_solmotion_preview_1791050859899.jpg',
    planillaTest: '¿Andaría igual con una planilla y Mercado Pago? NO: los Blinks ejecutan transacciones cripto seguras y descentralizadas directamente dentro del feed de Twitter/X y Farcaster sin intermediarios centralizados.',
  },
  {
    id: 'matepay-latam',
    title: 'MatePay: Pagos Sociales P2P',
    subtitle: 'La app de pagos crypto P2P más fluida de LATAM, con división de cuentas y QR interoperable',
    track: 'Pagos & LATAM',
    badge: 'Favorito Superteam Arg',
    problem: 'En Argentina la adopción de stablecoins (USDC/USDT) es masiva para protegerse de la inflación, pero la experiencia de usuario de pagar un café o dividir un asado en crypto sigue siendo técnica, fría y confusa.',
    solution: 'MatePay reinventa los micropagos cotidianos en Solana: división de gastos de grupo con animaciones dinámicas, nombres legibles (.sol o alias locales), pago por QR escaneable en 0.4 segundos y comprobantes visuales exportables.',
    multimediaEdge: 'Diseño de producto de nivel fintech premium (como Revolut o Wise pero con alma argentina): animaciones de confirmación de pago, sonidos hápticos, diseño de estados vacíos y feedback visual instantáneo.',
    solanaIntegration: 'Solana Pay (QR protocol), transferencias atómicas de USDC con transfer fees de Token-2022 o comisiones de fracción de centavo en devnet, y subcuentas para grupos de amigos.',
    pitchHook: '"Dividir el asado o pagar un café en Argentina con dólares digitales en Solana más rápido que cualquier billetera bancaria."',
    colosseumFit: 'Superteam Argentina tiene bounties y tracks específicos para adopción local y soluciones de la vida real en LATAM. Gran probabilidad de ganar premios regionales ($10.000 USDG) y avanzar en Colosseum.',
    difficulty: 'Media',
    techStack: ['React', 'Solana Pay SDK', '@solana/web3.js', 'Lucide Icons', 'Motion', 'Express'],
    mvpTimeline: {
      week1: 'Flujo de generación de QR con Solana Pay y simulación de escaneo.',
      week2: 'Módulo de división de gastos interactivo con cálculo en tiempo real y firma con Phantom/Backpack.',
      week3: 'Branding argentino de alta fidelidad, animaciones de éxito y simulación en vivo en el video demo.',
    },
    image: '/src/assets/images/project_matepay_preview_1791050873178.jpg',
    planillaTest: '¿Andaría igual con una planilla y MP? NO: custodia no custodia fondos en una sola cuenta bancaria personal sujeta a bloqueos; ejecuta la liberación atómica en USDC con reglas transparentes.',
  },
  {
    id: 'auragen-ai-branding',
    title: 'AuraGen: AI Brand Kit en Solana',
    subtitle: 'Generador de identidad visual multimedia y activos on-chain para dApps y comunidades',
    track: 'AI x Solana',
    badge: 'Tendencia AI x Web3',
    problem: 'Cientos de startups y tokens que nacen en hackathons de Solana carecen de identidad visual coherente (logos, banners, token graphics, pitch assets) y gastan semanas o lucen genéricas.',
    solution: 'Un agente de diseño multimedial impulsado por IA que genera kits completos de marca: logos vectoriales, paletas accesibles, avatares 3D y banners de X optimizados, registrando la autoría y los derechos en Solana.',
    multimediaEdge: 'Combina algoritmos de diseño generativo con principios formales de diseño multimedial: jerarquías, contraste cromático, ratios dorados y packaging digital listo para producción.',
    solanaIntegration: 'Almacenamiento descentralizado de assets, minteo del Brand Kit como un NFT comprimido (cNFT) con metadatos inmutables de propiedad comercial en Solana devnet.',
    pitchHook: '"El director de arte con IA que entrega la identidad multimedia completa de tu proyecto Web3 en 60 segundos con verificación en Solana."',
    colosseumFit: 'El track de AI x Crypto en Colosseum es uno de los más concurridos y con mayor capital de inversión post-hackathon.',
    difficulty: 'Media-Alta',
    techStack: ['React', 'Gemini API', 'Canvas API', '@solana/web3.js', 'Express', 'Tailwind CSS'],
    mvpTimeline: {
      week1: 'Pipeline de generación de prompts para estética de marca y vista previa en Canvas.',
      week2: 'Exportador de assets de marca (SVG, PNG, guía de estilo) y conexión con billetera Solana.',
      week3: 'Minteo del kit como cNFT y demo en video mostrando el flujo completo de creación.',
    },
    planillaTest: '¿Andaría igual sin blockchain? NO: el registro inmutable de procedencia y licencias de IP tokenizadas protege los derechos comerciales de las marcas creadas.',
  },
  {
    id: 'pixelgrid-depin',
    title: 'PixelGrid: DePIN Render Canvas',
    subtitle: 'Red colaborativa de renderizado multimedia distribuido con recompensas en Solana',
    track: 'Gaming & DePIN',
    badge: 'Innovación Tecnológica',
    problem: 'Renderizar animaciones 3D y gráficos pesados para proyectos de diseño y juegos requiere hardware costoso o granjas centralizadas inaccesibles para estudiantes y creadores independientes.',
    solution: 'PixelGrid permite a computadoras de diseñadores y gamers aportar potencia de GPU en reposo para renderizar frames multimedia, recibiendo micro-recompensas inmediatas en Solana verificadas por hash.',
    multimediaEdge: 'Interfaz de usuario espacial estilo visualizador de partículas en 3D que muestra el mapa global de nodos activos renderizando frames en tiempo real.',
    solanaIntegration: 'Transacciones de micro-pagos de streaming en Solana devnet, registro de nodos y tareas de cómputo en un programa de Solana.',
    pitchHook: '"Convertimos la potencia ociosa de diseñadores multimediales en una granja de render distribuida con pagos instantáneos en Solana."',
    colosseumFit: 'DePIN es un pilar estratégico de Solana. Los jueces valoran proyectos que lleven DePIN al usuario creativo común.',
    difficulty: 'Alta',
    techStack: ['React', 'Three.js', 'Web Workers', '@solana/web3.js', 'Anchor', 'WebSocket'],
    mvpTimeline: {
      week1: 'Visualizador de red en Canvas 3D y mock de worker de cómputo local.',
      week2: 'Contrato Anchor simple para registrar tareas y liquidar pagos de recompensa.',
      week3: 'Simulación de renderizado distribuido en vivo para la demo de Colosseum.',
    },
    planillaTest: '¿Andaría con una planilla? NO: la verificación de pruebas criptográficas de cómputo y el micro-pago continuo por frame solo son viables con la velocidad y costo de Solana.',
  },
  {
    id: 'flowstate-defi',
    title: 'FlowState: Visualizador Sensorial DeFi',
    subtitle: 'Panel táctil e intuitivo para liquid staking y vaults en Solana sin tablas de cálculo',
    track: 'DeFi Visual',
    badge: 'Revolución UX',
    problem: 'DeFi en Solana es ultra potente pero sus interfaces parecen hojas de Excel de 1998, asustando a millones de usuarios potenciales con números estáticos sin jerarquía.',
    solution: 'FlowState convierte el staking y las estrategias de rendimiento (JitoSOL, Marinade, Kamino) en un entorno visual interactivo, orgánico y reactivo, donde el crecimiento de los fondos se percibe visual y auditivamente.',
    multimediaEdge: 'Diseño sonoro sutil, partículas dinámicas proporcionales al APY, transiciones fluidas de 60fps y visualización de datos con gráficos artísticos.',
    solanaIntegration: 'Integración con SDKs de liquid staking de Solana (Jito / Marinade / Sanctum) y cotizaciones en tiempo real via Jupiter API en devnet.',
    pitchHook: '"Hacemos que entender e invertir en DeFi en Solana sea tan bello e intuitivo como jugar un videojuego de diseño."',
    colosseumFit: 'Aborda la mayor crítica de los jueces hacia DeFi: la pésima experiencia de usuario para nuevos participantes.',
    difficulty: 'Media',
    techStack: ['React', 'Jupiter SDK', 'Motion', '@solana/web3.js', 'Tailwind CSS'],
    mvpTimeline: {
      week1: 'Fetch de datos de APY y pools reales en Solana usando Jupiter y Sanctum.',
      week2: 'Construcción del motor gráfico interactivo para representar los flujos de rendimiento.',
      week3: 'Conexión de transacciones de swap y stake de 1 clic con feedback visual.',
    },
    planillaTest: '¿Andaría igual sin blockchain? NO: lee e interactúa directamente con los pools y vaults onchain de liquid staking en tiempo real.',
  },
];

export const BUILT_IN_SKILLS: SkillItem[] = [
  {
    id: 'workspace-colosseum-master',
    title: 'Kit de Hackathon: Colosseum Crypto World\'s Fair (Superteam Arg)',
    source: 'github.com/alejandrocol-dev/workspace-colosseum',
    type: 'github',
    isDefault: true,
    description: 'Kit oficial de hackathon para Superteam Argentina: reglas en español rioplatense, prueba de la planilla, comandos guiados (/solana-tuc-*) y modo devnet.',
    tags: ['GitHub', 'Superteam Arg', 'Colosseum', 'Tucumán', 'Oficial'],
    content: `# Kit de Hackathon: Colosseum Crypto World's Fair (Superteam Argentina)
Repositorio: https://github.com/alejandrocol-dev/workspace-colosseum

Sos un compañero de equipo en una hackathon. Respondé en español rioplatense, claro y sin jerga innecesaria.

## Reglas Maestras:
1. **Construir es barato con IA; elegir qué construir no.** Cuestioná, preguntá, no aplaudas por reflejo. Sé sparring, no aplaudidor.
2. **La prueba de la planilla:** ¿Esto andaría igual con una planilla compartida y una billetera virtual? Si anda igual, todavía no necesita Solana; buscar la parte donde hay plata o confianza en juego.
3. **Modo prueba siempre: solo devnet.** (La plata es de mentira, sale de un faucet y no vale nada). Nunca mainnet ni plata real durante la hackathon.
4. **Frase semilla y claves privadas:** NUNCA en el chat ni en archivos del repo. Toda transacción necesita aprobación explícita del usuario.
5. **Comandos guiados del kit:**
   - \`/solana-tuc-status\`: ¿en qué etapa estamos y qué falta?
   - \`/solana-tuc-idea\`: brainstorm guiado, 15-20 ideas, filtro por dolor y prueba de la planilla.
   - \`/solana-tuc-validar\`: abogado del diablo, qué ya existe, cementerios vs clones vivos, test de mesa con 3 personas reales.
   - \`/solana-tuc-mvp\`: alcance acotado, una sola persona, un solo recorrido, una sola transacción demostrable.
   - \`/solana-tuc-planificar\`: tareas chicas y verificables por integrante.
   - \`/solana-tuc-pitch\`: coach para el video demo de 3 minutos y textos de entrega en inglés.
   - \`/solana-tuc-empezar\`: bienvenida e introducción para arrancar.
6. **Entrega y Fechas:**
   - Hackathon: Colosseum Crypto World's Fair.
   - Fecha límite: 12/10/2026 23:59 PT (13/10 03:59 hora Argentina).
   - Track Superteam Argentina: US$10.000 en USDG (1.º 3.000, 2.º 2.000, 3.º 1.500, etc.).
   - Doble entrega obligatoria: en Colosseum Arena Y en Superteam Earn.
   - Todo el material de entrega para jueces (README, video, formulario) va en inglés.
`,
  },
  {
    id: 'solana-tuc-idea-skill',
    title: 'Skill: Brainstorm Guiado (/solana-tuc-idea)',
    source: 'workspace-colosseum/.devin/skills/solana-tuc-idea',
    type: 'github',
    description: 'Etapas de ideación: equipo -> 3 problemas vividos -> ronda divergente (15-20 ideas) -> filtro con la prueba de la planilla -> idea elegida.',
    tags: ['Ideación', 'Brainstorm', 'Planilla Test', 'Colosseum'],
    content: `# Skill: /solana-tuc-idea (Brainstorm Guiado)

Objetivo: Definir qué construir (problema, usuario concreto, idea elegida) antes de escribir código.

## Comportamiento:
- Una sola pregunta por mensaje.
- Español rioplatense, simple, sin jerga.
- Sparring, no aplaudidor. Si una idea es floja, decilo con respeto y razón.
- Cuestioná los "para todos": ¿quién exactamente? ¿conocés a alguien real?

## Proceso de 5 etapas:
1. **Equipo y fortalezas:** quiénes son, habilidades (diseño multimedial, fullstack, backend), horas disponibles (~15-20h).
2. **Problemas primero:** 3 problemas que hayan vivido de cerca (inflación, freelance, mandar plata, comunidades).
3. **Divergir (15-20 ideas):** prohibido juzgar en esta fase. Ronda del equipo + ronda de expansión (lentes: sacar un paso, cambiar público, agente IA, pagos programables).
4. **Filtro rápido:**
   - Barrido con la prueba de la planilla: ¿andaría igual con Excel + Mercado Pago?
   - Tabla de sobrevivientes (máximo 6-8): Dolor, Novedad, Por qué cadena, Factibilidad, Demo en 3 min, Negocio.
5. **Elegir:** 1 sola idea. Frase de una línea: "Ayudamos a [quién] a [hacer qué] para [lograr qué]".
`,
  },
  {
    id: 'solana-tuc-validar-skill',
    title: 'Skill: Abogado del Diablo (/solana-tuc-validar)',
    source: 'workspace-colosseum/.devin/skills/solana-tuc-validar',
    type: 'github',
    description: 'Pone a prueba la idea contra proyectos previos de Colosseum (5.400+ proyectos), cementerios de ideas, test de mesa y criterio de abortar.',
    tags: ['Validación', 'Competencia', 'Test de Mesa', 'Colosseum Copilot'],
    content: `# Skill: /solana-tuc-validar (Validación Crítica)

Objetivo: Romper la idea ahora que es barato, no el último día que cuesta la hackathon.

## Reglas de validación:
- El cariño por la idea no es evidencia. Preguntar "¿cómo lo sabés?".
- Prohibido inventar competidores o cifras.
- Patrones de mercado:
  1. **Clon vivo:** ya existe y ganó o tiene producto -> competir por ejecución/público.
  2. **Cementerio:** muchos intentos parecidos y cero premios -> ¿por qué fallaron? ¿demanda débil o falta de demo?
  3. **Commodity, público libre:** la mecánica existe pero nadie la llevó a tu nicho/LATAM.
  4. **Vacío total:** nadie lo intentó -> o es oro o no hay dolor real.
- **Test de mesa:** nombrar 3 personas de carne y hueso que tengan este dolor. Si no conocen a nadie, la idea es teórica.
- **Veredictos posibles:** Construir, Angostar la cuña, Pivotar, o Descartar.
`,
  },
  {
    id: 'solana-tuc-mvp-skill',
    title: 'Skill: Alcance Acotado del MVP (/solana-tuc-mvp)',
    source: 'workspace-colosseum/.devin/skills/solana-tuc-mvp',
    type: 'github',
    description: 'Reduce el alcance para que quepa en 15-20 horas: una sola persona, un solo recorrido, una sola transacción demostrable en devnet.',
    tags: ['MVP', 'Alcance', 'Devnet', 'Ejecución'],
    content: `# Skill: /solana-tuc-mvp (Alcance del MVP)

Objetivo: Cortar todo lo que no sea indispensable para una demo inolvidable de 3 minutos.

## Reglas:
- Una sola persona, un solo recorrido, una sola transacción en devnet.
- Si no se puede probar en pantalla en 3 minutos, queda afuera del MVP.
- Frontend web + Phantom en Devnet + RPC público (Helius).
- Sin instalar Rust/Anchor local si no es estrictamente necesario (usar Solana Playground beta.solpg.io).
`,
  },
  {
    id: 'solana-tuc-pitch-skill',
    title: 'Skill: Coach de Pitch & Demo (/solana-tuc-pitch)',
    source: 'workspace-colosseum/.devin/skills/solana-tuc-pitch',
    type: 'github',
    description: 'Estructura de video demo de 3 minutos, narrativa en inglés para los jurados de Colosseum y Superteam Arg.',
    tags: ['Pitch', 'Demo Video', 'Jurado', 'Inglés'],
    content: `# Skill: /solana-tuc-pitch (Pitch & Demo Coach)

Objetivo: Preparar el video de 3 minutos y textos para la entrega oficial en Colosseum y Superteam Earn.

## Estructura del video de 3 minutos:
1. 0:00 - 0:30: El problema doloroso con un caso concreto (en inglés).
2. 0:30 - 1:45: Demostración en vivo en pantalla completa del producto corriendo en Devnet.
3. 1:45 - 2:15: Arquitectura técnica y por qué Solana es insustituible.
4. 2:15 - 2:45: Mercado, tracción futura y modelo de negocio.
5. 2:45 - 3:00: Equipo y llamada a la acción.
`,
  },
  {
    id: 'solana-tuc-status-skill',
    title: 'Skill: Diagnóstico de Estado (/solana-tuc-status)',
    source: 'workspace-colosseum/.devin/skills/solana-tuc-status',
    type: 'github',
    description: 'Revisa en qué etapa del flujo está el equipo (Idea -> Validación -> MVP -> Plan -> Pitch) y sugiere el próximo paso.',
    tags: ['Status', 'Diagnóstico', 'Flujo', 'Organización'],
    content: `# Skill: /solana-tuc-status (Diagnóstico del Equipo)

Objetivo: Chequear en qué etapa está el equipo para no saltarse pasos ni perder tiempo.

## Etapas del kit:
- 01-idea.md: ¿Tenemos el problema, el usuario y la frase de una línea? (Si no: /solana-tuc-idea)
- 02-validacion.md: ¿Rompimos la idea contra proyectos previos y el test de mesa? (Si no: /solana-tuc-validar)
- 03-mvp.md: ¿Definimos el alcance acotado a una sola transacción en devnet? (Si no: /solana-tuc-mvp)
- 04-plan.md: ¿Dividimos las tareas chicas por integrante? (Si no: /solana-tuc-planificar)
- 05-pitch.md: ¿Tenemos el guion del video de 3 minutos en inglés? (Si no: /solana-tuc-pitch)
`,
  },
  {
    id: 'workspace-colosseum-contexto',
    title: 'Documento: Reglas y Criterios Oficiales de Colosseum',
    source: 'workspace-colosseum/docs/contexto-hackathon.md',
    type: 'github',
    description: 'Fechas oficiales (entrega 12/10/2026), track Superteam Arg ($10.000 USDG), 6 criterios de evaluación y doble envío.',
    tags: ['Reglas', 'Fechas', 'Superteam Arg', 'Criterios'],
    content: `# Contexto de la Hackathon Colosseum Crypto World's Fair

- **Fecha límite:** 12/10/2026 23:59 PT = 13/10 03:59 hora Argentina.
- **Track Superteam Argentina:** US$10.000 en USDG (1.º 3.000, 2.º 2.000, 3.º 1.500, etc.).
- **Doble envío:** Proyecto cargado en portal Colosseum Y en Superteam Earn.
- **6 Criterios de Colosseum:**
  1. Functionality: ¿qué tan bien funciona? ¿calidad del código?
  2. Potential Impact: ¿tamaño del mercado? ¿impacto en el ecosistema cripto?
  3. Novelty: ¿qué tan única es la idea?
  4. UX: ¿crea una gran experiencia sin fricción cripto?
  5. Open-source: ¿es open source y compone bien con otras primitivas?
  6. Business Plan: ¿se puede construir un negocio viable alrededor?
- Todo el material de entrega para jurados en inglés.
- Modo devnet siempre.
`,
  },
  {
    id: 'workspace-colosseum-ganadores',
    title: 'Documento: Análisis de Ganadores Previos de Colosseum',
    source: 'workspace-colosseum/docs/referencias-ganadores.md',
    type: 'github',
    description: 'Ganadores de Cypherpunk, Radar, Renaissance. Por qué ganaron, patrones de éxito y la prueba de la planilla.',
    tags: ['Ganadores', 'Patrones', 'Análisis', 'Colosseum'],
    content: `# Análisis de Ganadores de Colosseum

Patrones observados en ediciones pasadas (Cypherpunk, Radar, Renaissance):
1. **Un usuario y un problema muy concretos:** nadie dice "para todos".
2. **Muchos ganadores son herramientas o infraestructura** que otros equipos necesitan.
3. **IA + micropagos en Solana** aparece repetidamente (agentes que necesitan pagar o cobrar).
4. **La cadena hace algo que no se podía antes:** no es decoración superficial.
5. **Producto terminado y demostrable en pantalla** pesa más que una visión gigante inacabada.
6. **Ventaja latinoamericana:** stablecoins, pagos, remesas, acceso a dólares digitales son dolores reales que en Argentina se conocen mejor que en cualquier otra parte del mundo.
`,
  },
];
