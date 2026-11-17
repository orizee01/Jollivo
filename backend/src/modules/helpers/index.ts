import crypto from 'node:crypto';
import Joi from 'joi';
import hashingService from '../../shared/services/hashing/hashing.service.ts';
import Env from '../../shared/utils/env.ts';
import redisService from '../../shared/services/redis/redis.ts';
import type { redisReturnVal } from '../../shared/services/redis/redis.ts';
import { BadException } from '../../shared/errors/index.ts';
import loggerWrapper from '../../shared/log_wrapper/index.ts';
import { getOtpMaxAttempts } from '../users/dto.ts';

type ParamsType = {
  action: string;
  id: string | null;
  expiry?: number;
  identifierType: 'hash' | 'otp';
  value?: string | number;
};

interface OtpStoredPayload {
  code: string;
  attempts: number;
  expiresAt: number;
}

const OTP_INVALID_MESSAGE = 'Invalid or expired OTP';
const OTP_WRONG_MESSAGE = 'Invalid OTP. Please try again.';
const OTP_EXHAUSTED_MESSAGE = 'Too many failed attempts. Request a new OTP.';

function isOtpStoredPayload(value: unknown): value is OtpStoredPayload {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const payload = value as OtpStoredPayload;
  return typeof payload.code === 'string' && typeof payload.attempts === 'number' && typeof payload.expiresAt === 'number';
}

function getRemainingSeconds(expiresAt: number): number {
  return Math.ceil((expiresAt - Date.now()) / 1000);
}

export async function generateOtpOrHash(params: ParamsType) {
  let otpOrHash =
    params.identifierType === 'hash' ? hashingService.generateVerificationHash() : hashingService.generateTOTP();

  if (Env.get<string>('NODE_ENV') === 'test' || Env.get<string>('NODE_ENV') == 'development') {
    otpOrHash = params.identifierType === 'hash' ? 'random-hash' : '123456';
  }

  const id = params.id || otpOrHash;

  const key = `${id}_${params.action}`;

  await redisService.delFromRedis(key);

  if (params.identifierType === 'otp') {
    const expirySeconds = params.expiry ?? 300;
    const otpPayload: OtpStoredPayload = {
      code: String(params.value ?? otpOrHash),
      attempts: 0,
      expiresAt: Date.now() + expirySeconds * 1000
    };

    await redisService.addToRedis({
      key,
      value: otpPayload,
      expiresIn: expirySeconds
    });
  } else {
    await redisService.addToRedis({
      key,
      value: params.value || otpOrHash,
      expiresIn: params.expiry
    });
  }

  return otpOrHash;
}

async function verifyOtpWithAttempts(id: string, verificationCode: string): Promise<redisReturnVal | BadException> {
  const resp = await redisService.getFromRedis(id);

  if (!resp) {
    return new BadException(OTP_INVALID_MESSAGE);
  }

  // Legacy OTPs stored as plain strings before deploy
  if (!isOtpStoredPayload(resp)) {
    if (resp !== verificationCode) {
      return new BadException(OTP_INVALID_MESSAGE);
    }
    await redisService.delFromRedis(id);
    return resp;
  }

  const remainingSeconds = getRemainingSeconds(resp.expiresAt);
  if (remainingSeconds <= 0) {
    await redisService.delFromRedis(id);
    return new BadException(OTP_INVALID_MESSAGE);
  }

  if (resp.code === verificationCode) {
    await redisService.delFromRedis(id);
    return resp.code;
  }

  const nextAttempts = resp.attempts + 1;

  if (nextAttempts >= getOtpMaxAttempts()) {
    await redisService.delFromRedis(id);
    return new BadException(OTP_EXHAUSTED_MESSAGE);
  }

  await redisService.addToRedis({
    key: id,
    value: { ...resp, attempts: nextAttempts },
    expiresIn: remainingSeconds
  });

  return new BadException(OTP_WRONG_MESSAGE);
}

export async function verifyOtpOrHash(
  id: string,
  verificationCode: string,
  type: 'OTP' | 'hash'
): Promise<redisReturnVal | BadException> {
  if (type === 'OTP') {
    return verifyOtpWithAttempts(id, verificationCode);
  }

  const resp = await redisService.getFromRedis(id);

  if (!resp) {
    return new BadException('Invalid or expired hash');
  }

  if (resp !== verificationCode) {
    return new BadException('Invalid or expired hash');
  }

  await redisService.delFromRedis(id);

  return resp;
}

export function calculatePages(total: number, limit: number) {
  const displayPage = Math.floor(total / limit);
  return total % limit ? displayPage + 1 : displayPage;
}

export function generateShortCode(input: string, length = 7): string {
  if (!input || input.length < 3) {
    throw new Error('Input string must be at least 3 characters long');
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const prefix = input.slice(0, 3).toUpperCase();
  const randomCharsNeeded = length - prefix.length;

  const randomBytes = crypto.randomBytes(randomCharsNeeded);
  const randomSuffix = Array.from({ length: randomCharsNeeded }, (_, i) => alphabet[randomBytes[i]! % alphabet.length]).join(
    ''
  );

  return prefix + randomSuffix;
}

export function PasswordValidator() {
  return Joi.extend((joi) => ({
    type: 'password',
    base: joi.string().trim(),
    messages: {
      'password.complexity':
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      'password.weakPattern': 'Password contains common weak patterns',
      'password.minLength': 'Password must be at least {{#limit}} characters long'
    },
    rules: {
      complexity: {
        method() {
          return this.$_addRule('complexity');
        },
        validate(value, helpers) {
          const hasLowercase = /[a-z]/.test(value);
          const hasUppercase = /[A-Z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

          if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial) {
            return helpers.error('password.complexity');
          }

          return value;
        }
      },
      strong: {
        method() {
          return this.$_addRule('strong');
        },
        validate(value, helpers) {
          const weakPatterns = [
            /(abc|123|qwert|password|admin|welcome|letmein)/i,
            /(.)\1{2}/,
            /(012|234|345|456|567|678|789)/,
            /(qwer|asdf|zxcv)/i
          ];

          if (weakPatterns.some((pattern) => pattern.test(value))) {
            return helpers.error('password.weakPattern');
          }

          return value;
        }
      }
    }
  }));
}

/**
 * Generate a secure random challenge for biometric authentication
 * @returns A base64-encoded random challenge string
 */
export const generateChallenge = (): string => {
  // Generate a 32-byte (256-bit) random challenge
  const challengeBytes = crypto.randomBytes(32);
  // Return as base64 string for easy transport
  return challengeBytes.toString('base64');
};

/**
 * Verify a challenge signature using the device's public key
 * @param challenge - The original challenge
 * @param signedChallenge - The signature to verify
 * @param publicKeyB64 - Base64-encoded public key
 * @returns Whether the signature is valid
 */
export const verifySignedChallenge = (challenge: string, signedChallenge: string, publicKeyB64: string): boolean => {
  if (Env.get<string>('NODE_ENV') === 'test' || Env.get<string>('NODE_ENV') == 'development') {
    return true;
  }
  try {
    // Decode the base64 strings
    const publicKeyBuffer = Buffer.from(publicKeyB64, 'base64');
    const signatureBuffer = Buffer.from(signedChallenge, 'base64');
    const challengeBuffer = Buffer.from(challenge);

    // Import the public key (using the SPKI format from Flutter)
    const publicKey = crypto.createPublicKey({
      key: publicKeyBuffer,
      format: 'der',
      type: 'spki'
    });

    // Verify the signature using ECDSA with SHA-256
    return crypto.verify(
      'sha256', // Using SHA-256 with ECDSA
      challengeBuffer,
      publicKey,
      signatureBuffer
    );
  } catch (error) {
    loggerWrapper.error('Error verifying signature:', error);
    return false;
  }
};

export const getRandomRef = (prefix = 'REF-', length = 8, suffix = '') => {
  let text = '';
  const possible = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return prefix + text + suffix;
};
