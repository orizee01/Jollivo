import type { NextFunction, Request, Response } from 'express';

import Logger from '../../config/logger.ts';

type HttpError = Error & { status?: number; statusCode?: number };

/** Answers requests that matched no route. Register after all routes. */
export function NotFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({ status: 'error', message: `Route ${req.method} ${req.path} not found` });
}

/** Last middleware in the chain: turns any thrown error into a JSON response. */
export function GlobalErrorCatcherMiddleware(
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  const candidate = error.status ?? error.statusCode ?? 500;
  const status = candidate >= 400 && candidate < 600 ? candidate : 500;

  if (status >= 500) {
    Logger.error(`${req.method} ${req.originalUrl} - ${error.stack ?? error.message}`);
  }

  res.status(status).json({
    status: 'error',
    // Never leak internal details (SQL, stack traces) for server-side failures.
    message: status >= 500 ? 'Something went wrong. Please try again later.' : error.message
  });
}
