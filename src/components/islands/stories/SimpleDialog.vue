<!--
  The canonical Dialog: auto-header from `title` / `message` / `icon`, footer
  from `actions`, visibility through `v-model:open`. Adapted from frappe-ui's
  Dialog playground (src/components/Dialog/Dialog.playground.vue), with the
  knob wiring dropped.
-->
<script setup lang="ts">
import { Button, Dialog } from 'frappe-ui';
import { ref } from 'vue';

const open = ref(false);
const outcome = ref('');

// Every action receives `{ close }`; nothing closes on its own.
const actions = [
	{ label: 'Cancel', onClick: ({ close }) => ((outcome.value = 'Kept the project'), close()) },
	{
		label: 'Delete',
		variant: 'solid',
		theme: 'red',
		onClick: ({ close }) => ((outcome.value = 'Project deleted'), close()),
	},
];
</script>

<template>
	<div class="flex flex-col items-start gap-3">
		<Button label="Open dialog" @click="open = true" />
		<p v-if="outcome" class="text-sm text-ink-gray-5">{{ outcome }}</p>

		<Dialog
			v-model:open="open"
			title="Delete project"
			message="This will permanently remove the project. This action cannot be undone."
			:icon="{ name: 'lucide-trash-2', theme: 'red' }"
			:actions="actions"
		/>
	</div>
</template>
