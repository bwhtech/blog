<!--
  Newsletter signup, backed by netlify/functions/subscribe.ts and BWH OS.

  Mounted in three places — the foot of a post, the home hero and the training
  page — each with its own `formId`. The form in OS decides the tags and the
  success message. `collectName` adds a first name field; OS shows the matching
  snippet on the form's page. `compact` is the hero: no card, no heading, centred.
-->
<script setup lang="ts">
import { Button, ErrorMessage, FormControl } from 'frappe-ui';
import { onMounted, ref, useId } from 'vue';

import { cue } from '../../utils/sound';
import { currentPage, messageOf, subscribe } from './newsletter/api';

const props = withDefaults(
	defineProps<{
		formId: string;
		collectName?: boolean;
		heading?: string;
		blurb?: string;
		compact?: boolean;
	}>(),
	{
		heading: 'Letters from BWH',
		blurb: "Frappe engineering notes, what we're building, and when the next cohort opens. No spam.",
		collectName: false,
		compact: false,
	},
);

const headingId = useId();

const email = ref('');
const firstName = ref('');
const successMessage = ref('');
/** The honeypot. Named so browser autofill leaves it alone; see CommentForm. */
const hpUrl = ref('');
const state = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');
const errorMessage = ref('');

/** The honeypot is rendered only after mount, so it stays out of the built HTML. */
const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
});

async function submit() {
	if (state.value === 'submitting') return;
	state.value = 'submitting';
	errorMessage.value = '';

	try {
		successMessage.value = await subscribe({
			email: email.value,
			form_id: props.formId,
			first_name: props.collectName ? firstName.value : '',
			hp_url: hpUrl.value,
			...currentPage(),
		});
		state.value = 'success';
		cue('success');
	} catch (error) {
		errorMessage.value = messageOf(error);
		state.value = 'error';
		cue('error');
	}
}
</script>

<template>
	<!-- No FrappeUIProvider: it only hosts the toaster and the dialog stack,
	     neither of which this form uses, and a post page already has one. -->
	<section
		:class="
			compact
				? 'flex flex-col items-center text-center'
				: 'rounded-6 border border-outline-gray-2 bg-surface-base p-5 sm:p-6'
		"
		:aria-labelledby="headingId"
	>
		<h2
			:id="headingId"
			:class="compact ? 'text-sm font-medium text-ink-gray-7' : 'text-lg font-medium text-ink-gray-8'"
		>
			{{ heading }}
		</h2>
		<p v-if="!compact" class="mt-1 text-p-sm text-ink-gray-5">{{ blurb }}</p>

		<!-- Reserved height, so the card does not shrink when the form gives way
		     to the one-line confirmation. -->
		<div :class="['min-h-8', compact ? 'mt-4 w-full max-w-[420px]' : 'mt-5']">
			<p
				v-if="state === 'success'"
				class="flex h-8 items-center gap-2 text-base text-ink-gray-7"
				:class="compact && 'justify-center'"
				role="status"
			>
				<LucideMailCheck class="size-4 shrink-0 text-ink-gray-5" aria-hidden="true" />
				<span>{{ successMessage }}</span>
			</p>

			<form v-else class="flex flex-col gap-3" novalidate @submit.prevent="submit">
				<div class="flex flex-col gap-2 sm:flex-row">
					<FormControl
						v-if="collectName"
						v-model="firstName"
						class="sm:w-40"
						type="text"
						size="md"
						placeholder="First name"
						aria-label="First name"
						autocomplete="given-name"
						:disabled="state === 'submitting'"
					/>
					<FormControl
						v-model="email"
						class="flex-1"
						type="email"
						size="md"
						placeholder="you@example.com"
						aria-label="Email address"
						autocomplete="email"
						required
						:disabled="state === 'submitting'"
					/>
					<Button
						variant="solid"
						theme="gray"
						size="md"
						type="submit"
						label="Subscribe"
						:loading="state === 'submitting'"
					/>
				</div>

				<!-- Off-screen rather than display:none, which some bots skip. Not
				     sr-only either, which a screen reader would read out. -->
				<div v-if="mounted" class="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
					<label>
						Leave this empty
						<input v-model="hpUrl" type="text" name="hp_url" tabindex="-1" autocomplete="off" />
					</label>
				</div>

				<ErrorMessage :message="errorMessage" />
			</form>
		</div>

		<p v-if="compact" class="mt-3 text-p-sm text-ink-gray-5">{{ blurb }}</p>
	</section>
</template>