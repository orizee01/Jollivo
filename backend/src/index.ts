import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';

import app from './config/express.ts';
import Logger from './config/logger.ts';
import { pgp } from './config/database.ts';
import redisService from './shared/services/redis/redis.ts';
import Env from './shared/utils/env.ts';

const port = Number(Env.get<number>('PORT')) || 4000;
const httpsKey = Env.get<string>('HTTPS_KEY');
const httpsCert = Env.get<string>('HTTPS_CERT');

// Serve over HTTPS when a certificate is configured (needed when the app is opened from a phone).
const useHttps = Boolean(httpsKey && httpsCert);
const server = useHttps
  ? https.createServer({ key: fs.readFileSync(httpsKey!), cert: fs.readFileSync(httpsCert!) }, app)
  : http.createServer(app);

server.listen(port, () => {
  Logger.log(`Jollivo API running at ${useHttps ? 'https' : 'http'}://localhost:${port}/api/v1`, 'Server');
});

server.on('error', (error: NodeJS.ErrnoException) => {
  Logger.error(
    error.code === 'EADDRINUSE' ? `Port ${port} is already in use. Stop the other program or change PORT in .env.` : error
  );
  process.exit(1);
});

// On Ctrl+C or a deploy restart: finish in-flight requests, then close database and Redis connections.
async function shutdown(signal: string): Promise<void> {
  Logger.log(`${signal} received, shutting down`, 'Server');
  server.close(async () => {
    pgp.end();
    await redisService.disconnect();
    process.exit(0);
  });
  // Don't hang forever on a stuck connection.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
