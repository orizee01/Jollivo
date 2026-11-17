import type { EnvConfig } from '../../shared/interfaces/index.ts';
import base from './base.ts';

const test: EnvConfig = {
  ...base,
  LOG_LEVEL: 'error',
  SWAGGER_ENABLED: false
};

export default test;
