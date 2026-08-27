/**
 * Dock magnification, as in the macOS Dock: every item in a row swells by how
 * near the pointer is to it, so sweeping across reads as one wave passing
 * through rather than a series of separate hovers.
 *
 * CSS alone cannot do this — `:hover` knows which item the pointer is on, not
 * how far the others are from it.
 */

/** Extra scale directly under the pointer. */
const MAX_SCALE = 0.55;
/** Distance from an item's centre at which it is back to its own size. */
const RADIUS = 96;
/** How far the item under the pointer rises, in px. */
const LIFT = 10;

export function magnify(row: HTMLElement) {
	const items = Array.from(row.children) as HTMLElement[];
	if (!items.length) return;

	// Mouse only. There is no pointer to be near on a touch screen, and someone
	// who asked the system for less motion did not ask for a wave.
	const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
	const quiet = window.matchMedia('(prefers-reduced-motion: reduce)');

	let pointerX = 0;
	let frame = 0;

	function paint() {
		frame = 0;
		for (const item of items) {
			const box = item.getBoundingClientRect();
			const distance = Math.abs(pointerX - (box.left + box.width / 2));
			// A cosine quarter-wave: full strength under the pointer, nothing at
			// the radius, and no crease in between the way a linear ramp leaves.
			const strength = distance >= RADIUS ? 0 : Math.cos((distance / RADIUS) * (Math.PI / 2));

			item.style.transform =
				`translateY(${(-LIFT * strength).toFixed(2)}px) scale(${(1 + MAX_SCALE * strength).toFixed(3)})`;
		}
	}

	row.addEventListener('pointermove', (event) => {
		if (event.pointerType !== 'mouse' || !fine.matches || quiet.matches) return;
		pointerX = event.clientX;
		// One paint per frame however often the pointer reports.
		if (!frame) frame = requestAnimationFrame(paint);
	});

	row.addEventListener('pointerleave', () => {
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		// Removed rather than set back to `scale(1)`: it hands the row back to the
		// stylesheet, which is what draws it when this script never runs.
		for (const item of items) item.style.removeProperty('transform');
	});
}
