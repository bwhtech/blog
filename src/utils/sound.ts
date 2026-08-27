/**
 * Interaction sounds, via cuelume (Web Audio, no audio files).
 *
 * Two ways in, and both need this module first so the volume and the
 * reduced-motion opt-out are applied before anything plays:
 *
 *   - declarative: `data-cuelume-press` and friends in the markup, wired by
 *     the `bind()` below. It delegates from `document` in the capture phase,
 *     so islands that hydrate later are covered without re-binding.
 *   - imperative: `cue('success')` for an outcome, where there is no element
 *     to hang an attribute on.
 */
import { bind, play, setEnabled, setVolume, type SoundName } from 'cuelume';

/** Quieter than the default: this is page chrome, not a notification. */
const VOLUME = 0.3;

/**
 * The guard lives on the document rather than in a module variable. A page
 * script and a Vue island are separate entry points, and if the bundler ever
 * gives them separate copies of this module, a module-level flag would let
 * `bind()` run twice — cuelume de-dupes per module instance, so every sound
 * would play twice.
 */
function claimSetup() {
	if (typeof document === 'undefined') return false;
	if (document.documentElement.dataset.cuelume) return false;
	document.documentElement.dataset.cuelume = 'on';
	return true;
}

/** Idempotent, and safe to call from every island that wants sound. */
export function initSound() {
	if (!claimSetup()) return;

	setVolume(VOLUME);

	// Someone who asked the system for less motion did not ask for a
	// soundtrack either. The query is live, so the preference can change
	// mid-session.
	const quiet = window.matchMedia('(prefers-reduced-motion: reduce)');
	setEnabled(!quiet.matches);
	quiet.addEventListener('change', (event) => setEnabled(!event.matches));

	warmUp();
	bind();
}

/**
 * The first `AudioContext` of a browsing session costs around 100ms — Chrome
 * starts the audio device on it, and every later context is free. cuelume
 * builds one lazily on the first sound, so left alone that cost lands on a
 * click; when the click also animates, like a tab indicator sliding, it is a
 * visible hitch.
 *
 * Building one here and closing it pays for the device while the page is idle.
 * It needs no user gesture, because it never plays anything — and closing it
 * does not undo the warm-up, so the context cuelume builds later is free.
 */
function warmUp() {
	const build = () => {
		const legacy = window as unknown as { webkitAudioContext?: typeof AudioContext };
		const Ctor = window.AudioContext ?? legacy.webkitAudioContext;
		if (!Ctor) return;
		try {
			void new Ctor().close();
		} catch {
			// No Web Audio here, which makes every sound a no-op anyway.
		}
	};

	if ('requestIdleCallback' in window) window.requestIdleCallback(build, { timeout: 2000 });
	else setTimeout(build, 0);
}

/** Play a sound for an outcome the reader caused. */
export function cue(name: SoundName) {
	initSound();
	play(name);
}
