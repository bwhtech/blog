import { db } from './db';
import { sha256Hex } from './http';

export interface RateLimitOptions {
	ip: string;
	/** Namespaces the bucket, so a like and a comment never share a counter. */
	action: 'like' | 'comment';
	/** Narrows the bucket further, e.g. to one post. */
	extra?: string;
	limit: number;
	windowSec: number;
}

export interface RateLimitResult {
	allowed: boolean;
	/** Seconds until the current window rolls over. */
	retryAfter: number;
}

/**
 * Fixed-window counter in Turso, because functions are stateless and this has
 * to work for likes too — the likes table stores aggregates only, so there is
 * no per-visitor row to count.
 *
 * The bucket key is a salted SHA-256, so no raw IP is stored and nothing here
 * joins back to a comment or a like.
 */
export async function consume(options: RateLimitOptions): Promise<RateLimitResult> {
	const now = Math.floor(Date.now() / 1000);
	const windowIndex = Math.floor(now / options.windowSec);
	const expiresAt = (windowIndex + 1) * options.windowSec;
	const salt = process.env.RATE_LIMIT_SALT;
	if (!salt) throw new Error('RATE_LIMIT_SALT is not set');

	const bucket = await sha256Hex(
		`${salt}:${options.ip}:${options.action}:${options.extra ?? ''}:${windowIndex}`,
	);

	const statements = [
		{
			sql: `INSERT INTO rate_limits (bucket, hits, expires_at) VALUES (?, 1, ?)
			      ON CONFLICT(bucket) DO UPDATE SET hits = hits + 1
			      RETURNING hits`,
			args: [bucket, expiresAt],
		},
	];

	// Opportunistic pruning, roughly one invocation in fifty. Free on the other
	// forty-nine, and saves running a scheduled job for three tables.
	if (Math.random() < 0.02) {
		statements.push({
			sql: 'DELETE FROM rate_limits WHERE expires_at < ?',
			args: [now],
		});
	}

	const [counter] = await db().batch(statements, 'write');
	const hits = Number(counter.rows[0]?.hits ?? 0);

	return { allowed: hits <= options.limit, retryAfter: expiresAt - now };
}

/**
 * Runs several windows and fails on the first one exceeded, so a burst limit
 * and a daily limit can both apply to the same request.
 */
export async function consumeAll(
	windows: RateLimitOptions[],
): Promise<RateLimitResult> {
	let retryAfter = 0;
	for (const window of windows) {
		const result = await consume(window);
		if (!result.allowed) return result;
		retryAfter = Math.max(retryAfter, result.retryAfter);
	}
	return { allowed: true, retryAfter };
}
