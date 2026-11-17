import type { CorsOptions } from 'cors';

import envConfig from './env/index.ts';

const allowedOrigins = new Set(envConfig.CORS_ORIGINS);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // No Origin header means the call is not from a browser page on another site
    // (curl, Postman, health checks), so CORS does not apply. A browser origin that
    // is not on the list gets no CORS headers and is blocked by the browser.
    callback(null, !origin || allowedOrigins.has(origin));
  },
  // Let the browser send the sign-in cookie / Authorization header.
  credentials: true
};
