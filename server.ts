import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;

async function bootstrap() {
  const app = express();
  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Chat endpoint (multi-turn)
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const {
        messages = [],
        role = 'mentor',
        model = 'gemini-3.5-flash',
        activeSkillContext = '',
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      // Valid model enforcement based on guidelines
      const allowedModels = [
        'gemini-3.1-pro-preview',
        'gemini-3.5-flash',
        'gemini-3.1-flash-lite',
      ];
      const selectedModel = allowedModels.includes(model)
        ? model
        : 'gemini-3.5-flash';

      // System role persona mapping with workspace-colosseum directives
      const rolePersonas: Record<string, string> = {
        mentor: `Sos el facilitador y compañero de equipo en la hackathon Colosseum Crypto World's Fair (Superteam Argentina), guiando a Máximo Robles (estudiante de Licenciatura en Diseño Multimedial y desarrollador full stack).
Respondé en español rioplatense, claro y sin jerga innecesaria.

REGLAS MAESTRAS DEL KIT (alejandrocol-dev/workspace-colosseum):
- "Construir es barato con IA; elegir qué construir no." Sé sparring, no aplaudidor. Cuestioná, preguntá, no aplaudas por reflejo. Si una idea es floja, decilo con respeto y razón.
- La prueba de la planilla: ¿el producto andaría igual con una planilla compartida y una billetera virtual? Si anda igual, todavía no necesita Solana; buscar la parte donde hay plata o confianza en juego.
- Modo prueba siempre: solo devnet (la plata es de mentira, sale de un faucet y no vale nada). Nunca mainnet ni claves privadas.
- Si el usuario invoca comandos del kit, guialo según la etapa:
  * /solana-tuc-status: revisá en qué etapa está el equipo.
  * /solana-tuc-idea: lluvia de ideas (15-20 ideas sin juzgar, luego filtro por la prueba de la planilla y dolor).
  * /solana-tuc-validar: abogado del diablo, competidores previos en Colosseum, test de mesa con 3 personas reales, veredicto.
  * /solana-tuc-mvp: alcance acotado (una sola persona, un solo recorrido, una sola transacción demostrable).
  * /solana-tuc-planificar: tareas chicas y verificables.
  * /solana-tuc-pitch: estructura y coach para el video demo de 3 minutos y entrega en inglés.
- Una sola pregunta por mensaje para no abrumar y mantener el ritmo de trabajo.
- Aprovechá la ventaja competitiva de Máximo: diseño multimedial de alta fidelidad, microinteracciones y animaciones que superan el 95% de proyectos genéricos.`,
        architect: `Sos el Arquitecto Full Stack & Web3 especializado en Solana para la hackathon Colosseum x Superteam Arg.
Respondé en español rioplatense.
Recomendaciones clave de la sede:
- Para la hackathon alcanza con Frontend web + Phantom en Devnet + RPC público (Helius/Triton).
- Si hace falta un programa propio: Solana Playground (beta.solpg.io). No perder tiempo peleando con instalación de Rust/Anchor local a menos que sea necesario.
- Solana Actions & Blinks (Dialect), Token Extensions (Token-2022), y State Compression.
- Da soluciones pragmáticas, código limpio y verificable en pantalla.`,
        designer: `Sos el Director de Diseño Multimedial y UI/UX Web3.
Respondé en español rioplatense.
Explotá el superpoder de Máximo (Licenciatura en Diseño Multimedial):
- Anti-slop total: nada de gradientes violetas aleatorios ni cajas de píldoras estáticas. Tipografías con peso como Syne y Plus Jakarta Sans.
- Microinteracciones para transacciones en Solana (estados: esperando firma, procesando en devnet, confirmado).
- Gráficos 3D en Three.js o Canvas interactivo con propósito claro de producto.
- Experiencia sensorial y storytelling que cautive al jurado de Colosseum en los primeros 10 segundos de la demo.`,
        pitch: `Sos el Pitch & Demo Coach de Colosseum y Superteam Argentina.
Sabés que la entrega final es un video de máximo 3 minutos y textos en inglés.
Estructura ganadora del video de 3 minutos:
- 0:00 - 0:30: El problema doloroso con un caso de uso concreto (sin vueltas).
- 0:30 - 1:45: Demostración en vivo del producto corriendo en devnet a pantalla completa.
- 1:45 - 2:15: Arquitectura técnica y por qué Solana es insustituible.
- 2:15 - 2:45: Mercado, modelo de negocio y tracción futura.
- 2:45 - 3:00: Equipo y llamada a la acción.
Ayudá a redactar guiones, slides y ensayar respuestas difíciles.`,
      };

      let systemInstruction = rolePersonas[role] || rolePersonas.mentor;
      if (activeSkillContext && activeSkillContext.trim().length > 0) {
        systemInstruction += `\n\n=== CONOCIMIENTO Y DIRECTRICES DE SKILL CARGADA (GITHUB/SUPERTEAM) ===\n${activeSkillContext}\nUsa y prioriza activamente estas directrices y requisitos en tus respuestas.`;
      }

      // Convert conversation messages to @google/genai format
      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
        },
      });

      const replyText = response.text || 'No se pudo generar una respuesta.';
      res.json({
        reply: replyText,
        modelUsed: selectedModel,
        role,
      });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      res.status(500).json({
        error: error.message || 'Error al comunicarse con Gemini API.',
      });
    }
  });

  // Image Analysis endpoint (mandated gemini-3.1-pro-preview)
  app.post('/api/analyze-image', async (req: Request, res: Response) => {
    try {
      const {
        imageBase64,
        mimeType = 'image/png',
        prompt,
        analysisMode = 'design',
      } = req.body;

      if (!imageBase64) {
        return res
          .status(400)
          .json({ error: 'La imagen en base64 es requerida.' });
      }

      // Clean base64 prefix if present
      const cleanBase64 = imageBase64.replace(
        /^data:image\/[a-zA-Z0-9+.-]+;base64,/,
        ''
      );

      const modeInstructions: Record<string, string> = {
        design:
          'Realiza una auditoría visual y de UI/UX multimedia exhaustiva. Evalúa jerarquía tipográfica, contraste, balance de espacios, experiencia de interacción, pulido estético y posibles fricciones.',
        pitch:
          'Evalúa esta diapositiva o imagen de presentación para el jurado de la hackathon Colosseum x Superteam Arg. ¿Comunica el mensaje en 5 segundos? ¿Es atractiva, clara y convincente?',
        architecture:
          'Analiza este diagrama de arquitectura o flujo de usuario Web3/Solana. Identifica cuellos de botella, seguridad, interacción con la blockchain, billeteras y componentes de servidor.',
        general:
          'Analiza la imagen detalladamente y proporciona observaciones clave para un proyecto de hackathon tecnológica y multimedia.',
      };

      const selectedInstruction =
        modeInstructions[analysisMode] || modeInstructions.design;
      const userPrompt =
        prompt && prompt.trim().length > 0
          ? prompt
          : 'Analiza detalladamente esta imagen para nuestro proyecto de la hackathon Colosseum y sugiere mejoras.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: cleanBase64,
              },
            },
            {
              text: `${userPrompt}\n\nInstrucción de análisis: ${selectedInstruction}`,
            },
          ],
        },
        config: {
          systemInstruction: `Eres un director de diseño multimedia y evaluador de proyectos para la hackathon Colosseum (Solana) y Superteam Argentina. 
Analiza imágenes como capturas de Figma, maquetas de interfaz, diagramas técnicos de flujo, diapositivas de pitch deck o bocetos a mano.
Sé constructivo, preciso, detallista y orientado a maximizar el impacto ante los jueces de Colosseum y el ecosistema de Superteam.
Responde en español estructurado con encabezados claros y viñetas ejecutables.`,
        },
      });

      res.json({
        analysis: response.text || 'Sin observaciones devueltas.',
        modelUsed: 'gemini-3.1-pro-preview',
      });
    } catch (error: any) {
      console.error('Error in /api/analyze-image:', error);
      res.status(500).json({
        error: error.message || 'Error al analizar la imagen con Gemini.',
      });
    }
  });

  // Fetch skill from GitHub (e.g. repo URL, raw URL, or github repo path)
  app.post('/api/github-skill', async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res
          .status(400)
          .json({ error: 'La URL o repositorio de GitHub es requerido.' });
      }

      const trimmedUrl = url.trim();

      // Case 1: Raw githubusercontent URL
      if (trimmedUrl.includes('raw.githubusercontent.com')) {
        const rawRes = await fetch(trimmedUrl);
        if (!rawRes.ok) {
          throw new Error(
            `Error al descargar archivo raw de GitHub: ${rawRes.statusText}`
          );
        }
        const text = await rawRes.text();
        return res.json({
          title: path.basename(trimmedUrl),
          content: text,
          source: trimmedUrl,
        });
      }

      // Case 2: Standard GitHub repo URL (e.g., https://github.com/owner/repo or https://github.com/owner/repo/blob/main/SKILL.md)
      const githubRegex =
        /github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/blob\/([a-zA-Z0-9_.-]+)\/(.+))?/;
      const match = trimmedUrl.match(githubRegex);

      if (match) {
        const [, owner, repoWithGit, branch = 'main', filePath] = match;
        const repo = repoWithGit.replace(/\.git$/, '');

        // If specific file path was provided
        if (filePath) {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
          const fileRes = await fetch(rawUrl);
          if (fileRes.ok) {
            const content = await fileRes.text();
            return res.json({
              title: `${owner}/${repo} - ${path.basename(filePath)}`,
              content,
              source: trimmedUrl,
            });
          }
        }

        // Try common skill/doc file locations
        const candidateFiles = [
          'SKILL.md',
          'skill.md',
          'README.md',
          'readme.md',
          'docs/SKILL.md',
          'HACKATHON.md',
          'instructions.md',
        ];

        for (const candidate of candidateFiles) {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${candidate}`;
          const testRes = await fetch(rawUrl);
          if (testRes.ok) {
            const content = await testRes.text();
            return res.json({
              title: `${owner}/${repo} (${candidate})`,
              content,
              source: rawUrl,
            });
          }
        }

        // If not found in main branch, try master branch
        for (const candidate of candidateFiles) {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${candidate}`;
          const testRes = await fetch(rawUrl);
          if (testRes.ok) {
            const content = await testRes.text();
            return res.json({
              title: `${owner}/${repo} (${candidate})`,
              content,
              source: rawUrl,
            });
          }
        }

        throw new Error(
          `No se encontró automáticamente SKILL.md o README.md en el repositorio ${owner}/${repo}. Por favor ingresa el link directo al archivo o pega el contenido directamente.`
        );
      }

      // Case 3: simple 'owner/repo' format
      if (/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(trimmedUrl)) {
        const [owner, repo] = trimmedUrl.split('/');
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/SKILL.md`;
        const testRes = await fetch(rawUrl);
        if (testRes.ok) {
          const content = await testRes.text();
          return res.json({
            title: `${owner}/${repo} (SKILL.md)`,
            content,
            source: rawUrl,
          });
        }
        const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
        const readmeRes = await fetch(readmeUrl);
        if (readmeRes.ok) {
          const content = await readmeRes.text();
          return res.json({
            title: `${owner}/${repo} (README.md)`,
            content,
            source: readmeUrl,
          });
        }
      }

      throw new Error(
        'Formato de URL de GitHub no reconocido. Ingresa un enlace tipo https://github.com/usuario/repo o el enlace Raw.'
      );
    } catch (error: any) {
      console.error('Error in /api/github-skill:', error);
      res.status(400).json({ error: error.message || 'Error al cargar skill de GitHub.' });
    }
  });

  // === MatePay Backend Endpoints (Mauricio's Module) ===

  // Registro de Alias en Memoria para Devnet
  const aliasRegistry: Record<string, { address: string; label: string; createdAt: string }> = {
    '@cafemartinez': {
      address: '7xKXtg2CW87d97TXJSD8j9P4mZ7a8B3cDevnetDemo1',
      label: 'Café Martinez San Martín',
      createdAt: new Date().toISOString(),
    },
    '@montero': {
      address: '4uQeVj5tqViQh7yVWzmKb7P3n9A8B6cDevnetMauricio',
      label: 'Mauricio Montero (Full Stack Lead)',
      createdAt: new Date().toISOString(),
    },
    '@juanpi': {
      address: '3mK9tg5VW87d97TXJSD8j9P4mZ7a8B3cDevnetJuanPablo',
      label: 'Juan Pablo Gerez (Frontend Lead)',
      createdAt: new Date().toISOString(),
    },
    '@roblesmaximo': {
      address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      label: 'Máximo Robles (Diseño Multimedial)',
      createdAt: new Date().toISOString(),
    },
    '@superteamarg': {
      address: 'SuperteamArgDevnetPublicAddress11111111111111',
      label: 'Superteam Argentina Hackathon Treasury',
      createdAt: new Date().toISOString(),
    },
  };

  // Obtener todos los alias registrados
  app.get('/api/matepay/aliases', (_req: Request, res: Response) => {
    res.json(aliasRegistry);
  });

  // Resolver alias individual
  app.get('/api/matepay/alias/:alias', (req: Request, res: Response) => {
    const rawAlias = req.params.alias.toLowerCase();
    const cleanAlias = rawAlias.startsWith('@') ? rawAlias : `@${rawAlias}`;
    const found = aliasRegistry[cleanAlias];
    if (found) {
      res.json({ alias: cleanAlias, ...found });
    } else {
      res.status(404).json({ error: `Alias ${cleanAlias} no encontrado.` });
    }
  });

  // Registrar nuevo alias
  app.post('/api/matepay/alias', (req: Request, res: Response) => {
    const { alias, address, label } = req.body;
    if (!alias || !address) {
      return res.status(400).json({ error: 'Alias y dirección de Solana son obligatorios.' });
    }
    const cleanAlias = alias.trim().toLowerCase().startsWith('@')
      ? alias.trim().toLowerCase()
      : `@${alias.trim().toLowerCase()}`;

    aliasRegistry[cleanAlias] = {
      address: address.trim(),
      label: label?.trim() || cleanAlias,
      createdAt: new Date().toISOString(),
    };
    res.json({ success: true, alias: cleanAlias, record: aliasRegistry[cleanAlias] });
  });

  // Servicio Fee-Payer Gasless (Devnet)
  app.post('/api/matepay/fee-payer/sign', async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        network: 'Solana Devnet',
        feePaid: '0.000005 SOL',
        feePayerAddress: 'MatePayFeePayerDevnetKey11111111111111111111',
        message: 'Transacción subsidiada por MatePay Fee-Payer. Usuario paga $0 en SOL.',
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Error en Fee-Payer service' });
    }
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Colosseum Studio Server listening on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
