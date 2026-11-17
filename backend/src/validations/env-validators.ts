import Joi from 'joi';
import { AppEnv } from '../shared/enums/indexs.ts';
;

export interface EnvProps {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  SWAGGER_ROUTE: string;
  CSP_REPORT_ONLY: boolean;
  REDIS_SESSION_STORE_URL: string;
  SESSION_SECRET: string;
  RATE_LIMIT_ENABLED: boolean;
  LOGIN_RATE_LIMIT_WINDOW: number;
  LOGIN_RATE_LIMIT_MAX_REQUESTS: number;
  OTP_RATE_LIMIT_WINDOW: number;
  OTP_RATE_LIMIT_MAX_REQUESTS: number;
  FORGOT_PASSWORD_RATE_LIMIT_WINDOW: number;
  FORGOT_PASSWORD_RATE_LIMIT_MAX_REQUESTS: number;
  ACCOUNT_THROTTLE_COOLDOWN_BASE_SECONDS: number;
  ACCOUNT_THROTTLE_MAX_COOLDOWN_SECONDS: number;
  MAX_FAILED_LOGIN_ATTEMPTS: number;
  MAX_FAILED_OTP_ATTEMPTS: number;
  NEW_DEVICE_VERIFICATION_ENABLED: boolean;
  DEVICE_COOKIE_SECRET?: string;
}

export const envValidatorSchema = Joi.object<EnvProps>({
  PORT: Joi.number().default(8000),
  NODE_ENV: Joi.string()
    .required()
    .valid(AppEnv.DEVELOPMENT, AppEnv.TEST, AppEnv.STAGING, AppEnv.PRODUCTION, AppEnv.DEMO)
    .default(AppEnv.DEVELOPMENT),

  DATABASE_URL: Joi.string().required(),

  REDIS_SESSION_STORE_URL: Joi.string(),

  SWAGGER_ROUTE: Joi.string().default('/api/docs'),
  CSP_REPORT_ONLY: Joi.boolean().default(false),
  SESSION_SECRET: Joi.string(),
  RATE_LIMIT_ENABLED: Joi.boolean().default(true),
  LOGIN_RATE_LIMIT_WINDOW: Joi.number().integer().min(1).default(60),
  LOGIN_RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().min(1).default(5),
  OTP_RATE_LIMIT_WINDOW: Joi.number().integer().min(1).default(60),
  OTP_RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().min(1).default(10),
  FORGOT_PASSWORD_RATE_LIMIT_WINDOW: Joi.number().integer().min(1).default(60),
  FORGOT_PASSWORD_RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().min(1).default(5),
  ACCOUNT_THROTTLE_COOLDOWN_BASE_SECONDS: Joi.number().integer().min(0).default(1),
  ACCOUNT_THROTTLE_MAX_COOLDOWN_SECONDS: Joi.number().integer().min(1).default(8),
  MAX_FAILED_LOGIN_ATTEMPTS: Joi.number().integer().min(1).default(5),
  MAX_FAILED_OTP_ATTEMPTS: Joi.number().integer().min(1).default(5),
  NEW_DEVICE_VERIFICATION_ENABLED: Joi.boolean().default(true),
  DEVICE_COOKIE_SECRET: Joi.string().optional()
}).unknown(true);
