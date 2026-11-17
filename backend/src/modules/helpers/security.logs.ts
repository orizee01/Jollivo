import type { Request } from 'express';

import loggerWrapper from '../../shared/log_wrapper/index.ts';

/** Security-relevant things worth a permanent record. Add new ones here as features grow. */
export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',
  OTP_REQUESTED: 'otp_requested',
  OTP_FAILED: 'otp_failed',
  OTP_LOCKED_OUT: 'otp_locked_out',
  PASSWORD_CHANGED: 'password_changed',
  PASSWORD_RESET_REQUESTED: 'password_reset_requested',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity'
} as const;

export type SecurityEvent = (typeof SECURITY_EVENTS)[keyof typeof SECURITY_EVENTS];

type SecurityLogParams = {
  event: SecurityEvent;
  /** Who it happened to, when known. */
  userId?: string | null;
  /** The request it happened on; supplies IP, device, route and request id. */
  req?: Request;
  /** Extra context. Secrets (passwords, OTPs, tokens...) are removed automatically. */
  details?: Record<string, unknown>;
};

// Values under these keys must never reach a log file.
const SENSITIVE_KEY = /pass(word)?|otp|pin|token|secret|authorization|cookie|signature|private|card|cvv/i;

function redact(value: unknown, depth = 0): unknown {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (depth >= 4) {
    return '[truncated]';
  }
  if (Array.isArray(value)) {
    return value.map((item) => redact(item, depth + 1));
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, SENSITIVE_KEY.test(key) ? '[REDACTED]' : redact(entry, depth + 1)])
  );
}

/** "ada.obi@gmail.com" -> "ad***@gmail.com", so a log line identifies an account without exposing it. */
export function maskEmail(email: string): string {
  const [name = '', domain] = email.split('@');
  return domain ? `${name.slice(0, 2)}***@${domain}` : '***';
}

/** "+2348012345678" -> "**********5678" */
export function maskPhone(phone: string): string {
  return phone.length > 4 ? '*'.repeat(phone.length - 4) + phone.slice(-4) : '****';
}

/**
 * Record a security event as one JSON line in the logs, e.g.
 *   logSecurityEvent({ event: SECURITY_EVENTS.LOGIN_FAILED, req, details: { email: maskEmail(email) } });
 * Failures and suspicious events go to the error log; the rest to the info log.
 */
export function logSecurityEvent({ event, userId = null, req, details }: SecurityLogParams): void {
  const entry = {
    type: 'SECURITY',
    event,
    userId,
    ip: req?.ip ?? null,
    userAgent: req?.get('user-agent') ?? null,
    method: req?.method ?? null,
    path: req?.originalUrl.split('?')[0] ?? null,
    correlationId: (req?.res?.locals.correlationId as string | undefined) ?? null,
    details: details ? redact(details) : undefined
  };

  const line = JSON.stringify(entry);
  const isAlert = /failed|locked|unauthorized|suspicious/.test(event);

  if (isAlert) {
    loggerWrapper.error(line);
  } else {
    loggerWrapper.info(line, 'Security');
  }
}
