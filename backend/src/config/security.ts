import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import Env from '../shared/utils/env.ts';

const HSTS_MAX_AGE_SECONDS = 15552000; // 180 days

function isCspReportOnly(): boolean {
  return Env.get<string>('CSP_REPORT_ONLY') === 'true';
}

const strictApiCspDirectives = {
  defaultSrc: ["'none'"],
  baseUri: ["'none'"],
  formAction: ["'none'"],
  frameAncestors: ["'none'"],
  objectSrc: ["'none'"],
  upgradeInsecureRequests: []
};

export const apiSecurityHeaders = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: strictApiCspDirectives,
    reportOnly: isCspReportOnly()
  },
  hsts: {
    maxAge: HSTS_MAX_AGE_SECONDS,
    includeSubDomains: true
  },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'no-referrer' }
});

export interface SwaggerCspOptions {
  port: number;
  remoteServerUrl?: string;
  serviceName?: string;
}

function buildSwaggerConnectSrc(options: SwaggerCspOptions): string[] {
  const sources: string[] = ["'self'"];

  sources.push(`http://localhost:${options.port}`);

  if (options.serviceName) {
    sources.push(`http://${options.serviceName}:${options.port}`);
  }

  if (options.remoteServerUrl) {
    sources.push(options.remoteServerUrl.replace(/\/$/, ''));
  }

  return sources;
}

export function createSwaggerCsp(options: SwaggerCspOptions) {
  return helmet.contentSecurityPolicy({
    useDefaults: false,
    reportOnly: isCspReportOnly(),
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: buildSwaggerConnectSrc(options),
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"]
    }
  });
}

const PERMISSIONS_POLICY =
  'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()';

export function permissionsPolicy(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Permissions-Policy', PERMISSIONS_POLICY);
  next();
}
