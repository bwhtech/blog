<script setup lang="ts">
import { Avatar, Button, ErrorMessage, FormControl } from 'frappe-ui';
import { computed, onMounted, ref } from 'vue';

import {
	type FieldErrors,
	fieldErrorsOf,
	messageOf,
	postComment,
	type PublicComment,
} from './api';
import { readCommenter, saveCommenter } from './likedPosts';

const props = defineProps<{ postId: string }>();
const emit = defineEmits<{ posted: [comment: PublicComment] }>();

const BODY_MAX = 2000;

const name = ref('');
const email = ref('');
const body = ref('');
/**
 * The honeypot. Named so that browser autofill leaves it alone: `website`,
 * `url` and `company` are all fields a password manager will happily fill for
 * a real person, which would silently drop their comment.
 */
const hpUrl = ref('');

const submitting = ref(false);
const fieldErrors = ref<FieldErrors>({});
const formError = ref('');
const posted = ref(false);

/** Set on mount, so the server can reject a form submitted faster than a person could read it. */
let shownAt = 0;

onMounted(() => {
	shownAt = performance.now();
	const remembered = readCommenter();
	name.value = remembered.name;
	email.value = remembered.email;
});

const remaining = computed(() => BODY_MAX - body.value.length);

async function submit() {
	if (submitting.value) return;
	submitting.value = true;
	fieldErrors.value = {};
	formError.value = '';

	try {
		const comment = await postComment({
			postId: props.postId,
			name: name.value,
			email: email.value,
			body: body.value,
			hp_url: hpUrl.value,
			elapsedMs: Math.round(performance.now() - shownAt),
		});

		emit('posted', comment);
		saveCommenter({ name: name.value, email: email.value });
		body.value = '';
		posted.value = true;
		shownAt = performance.now();
	} catch (error) {
		const fields = fieldErrorsOf(error);
		if (fields) fieldErrors.value = fields;
		else formError.value = messageOf(error);
	} finally {
		submitting.value = false;
	}
}
</script>

<template>
	<form class="rounded-6 border border-outline-gray-2 bg-surface-base p-4" @submit.prevent="submit">
		<div class="mb-4 flex items-center gap-2">
			<Avatar :label="name || '?'" size="md" />
			<span class="min-w-0 flex-1 truncate text-base font-medium text-ink-gray-8">
				{{ name || 'Leave a comment' }}
			</span>
		</div>

		<div class="flex flex-col gap-4">
			<div class="grid gap-4 sm:grid-cols-2">
				<FormControl
					v-model="name"
					type="text"
					label="Name"
					placeholder="Ada Lovelace"
					autocomplete="name"
					required
					:error="fieldErrors.name"
				/>
				<FormControl
					v-model="email"
					type="email"
					label="Email"
					placeholder="ada@example.com"
					autocomplete="email"
					description="Never shown publicly."
					required
					:error="fieldErrors.email"
				/>
			</div>

			<FormControl
				v-model="body"
				type="textarea"
				label="Comment"
				placeholder="Share what you think."
				:rows="4"
				:maxlength="BODY_MAX"
				required
				:error="fieldErrors.body"
			/>

			<!-- Off-screen rather than display:none, which some bots skip. Not
			     sr-only either, which a screen reader would read out. -->
			<div class="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
				<label>
					Leave this empty
					<input v-model="hpUrl" type="text" name="hp_url" tabindex="-1" autocomplete="off" />
				</label>
			</div>

			<ErrorMessage :message="formError" />

			<div class="flex items-center justify-between gap-3">
				<span class="text-p-sm text-ink-gray-5">
					<template v-if="posted && !body">Thanks, your comment is live.</template>
					<template v-else-if="remaining < 200">{{ remaining }} characters left</template>
				</span>
				<Button variant="solid" theme="gray" type="submit" :loading="submitting" label="Post" />
			</div>
		</div>
	</form>
</template>
