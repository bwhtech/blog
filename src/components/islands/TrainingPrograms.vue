<script setup lang="ts">
import { Badge, Button, FrappeUIProvider, TabButtons } from 'frappe-ui';
import { computed, ref } from 'vue';
import type { Track } from '../../data/training';

const props = defineProps<{ tracks: Track[] }>();

const activeId = ref(props.tracks[0]?.id ?? '');

const options = computed(() =>
	props.tracks.map((track) => ({
		label: track.label,
		value: track.id,
		iconLeft: track.icon,
	})),
);

const active = computed(() => props.tracks.find((track) => track.id === activeId.value));

// Cycled per card so the programmes in a track read as siblings rather than a
// list of the same thing. Red is left out: on a badge it reads as an error.
const BADGE_THEMES = ['violet', 'blue', 'green', 'amber'] as const;

function badgeTheme(index: number) {
	return BADGE_THEMES[index % BADGE_THEMES.length];
}
</script>

<template>
	<FrappeUIProvider>
		<div class="flex flex-col gap-8">
			<!-- Horizontal scroll so the three tabs never wrap on a narrow phone. -->
			<div class="-mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0">
				<TabButtons v-model="activeId" :options="options" variant="subtle" size="md" />
			</div>

			<div v-if="active" class="flex flex-col gap-6">
				<div class="flex flex-col gap-1">
					<p v-if="active.blurb" class="max-w-[560px] text-lg-medium text-ink-gray-8">
						{{ active.blurb }}
					</p>
					<p v-if="active.audience" class="max-w-[560px] text-p-sm text-ink-gray-5">
						{{ active.audience }}
					</p>
				</div>

				<ul class="grid gap-4 sm:grid-cols-2">
					<li
						v-for="(program, index) in active.programs"
						:key="program.title"
						class="flex flex-col rounded-6 border border-outline-gray-1 bg-surface-base p-5 transition-colors hover:border-outline-gray-2"
					>
						<div class="flex items-start justify-between gap-3">
							<h3 class="text-lg-medium text-ink-gray-8">{{ program.title }}</h3>
							<Badge :label="program.format" :theme="badgeTheme(index)" variant="subtle" />
						</div>

						<p class="mt-2 text-p-base text-ink-gray-6">{{ program.tagline }}</p>

						<p v-if="program.audience" class="mt-3 text-p-sm text-ink-gray-5">
							{{ program.audience }}
						</p>

						<!-- One line rather than a bullet list: the card is a teaser, not a syllabus. -->
						<p class="mt-3 text-p-sm text-ink-gray-5">
							{{ program.covers.join(' · ') }}
						</p>

						<p v-if="program.outcome" class="mt-3 text-p-sm font-medium text-ink-gray-7">
							{{ program.outcome }}
						</p>

						<!-- mt-auto: CTAs line up along the bottom however tall the card grows. -->
						<div class="mt-auto pt-5">
							<Button :label="program.cta" link="/meet" variant="subtle" theme="gray" size="md" />
						</div>
					</li>
				</ul>

				<div v-if="active.addOns?.length" class="flex flex-col gap-3">
					<div class="flex flex-wrap gap-2">
						<Badge
							v-for="addOn in active.addOns"
							:key="addOn"
							:label="addOn"
							theme="gray"
							variant="outline"
						/>
					</div>
				</div>

				<section
					class="rounded-7 border border-outline-gray-2 bg-surface-gray-1 p-5 sm:p-6"
					aria-label="Pricing"
				>
					<div class="flex flex-wrap items-center justify-between gap-3">
						<h3 class="text-lg-medium text-ink-gray-8">What it costs</h3>
						<Badge label="Minimum 5 seats" theme="gray" variant="subtle" />
					</div>

					<ul class="mt-5 grid gap-3 sm:grid-cols-3">
						<li
							v-for="(tier, index) in active.pricing.tiers"
							:key="tier.seats"
							class="rounded-6 border bg-surface-base p-4"
							:class="index === 0 ? 'border-outline-gray-3' : 'border-outline-gray-1'"
						>
							<p class="text-p-sm text-ink-gray-5">{{ tier.seats }}</p>
							<p class="mt-2 text-2xl-semibold" :class="index === 0 ? 'text-ink-gray-9' : 'text-ink-green-7'">
								{{ tier.price }}
							</p>
							<p class="mt-1 text-p-sm text-ink-gray-5">{{ tier.unit }}</p>
						</li>
					</ul>

					<p class="mt-4 text-p-sm text-ink-gray-5">{{ active.pricing.note }}</p>
				</section>
			</div>
		</div>
	</FrappeUIProvider>
</template>
