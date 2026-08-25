<!--
  Likes and comments at the foot of a blog post.

  Mounted by src/layouts/BlogPostLayout.astro with client:visible, so nothing is
  fetched until the reader is near the end of the post. The single GET lives
  here because both children render from it.
-->
<script setup lang="ts">
import { Alert, FrappeUIProvider } from 'frappe-ui';
import { onMounted, ref } from 'vue';

import { type PublicComment, fetchEngagement, likePost, messageOf } from './engagement/api';
import CommentForm from './engagement/CommentForm.vue';
import CommentList from './engagement/CommentList.vue';
import CommentSkeleton from './engagement/CommentSkeleton.vue';
import LikeButton from './engagement/LikeButton.vue';
import { hasLiked, markLiked } from './engagement/likedPosts';

const props = defineProps<{ postId: string }>();

/**
 * localStorage is unreadable during the static build, so anything derived from
 * it has to stay out of the first render or Vue reports a hydration mismatch.
 * `liked` in particular must start false: the built HTML says "not liked", and
 * hydration has to agree with it before onMounted corrects the picture.
 */
const mounted = ref(false);
const state = ref<'loading' | 'ready' | 'error'>('loading');
const likes = ref(0);
const liked = ref(false);
const likeBusy = ref(false);
const comments = ref<PublicComment[]>([]);
const errorMessage = ref('');

async function load() {
	state.value = 'loading';
	try {
		const engagement = await fetchEngagement(props.postId);
		likes.value = engagement.likes;
		comments.value = engagement.comments;
		state.value = 'ready';
	} catch (error) {
		errorMessage.value = messageOf(error);
		state.value = 'error';
	}
}

onMounted(async () => {
	mounted.value = true;
	liked.value = hasLiked(props.postId);
	await load();
});

async function onLike() {
	if (liked.value || likeBusy.value) return;

	const previous = likes.value;
	// Optimistic: the heart fills before the round trip, and rolls back if the
	// server disagrees.
	likes.value += 1;
	liked.value = true;
	likeBusy.value = true;

	try {
		const result = await likePost(props.postId);
		likes.value = result.likes;
		// Persisted only after the server agrees, so a failed request never
		// leaves this browser believing it liked a post it did not.
		markLiked(props.postId);
	} catch {
		likes.value = previous;
		liked.value = false;
	} finally {
		likeBusy.value = false;
	}
}

function onPosted(comment: PublicComment) {
	comments.value = [...comments.value, comment];
}
</script>

<template>
	<FrappeUIProvider>
		<section class="mt-16 border-t border-outline-gray-1 pt-10" aria-labelledby="engagement-heading">
			<div class="mb-6 flex items-center justify-between gap-4">
				<h2 id="engagement-heading" class="text-lg font-medium text-ink-gray-8">
					Comments
					<span v-if="state === 'ready' && comments.length" class="text-ink-gray-5">
						({{ comments.length }})
					</span>
				</h2>
				<LikeButton :likes="likes" :liked="liked" :busy="likeBusy" @like="onLike" />
			</div>

			<!-- Reserved height, so the section does not jump when the fetch lands. -->
			<div class="min-h-[7rem]">
				<CommentSkeleton v-if="state === 'loading'" />
				<Alert v-else-if="state === 'error'" theme="red" title="Comments could not be loaded">
					{{ errorMessage }}
				</Alert>
				<CommentList v-else :comments="comments" />
			</div>

			<!-- Rendered only after mount: it keeps the honeypot out of the built
			     HTML, and dodges any id mismatch between the static render and
			     hydration inside FormControl. -->
			<CommentForm v-if="mounted" class="mt-8" :post-id="postId" @posted="onPosted" />
		</section>
	</FrappeUIProvider>
</template>
