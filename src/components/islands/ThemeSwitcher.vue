<script setup lang="ts">
import { FrappeUIProvider, TabButtons, useColorScheme, type ColorScheme } from 'frappe-ui';
import { computed } from 'vue';

import { cue } from '../../utils/sound';

const { colorScheme, setColorScheme } = useColorScheme();

const options: { label: string; value: ColorScheme; iconLeft: string }[] = [
	{ label: 'Light', value: 'light', iconLeft: 'lucide-sun' },
	{ label: 'Dark', value: 'dark', iconLeft: 'lucide-moon' },
	{ label: 'System', value: 'system', iconLeft: 'lucide-monitor' },
];

// `colorScheme` is readonly on purpose — the ref is only half the state, the
// rest is `<html data-theme>` and localStorage. Writes have to go through
// `setColorScheme` so all three move together.
const scheme = computed({
	get: () => colorScheme.value,
	set: (value) => {
		if (value === colorScheme.value) return;
		setColorScheme(value as ColorScheme);
		// Imperative rather than `data-cuelume-toggle` on the track: TabButtons
		// re-fires the model setter for the segment that is already active, and a
		// click on the track's padding is not a switch at all.
		cue('toggle');
	},
});
</script>

<template>
	<FrappeUIProvider>
		<TabButtons v-model="scheme" :options="options" variant="subtle" size="sm" />
	</FrappeUIProvider>
</template>
