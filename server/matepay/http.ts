import { NextFunction, Request, RequestHandler, Response } from 'express';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Express 4 no captura rechazos de handlers async: los derivamos al error handler.
export const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res).catch(next);
  };

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error('[matepay] Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor. Probá de nuevo en unos segundos.' });
}

// Límite simple en memoria por IP: alcanza para que nadie vacíe el fee-payer de devnet a fuerza de requests.
export function rateLimit(maxRequests: number, windowMs: number): RequestHandler {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || entry.resetAt < now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= maxRequests) {
      res.status(429).json({ error: 'Demasiadas solicitudes. Esperá un minuto y probá de nuevo.' });
      return;
    }
    entry.count++;
    next();
  };
}
