# Contexto de la hackathon

Este archivo lo leen las skills (`/solana-tuc-idea`, `/solana-tuc-validar`, `/solana-tuc-mvp`, `/solana-tuc-planificar`, `/solana-tuc-pitch`) para no inventar reglas.
**Organizadores:** completá la sección "Datos a confirmar" y corregí lo que haya cambiado.

## La competencia

- **Colosseum Crypto World's Fair**: hackathon online, abierta a todas las blockchains por primera vez.
  Fuente: <https://colosseum.com/worldsfair>
- Inicio: 14/09/2026. **Entrega: 12/10/2026** (hora de California, ver "Datos a confirmar").
- Premios generales: Grand Champion US$30.000, 20 equipos siguientes US$15.000 c/u, Public Good US$5.000, University US$5.000.
- Track Solana: US$100.000 repartidos en 10 proyectos de US$10.000.
- Accelerator de Colosseum: US$250.000 de pre-seed + 12 semanas en San Francisco. Todos los ganadores son entrevistados.
- Colosseum remarca que sigue invirtiendo en fundadores de Solana.

## Nuestro track: Superteam Argentina

- Listing: <https://superteam.fun/earn/listing/colosseum-crypto-worlds-fair-hackathon-superteam-argentina-track>
- Solo para personas en Argentina. Es **adicional**: el mismo proyecto compite en Colosseum y en este track.
- Premios: US$10.000 en USDG. 1.º 3.000, 2.º 2.000, 3.º 1.500, 4.º 1.000, 5.º 500, más 4 bonus de 500.
- Anuncio de ganadores: 28/10/2026.
- Skills pedidas en el listing: Blockchain, Frontend, Backend, Mobile, Growth, Otros.
- **Confirmado por la Guía oficial 2 (Superteam ARG):** se entrega **en Superteam Earn Y en Colosseum** (doble envío). Cada integrante necesita cuenta propia en Arena para figurar en la entrega.

## Cómo juzgan (reglas oficiales de Colosseum)

Los proyectos se evalúan con estos seis criterios:

1. **Functionality**: ¿qué tan bien funciona? ¿calidad del código?
2. **Potential Impact**: ¿tamaño del mercado? ¿impacto en el ecosistema cripto?
3. **Novelty**: ¿qué tan única es la idea?
4. **UX**: ¿usa la blockchain para crear una gran experiencia al usuario final?
5. **Open-source**: ¿es open source? ¿compone bien con otras primitivas del ecosistema?
6. **Business Plan**: ¿se puede construir un negocio viable alrededor?

Lectura de Superteam Türkiye (otro capítulo, es interpretación, no regla): los jurados puntúan "como inversores":
founder-market fit, insight único, calidad de ejecución, tamaño de mercado, comunicación, modelo de negocio y tracción.
"Código prolijo es lo mínimo, no suma puntos."

## Qué se entrega

- Proyecto cargado en el portal de Colosseum **y** en el listing de Superteam Earn (son dos envíos distintos; **confirmado** por la Guía oficial 2 de Superteam ARG).
- Lo que sigue viene de Superteam Türkiye citando las reglas oficiales (verificar):
- Video pitch y video demo (máximo 3 minutos cada uno; la misma página menciona 2 min para el pitch en otro punto: confirmar).
- Repositorio público (o dar acceso a los jurados si es privado; es un error de descalificación común).
- **Todo el contenido en inglés** (sección 12 de las reglas, según esa fuente).
- Declarar todo el desarrollo previo a la hackathon: solo se juzga el trabajo hecho dentro de la ventana. No declararlo puede descalificar.
- El botón de envío se habilita el 6/10 (según esa fuente). Se puede dejar un borrador antes.

## Consejos de esa misma fuente que vale la pena tomar

- Un solo caso de uso de punta a punta. Pasarse de alcance es la forma más común de perder.
- Conectar la blockchain temprano: wallet y una transacción real. "Si el proyecto puede existir sin cadena, los jurados lo notan."
- Usar el stack existente en vez de reconstruirlo (ejemplos que menciona: Helius/Triton para RPC, Privy para auth, Jupiter para swaps, Squads para multisig, Pyth para precios).
- Una URL pública vale más que un link a GitHub.
- Mostrarlo a ~10 personas que sean el cliente ideal y mirarlas usarlo en silencio.
- Los jurados prefieren equipos de 3 o más (se puede participar solo, pero es más difícil).
- Validar la idea contra **Colosseum Copilot** (5.400+ proyectos previos) para detectar si ya existe.
- Entregar con 2 días de margen.

## Setup oficial de la sede (Guías 1-3 de Superteam ARG, 2026-10-01)

Lo que la organización ya les pidió a los participantes tener listo **antes** de la sede:

- **Para todos:** cuenta en Arena (arena.colosseum.org), cuenta en Superteam Earn, wallet Phantom en **Devnet** con SOL de prueba del faucet (faucet.solana.com).
- **Para quien escribe código:** Node.js 18+, Git, un agente de código (Devin gratis con los códigos repartidos) y **dos skills ya instaladas**:
  - `npx skills add solana-foundation/solana-dev-skill`
  - `npx skills add ColosseumOrg/colosseum-copilot`
- **No hace falta:** Rust, Anchor ni Solana CLI local. Todo se hace en **devnet desde el navegador**. Para programas propios: Solana Playground (beta.solpg.io).
- Detalles y diferencias con la versión actual de Copilot: ver `docs/skills-externas.md`.

De la Guía 3 (qué construir), dos herramientas que las skills ya integran:

- **La prueba de la planilla:** ¿el producto andaría igual con una planilla compartida y una billetera virtual? Si anda igual, todavía no necesita Solana; buscar la parte donde hay plata o confianza en juego.
- **Rubros semilla** (de fácil a difícil): pagos y cobros, entradas y rifas, trazabilidad, tokenización, agentes de IA que pagan (x402), marketplace con custodia.
- Para elegir: "achicalo — una sola persona, un solo recorrido, una sola transacción que se pueda mostrar".

## Datos a confirmar (organizadores)

Marcá con la fecha en que lo verificaste.

- [ ] Reglas y criterios específicos del track Argentina (la pestaña "Details" del listing no se pudo leer automáticamente).
- [ ] Horario límite exacto. La fuente dice 12/10 23:59 hora de California = **13/10 03:59 hora Argentina**. Confirmar en Colosseum.
- [ ] Largo máximo exacto del pitch video (2 o 3 minutos).
- [ ] Requisitos de elegibilidad: edad, residencia, equipos, premios a personas vs. equipos.
- [ ] Fecha en la que se registró cada equipo en Arena y qué trabajo previo existe (para declararlo).
- [ ] **Copilot:** la Guía 1 oficial explica la activación con `COLOSSEUM_COPILOT_PAT` + `api/v1`, pero la skill actual (v2.0.1) usa `npx @colosseum-org/copilot-connect login` y trata el PAT como obsoleto. Avisar a los equipos la forma vigente (ver `docs/skills-externas.md`).

## Tiempo de trabajo en la sede

Jornada presencial: sábado 3 de octubre en Tucumán ("Road to Colosseum X Tucumán"), aproximadamente 5 horas. Después sigue el trabajo remoto hasta la entrega del 12/10.
Los equipos usan Devin con SWE-2 (tokens ilimitados) y otros modelos. Eso abarata construir; lo difícil es **elegir qué construir** y **demostrar que importa**.
