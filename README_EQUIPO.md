# 🧉 MatePay — Kit de Trabajo para el Equipo
### Hackathon: Colosseum Crypto World's Fair x Superteam Argentina
**Fecha Límite de Entrega:** 12 de Octubre de 2026

¡Hola equipo! Este repositorio contiene **MatePay** funcionando con transacciones reales en **Solana Devnet**, junto con el kit oficial de Superteam Argentina (`workspace-colosseum`).

---

## 👥 Roles del Equipo

* **Montero Mauricio:** Ing. en Sistemas — *Full Stack & Web3 Lead*
* **Gerez Juan Pablo:** Estudiante de ing. en Sistemas & Desarrollador Front
* **Robles Máximo:** *Diseñador Multimedial & Aprendiz de Full Stack*

---

## 🚀 La Propuesta de Valor (Para los Jueces de Colosseum)

> **"Ayudamos a personas y comercios en Argentina a pagar y cobrar en dólares digitales (USDC) en 1 segundo vía QR de Solana Pay y Alias legibles, sin necesidad de tener SOL para comisiones ni miedo a equivocarse de dirección."**

---

## 🛠️ Cómo Levantar el Proyecto en tu Máquina

### Requisitos:
* **Node.js 20+** instalado.
* Git.

### Pasos:
1. Clonar el repositorio y, en la carpeta del proyecto:
   ```bash
   npm install
   cp .env.example .env   # opcional: todo tiene valores por defecto para devnet
   npm run dev
   ```
2. Abrir **`http://localhost:3000`**.
3. La primera vez el server crea dos wallets de devnet en `.keys/` (ignorada por git) y muestra sus direcciones en la consola:
   * **fee-payer**: paga las comisiones de todos. **Necesita SOL de devnet**: pegá su dirección en [faucet.solana.com](https://faucet.solana.com). Sin SOL, los pagos fallan.
   * **demo-merchant**: el comercio `@cafedelaesquina` de la Demo en vivo. Solo recibe.
4. Para pagar necesitás **Phantom en devnet** (Settings → Developer settings → Testnet mode) y **USDC de prueba** de [faucet.circle.com](https://faucet.circle.com) (red Solana Devnet). **No hace falta SOL en la wallet del cliente.**
5. Smoke test de la API (con el server corriendo): `npx tsx scripts/smoke-test.ts http://localhost:3000`

### Probar con el celular (QR real)
Phantom mobile necesita una URL pública HTTPS para pagar sin SOL escaneando el QR del POS (Solana Pay *transaction request*):
```bash
npx cloudflared tunnel --url http://localhost:3000   # o ngrok http 3000
```
Poné la URL `https://...` que te da en `APP_URL` del `.env` y reiniciá el server. Sin `APP_URL`, el QR es un *transfer request* clásico: MatePay (pestaña Pagar → cámara) paga sin gas, pero otras wallets cobran su comisión.

---

## 📱 Cómo Funciona (todo real, en Solana devnet)

1. **Cobrar (`src/components/PosTerminal.tsx`)**: el comercio ingresa pesos, se convierten a USDC con DolarAPI y el server crea un cobro con una `reference` única. El POS consulta la cadena cada 2 s y confirma solo cuando ve la transferencia con el monto, el token y el destino correctos.
2. **Pagar (`src/components/ClientPay.tsx`)**: el cliente escribe `@alias`, una dirección o escanea el QR con la cámara. El server arma la transacción con **MatePay como fee payer** y la firma, la wallet del cliente firma solo la transferencia de USDC, y el server la envía y confirma.
3. **Mi cuenta (`src/components/Account.tsx`)**: saldo real, historial de movimientos con link al explorer y registro de `@alias` **firmado con la wallet** (nadie puede registrar un alias a nombre de otra dirección).
4. **Demo en vivo (`src/components/LiveDemo.tsx`)**: POS y cliente lado a lado, con transacciones reales.

### Backend (`server/matepay/`)
| Endpoint | Qué hace |
|---|---|
| `GET /api/matepay/config` | Red, mint USDC, fee-payer y su saldo |
| `GET /api/matepay/balance/:address` | Saldo SOL y USDC |
| `GET /api/matepay/history/:address` | Últimos movimientos en USDC |
| `GET /api/matepay/alias/:alias` · `GET /api/matepay/alias-of/:address` | Resolver alias |
| `POST /api/matepay/alias` | Registrar alias (requiere firma de la wallet) |
| `POST /api/matepay/payment-requests` · `GET /api/matepay/payment-requests/:id` | Crear cobro / consultar si se pagó |
| `POST /api/matepay/tx/build` | Armar transferencia gasless firmada por el fee-payer |
| `POST /api/matepay/tx/submit` | Enviar la transacción firmada por el cliente |
| `GET/POST /api/solana-pay/:id` | Solana Pay transaction request (lo que lee Phantom) |

Protecciones: el server no arranca si el RPC no es devnet (verifica el genesis hash), el fee-payer nunca puede figurar como pagador, hay tope por pago (`MAX_PAYMENT_USDC`) y límite de requests por IP.

Alias y cobros se guardan en `data/*.json` (ignorado por git): alcanza para la hackathon; para producción hace falta una base de datos.

Las herramientas internas (chat con Gemini, analizador, skills) siguen en el código: se ven con `VITE_SHOW_STUDIO=true` en el `.env`.

---

## 🎯 Próximas Tareas

### Montero Mauricio (Backend & Web3)
* Revisar `server/matepay/solana.ts` y `routes.ts`. Pasar el RPC a Helius/Triton devnet (`SOLANA_RPC_URL`).
* Mover alias y cobros de JSON a una base (SQLite/Postgres) antes de hacer deploy.
* Alertar cuando el fee-payer baje de 0.1 SOL.

### Gerez Juan Pablo (Frontend)
* Probar el flujo completo con Phantom extensión y Phantom mobile (con túnel HTTPS).
* Sumar Solana Mobile Wallet Adapter para navegadores de Android sin Phantom.

### Robles Máximo (UX, Conversor y Demo)
* Pulir microinteracciones de los estados de pago (armando → firmá → enviando → confirmado).
* Comprobante descargable/compartible y guión del video de 3 minutos en inglés sobre la Demo en vivo.

---

## ⚠️ Reglas Maestras de la Sede (No Romper):
1. **Solo Devnet:** La plata es de mentira, sale de faucets (`faucet.solana.com`). NUNCA usar mainnet ni dinero real durante la hackathon.
2. **Claves privadas y frases semilla:** NUNCA en el chat de la IA, ni en archivos del repo, ni en GitHub.
3. **La entrega final (README, video de 3 min y formulario) va en inglés.** Fecha límite: 12/10/2026.
