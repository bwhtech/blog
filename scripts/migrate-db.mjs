/**
 * Applies db/schema.sql to the Turso database named by TURSO_DATABASE_URL.
 *
 * Deliberately not a migration framework: three tables, every statement guarded
 * by IF NOT EXISTS, so running it again is a no-op. To add a column later,
 * append the ALTER TABLE to schema.sql and run it once by hand in
 * `turso db shell` — this script will not replay it.
 *
 *   npm run db:migrate
 */
import { readFile } from 'node:fs/promises';

import { createClient } from '@libsql/client/web';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
	console.error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set (see .env).');
	process.exit(1);
}

// The Turso dashboard hands out `turso://` URLs, which @libsql/client rejects
// outright. Same host, same endpoint — only the scheme label differs.
const normalisedUrl = url.replace(/^turso:\/\//, 'libsql://');

const sql = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');

// Line comments are stripped before splitting, because a `--` comment is free
// to contain a semicolon and would otherwise cut a statement in half. Splitting
// on `;` is then safe for this schema: no triggers, no BEGIN...END bodies and
// no semicolons inside string literals. Revisit if it ever grows one.
const statements = sql
	.replace(/--[^\n]*/g, '')
	.split(';')
	.map((statement) => statement.trim())
	.filter(Boolean);

const client = createClient({ url: normalisedUrl, authToken });

await client.batch(statements, 'write');
console.log(`applied ${statements.length} statements to ${new URL(normalisedUrl).host}`);
