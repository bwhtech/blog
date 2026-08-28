<script setup lang="ts">
import { Badge, Button, FrappeUIProvider, TabButtons } from 'frappe-ui';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { type Track } from '../../data/training';
import ProductRow from './ProductRow.vue';
import { cue } from '../../utils/sound';

const props = defineProps<{ tracks: Track[] }>();

const activeId = ref(props.tracks[0]?.id ?? '');

// Written through a setter rather than watched, so the cue fires on a switch
// and not on a click that lands on the already-active tab.
const activeTab = computed({
	get: () => activeId.value,
	set: (value: string) => {
		if (value === activeId.value) return;
		activeId.value = value;
		cue('toggle');
	},
});

const options = computed(() =>
	props.tracks.map((track) => ({
		label: track.label,
		value: track.id,
		iconLeft: track.icon,
	})),
);

const active = computed(() => props.tracks.find((track) => track.id === activeId.value));

/**
 * The tab row scrolls sideways on a phone, and a tab cut off flat at the edge
 * reads as a clipping bug rather than as "there is more this way". So each end
 * that has something past it is faded out.
 *
 * Which end that is changes as you scroll, so it cannot be a static class: the
 * fade has to follow `scrollLeft`. A scroll-driven CSS animation would do this
 * with no script, but `animation-timeline` is not in Firefox yet. This is a
 * hydrated island already, so a passive listener is the cheaper bet.
 */
const FADE = '2.5rem';

const scroller = ref<HTMLElement | null>(null);
const fadeStart = ref(false);
const fadeEnd = ref(false);

function readFades() {
	const el = scroller.value;
	if (!el) return;

	// A pixel of slack: scrollLeft is fractional under a zoom or a retina scale,
	// so an exact comparison leaves a hairline fade at a scroll that has in fact
	// reached the end. When the row fits, both come out false and the mask is
	// dropped entirely — which is what makes the `sm` case need no breakpoint.
	const max = el.scrollWidth - el.clientWidth;
	fadeStart.value = el.scrollLeft > 1;
	fadeEnd.value = el.scrollLeft < max - 1;
}

const maskStyle = computed(() => {
	if (!fadeStart.value && !fadeEnd.value) return { maskImage: 'none' };

	const from = fadeStart.value ? `transparent, #000 ${FADE}` : '#000 0';
	const to = fadeEnd.value ? `#000 calc(100% - ${FADE}), transparent` : '#000 100%';

	return { maskImage: `linear-gradient(to right, ${from}, ${to})` };
});

// Width, not just scroll: a rotation or a resize changes whether the row
// overflows at all, and neither fires a scroll event.
let observer: ResizeObserver | undefined;

onMounted(() => {
	readFades();
	observer = new ResizeObserver(readFades);
	if (scroller.value) observer.observe(scroller.value);
});

onBeforeUnmount(() => observer?.disconnect());

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
			<!--
				Horizontal scroll so the three tabs never wrap on a narrow phone. The
				mask fades whichever end has tabs past it; see `readFades` above. It
				masks alpha, not colour, so it needs no dark-mode counterpart.

				The class is the pre-hydration state, not the live one: the island is
				`client:visible`, so until it hydrates the only end that can have
				anything past it is the right. `maskStyle` always resolves to a
				`mask-image` — `none` included — so it overrides the class outright
				rather than leaving the two to disagree.
			-->
			<div
				ref="scroller"
				class="-mx-4 flex overflow-x-auto px-4 [mask-image:linear-gradient(to_right,#000_calc(100%-2.5rem),transparent)] sm:mx-0 sm:px-0 sm:[mask-image:none]"
				:style="maskStyle"
				@scroll.passive="readFades"
			>
				<TabButtons v-model="activeTab" :options="options" variant="subtle" size="md" />
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
							The spacer, not a margin, is what separates the outcome from the rule
							below it: it grows to take up whatever slack the shorter card has, so
							the two rules sit on the same line while both cards are closed —
							which is how the row is first seen. `min-h-5` keeps its floor at the
							margin it replaces. Opening one card still drops the other's rule,
							because the group below is bottom-anchored and one of them is taller.
						-->
						<div class="min-h-5 grow" aria-hidden="true" />

						<!--
							The syllabus and the audience line are the two things that made this
							card a wall of text, and neither is what someone is reading the card
							for. They stay one click away instead of being cut: `details` gives
							the disclosure for free, with no state and no hydration cost beyond
							the island this already is.
						-->
						<details class="group border-t border-outline-gray-1 pt-4">
							<summary
								data-cuelume-toggle
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

						<!-- The spacer above already pushed this to the bottom, so the CTAs
						     line up however tall the card grows. -->
						<div class="flex flex-wrap items-center gap-3 pt-6">
							<ProductRow v-if="program.products?.length" :products="program.products" />
							<Button
								:label="program.cta"
								link="/meet"
								variant="subtle"
								theme="gray"
								size="md"
								data-cuelume-press
								data-cuelume-release
							/>
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
