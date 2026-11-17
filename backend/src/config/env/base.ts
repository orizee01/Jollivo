import type { EnvConfig } from '../../shared/interfaces/index.ts';

/** Values read from environment variables (.env); shared by every environment. */
const base: Omit<EnvConfig, 'LOG_LEVEL' | 'SWAGGER_ENABLED'> = {
  PORT: Number(process.env.PORT) || 4000,
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'https://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || undefined,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || undefined,
  HTTPS_KEY: process.env.HTTPS_KEY || undefined,
  HTTPS_CERT: process.env.HTTPS_CERT || undefined,
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || undefined
};

export default base;
