import { purgeCache } from '@netlify/functions';

/**
 * The engagement GET is cached on Netlify's CDN, and every like or comment
 * purges that post's entry. Readers get the cached copy in tens of
 * milliseconds instead of a cold start plus an OS round trip, and a commenter
 * still sees their own comment on reload.
 *
 * What the purge cannot see is a comment hidden or deleted in OS. That stays
 * visible for up to the max-age, plus one stale response while it revalidates.
 */
const MAX_AGE_SEC = 60;
const STALE_SEC = 5 * 60;

/** Tags are plain tokens, so the `/` in a post id is swapped out. */
function tagFor(postId: string): string {
	return `engagement-${postId.replace('/', '--')}`;
}

/**
 * CDN only. `durable` shares the entry across Netlify's edge nodes, so a quiet
 * post is not a cache miss in every region. The browser still gets `no-store`
 * from the base headers in http.ts, which keeps a reload honest.
 */
export function engagementCacheHeaders(postId: string): Record<string, string> {
	return {
		'netlify-cdn-cache-control': `public, durable, max-age=${MAX_AGE_SEC}, stale-while-revalidate=${STALE_SEC}`,
		'netlify-cache-tag': tagFor(postId),
	};
}

/**
 * Called after a write lands. A failed purge is logged, not thrown: the write
 * succeeded, and the entry expires within the max-age anyway. Under
 * `netlify dev` there is no cache to purge and this fails harmlessly.
 */
export async function purgeEngagement(postId: string): Promise<void> {
	try {
		await purgeCache({ tags: [tagFor(postId)] });
	} catch (error) {
		console.warn('engagement:purge', error);
	}
}
