# Hackathon Kit: de la idea al pitch con Devin

Kit de **skills para Devin** que guía a un equipo de hackathon de punta a punta: decidir **qué construir** antes de construir, validarlo contra lo que ya existe, recortarlo a algo demostrable y llegar a la entrega con un pitch.

Hecho para la **Colosseum Crypto World's Fair, track Superteam Argentina**, pero sirve para cualquier hackathon crypto.

> Con un agente de código, escribir código es barato. Lo difícil es elegir bien qué construir y demostrar que importa. Este kit ataca eso.

## Cómo funciona

Siete skills que se llaman con `/` dentro de Devin (o de cualquier agente compatible: Claude Code, Codex, Cursor). **Hacen preguntas de a una**, cuestionan la idea y dejan el trabajo escrito en `proyecto/`, que es la memoria del equipo entre sesiones: cada sesión nueva del agente arranca sin memoria.

```
     /solana-tuc-empezar    cómo funciona el kit
  -> /solana-tuc-idea       qué construir
  -> /solana-tuc-validar    ¿vale la pena?
  -> /solana-tuc-mvp        qué entra en las horas
  -> /solana-tuc-planificar cómo se hace
  -> (construir)
  -> /solana-tuc-pitch      cómo se cuenta
```

| Skill | Qué hace | Archivo que deja |
|---|---|---|
| `/solana-tuc-empezar` | Explica cómo funciona todo el kit antes de arrancar (etapas, skills, reglas) e instala las skills externas que falten | (no escribe) |
| `/solana-tuc-status` | Te ubica en el proceso y te dice el próximo paso | (no escribe) |
| `/solana-tuc-idea` | Brainstorm guiado: equipo, problemas, ideas, filtro, elección | `proyecto/01-idea.md` |
| `/solana-tuc-validar` | Investiga qué ya existe (con Colosseum Copilot si está instalada), ataca la idea y da un veredicto | `proyecto/02-validacion.md` |
| `/solana-tuc-mvp` | Recorta a 3 funciones y define la demo de 3 minutos | `proyecto/03-mvp.md` |
| `/solana-tuc-planificar` | Bloques de trabajo con tareas listas para pedirle a Devin; arma el `AGENTS.md` | `proyecto/04-plan.md` |
| `/solana-tuc-pitch` | Deck, guiones de video en inglés y checklist de entrega | `proyecto/05-pitch.md` |

Si la investigación dice que la idea es floja, `/solana-tuc-validar` no te manda a descartar a ciegas: te da un menú (angostar a la cuña, pivotar, clon consciente, descartar o veredicto provisional) según el patrón de mercado que encontró.

## Regla de oro: modo prueba, siempre

Todo el kit trabaja sobre **devnet**, la red de prueba de Solana. La plata ahí es de mentira: sale de un faucet y no vale nada.

- **Nunca** mainnet ni plata real durante la hackathon.
- **Nunca** frases semilla ni claves privadas en el chat ni en archivos del repo.
- Toda transacción que se firme o envíe pide aprobación, mostrando destino, monto, token y red.
- Al entregar, se aclara a los jurados que el proyecto corre en devnet.

## Para los participantes: arrancar

### Opción A: instalar las skills (cualquier agente, recomendada)

Necesitás Node.js 18 o superior. En la terminal:

```bash
npx skills add alejandrocol-dev/workspace-colosseum -g
```

Abrí tu agente (Devin, Claude Code, Codex, Cursor) en una carpeta vacía para el proyecto del equipo y escribí:

```
/solana-tuc-empezar
```

Te explica cómo funciona el kit, se fija si tenés las dos skills externas que pide la Guía oficial 1 (`solana-dev` y `colosseum-copilot`) y, si falta alguna, te ofrece instalarla. Después abrí una sesión nueva y arrancá con `/solana-tuc-idea`.

Si preferís dejar todo instalado desde la terminal:

```bash
npx skills add solana-foundation/solana-dev-skill -g
npx skills add ColosseumOrg/colosseum-copilot -g
npx skills add alejandrocol-dev/workspace-colosseum -g
```

`-g` las instala globales; sin `-g` quedan solo en la carpeta actual. Para instalar una sola: `--skill solana-tuc-validar`. Cada skill trae en su carpeta `references/` los docs que necesita, así que andan fuera de este repo. El trabajo se guarda en `proyecto/` de la carpeta donde estén, y `/solana-tuc-planificar` crea el `AGENTS.md` si no existe.

### Opción B: usar este repo como base (Devin)

1. Instalá Devin (<https://devin.ai/desktop>) e iniciá sesión.
2. Botón **Use this template** en GitHub (o clonalo) y abrí la carpeta en Devin. Las skills ya vienen en `.devin/skills/`.
3. Abrí una sesión y escribí `/solana-tuc-empezar`.

### En cualquiera de las dos

En cualquier momento, `/solana-tuc-status` te dice en qué etapa están y cuál es el próximo paso. Cada skill empieza mostrando su propia guía (qué hace, qué necesitás, cuánto lleva y qué archivo deja) antes de preguntar si arrancan.

**Si no sabés de cripto:** el kit asume que pueden ser principiantes. Cada término (devnet, wallet, USDC, votación onchain) se explica en una línea la primera vez que aparece. Si algo no se entiende, frenen y pidan que lo explique.

**Cuánto tiempo lleva la parte de decidir:** `/solana-tuc-idea` y `/solana-tuc-validar` en la primera hora; `/solana-tuc-mvp` y `/solana-tuc-planificar` antes de escribir una línea de código.

**Sin agente:** las skills también sirven como checklist humano. El método (preguntas, test de mesa, veredicto) no necesita IA para funcionar.

## Para quien mantiene el kit

`docs/` y `AGENTS.md` son la fuente. Si los editás, corré `./scripts/sync-references.sh` antes de commitear: copia esos archivos a las `references/` de cada skill, que es lo que se instala con `npx skills`.

## Qué hay en el repo

```
.devin/skills/       las 7 skills solana-tuc-*, cada una con su references/
scripts/             sync-references.sh: copia docs/ a las references/ de cada skill
docs/                reglas y fechas, proyectos ganadores de referencia, guía de Devin, skills externas
docs/ejemplo/        un proyecto completo de ejemplo (solo para mirar, NO es el tuyo)
proyecto/            la memoria del equipo: arranca vacía, la llenan las skills
AGENTS.md            instrucciones permanentes para Devin (/solana-tuc-planificar completa la sección del proyecto)
```

## Skills externas (las pide la Guía oficial 1)

La guía de setup de la sede ya les pide instalar dos skills que el kit aprovecha si están:

- **`colosseum-copilot`** → `/solana-tuc-validar` la usa para ver qué ya se hizo en 5.400+ entregas pasadas, y `/solana-tuc-pitch` para pedir feedback. Si no está instalada o falla el login, `/solana-tuc-validar` tiene plan B manual.
- **`solana-dev`** → se activa sola al escribir código Solana con las librerías actuales.

Instalación, autenticación (ojo: la Guía 1 muestra un método viejo — ver el doc), troubleshooting y reglas de seguridad en [`docs/skills-externas.md`](docs/skills-externas.md).

## Construir rápido con Devin

Leé [`docs/guia-devin-para-construir.md`](docs/guia-devin-para-construir.md): modelos, modos, rutina de trabajo y qué evitar.

## Fuentes

- Colosseum Crypto World's Fair: <https://colosseum.com/worldsfair>
- Listing Superteam Argentina: <https://superteam.fun/earn/listing/colosseum-crypto-worlds-fair-hackathon-superteam-argentina-track>
- Ganadores anteriores: <https://blog.colosseum.com>
- Documentación de skills de Devin CLI: ver la carpeta de docs incluida con la instalación.
