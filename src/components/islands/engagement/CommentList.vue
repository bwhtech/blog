<!--
  The rail layout from frappe/ui's ActivityTimeline: a 30px gutter column
  carrying the connector line and the avatar, and a content column holding the
  header row and the comment body.
-->
<script setup lang="ts">
import { Avatar } from 'frappe-ui';

import type { PublicComment } from './api';
import TimeAgo from './TimeAgo.vue';

defineProps<{ comments: PublicComment[] }>();
</script>

<template>
	<ul class="flex flex-col">
		<li
			v-for="(comment, index) in comments"
			:key="comment.id"
			class="grid w-full grid-cols-[30px_minmax(0,_1fr)] gap-3"
		>
			<!-- Gutter: the connector line is a pseudo-element behind the avatar,
			     which paints its own background to punch a hole in it. -->
			<div
				class="relative flex justify-center after:absolute after:start-[50%] after:top-3 after:z-0 after:border-s after:border-outline-gray-2"
				:class="index !== comments.length - 1 && 'after:h-full'"
			>
				<div class="relative z-10 flex h-8 items-center justify-center bg-surface-base">
					<Avatar :label="comment.name" :theme="comment.avatarTheme" size="md" />
				</div>
			</div>

			<div class="mb-5 min-w-0">
				<div class="flex h-8 items-center justify-between gap-2 leading-6">
					<span class="truncate text-base font-medium text-ink-gray-8">{{ comment.name }}</span>
					<TimeAgo :timestamp="comment.createdAt" class="shrink-0 text-sm" />
				</div>
				<!-- Plain text, so this is an interpolation and Vue escapes it. There
				     is no markdown and no v-html anywhere in this feature. -->
				<p
					class="whitespace-pre-wrap break-words rounded-4 bg-surface-gray-1 px-3 py-[7.5px] text-base leading-6 text-ink-gray-7"
				>
					{{ comment.body }}
				</p>
			</div>
		</li>
	</ul>
</template>
