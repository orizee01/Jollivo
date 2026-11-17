import { createClient } from 'redis';

import Env from '../../utils/env.ts';
import loggerWrapper from '../../log_wrapper/index.ts';

/** What a stored value looks like when read back. */
export type redisReturnVal = string | number | object | null;

type AddToRedisParams = {
  key: string;
  value: string | number | object;
  /** Seconds until the key is deleted automatically. Omit to keep it forever. */
  expiresIn?: number;
};

const client = createClient({ url: Env.get<string>('REDIS_URL') ?? 'redis://localhost:6379' });

client.on('error', (error: Error) => {
  loggerWrapper.error('Redis error:', error);
});

// Connect on first use, so the server can start even when Redis is not running.
let connecting: Promise<unknown> | null = null;
async function getClient() {
  if (!client.isOpen) {
    connecting ??= client.connect().finally(() => {
      connecting = null;
    });
    await connecting;
  }
  return client;
}

const redisService = {
  async addToRedis({ key, value, expiresIn }: AddToRedisParams): Promise<void> {
    const redis = await getClient();
    const payload = JSON.stringify(value);
    if (expiresIn && expiresIn > 0) {
      await redis.set(key, payload, { EX: Math.ceil(expiresIn) });
    } else {
      await redis.set(key, payload);
    }
  },

  async getFromRedis(key: string): Promise<redisReturnVal> {
    const redis = await getClient();
    const raw = await redis.get(key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as redisReturnVal;
    } catch {
      return raw;
    }
  },

  async delFromRedis(key: string): Promise<void> {
    const redis = await getClient();
    await redis.del(key);
  },

  /** Close the connection. Call when the server is shutting down. */
  async disconnect(): Promise<void> {
    if (client.isOpen) {
      await client.quit();
    }
  }
};

export default redisService;
