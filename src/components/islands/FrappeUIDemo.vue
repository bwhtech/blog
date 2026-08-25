<template>
	<FrappeUIProvider>
		<div class="flex flex-col gap-10">
			<section class="flex flex-col gap-3">
				<h2 class="text-lg-medium text-ink-gray-8">Color scheme</h2>
				<p class="text-p-sm text-ink-gray-5">
					Driven by frappe-ui's <code>useColorScheme</code>, which writes
					<code>data-theme</code> on <code>&lt;html&gt;</code> — the same attribute the
					no-flash script in the document head stamps before first paint.
				</p>
				<div class="flex flex-wrap items-center gap-2">
					<Button
						v-for="option in schemes"
						:key="option"
						:label="labels[option]"
						:variant="mounted && colorScheme === option ? 'solid' : 'subtle'"
						@click="setColorScheme(option)"
					/>
					<Badge v-if="mounted" :label="`resolved: ${resolved}`" theme="blue" variant="subtle" />
				</div>
			</section>

			<section class="flex flex-col gap-3">
				<h2 class="text-lg-medium text-ink-gray-8">Buttons</h2>
				<div class="flex flex-wrap items-center gap-2">
					<Button v-for="variant in variants" :key="variant" :variant="variant" :label="variant" />
					<Button theme="blue" variant="solid" label="Primary" />
					<Button theme="red" variant="subtle" label="Danger" />
					<Button :loading="true" label="Loading" />
				</div>
			</section>

			<section class="flex flex-col gap-3">
				<h2 class="text-lg-medium text-ink-gray-8">Form controls</h2>
				<div class="flex flex-wrap items-center gap-3">
					<TextInput v-model="name" class="w-56" placeholder="Your name" />
					<Switch v-model="subscribed" label="Subscribe" />
				</div>
			</section>

			<section class="flex flex-col gap-3">
				<h2 class="text-lg-medium text-ink-gray-8">Tab buttons</h2>
				<TabButtonVariants />
			</section>

			<section class="flex flex-col gap-3">
				<h2 class="text-lg-medium text-ink-gray-8">Alert</h2>
				<AlertBanners />
			</section>

			<section class="flex flex-col gap-3">
				<h2 class="text-lg-medium text-ink-gray-8">Badges</h2>
				<BadgeListStatus />
			</section>

			<section class="flex flex-col gap-3">
				<h2 class="text-lg-medium text-ink-gray-8">Dialog</h2>
				<SimpleDialog />
			</section>
		</div>
	</FrappeUIProvider>
</template>

<script setup lang="ts">
import {
	Badge,
	Button,
	FrappeUIProvider,
	Switch,
	TextInput,
	useColorScheme,
	type ColorScheme,
} from 'frappe-ui';
import { computed, onMounted, ref } from 'vue';
import AlertBanners from './stories/AlertBanners.vue';
import BadgeListStatus from './stories/BadgeListStatus.vue';
import SimpleDialog from './stories/SimpleDialog.vue';
import TabButtonVariants from './stories/TabButtonVariants.vue';

const schemes: ColorScheme[] = ['light', 'dark', 'system'];
const labels: Record<ColorScheme, string> = {
	light: 'Light',
	dark: 'Dark',
	system: 'System',
};
const variants = ['solid', 'subtle', 'outline', 'ghost'] as const;

// `useColorScheme` reads localStorage and matchMedia, so on the server it can
// only report 'light'. Rendering the active state before mount would disagree
// with what the client resolves and Vue would report a hydration mismatch.
const mounted = ref(false);
onMounted(() => (mounted.value = true));

const { colorScheme, setColorScheme } = useColorScheme();
const resolved = computed(() => (colorScheme.value === 'system' ? 'system → OS' : colorScheme.value));

const name = ref('');
const subscribed = ref(false);
</script>
