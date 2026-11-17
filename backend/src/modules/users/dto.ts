import Env from '../../shared/utils/env.ts';

/** How many wrong OTP entries are allowed before the code is thrown away (default 5). */
export function getOtpMaxAttempts(): number {
  const configured = Number(Env.get<string>('OTP_MAX_ATTEMPTS'));
  return Number.isInteger(configured) && configured > 0 ? configured : 5;
}
