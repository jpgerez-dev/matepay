# 02 — Validación

> **EJEMPLO DE REFERENCIA — no es tu proyecto.** Muestra cómo queda este archivo cuando `/solana-tuc-validar` termina. La investigación de competencia es real (Colosseum Copilot + web, 2-oct-2026), pero Marcos, Sofía y Nico del test de mesa son personajes inventados: en tu proyecto tienen que ser personas reales que conozcan.

## La idea en una línea

Ayudamos a los socios de clubes y promos a juntar y gastar plata en común sin tener que confiar en una sola persona.

## Supuestos peligrosos y su evidencia

| Supuesto | Tipo | Evidencia hoy |
|---|---|---|
| Los socios aceptarían mover la caja a USDC | Uso | Débil — test de mesa, nadie lo probó con plata real |
| El dolor alcanza (vs "el tesorero es de confianza") | Dolor | Débil — 3 personas reales lo vivieron, todas se resignaron |
| Entra en ~20 hs construyendo sobre Squads | Viabilidad | Parcial: Squads tiene SDK de TS ([github.com/squads-protocol/v4](https://github.com/squads-protocol/v4)) pero no se probó nada |
| Hay hueco de mercado en Colosseum | Novedad | **Verificado parcial** (Copilot, 2-oct-2026): la mecánica "caja que solo se mueve si el grupo vota" ya se intentó ~15 veces y Blonk ganó con ella en Radar. El hueco real es más finito: grupos no-cripto, fiat-first, LatAm — ver Competencia |

## Competencia (verificada con links, actualizado 2-oct-2026 vía Colosseum Copilot + web)

### Proyectos Colosseum que ya lo intentaron

**Con premio:**

- **Blonk** — el precedente más cercano: bot de Telegram que crea multisigs de Squads V3 dentro del grupo de chat y los miembros aprueban/rechazan transacciones con botones (Blinks). 5º puesto DAOs & Network States, Radar 2024 ($5k). Apunta a comunidades cripto en Telegram; cada miembro necesita wallet. <https://colosseum.com/projects/explore/blonk> · repo: <https://github.com/blonk-b/blonk-platform>
- **Marshmallow** — "Family DAO": tesorería familiar donde los padres aprueban gastos/rewards. 2º puesto DAOs & Network States, Radar. Conceptual: solo mockups, sin producto funcional. <https://colosseum.com/projects/explore/marshmallow>
- **Fora** — chats de grupo privados que funcionan como fondos de capital común con NAV. 3º puesto Consumer Apps, Cypherpunk. Para trading/predicción, no gastos cotidianos. <https://colosseum.com/projects/explore/fora>
- **CargoBill** — multisig en Solana para pagos entre empresas de logística (industria no-cripto pero B2B). 1º puesto Stablecoins, Breakout. <https://colosseum.com/projects/explore/cargobill>
- **DeStreet** — pools de trading grupales no-custodiales vía links. 2º puesto DAOs & Communities, Renaissance. <https://colosseum.com/projects/explore/destreet:-trade-onchain-with-friends>

**Sin premio (los más parecidos a la idea nunca ganaron):**

- **Squadmint / ZakaApp** — el intento más parecido a la idea completa: app mobile estilo stokvel donde la plata del grupo **solo sale si >50% de los miembros vota el retiro**; onboarding con Google sign-in, gasless, `$handles` en vez de direcciones. Multisig propio en Anchor (devnet). Sin premio en Cypherpunk, pero llegó a App Store como ZakaApp (Sudáfrica; estado actual sin verificar). <https://colosseum.com/projects/explore/squadmint-aka-zakaapp> · <https://www.zakaapp.com/>
- **WeSplit** — empezó como bill-splitting onchain en Cypherpunk (sin premio) y hoy es **producto vivo**: app en Play Store/TestFlight/Solana dApp Store con "Squad Wallet" (pool compartido + aprobación multisig "en un tap", nombres en vez de addresses, reglas de gasto y metas). Pero es crypto-para-crypto: sus usuarios ya operan USDC/wallets. Si el Squad Wallet ya está en producción o solo publicitado: **sin verificar**. <https://colosseum.com/projects/explore/wesplit> · <https://wesplit.io/>
- **Pool** — "social spending": amigos meten plata en un balance común y gastan con tarjeta. Frontier; solo pitch, sin demo funcional. <https://colosseum.com/projects/explore/pool-1>
- **ShareApp** — gastos colectivos para eventos (viajes, asados) en Solana. Frontier. <https://colosseum.com/projects/explore/shareapp>
- **Fund Together** — cuenta conjunta de hasta 100 personas en vault compartido. Cypherpunk, conceptual. <https://colosseum.com/projects/explore/fund-together-app>
- **Chest** — vaults onchain administrados desde Telegram con votación de trades. Cypherpunk. <https://colosseum.com/projects/explore/chest>
- **Cluster ROSCA** (tandas/stokvels/pasanakus onchain, ~10 proyectos, todos sin premio): Vaquita Protocol (Radar — apunta a vaquita/junta/pasanaku de LatAm: <https://colosseum.com/projects/explore/vaquita-protocol>), Roosta, Chord Finance, Circles, Susu Protocol, UnityLedger, Ajo, Poolver, SafeNudge, ChainPot. Mecánica distinta (rotación de ahorro, no voto por gasto) pero mismo público informal.
- **Cluster "split expenses"** (~9 proyectos, todos sin premio): Chipin, SplitSOL, Solit, Tangerii, Divvy, Ledger & Pay, Naami, FundWise.

### Productos de mercado (fuera de Colosseum)

- **Squads Protocol** — multisig con propuestas, votación, límites de gasto y roles. $10B+ custodiados, lo usan Jupiter/Pyth/Kamino. Orientado a equipos cripto, no a grupos comunes. <https://docs.squads.so/main/getting-started/treasury-management-overview>
- **Safe{Wallet}** — el multisig líder en EVM ($60B+ asegurados). Teams y DAOs; mismas barreras (cada miembro necesita wallet). <https://appsafe.global/>
- **Fuse Wallet** — smart wallet en Solana sobre Squads: sin seed phrase, límites de gasto, recovery social. Individual, no caja de grupo. <https://fusewallet.com/>
- **Braid → Pool** — la lección no-cripto: Braid (2019–2023, ~$10M de Index/Accel) hizo "money pools" multi-usuario asegurados FDIC con tarjeta de débito; llegó a ~50k usuarios y murió cuando su banco sponsor cortó el servicio. La fundadora relanzó como Pool (2025, seed $4.5M, First Internet Bank + Visa). Ojo: ahí cualquier miembro gasta — no hay voto, la custodia es del banco. <https://techcrunch.com/2023/10/09/consumer-payments-startup-braid-shuts-down-cites-struggles-with-leveraging-third-party-software/> · <https://amandapeyton.com/blog/2023/10/braid-is-dead-long-live-braid/>
- **La Vaquita** — organiza vaquitas con link y comprobantes, pero la plata va a la cuenta del organizador. <https://lavaquita.app/>
- **Mercado Pago "Pedir dinero"** — juntar de hasta 50 contactos; todo cae en una sola cuenta. <https://www.ambito.com/informacion-general/mercado-pago-como-juntar-dinero-mis-contactos-whatsapp-n5783473>
- **Dividí / AhorrAR** — dividen gastos y balances; registran deudas, no custodian. <https://dividi.com.ar/> <https://ahorrarapp.com.ar/>

**Cuña actualizada:** el hueco NO es "nadie hizo caja común con votación" — eso existe (Blonk ganó con eso; WeSplit y ZakaApp lo tienen publicado). El hueco real y más finito: **fiat-first, en español, para clubes/promos de LatAm** — alguien que cobra en pesos, no sabe qué es una wallet, y quiere que la caja obedezca el voto. La mecánica onchain es commodity; la diferenciación es público + onboarding (ARS → USDC invisible). Dos riesgos honestos: ~15 intentos parecidos en Colosseum y solo Blonk ganó; y Braid muestra que en "pool de plata para grupos" el cuello de botella son los rieles de plata real (banco/on-ramp), no la app.

**Patrón de mercado:** commodity con público libre — la mecánica existe y está probada; nadie la llevó a grupos no-cripto fiat-first en LatAm.

## Test de "¿por qué cadena?"

Sin blockchain no existe: la propuesta central es que **la plata esté custodiada por reglas** (nadie la mueve sin votación). Planilla, MP y La Vaquita dejan la plata en la cuenta de una persona. La cadena no es decoración: ES el producto.

## Puntajes (criterios oficiales, 1-5)

| Criterio | Puntos | Justificación |
|---|---|---|
| Funcionalidad | 4 | Con Squads SDK es viable; programa propio en 20 hs = 2 |
| Impacto | 3 | Dolor real pero nicho chico |
| Novedad | 2 | La mecánica ya existe y está publicada (Blonk ganó con ella; WeSplit y ZakaApp la tienen en producción). Solo sube si la demo muestra la cuña: un socio sin wallet |
| UX | 3 | Mayor riesgo: esconder la complejidad multisig |
| Open source / composabilidad | 5 | Construir sobre Squads ES componer |
| Negocio | 2 | ¿Quién paga? Sin verificar |

## 3 razones por las que fracasa

1. Squads, WeSplit y ZakaApp ya hacen la mecánica — si la demo se ve igual que la de ellos (socio con wallet crypto), es un clon más. Solo se diferencia si el socio entra sin saber qué es una wallet.
2. Onboarding: el socio de un club no tiene wallet ni USDC; la fricción puede matar todo.
3. En ~20 hs puede no alcanzar ni con Squads — la votación multisig tiene sus curvas.

## Test de mesa: personas reales que el equipo conoce

| Persona | Qué le pasó | Qué hizo | ¿Siguió o se resignó? |
|---|---|---|---|
| Marcos (tesorero del club de barrio) | Junta la cuota en efectivo + cuaderno; dos veces "faltó plata" y hubo puterío | Anotó todo a mano y mostró el cuaderno | Resignado: "es lo que hay" |
| Sofía (promo de 5to año) | Recaudó el viaje por MP y mandaba capturas al grupo | Capturas + planilla de Google | Se resignó: "todos desconfiaban igual" |
| Nico (asado de los sábados) | Persiguió a los que no ponían durante semanas | WhatsApp + memoria | Resignado: "después no se acuerdan ni ellos" |

3 de 3 personas reales con dolor vivido. Ninguna encontró solución: se resignaron. Señal buena.

## Criterio de abortar

Si no podíamos nombrar ni una persona real que sufrió esto, o si todos hubieran resuelto bien con MP + capturas, pivotábamos a la idea 13 (ahorro bloqueado) o volvíamos a `/solana-tuc-idea`.

## Veredicto

**ANGOSTAR A LA CUÑA** (2026-10-02). Patrón de mercado: commodity con público libre. Versión angosta: caja común para grupos que **no son cripto** — el socio entra con su email, sin wallet ni frase semilla, y vota en español. Se construye **sobre Squads Protocol** (no programa propio), en **devnet** (red de prueba, plata de mentira).

La demo tiene que mostrar a alguien sin wallet votando. Si el login por email no sale en el spike (la doc de Squads menciona cuentas por email vía TipLink; **a verificar**), el plan es "clon consciente" y la apuesta pasa a ser UX en español + el caso del club, dicho tal cual en el pitch.

Evidencia débil a mejorar en la semana: nadie probó pagar — mostrarle la demo a una persona real del test de mesa.

## Siguiente paso

`/solana-tuc-mvp`
