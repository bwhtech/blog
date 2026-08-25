import { type Client, createClient } from '@libsql/client/web';

/**
 * The `/web` subpath is load-bearing. The package's default entry resolves to
 * the Node build, which requires the `libsql` native addon — esbuild cannot
 * inline a `.node` binary, so bundling would either fail or produce a function
 * that throws at runtime on a missing file. `/web` is the pure-JS, fetch-based
 * Hrana-over-HTTP client: it bundles cleanly and starts fast. Its only
 * limitation, no embedded replicas, is irrelevant in a stateless function.
 *
 * This is the only file in the repo that imports @libsql/client. Keep it that
 * way — an import without `/web` anywhere else reintroduces the native addon.
 */
let client: Client | undefined;

export function db(): Client {
	if (client) return client;

	const url = process.env.TURSO_DATABASE_URL;
	const authToken = process.env.TURSO_AUTH_TOKEN;
	if (!url || !authToken) {
		throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are not set');
	}

	// The Turso dashboard hands out `turso://` URLs, which createClient rejects.
	client = createClient({ url: url.replace(/^turso:\/\//, 'libsql://'), authToken });
	// Module scope, so a warm invocation reuses the client and its HTTP
	// keep-alive rather than paying connection setup again.
	return client;
}
