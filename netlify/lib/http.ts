import type { Context } from '@netlify/functions';

/** Responses are never cached: a commenter must see their own comment on reload. */
const HEADERS = {
	'content-type': 'application/json; charset=utf-8',
	'cache-control': 'no-store',
};

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
	return new Response(JSON.stringify(body), { status, headers: { ...HEADERS, ...headers } });
}

export function methodNotAllowed(allowed: string[]): Response {
	return json({ error: 'method_not_allowed' }, 405, { allow: allowed.join(', ') });
}

export function rateLimited(retryAfter: number): Response {
	return json({ error: 'rate_limited', retryAfter }, 429, {
		'retry-after': String(Math.max(retryAfter, 1)),
	});
}

export function serverError(scope: string, error: unknown): Response {
	console.error(scope, error);
	return json({ error: 'server_error' }, 500);
}

/**
 * `context.ip` is filled in by Netlify's edge, not by the request, so it cannot
 * be spoofed with a header. The header fallbacks exist only because it comes
 * back empty under `netlify dev`.
 */
export function clientIp(req: Request, context: Context): string {
	return (
		context.ip ||
		req.headers.get('x-nf-client-connection-ip') ||
		req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		'unknown'
	);
}

export async function sha256Hex(input: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

/** Parses a JSON body, returning undefined rather than throwing on malformed input. */
export async function readJson(req: Request): Promise<Record<string, unknown> | undefined> {
	try {
		const body = await req.json();
		return body && typeof body === 'object' ? (body as Record<string, unknown>) : undefined;
	} catch {
		return undefined;
	}
}
