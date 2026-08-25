<script setup lang="ts">
import { Badge, Button, FrappeUIProvider, TabButtons } from 'frappe-ui';
import { computed, ref } from 'vue';
import { PRODUCTS, type Track } from '../../data/training';

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
						<div class="mt-auto flex flex-wrap items-center gap-3 pt-5">
							<ul v-if="program.products?.length" class="flex items-center gap-1.5">
								<li v-for="key in program.products" :key="key">
									<img
										class="size-6"
										:src="PRODUCTS[key].src"
										:alt="PRODUCTS[key].label"
										:title="PRODUCTS[key].label"
										width="24"
										height="24"
										loading="lazy"
									/>
								</li>
							</ul>
							<Button :label="program.cta" link="/meet" variant="subtle" theme="gray" size="md" />
						</div>
					</li>
				</ul>

				<p class="text-p-sm text-ink-gray-5">
					<span class="font-medium text-ink-gray-8">{{ active.pricing.base }}</span> per seat
					<template v-for="discount in active.pricing.discounts" :key="discount">
						· {{ discount }}
					</template>
					· {{ active.pricing.note }}
				</p>

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


			</div>
		</div>
	</FrappeUIProvider>
</template>
