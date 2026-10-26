/**
 * Shared motion helpers for the /lab pages, on top of Motion
 * (https://motion.dev). LabLayout stamps `data-motion="on"` before paint when
 * motion is allowed; `boot()` tells it the page script is alive.
 */
import { animate, inView } from 'motion';

export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function motionAllowed(): boolean {
	return document.documentElement.dataset.motion === 'on';
}

export function boot() {
	document.documentElement.dataset.motionBooted = '1';
}

/** Reveals `[data-reveal]` elements, nudging them up as they arrive. */
export function reveal(elements: Element[] | NodeListOf<Element>, options: { y?: number; delay?: number } = {}) {
	const { y = 10, delay = 0 } = options;
	[...elements].forEach((element, index) => {
		if (!motionAllowed()) return;
		animate(
			element,
			{ opacity: [0, 1], transform: [`translateY(${y}px)`, 'translateY(0)'] },
			{ duration: 0.6, delay: delay + index * 0.06, ease: EASE_OUT },
		);
	});
}

/** Counts a number up from zero once it scrolls into view. */
export function countUp(element: HTMLElement) {
	const target = Number(element.dataset.count);
	const decimals = Number(element.dataset.decimals ?? 0);
	const suffix = element.dataset.suffix ?? '';
	const format = new Intl.NumberFormat('en-IN', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
	const finalText = element.textContent ?? '';
	if (!motionAllowed() || Number.isNaN(target)) return;

	element.textContent = `${format.format(0)}${suffix}`;
	inView(
		element,
		() => {
			animate(0, target, {
				duration: 1.1,
				ease: EASE_OUT,
				onUpdate: (value) => (element.textContent = `${format.format(value)}${suffix}`),
				onComplete: () => (element.textContent = finalText),
			});
		},
		{ amount: 0.6 },
	);
}

/** Runs `callback` once, the first time `element` is in view. */
export function once(element: Element, callback: () => void, amount = 0.35) {
	const stop = inView(
		element,
		() => {
			callback();
			stop();
		},
		{ amount },
	);
}
