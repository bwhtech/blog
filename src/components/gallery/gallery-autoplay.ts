/**
 * Advances a gallery on a timer. Runs only while the gallery is on screen and the
 * tab is visible, pauses while the pointer or focus is inside it, and stops for
 * good once the reader swipes, clicks or presses a key: from then on they drive.
 * Never starts under prefers-reduced-motion.
 */
export class GalleryAutoplay {
	private readonly root: HTMLElement;
	private readonly delay: number;
	private readonly advance: () => void;
	private readonly caption: HTMLElement | null;
	private readonly observer: IntersectionObserver;
	private timer = 0;
	private onScreen = false;
	private hovered = false;
	private focused = false;
	private stopped = false;

	constructor(root: HTMLElement, delay: number, advance: () => void) {
		this.root = root;
		this.delay = delay;
		this.advance = advance;
		this.caption = root.querySelector('[data-gallery-caption]');
		this.observer = new IntersectionObserver(([entry]) => {
			this.onScreen = entry.isIntersecting;
			this.update();
		}, { threshold: 0.5 });
	}

	start() {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// A caption read aloud every few seconds would talk over the page.
		this.caption?.setAttribute('aria-live', 'off');
		this.observer.observe(this.root);
		this.bindPauses();
		this.bindStops();
		document.addEventListener('visibilitychange', () => this.update());
	}

	private bindPauses() {
		this.root.addEventListener('pointerenter', () => this.setHovered(true));
		this.root.addEventListener('pointerleave', () => this.setHovered(false));
		this.root.addEventListener('focusin', () => this.setFocused(true));
		this.root.addEventListener('focusout', () => this.setFocused(false));
	}

	private bindStops() {
		for (const type of ['pointerdown', 'wheel', 'touchstart', 'keydown']) {
			this.root.addEventListener(type, () => this.stop(), { passive: true, once: true });
		}
	}

	private setHovered(value: boolean) {
		this.hovered = value;
		this.update();
	}

	private setFocused(value: boolean) {
		this.focused = value;
		this.update();
	}

	private stop() {
		if (this.stopped) return;
		this.stopped = true;
		this.observer.disconnect();
		this.caption?.setAttribute('aria-live', 'polite');
		this.update();
	}

	/** Restarts the countdown whenever the gallery becomes playable again. */
	private update() {
		window.clearTimeout(this.timer);
		if (!this.playable()) return;
		this.timer = window.setTimeout(() => this.tick(), this.delay);
	}

	private tick() {
		this.advance();
		this.update();
	}

	private playable() {
		return (
			!this.stopped && this.onScreen && !this.hovered && !this.focused && document.visibilityState === 'visible'
		);
	}
}
