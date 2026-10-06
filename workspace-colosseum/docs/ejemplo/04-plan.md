# 04 — Plan de construcción

> **EJEMPLO DE REFERENCIA — no es tu proyecto.** Todo en devnet. Ver `02-validacion.md` de esta misma carpeta.

## Stack

- **Frontend:** Next.js + TypeScript + Tailwind (lo que ya conocen).
- **Onchain:** Squads Protocol v4 vía `@sqds/multisig` (SDK TS), red **devnet**, RPC público.
- **Wallet:** Phantom en modo devnet; wallets de socios pre-creadas para la demo.
- **Token:** USDC devnet; plan B = SOL si el mint de USDC complica.
- **Deploy:** Vercel (link público desde el bloque 0).
- Sin programa propio → sin Rust/Anchor/CLI local (Guía oficial 1).

## Bloques y tareas

### B0 — Arranque (45 min, todos)
| ID | Tarea | Quién | Listo cuando | Prompt para Devin |
|---|---|---|---|---|
| T0.1 | Repo + Next.js vacío + deploy | Dev1 | URL pública responde | "Inicializá Next.js+TS+Tailwind y dejalo deployable a Vercel" |
| T0.2 | Phantom conecta en devnet | Dev2 | Botón conecta y muestra address | "Agregá wallet adapter de Phantom forzando cluster devnet" |
| T0.3 | **SPIKE**: Squads create→propose→vote→execute en devnet | Dev2 | Script corre las 4 ops en devnet | "Con @sqds/multisig en devnet: creá un multisig 2-de-3, una propuesta de transferencia, votá y ejecutá. Solo script, sin UI" |
| T0.4 | **SPIKE (la cuña)**: un socio vota entrando con email, sin wallet propia | Dev1 | Una persona sin Phantom aprueba una propuesta de prueba | "Investigá en la doc oficial de Squads/TipLink si hay una forma de firmar con una cuenta creada por email, en devnet. Probala con un script mínimo y decime qué falta; no inventes APIs" |

### B1 — Esqueleto andante (~2 hs)
| ID | Tarea | Quién | Listo cuando | Prompt |
|---|---|---|---|---|
| T1.1 | Servicio `caja.ts`: wrappear create/propose/vote/execute | Dev2 | Funciones corren contra devnet | "Encapsulá las 4 operaciones del spike en @/lib/caja.ts con errores claros" |
| T1.2 | UI fea pero completa del flujo | Dev1 | De punta a punta aunque sin diseño | "Pantallas: estado de caja, nueva propuesta, votar. Usá @/lib/caja.ts, sin estilos todavía" |
| T1.3 | Copy + look del club ficticio | Diseño | Nombre, logo, textos ES | "Club Atlético Demo: nombre, colores, textos de las 3 pantallas" |

**Checkpoint B1:** ¿podemos mostrar la demo hoy? (aunque fea) → si no, recortar.

### B2 — Hacerlo real (~2 hs)
| ID | Tarea | Quién | Listo cuando | Prompt |
|---|---|---|---|---|
| T2.1 | Caja real + aporte USDC + socios reales (wallets devnet) | Dev2 | 3 wallets votan de verdad | "Script de setup: 3 keypairs devnet, fund con faucet, aportar a la caja" |
| T2.2 | Historial onchain real en pantalla pública | Dev1 | Saldo y gastos vienen de la cadena | "La pantalla pública lee estado del multisig, no datos mock" |
| T2.3 | Diseño aplicado a las 3 pantallas | Diseño | Mobile-first, sin jerga cripto | "Aplicá el diseño: nada de 'multisig/firma/PDA' en la UI" |

### B3 — Pulir la demo (~1.5 hs)
| ID | Tarea | Quién | Listo cuando |
|---|---|---|---|
| T3.1 | Estados de error y vacíos | Dev1 | Rechazo de voto, sin fondos, etc. no rompen |
| T3.2 | Ensayo del guion de demo ×3 | Todos | El video de `03-mvp.md` se puede grabar |
| T3.3 | Freeze de alcance | Todos | Nada nuevo entra desde acá |

### B4 — Cierre
- README en inglés, video pitch + video demo, doble entrega → `/solana-tuc-pitch`.

## Riesgos y plan B

| Riesgo | Plan B |
|---|---|
| SDK de Squads se resiste en el spike | Idea 13 (ahorro bloqueado, una regla) o propuesta/voto simulado aclarado en pitch |
| Wallets de socios fricción | Wallets pre-cargadas como "cuentas demo", se aclara |
| USDC devnet complica | Usar SOL como "fichas del club" |

## Estado

- [ ] B0 arranque (spike primero!)
- [ ] B1 esqueleto andante
- [ ] B2 hacerlo real
- [ ] B3 pulir + freeze
- [ ] B4 cierre

## Siguiente paso

Tarea **T0.3 (el spike)**. Para el cierre: `/solana-tuc-pitch`.
