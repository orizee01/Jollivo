import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { Router, ROUTE_BASE } from '../routes/index.ts';
import {
  GlobalErrorCatcherMiddleware,
  NotFoundMiddleware
} from '../shared/middlewares/global-error-catcher.middleware.ts';
import { corsOptions } from './cors.ts';
import { apiSecurityHeaders, createSwaggerCsp, permissionsPolicy } from './security.ts';
import { setupSwagger } from './swagger.ts';
import Env from '../shared/utils/env.ts';
import { correlationIdMiddleware } from '../shared/middlewares/correlation-id.middleware.ts';

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(correlationIdMiddleware);

app.use(cors(corsOptions));

app.use(apiSecurityHeaders);
app.use(permissionsPolicy);
app.disable('x-powered-by');

// Works out who is signed in on each request. Skipped when the Clerk keys are not set,
// so the API still starts; routes that need a signed-in user must then refuse the request.
if (Env.get<string>('CLERK_SECRET_KEY') && Env.get<string>('CLERK_PUBLISHABLE_KEY')) {
  app.use(clerkMiddleware());
}

if (Env.get<boolean>('SWAGGER_ENABLED')) {
  const swaggerPort = Number(Env.get<number>('PORT')) || 4000;
  const swaggerRemoteOrigin = Env.get<string>('SWAGGER_REMOTE_ORIGIN');
  const swaggerRoute = Env.get<string>('SWAGGER_ROUTE') ?? '/api/docs';

  app.use(
    swaggerRoute,
    createSwaggerCsp({
      port: swaggerPort,
      remoteServerUrl: swaggerRemoteOrigin
    })
  );

  setupSwagger(app, {
    title: 'Jollivo API',
    version: '0.1.0',
    description: 'REST API documentation. Add paths in src/docs/openapi.path.ts.',
    port: swaggerPort,
    apiBasePath: ROUTE_BASE.V1_PATH,
    remoteServerUrl: swaggerRemoteOrigin
  });
}

// Register all other routes
app.use(ROUTE_BASE.V1_PATH, Router);

app.use(NotFoundMiddleware);
app.use(GlobalErrorCatcherMiddleware);

export default app;
