// @solana/web3.js usa Buffer, que no existe en el navegador.
import { Buffer } from 'buffer';

if (!(globalThis as any).Buffer) {
  (globalThis as any).Buffer = Buffer;
}
