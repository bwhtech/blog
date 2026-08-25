<!--
  The collapsed affordance shown when a post has no comments yet. It replaces
  the empty state rather than sitting under one: a block that says "be the first
  to say something" above a form that already invites exactly that is the same
  prompt twice.

  Modelled on Gameplan's collapsed comment button — avatar, then a line of muted
  text filling the row. The label matches the heading of the form it opens.
-->
<script setup lang="ts">
import { Avatar } from 'frappe-ui';

defineProps<{ name: string }>();
defineEmits<{ open: [] }>();
</script>

<template>
	<button
		type="button"
		class="flex w-full items-center gap-3 rounded-6 border border-outline-gray-2 bg-surface-base px-3 py-3 text-left transition hover:border-outline-gray-3 hover:bg-surface-gray-1"
		@click="$emit('open')"
	>
		<Avatar :label="name || '?'" size="md" />
		<span class="min-w-0 flex-1 truncate text-base text-ink-gray-5">
			Leave a comment
		</span>
	</button>
</template>
