/** Options used when signing a JSON Web Token. */
export interface JwtSignature {
  issuer: string;
  subject: string;
  audience: string;
  /** Lifetime as a duration string, e.g. '15m', '1h', '7d'. */
  expiresIn: string;
}

/** The configuration every environment file (config/env/*.ts) must export. */
export interface EnvConfig {
  PORT: number;
  CORS_ORIGINS: string[];
  CLERK_PUBLISHABLE_KEY?: string;
  CLERK_SECRET_KEY?: string;
  HTTPS_KEY?: string;
  HTTPS_CERT?: string;
  DATABASE_URL?: string;
  JWT_EXPIRES_IN?: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  /** Serve the Swagger UI / OpenAPI docs. */
  SWAGGER_ENABLED: boolean;
}
