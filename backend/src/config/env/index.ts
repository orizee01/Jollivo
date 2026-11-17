import production from './production.ts';
import staging from './staging.ts';
import development from './development.ts';
import test from './test.ts';
import demo from './demo.ts';
import type { JwtSignature } from '../../shared/interfaces/index.ts';

const configByEnv = {
  production,
  staging,
  development,
  test,
  demo
};

const envName = (process.env.NODE_ENV || 'development') as keyof typeof configByEnv;
const envConfig = configByEnv[envName] ?? development;

export const JwtSignOptions: JwtSignature = {
  issuer: 'Jollivo',
  subject: 'Authentication Token',
  audience: 'Jollivo API',
  expiresIn: envConfig.JWT_EXPIRES_IN || '15m'
};
export default envConfig;
