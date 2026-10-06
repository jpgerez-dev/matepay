# 03 — MVP

> **EJEMPLO DE REFERENCIA — no es tu proyecto.** Todo corre en devnet (red de prueba). Ver `02-validacion.md` de esta misma carpeta.

## Usuario y problema

**Ayudamos a los socios de clubes y promos a juntar y gastar plata en común sin tener que confiar en una sola persona.**

## Momento wow

La plata se mueve sola cuando la votación llega al quórum. Nadie la tuvo en su cuenta.

## Guion de la demo (5 pasos)

1. Una socia **sin wallet** abre el link y entra con su email (la cuña: nadie le habla de wallets). La caja del "Club Atlético Demo" tiene 500 USDC de prueba (devnet).
2. El tesorero propone: "Comprar pelotas — 80 USDC".
3. Los socios votan sí/no desde el celu. UI en español, sin la palabra "multisig".
4. Al llegar al quórum, la transacción se ejecuta sola.
5. Historial público: quién votó, qué se aprobó, saldo nuevo.

## Flujo central

Crear caja → aportar USDC → proponer gasto → votar → se ejecuta sola.
Una persona, un recorrido, transacciones reales en devnet.

## Alcance

| Entra (máx 3) | Esfuerzo |
|---|---|
| Caja Squads en devnet + aporte inicial | M |
| Proponer gasto → votar → ejecutar desde UI simple | L |
| Pantalla pública "estado de la caja" (saldo + historial) | S |

**Después:** crear tu propio club · notificaciones WhatsApp/Telegram · roles Squads.
**No entra:** mainnet (jamás: solo devnet) · programa propio · cuentas propias con base de datos · token propio · app nativa · onboarding fiat→USDC.

**Ojo:** el login por email SÍ entra dentro de "Proponer gasto → votar → ejecutar" como condición de la demo, porque es lo que diferencia al proyecto de Blonk, WeSplit y ZakaApp. Se prueba en el spike; si no sale, ver plan B.

## Real vs simulado

| Parte | Estado |
|---|---|
| Caja, propuesta, voto, ejecución | Real (devnet + Squads SDK) |
| UI español mobile-first | Real |
| Socios votando | Real — al menos 1 socio entra con email sin wallet propia; el resto son cuentas de prueba creadas por el equipo (aclarado) |
| El club | Simulado — ficticio (aclarado) |
| Onboarding de socios nuevos | A mano / fuera de scope |

## Riesgo técnico a probar primero

Dos spikes de 30 min al arrancar, en este orden: (1) crear multisig → proponer → votar → ejecutar con `@sqds/multisig` en devnet; (2) que un socio pueda votar entrando con email, sin wallet propia. Si el (1) no sale → plan B: idea 13 (ahorro bloqueado, una sola regla). Si el (2) no sale → seguir como "clon consciente" y decirlo en el pitch.

## Definición de "listo"

Un socio abre el link público, ve la caja con saldo real en devnet, vota una propuesta y ve la plata moverse sola — en menos de 2 minutos, sin ver "multisig", "firma" ni "PDA".

## Siguiente paso

`/solana-tuc-planificar`
