<!--
  The row of product logos, in the two places it appears: the One Shot section
  and the footer of a programme card.

  It is an island for one reason — frappe-ui's Tooltip needs JavaScript, and the
  native `title` it replaces was slow to appear and unstyleable. One shared
  TooltipProvider rather than one per logo, so moving along the row after the
  first tooltip opens the rest with no delay.
-->
<script setup lang="ts">
import { Tooltip, TooltipProvider } from 'frappe-ui';
import { onMounted, useTemplateRef } from 'vue';

import { PRODUCTS, type ProductKey } from '../../data/training';
import { magnify } from '../../utils/dock';

const props = withDefaults(
	defineProps<{
		products: readonly ProductKey[];
		/**
		 * The One Shot row is a strip to sweep across: the logos are keys, padded
		 * into a playable size, magnified like the macOS Dock and sounding a note
		 * each. The row inside a programme card is a credit line — same logos, no
		 * theatre.
		 */
		magnified?: boolean;
	}>(),
	{ magnified: false },
);

const row = useTemplateRef<HTMLUListElement>('row');

onMounted(() => {
	if (props.magnified && row.value) magnify(row.value);
});
</script>

<template>
	<TooltipProvider :hover-delay="0.3" :skip-delay="0.5">
		<ul ref="row" class="flex flex-wrap items-center" :class="magnified ? 'gap-0.5' : 'gap-1.5'">
			<Tooltip v-for="key in products" :key="key" :text="PRODUCTS[key].label">
				<!-- TooltipTrigger is `as-child`, so the trigger is this `li` itself and
				     the row keeps `ul > li`. That matters twice over: `magnify` walks
				     the row's children, and the hover cue belongs on the padded key
				     rather than on the 24px logo inside it. -->
				<li
					:class="
						magnified
							? 'origin-bottom cursor-default rounded-3 p-1.5 transition-transform duration-150 ease-out motion-safe:hover:-translate-y-1 motion-safe:hover:scale-125'
							: ''
					"
					:data-cuelume-hover="magnified ? 'pulse' : undefined"
				>
					<img
						class="size-6"
						:src="PRODUCTS[key].src"
						:alt="PRODUCTS[key].label"
						width="24"
						height="24"
						loading="lazy"
					/>
				</li>
			</Tooltip>
		</ul>
	</TooltipProvider>
</template>
