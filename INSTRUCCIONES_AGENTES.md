# 🤖 Instrucciones para los Agentes de IA de Mauricio y Juan Pablo

Si usás **Devin**, **Antigravity**, **Cursor** o **Claude Code**, copiale y pegale este mensaje a tu agente apenas abras esta carpeta:

---

### 👉 Para el Agente de Mauricio Montero (Backend / Web3 Lead):

```text
Hola! Soy Mauricio Montero (Ing. en Sistemas y Full Stack Lead). Estamos participando en la hackathon Colosseum Crypto World's Fair x Superteam Argentina con nuestro proyecto MatePay.

Por favor leé el archivo AGENTS.md y README_EQUIPO.md en la raíz de este proyecto.

Mi rol es el Backend y la lógica Web3 en Solana Devnet:
1. Revisá en server.ts los endpoints creados para /api/matepay/aliases y /api/matepay/fee-payer/sign.
2. Ayudame a implementar la conexión con @solana/web3.js para que el Fee-Payer use una Keypair de prueba de Devnet con SOL de faucet y firme las transacciones de USDC subsidiando la comisión de red.
3. Asegurate de seguir la regla de oro: MODO DEVNET SIEMPRE, nada de mainnet ni pedir claves reales.

¿Podés revisar server.ts y proponerme el código para robustecer el endpoint de Fee Payer?
```

---

### 👉 Para el Agente de Juan Pablo Gerez (Frontend Lead):

```text
Hola! Soy Juan Pablo Gerez (Frontend Lead). Estamos participando en la hackathon Colosseum Crypto World's Fair x Superteam Argentina con nuestro proyecto MatePay.

Por favor leé el archivo AGENTS.md y README_EQUIPO.md en la raíz de este proyecto.

Mi rol es la integración del Frontend en React con Solana:
1. Revisá los componentes en src/components/ClientPay.tsx, src/components/PosTerminal.tsx y src/components/LiveDemo.tsx.
2. Ayudame a integrar @solana/wallet-adapter-react configurado para Phantom en Devnet, para permitir que los usuarios puedan firmar transacciones tanto en modo simulado como con su extensión de Phantom instalada.
3. Asegurate de que el flujo no se rompa si el usuario no tiene Phantom (mantener el fallback interactivo actual).

¿Podés revisar src/components/ClientPay.tsx y mostrarme cómo conectar el hook useWallet()?
```
