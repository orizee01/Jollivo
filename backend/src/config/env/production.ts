import type { EnvConfig } from '../../shared/interfaces/index.ts';
import base from './base.ts';

const production: EnvConfig = {
  ...base,
  LOG_LEVEL: 'info',
  SWAGGER_ENABLED: false
};

export default production;
