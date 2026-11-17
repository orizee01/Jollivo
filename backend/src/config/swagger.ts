import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

import { openApiPaths } from '../docs/openapi.path.ts';
import Env from '../shared/utils/env.ts';

export interface SwaggerOptions {
  title: string;
  version: string;
  description: string;
  port: number;
  /** Path the API routes live under, e.g. /api/v1. */
  apiBasePath: string;
  /** Deployed API address to list as a second server, e.g. https://api.example.com. */
  remoteServerUrl?: string;
}

/** Serve the interactive API docs at SWAGGER_ROUTE (default /api/docs). */
export function setupSwagger(app: Express, options: SwaggerOptions): void {
  const route = Env.get<string>('SWAGGER_ROUTE') ?? '/api/docs';

  const servers = [{ url: options.apiBasePath, description: 'This server' }];
  if (options.remoteServerUrl) {
    servers.push({ url: `${options.remoteServerUrl}${options.apiBasePath}`, description: 'Remote' });
  }

  const document = {
    openapi: '3.0.3',
    info: { title: options.title, version: options.version, description: options.description },
    servers,
    paths: openApiPaths
  };

  app.use(route, swaggerUi.serve, swaggerUi.setup(document));
}
