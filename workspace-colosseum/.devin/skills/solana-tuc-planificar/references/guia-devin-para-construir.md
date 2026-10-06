# Guía rápida: construir rápido con Devin

Con SWE-2 y tokens ilimitados, **escribir código ya no es el cuello de botella**. Lo escaso es tener claro qué construir, revisar lo que sale y llegar a una demo que funcione.

## Modelos

| Para qué | Qué usar |
|---|---|
| Casi todo (features, UI, bugs comunes) | `swe` (SWE-2) |
| Un bug que no sale después de 2 intentos, o decisiones de arquitectura | `/model opus` o `/model gpt` |
| Balance calidad/costo automático | `/fusion` o `/model adaptive` |
| Cambiar el nivel de razonamiento | `Alt+T` |

Como no hay que ahorrar tokens: pedí 2 o 3 variantes de una pantalla, pedí tests, pedí que revise su propio trabajo.

## Modos (cambiás con `Shift+Tab`)

- `/plan`: solo lee y propone. Usalo antes de tocar algo grande.
- `/accept-edits` o `/smart`: para construir sin que te frene en cada archivo.
- `/ask <pregunta>`: para entender código sin que lo modifique.

## Rutina de trabajo

1. Abrí sesión y escribí `/solana-tuc-status` si no sabés dónde estás.
2. Pedí **una tarea chica por vez** (idealmente la de `proyecto/04-plan.md`). "Hacé login con wallet" es mejor que "hacé la app".
3. Pasale contexto con `@archivo` y, para bugs de UI, pegá una captura con `Ctrl+V`.
4. Probalo vos. Mirá la pantalla. No confíes en "ya está listo".
5. Pedile: **"hacé commit"**. Commits chicos y seguidos.
6. Si se rompió algo: `/steps` y `/revert <n>` vuelven atrás los archivos y la conversación.
7. Si querés probar otra dirección sin perder la actual: `/fork`.

## Trabajar en paralelo

- Pedile que investigue algo en un **subagente en segundo plano** mientras seguís con otra cosa (`Ctrl+B` manda uno al fondo).
- `/btw <pregunta>` hace una consulta rápida sin ensuciar la conversación.
- Cada compañero puede tener su propia sesión en una rama distinta. Integren seguido para no tener conflictos enormes.

## Contexto de la sesión

- El círculo junto al input muestra cuánto contexto se usó. Si se llena, Devin compacta solo; con `/compact` lo forzás.
- Cada sesión nueva arranca sin memoria. Por eso `AGENTS.md` y la carpeta `proyecto/` existen: ahí queda lo importante.

## Qué evitar

- Pedir "construí todo el proyecto" de una. Sale algo que parece completo y no funciona.
- Agregar funciones a último momento. Congelen el alcance antes del último bloque.
- Dejar el deploy y los videos para el final. Deploy temprano; videos con margen.
- Aceptar código que no entienden en la parte que explican en el pitch. Los jurados preguntan.
