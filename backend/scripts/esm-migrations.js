// Runs automatically after `npm run migrate:create` and `npm run seed:create`.
//
// db-migrate generates migration files in the old `require` style and drops a
// package.json ({"type":"commonjs"}) next to them so Node can load them. This
// script rewrites each newly generated file in the `import`/`export` style the
// rest of the backend uses, then deletes those package.json files.
import fs from 'node:fs';
import path from 'node:path';

const MIGRATIONS_DIR = path.resolve(import.meta.dirname, '..', 'migrations');

const template = (name) => `import fs from 'node:fs/promises';
import path from 'node:path';

// The SQL for this migration lives in ./sqls/${name}-up.sql and -down.sql
const readSql = (direction) =>
  fs.readFile(path.join(import.meta.dirname, 'sqls', \`${name}-\${direction}.sql\`), 'utf-8');

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
`;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name === 'package.json') {
      fs.rmSync(fullPath);
      console.log(`removed   ${path.relative(MIGRATIONS_DIR, fullPath)}`);
    } else if (entry.name.endsWith('.js') && fs.readFileSync(fullPath, 'utf-8').includes('exports.up')) {
      const name = entry.name.slice(0, -'.js'.length);
      const hasSql = fs.existsSync(path.join(dir, 'sqls', `${name}-up.sql`));
      if (hasSql) {
        fs.writeFileSync(fullPath, template(name));
        console.log(`converted ${path.relative(MIGRATIONS_DIR, fullPath)}`);
      }
    }
  }
}

if (fs.existsSync(MIGRATIONS_DIR)) {
  walk(MIGRATIONS_DIR);
}
