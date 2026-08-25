<script setup lang="ts">
import { FrappeUIProvider, TabButtons, useColorScheme, type ColorScheme } from 'frappe-ui';
import { computed } from 'vue';

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
	set: (value) => setColorScheme(value as ColorScheme),
});
</script>

<template>
	<FrappeUIProvider>
		<TabButtons v-model="scheme" :options="options" variant="subtle" size="sm" />
	</FrappeUIProvider>
</template>
