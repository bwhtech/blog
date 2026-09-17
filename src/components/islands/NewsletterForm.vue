<!--
  Newsletter signup, backed by netlify/functions/subscribe.ts and BWH OS.

  Mounted in three places — the foot of a post, the home hero and the training
  page — each with its own `placement`. The function maps a placement to a form in
  BWH OS through an environment variable. The form in OS decides the tags and the
  success message. The card fills its container; the page sets the width.
-->
<script setup lang="ts">
import { Button, ErrorMessage, FormControl } from 'frappe-ui';
import { onMounted, ref, useId } from 'vue';

import { cue } from '../../utils/sound';
import { currentPage, messageOf, subscribe, type Placement } from './newsletter/api';

const props = withDefaults(
	defineProps<{
		placement: Placement;
		heading?: string;
		blurb?: string;
		/** The submit button. A lead magnet form asks for the download, not a subscription. */
		submitLabel?: string;
		/** A lead magnet is addressed to someone, so its form insists on a name. */
		requireName?: boolean;
		/** The field still fills `first_name`; only what the reader is asked changes. */
		nameLabel?: string;
	}>(),
	{
		heading: 'BWH Newsletter',
		blurb: 'Be the first to hear about latest stuff from Frappeverse: products, tutorials, and much more.',
		submitLabel: 'Subscribe',
		requireName: false,
		nameLabel: 'First name',
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

	// The form carries `novalidate`, so the browser reports nothing and every
	// empty field has to be caught here. An empty address is OS's to reject; an
	// empty name never reaches it.
	if (props.requireName && !firstName.value.trim()) {
		errorMessage.value = `Please enter ${props.nameLabel.toLowerCase()}.`;
		state.value = 'error';
		cue('error');
		return;
	}

	state.value = 'submitting';
	errorMessage.value = '';

	try {
		successMessage.value = await subscribe({
			email: email.value,
			placement: props.placement,
			first_name: firstName.value,
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
		class="w-full overflow-hidden rounded-7 border border-outline-gray-2 bg-surface-elevation-1 text-left shadow-sm"
		:aria-labelledby="headingId"
	>
		<form novalidate @submit.prevent="submit">
			<div class="flex flex-col gap-5 p-5 sm:p-6">
				<!-- Not an <h2>: mounted in a post body this sits inside `.prose-v3`,
				     whose heading rules are plain descendant selectors that outrank the
				     card's own classes and add the article's 32px heading margin. The
				     role keeps it a level-2 heading for a screen reader. -->
				<div
					:id="headingId"
					class="text-lg font-medium text-ink-gray-8"
					role="heading"
					aria-level="2"
				>
					{{ heading }}
				</div>

				<!-- Reserved height, so the card does not shrink when the fields give
				     way to the one-line confirmation, and `flex-1` hands the block any
				     height left over — the confirmation then sits in the middle of the
				     space the fields had rather than against the heading. -->
				<p
					v-if="state === 'success'"
					class="flex min-h-[54px] flex-1 items-center gap-2 text-base text-ink-gray-7"
					role="status"
				>
					<LucideMailCheck class="size-4 shrink-0 text-ink-gray-5" aria-hidden="true" />
					<span>{{ successMessage }}</span>
				</p>

				<template v-else>
					<div class="grid gap-3 sm:grid-cols-2">
						<FormControl
							v-model="firstName"
							type="text"
							size="md"
							:label="nameLabel"
							placeholder="Jane"
							autocomplete="given-name"
							:required="requireName"
							:disabled="state === 'submitting'"
						/>
						<FormControl
							v-model="email"
							type="email"
							size="md"
							label="Email"
							placeholder="you@example.com"
							autocomplete="email"
							required
							:disabled="state === 'submitting'"
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

					<ErrorMessage v-if="errorMessage" :message="errorMessage" />
				</template>
			</div>

			<div
				class="flex flex-col gap-3 border-t border-outline-gray-1 bg-surface-gray-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
			>
				<p class="text-p-sm text-ink-gray-5 sm:max-w-[340px]">{{ blurb }}</p>
				<Button
					v-if="state !== 'success'"
					class="shrink-0"
					variant="outline"
					theme="gray"
					size="md"
					type="submit"
					:label="submitLabel"
					:loading="state === 'submitting'"
				/>
			</div>
		</form>
	</section>
</template>
