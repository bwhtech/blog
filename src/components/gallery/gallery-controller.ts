import { GalleryAutoplay } from './gallery-autoplay';
import { GalleryIndicators } from './gallery-indicators';

/**
 * Behaviour for <Gallery>. The track is a native scroll-snap scroller, so swiping
 * on touch screens needs no code here. This class tracks which slide is current
 * (caption text, counter, arrows, aria-current) and handles clicks and arrow keys.
 * The visual indicators follow the scroll every frame in GalleryIndicators.
 */
export class GalleryController {
	private readonly track: HTMLElement;
	private readonly slides: HTMLImageElement[];
	private readonly thumbs: HTMLElement[];
	private readonly indicators: GalleryIndicators;
	private readonly thumbColumn: HTMLElement | null;
	private readonly caption: HTMLElement | null;
	private readonly counter: HTMLElement | null;
	private readonly prev: HTMLButtonElement | null;
	private readonly next: HTMLButtonElement | null;
	private readonly autoplay: GalleryAutoplay | null;
	private index = 0;
	private frame = 0;
	/** Slide a click is scrolling to. Scroll events on the way there are ignored. */
	private pending: number | null = null;

	static mountAll() {
		document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((root) => {
			if (root.dataset.galleryMounted) return;
			root.dataset.galleryMounted = 'true';
			new GalleryController(root).bind();
		});
	}

	constructor(root: HTMLElement) {
		this.track = root.querySelector('[data-gallery-track]')!;
		this.slides = [...this.track.querySelectorAll('img')];
		this.thumbs = [...root.querySelectorAll<HTMLElement>('[data-gallery-thumb]')];
		this.thumbColumn = root.querySelector('[data-gallery-thumbs]');
		this.caption = root.querySelector('[data-gallery-caption]');
		this.counter = root.querySelector('[data-gallery-current]');
		this.prev = root.querySelector('[data-gallery-prev]');
		this.next = root.querySelector('[data-gallery-next]');
		this.indicators = new GalleryIndicators(root, this.track, this.slides.length);
		this.autoplay = this.createAutoplay(root);
	}

	bind() {
		this.track.addEventListener('scroll', () => this.scheduleSync(), { passive: true });
		this.track.addEventListener('scrollend', () => this.endPending());
		for (const type of ['pointerdown', 'wheel', 'touchstart']) {
			this.track.addEventListener(type, () => (this.pending = null), { passive: true });
		}
		this.track.addEventListener('keydown', (event) => this.onKey(event));
		this.thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => this.goTo(index)));
		this.prev?.addEventListener('click', () => this.goTo(this.index - 1));
		this.next?.addEventListener('click', () => this.goTo(this.index + 1));
		this.render();
		this.autoplay?.start();
	}

	goTo(index: number, { instant = false } = {}) {
		const target = clamp(index, 0, this.slides.length - 1);
		this.pending = target;
		const behavior = instant ? 'instant' : scrollBehavior();
		this.track.scrollTo({ left: target * this.track.clientWidth, behavior });
		// Update now so the thumbnail reacts on click, not after the scroll finishes.
		this.setIndex(target);
	}

	private createAutoplay(root: HTMLElement) {
		const delay = Number(root.dataset.galleryAutoplay);
		if (!delay || this.slides.length < 2) return null;
		// Wraps to the first slide after the last.
		return new GalleryAutoplay(root, delay, () => this.goTo((this.index + 1) % this.slides.length));
	}

	private onKey(event: KeyboardEvent) {
		const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
		if (!step) return;
		event.preventDefault();
		// Keyboard steps are instant: animating a key press only delays the next one.
		this.goTo(this.index + step, { instant: true });
	}

	private scheduleSync() {
		cancelAnimationFrame(this.frame);
		this.frame = requestAnimationFrame(() => this.sync());
	}

	private sync() {
		const width = this.track.clientWidth;
		if (!width) return;
		this.indicators.paint({ jumping: this.pending !== null });
		const visible = Math.round(this.track.scrollLeft / width);
		if (this.pending !== null) {
			if (visible !== this.pending) return;
			this.pending = null;
		}
		this.setIndex(visible);
	}

	private endPending() {
		this.pending = null;
		this.scheduleSync();
	}

	private setIndex(index: number) {
		if (index === this.index) return;
		this.index = index;
		this.render();
	}

	private render() {
		markCurrent(this.thumbs, this.index);
		if (this.caption) this.caption.textContent = this.slides[this.index]?.dataset.caption ?? '';
		if (this.counter) this.counter.textContent = String(this.index + 1);
		if (this.prev) this.prev.disabled = this.index === 0;
		if (this.next) this.next.disabled = this.index === this.slides.length - 1;
		this.revealThumb();
	}

	/** Scroll only the thumbnail column. scrollIntoView would also scroll the page. */
	private revealThumb() {
		const column = this.thumbColumn;
		const thumb = this.thumbs[this.index];
		if (!column || !thumb || column.clientHeight === 0) return;

		// The column is position: relative, so offsetTop is measured from it.
		const top = thumb.offsetTop;
		const bottom = top + thumb.offsetHeight;
		if (top < column.scrollTop) {
			column.scrollTo({ top, behavior: scrollBehavior() });
		} else if (bottom > column.scrollTop + column.clientHeight) {
			column.scrollTo({ top: bottom - column.clientHeight, behavior: scrollBehavior() });
		}
	}
}

function markCurrent(elements: HTMLElement[], index: number) {
	elements.forEach((element, i) => {
		if (i === index) element.setAttribute('aria-current', 'true');
		else element.removeAttribute('aria-current');
	});
}

function scrollBehavior(): ScrollBehavior {
	return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}
