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
		<div class="flex flex-col gap-10">
			<!-- Horizontal scroll so the three tabs never wrap on a narrow phone. -->
			<div class="-mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0">
				<TabButtons v-model="activeId" :options="options" variant="subtle" size="md" />
			</div>

			<div v-if="active" class="flex flex-col gap-10">
				<div class="flex flex-col gap-2">
					<p v-if="active.blurb" class="max-w-[560px] text-lg-medium text-ink-gray-8">
						{{ active.blurb }}
					</p>
					<p v-if="active.audience" class="max-w-[560px] text-p-sm text-ink-gray-5">
						{{ active.audience }}
					</p>
				</div>

				<!-- Stretching is the grid default and stays that way: cards in a row
				     match heights. Opening one card's syllabus grows its neighbour too,
				     and `mt-auto` on the footer keeps both CTAs on the same line. -->
				<ul class="grid gap-5 sm:grid-cols-2">
					<li
						v-for="(program, index) in active.programs"
						:key="program.title"
						class="flex flex-col rounded-6 border border-outline-gray-1 bg-surface-base p-6 transition-colors hover:border-outline-gray-2"
					>
						<div class="flex items-start justify-between gap-3">
							<h3 class="text-lg-medium text-ink-gray-8">{{ program.title }}</h3>
							<Badge :label="program.format" :theme="badgeTheme(index)" variant="subtle" />
						</div>

						<p class="mt-2.5 text-p-base text-ink-gray-6">{{ program.tagline }}</p>

						<p v-if="program.outcome" class="mt-4 flex gap-2 text-p-sm text-ink-gray-7">
							<span
								class="lucide-check size-4 shrink-0 translate-y-0.5 text-ink-gray-5"
								aria-hidden="true"
							/>
							<span>{{ program.outcome }}</span>
						</p>

						<!--
							The syllabus and the audience line are the two things that made this
							card a wall of text, and neither is what someone is reading the card
							for. They stay one click away instead of being cut: `details` gives
							the disclosure for free, with no state and no hydration cost beyond
							the island this already is.
						-->
						<details class="group mt-5 border-t border-outline-gray-1 pt-4">
							<summary
								class="flex cursor-pointer select-none list-none items-center gap-1.5 text-sm text-ink-gray-5 transition-colors hover:text-ink-gray-8"
							>
								<span>What's covered</span>
								<span
									class="lucide-chevron-down size-3.5 transition-transform duration-200 group-open:rotate-180"
									aria-hidden="true"
								/>
							</summary>

							<div class="flex flex-col gap-4 pt-4">
								<p v-if="program.audience" class="text-p-sm text-ink-gray-5">
									<span class="font-medium text-ink-gray-7">Who it's for:</span>
									{{ program.audience }}
								</p>

								<!-- `marker:` rather than a rendered dot: `ink-*` is a text-colour
								     scale in the preset, so `bg-ink-gray-4` emits nothing. -->
								<ul class="flex list-disc flex-col gap-2 ps-4 marker:text-ink-gray-4">
									<li v-for="topic in program.covers" :key="topic" class="text-p-sm text-ink-gray-6">
										{{ topic }}
									</li>
								</ul>
							</div>
						</details>

						<!-- mt-auto: CTAs line up along the bottom however tall the card grows. -->
						<div class="mt-auto flex flex-wrap items-center gap-3 pt-6">
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

				<div v-if="active.addOns?.length" class="flex flex-col gap-4">
					<h3 class="text-sm font-medium text-ink-gray-7">Add a deep dive</h3>
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

				<!-- Its own strip rather than a fourth grey paragraph: the rate, the
				     ladder and the caveats each get their own line to sit on. -->
				<div
					class="flex flex-col gap-2 rounded-6 border border-outline-gray-1 bg-surface-gray-1 px-5 py-4"
				>
					<p class="text-base text-ink-gray-8">
						<span class="font-medium">{{ active.pricing.base }}</span>
						<span class="text-ink-gray-5"> per seat</span>
					</p>
					<p class="text-p-sm text-ink-gray-5">{{ active.pricing.discounts.join(' · ') }}</p>
					<p class="text-p-sm text-ink-gray-5">{{ active.pricing.note }}</p>
				</div>
			</div>
		</div>
	</FrappeUIProvider>
</template>
