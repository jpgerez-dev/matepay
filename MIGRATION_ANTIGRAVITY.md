# Guía de Migración a Antigravity

Esta guía explica paso a paso cómo abrir y continuar este proyecto en **Antigravity**.

---

### Opción 1: Descargar el ZIP y abrirlo en Antigravity (La más rápida)

1. **Descargar el proyecto completo:**
   - Podés descargar el archivo ZIP listo desde la app web en la URL:
     `https://<TU_APP_URL>/matepay-colosseum-workspace.zip`
     *(o haciendo clic en el botón de descarga en la barra de herramientas de la app).*

2. **Abrir en Antigravity:**
   - Descomprimí el archivo en tu computadora en una carpeta llamada `matepay-colosseum`.
   - Abrí Antigravity y seleccioná **Open Folder / Open Project** eligiendo esa carpeta.
   - Antigravity detectará automáticamente el archivo `AGENTS.md` y sabrá de inmediato todo el contexto de MatePay, tu equipo y la hackathon.

3. **Instalar dependencias y levantar el servidor:**
   En la terminal integrada de Antigravity:
   ```bash
   npm install
   npm run dev
   ```

---

### Opción 2: Subir a tu GitHub y clonar en Antigravity (Recomendada para trabajar en equipo)

1. En tu GitHub personal (por ejemplo `https://github.com/maximoroblespalacios`), creá un repositorio nuevo vacío llamado `matepay-colosseum`.
2. En la terminal de tu máquina (o acá mismo), conectá y enviá el código:
   ```bash
   git remote add origin https://github.com/maximoroblespalacios/matepay-colosseum.git
   git branch -M main
   git push -u origin main
   ```
3. En Antigravity, seleccioná **Clone from GitHub** o vinculá tu repositorio.

---

### El Prompt para pegar en Antigravity al arrancar:

Una vez abierto en Antigravity, pegale este mensaje a tu agente:

```text
Hola! Estamos trabajando en la hackathon Colosseum Crypto World's Fair x Superteam Argentina.
Leé el archivo AGENTS.md en la raíz del proyecto para ver las reglas, los integrantes de nuestro equipo (Mauricio, Juan Pablo y Máximo) y el proyecto elegido: MatePay (pagos en USDC con Solana Pay en devnet, sin gas y con alias legibles).

Queremos arrancar con la implementación de la primera tarea:
1. Mauricio: Endpoint de Solana Pay y Fee Payer en el backend.
2. Juan Pablo: Conexión de Phantom Wallet Adapter en devnet.
3. Máximo: Conversor de pesos argentinos a USDC en tiempo real con DolarAPI.

¿Podés guiarnos para escribir el código del primer hito?
```
