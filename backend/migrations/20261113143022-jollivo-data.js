import fs from 'node:fs/promises';
import path from 'node:path';

// The SQL for this migration lives in ./sqls/20261113143022-jollivo-data-up.sql and -down.sql
const readSql = (direction) =>
  fs.readFile(path.join(import.meta.dirname, 'sqls', `20261113143022-jollivo-data-${direction}.sql`), 'utf-8');

export function setup() {}

export async function up(db) {
  return db.runSql(await readSql('up'));
}

export async function down(db) {
  return db.runSql(await readSql('down'));
}

export const _meta = {
  version: 1
};
