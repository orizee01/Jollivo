import type { EnvConfig } from '../../shared/interfaces/index.ts';
import base from './base.ts';

const staging: EnvConfig = {
  ...base,
  LOG_LEVEL: 'info',
  SWAGGER_ENABLED: true
};

export default staging;
