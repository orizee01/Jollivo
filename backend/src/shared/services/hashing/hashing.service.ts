import crypto from 'node:crypto';

const hashingService = {
  /** Long random token for links (e.g. email verification, password reset). */
  generateVerificationHash(): string {
    return crypto.randomBytes(32).toString('hex');
  },

  /** 6-digit one-time code, zero-padded (e.g. "004821"). */
  generateTOTP(): string {
    return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
  }
};

export default hashingService;
