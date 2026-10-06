# 01 — Qué construir

> **EJEMPLO DE REFERENCIA — no es tu proyecto.** Las respuestas del equipo son simuladas; sirven para ver cómo queda este archivo.

## Equipo y fortalezas

- 3 personas, todas de sistemas. 2 orientados a desarrollo, 1 a diseño.
- Horas reales estimadas: ~15-20 hs en total (sede + algo en la semana hasta el 12/10).

## Problemas explorados

| Problema | Quién lo sufre | Cómo lo resuelve hoy | Costo |
|---|---|---|---|
| Caja del club manejada por una sola persona | Socios de un club de fútbol de barrio | Tesorero con efectivo + cuaderno | Desconfianza, plata que "desaparece" |
| Promo juntando plata para el viaje | Estudiantes de último año | Uno recauda por MP + capturas por WhatsApp | Nadie confía en los números |
| Juntar plata entre amigos | Grupos de amigos | Memoria + perseguir a los que no pagaron | Fricción y discusiones |

## Tabla de ideas

**18 ideas generadas** (ronda del equipo + ronda de expansión, sin juzgar). Barrido por la prueba de la planilla: 7 descartadas porque funcionan igual sin cadena (caja visible, perseguir deudores, vaquita simple, historial, puntos, bot, muro). 2 fundidas en otras. Sobrevivientes:

| Idea | Puntaje | Nota |
|---|---|---|
| **Caja común con gasto por votación** | **25** | La cadena custodia la plata + las reglas. |
| Caja con límites duros (máx. X por semana) | 23 | Variante de la elegida. |
| Ahorro bloqueado hasta el viaje (promo) | 23 | La más simple: una sola regla onchain. **Plan B.** |
| Rifa onchain verificable | 22 | Sorteo público sin trampa. Menos dolor cotidiano. |
| Fideicomiso que se autodestruye y reparte | 21 | Rara pero interesante. |
| Sponsor local con publicidad verificable | 20 | Modelo de negocio claro, ejecución más larga. |

## Idea elegida

**Ayudamos a los socios de clubes y promos a juntar y gastar plata en común sin tener que confiar en una sola persona.**

- La caja vive onchain (USDC, devnet). El tesorero **propone** un gasto, los socios **votan**, y si se aprueba la plata **se libera sola**.
- Nadie puede tocar la plata sin votación: ni el tesorero, ni nosotros.

## Por qué cadena (prueba de la planilla)

- ¿Andaría igual con una planilla + billetera virtual? **No.** Una planilla registra, pero la plata sigue en la cuenta de una persona que puede moverla cuando quiera. Acá la cadena custodia los fondos y ejecuta las reglas de gasto.

## 3 supuestos peligrosos

1. Que los socios de un club real **quieran** mover su caja a USDC aunque la idea les guste (fricción de onboarding).
2. Que el dolor sea suficiente: puede que la desconfianza se banque con "el tesorero es de confianza y ya".
3. Que quepa en ~20 hs: votación + liberación de fondos onchain puede ser más complejo de lo que parece.

## Siguiente paso

`/solana-tuc-validar`
