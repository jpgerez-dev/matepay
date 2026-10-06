export interface ExchangeRate {
  compra: number;
  venta: number;
  casa: string;
  nombre: string;
  fechaActualizacion: string;
  fuente: string;
}

// Fallback por defecto si no hay conexión o falla la API
const DEFAULT_RATE: ExchangeRate = {
  compra: 1210,
  venta: 1240,
  casa: 'cripto',
  nombre: 'Dólar Cripto (USDC/USDT)',
  fechaActualizacion: new Date().toISOString(),
  fuente: 'Fallback Offline',
};

let cachedRate: ExchangeRate | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60 * 1000; // 1 minuto de caché

/**
 * Obtiene la cotización del dólar cripto en vivo desde DolarAPI.
 * Si falla, prueba con el dólar blue o recurre al fallback local.
 */
export async function getLiveCriptoRate(): Promise<ExchangeRate> {
  const now = Date.now();
  if (cachedRate && now - lastFetchTime < CACHE_DURATION_MS) {
    return cachedRate;
  }

  try {
    const response = await fetch('https://dolarapi.com/v1/dolares/cripto', {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`DolarAPI error status ${response.status}`);
    }

    const data = await response.json();
    cachedRate = {
      compra: Number(data.compra) || DEFAULT_RATE.compra,
      venta: Number(data.venta) || DEFAULT_RATE.venta,
      casa: data.casa || 'cripto',
      nombre: 'Dólar Cripto (USDC)',
      fechaActualizacion: data.fechaActualizacion || new Date().toISOString(),
      fuente: 'DolarAPI en vivo',
    };
    lastFetchTime = now;
    return cachedRate;
  } catch (err) {
    console.warn('Fallo al obtener dólar cripto, intentando fallback blue...', err);

    try {
      const blueRes = await fetch('https://dolarapi.com/v1/dolares/blue');
      if (blueRes.ok) {
        const blueData = await blueRes.json();
        cachedRate = {
          compra: Number(blueData.compra) || DEFAULT_RATE.compra,
          venta: Number(blueData.venta) || DEFAULT_RATE.venta,
          casa: 'blue',
          nombre: 'Dólar Blue (referencia)',
          fechaActualizacion: blueData.fechaActualizacion || new Date().toISOString(),
          fuente: 'DolarAPI Blue',
        };
        lastFetchTime = now;
        return cachedRate;
      }
    } catch {
      // Ignorar y usar fallback
    }

    return DEFAULT_RATE;
  }
}

/**
 * Convierte monto en pesos argentinos a USDC según la tasa de cambio dada.
 */
export function convertArsToUsdc(amountArs: number, rateVenta: number): number {
  if (!amountArs || amountArs <= 0 || !rateVenta || rateVenta <= 0) return 0;
  const usdc = amountArs / rateVenta;
  return Number(usdc.toFixed(2));
}

/**
 * Convierte monto en USDC a pesos argentinos según la tasa de cambio dada.
 */
export function convertUsdcToArs(amountUsdc: number, rateVenta: number): number {
  if (!amountUsdc || amountUsdc <= 0 || !rateVenta || rateVenta <= 0) return 0;
  return Math.round(amountUsdc * rateVenta);
}

/**
 * Formatea un número como pesos argentinos (ej: "$ 4.500")
 */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea un número como dólares USDC (ej: "3,65 USDC")
 */
export function formatUSDC(amount: number): string {
  return `${amount.toFixed(2)} USDC`;
}
