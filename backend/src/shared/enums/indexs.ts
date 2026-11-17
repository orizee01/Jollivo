// Plain objects instead of `enum`: this project runs TypeScript directly in Node,
// which does not support enums. Usage is the same: AppEnv.PRODUCTION, LOGIN_MODE.EMAIL.

export const AppEnv = {
  PRODUCTION: 'production',
  STAGING: 'staging',
  DEVELOPMENT: 'development',
  TEST: 'test',
  DEMO: 'demo'
} as const;
export type AppEnv = (typeof AppEnv)[keyof typeof AppEnv];

export const LOGIN_MODE = {
  EMAIL: 'email',
  PHONE: 'phone'
} as const;
export type LOGIN_MODE = (typeof LOGIN_MODE)[keyof typeof LOGIN_MODE];
