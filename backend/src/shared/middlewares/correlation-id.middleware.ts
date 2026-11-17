import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

/**
 * Gives every request an id, returned in the x-correlation-id response header and
 * available as res.locals.correlationId, so one request can be traced through the logs.
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.get('x-correlation-id');
  const correlationId = incoming && /^[\w-]{1,64}$/.test(incoming) ? incoming : randomUUID();
  res.locals.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
}
