<!--
  Placeholder rows in the shape of a real comment, so the section does not
  reflow when the fetch lands. frappe-ui's Skeleton is a bare animate-pulse
  block, sized by the classes it is given.
-->
<script setup lang="ts">
import { Skeleton } from 'frappe-ui';

withDefaults(defineProps<{ rows?: number }>(), { rows: 2 });
</script>

<template>
	<!-- Skeleton itself is aria-hidden, so the status role is what a screen
	     reader announces while the comments load. -->
	<div role="status" aria-label="Loading comments" class="flex flex-col">
		<div
			v-for="row in rows"
			:key="row"
			class="grid w-full grid-cols-[30px_minmax(0,_1fr)] gap-3"
		>
			<div class="flex justify-center">
				<Skeleton class="size-6 rounded-full" />
			</div>
			<div class="mb-5 min-w-0">
				<div class="flex h-8 items-center justify-between gap-2">
					<Skeleton class="h-3.5 w-28 rounded-1" />
					<Skeleton class="h-3 w-16 rounded-1" />
				</div>
				<div class="flex flex-col gap-1.5 rounded-4 bg-surface-gray-1 px-3 py-3">
					<Skeleton class="h-3 w-full rounded-1" />
					<Skeleton class="h-3 rounded-1" :class="row % 2 ? 'w-3/5' : 'w-4/5'" />
				</div>
			</div>
		</div>
	</div>
</template>
