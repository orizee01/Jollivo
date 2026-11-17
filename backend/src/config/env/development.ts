import type { EnvConfig } from '../../shared/interfaces/index.ts';
import base from './base.ts';

const development: EnvConfig = {
  ...base,
  LOG_LEVEL: 'debug',
  SWAGGER_ENABLED: true
};

export default development;
