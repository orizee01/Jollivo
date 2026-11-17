import type { EnvConfig } from '../../shared/interfaces/index.ts';
import base from './base.ts';

const demo: EnvConfig = {
  ...base,
  LOG_LEVEL: 'info',
  SWAGGER_ENABLED: true
};

export default demo;
