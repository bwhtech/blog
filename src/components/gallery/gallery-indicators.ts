/**
 * Indicators that follow the track's scroll position 1:1: the thumbnail ring, the
 * page dot, thumbnail emphasis and the caption fade. Because they read the live
 * scroll value on every frame, they track a swipe exactly, carry its momentum, and
 * reverse the instant the finger does. No CSS transition or keyframe is involved.
 */
export class GalleryIndicators {
	private readonly track: HTMLElement;
	private readonly slideCount: number;
	private readonly thumbs: HTMLElement[];
	private readonly dots: HTMLElement[];
	private readonly ring: HTMLElement | null;
	private readonly dotIndicator: HTMLElement | null;
	private readonly caption: HTMLElement | null;
	private thumbTops: number[] = [];
	private dotLefts: number[] = [];

	constructor(root: HTMLElement, track: HTMLElement, slideCount: number) {
		this.track = track;
		this.slideCount = slideCount;
		this.thumbs = [...root.querySelectorAll<HTMLElement>('[data-gallery-thumb]')];
		this.dots = [...root.querySelectorAll<HTMLElement>('[data-gallery-dot]')];
		this.ring = root.querySelector('[data-gallery-ring]');
		this.dotIndicator = root.querySelector('[data-gallery-dot-indicator]');
		this.caption = root.querySelector('[data-gallery-caption]');
		new ResizeObserver(() => this.measure()).observe(root);
	}

	/**
	 * Draw for the current scroll position. While a click is jumping several slides,
	 * the caption already shows the destination, so it stays fully visible instead
	 * of blinking.
	 */
	paint({ jumping = false } = {}) {
		const width = this.track.clientWidth;
		if (!width) return;

		const position = clamp(this.track.scrollLeft / width, 0, Math.max(this.slideCount - 1, 0));
		const from = Math.floor(position);
		const progress = position - from;

		if (this.ring) this.ring.style.transform = `translateY(${lerpAt(this.thumbTops, from, progress)}px)`;
		if (this.dotIndicator) {
			this.dotIndicator.style.transform = `translateX(${lerpAt(this.dotLefts, from, progress)}px)`;
		}
		this.thumbs.forEach((thumb, i) => {
			// Full at its own slide, fading to the resting level one slide away.
			const nearness = Math.max(0, 1 - Math.abs(position - i));
			thumb.style.setProperty('--emphasis', (0.45 + 0.55 * nearness).toFixed(3));
		});
		// Fades out toward the halfway point, where the text swaps, then back in.
		if (this.caption) this.caption.style.opacity = jumping ? '1' : Math.abs(1 - 2 * progress).toFixed(3);
	}

	/** Offsets are cached so painting never forces layout. Measured from the first item. */
	private measure() {
		this.thumbTops = this.thumbs.map((thumb) => thumb.offsetTop - (this.thumbs[0]?.offsetTop ?? 0));
		this.dotLefts = this.dots.map((dot) => dot.offsetLeft - (this.dots[0]?.offsetLeft ?? 0));
		this.paint();
	}
}

/** Value between offsets[from] and offsets[from + 1]. */
function lerpAt(offsets: number[], from: number, progress: number) {
	const start = offsets[from] ?? 0;
	const end = offsets[from + 1] ?? start;
	return start + (end - start) * progress;
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}
