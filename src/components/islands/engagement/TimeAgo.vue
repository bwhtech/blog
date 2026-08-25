<!--
  Relative label with the absolute date on hover, matching the TimeAgo in
  frappe/ui's ActivityTimeline. Intl rather than dayjs: astro.config.mjs carries
  a bespoke plugin to make dayjs's ESM resolvable at build time, and an island
  that only needs "3 days ago" is no reason to pull that in.
-->
<script setup lang="ts">
import { Tooltip } from 'frappe-ui';
import { computed } from 'vue';

const props = defineProps<{ timestamp: number }>();

const date = computed(() => new Date(props.timestamp * 1000));

const absolute = computed(() =>
	new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date.value),
);

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
	{ amount: 60, unit: 'second' },
	{ amount: 60, unit: 'minute' },
	{ amount: 24, unit: 'hour' },
	{ amount: 7, unit: 'day' },
	{ amount: 4.34524, unit: 'week' },
	{ amount: 12, unit: 'month' },
	{ amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

const relative = computed(() => {
	const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	let duration = (date.value.getTime() - Date.now()) / 1000;
	for (const division of DIVISIONS) {
		if (Math.abs(duration) < division.amount) {
			return formatter.format(Math.round(duration), division.unit);
		}
		duration /= division.amount;
	}
	return absolute.value;
});

const iso = computed(() => date.value.toISOString());
</script>

<template>
	<Tooltip :text="absolute">
		<time :datetime="iso" class="whitespace-nowrap leading-6 text-ink-gray-5" v-bind="$attrs">
			{{ relative }}
		</time>
	</Tooltip>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>
