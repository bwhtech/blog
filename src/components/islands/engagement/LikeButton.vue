<!--
  A bare <button>, not frappe-ui's Button: the heart has to fill on click, and
  Button's `icon` prop routes through frappe-ui's iconPackPlugin, which only
  emits the `.lucide-heart` class if that literal string appears in a scanned
  source file. Fragile in an island; the component form is not.

  Shape follows the reaction pills in Gameplan and Helpdesk — rounded-full,
  px-2 py-1, background swap on active — with the heart itself filling too.
-->
<script setup lang="ts">
defineProps<{ likes: number; liked: boolean; busy: boolean }>();
defineEmits<{ like: [] }>();
</script>

<template>
	<button
		type="button"
		class="group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm transition disabled:cursor-default"
		:class="
			liked
				? 'bg-surface-red-2 text-ink-red-4'
				: 'bg-surface-gray-2 text-ink-gray-6 hover:bg-surface-gray-3'
		"
		:aria-pressed="liked"
		:aria-label="liked ? `Liked, ${likes} in total` : `Like this post, ${likes} so far`"
		:disabled="liked || busy"
		@click="$emit('like')"
	>
		<!-- lucideIcons() in astro.config.mjs resolves this with no import. It
		     renders stroke-only, so `fill-current` is what fills it. -->
		<LucideHeart
			class="size-4 transition-transform motion-safe:duration-200"
			:class="liked ? 'fill-current motion-safe:scale-110' : 'group-hover:text-ink-red-4'"
		/>
		<span class="tabular-nums font-medium">{{ likes }}</span>
	</button>
</template>
