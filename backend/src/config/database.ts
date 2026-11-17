import pgp from 'pg-promise';
import Env from '../shared/utils/env.ts';

const pg = pgp({ noWarnings: true });

const databaseUrl = Env.get<string>('DATABASE_URL');
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const db = pg(databaseUrl);

export { db, pg as pgp };
