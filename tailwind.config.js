import frappeUIPreset from 'frappe-ui/tailwind';

/** @type {import('tailwindcss').Config} */
export default {
	// The preset carries the Espresso palette, the semantic surface/ink/outline
	// variables, the radius scale, the elevation/focus effects and the
	// `text-<size>-<weight>` type utilities. None of it is copied into this repo.
	presets: [frappeUIPreset],
	// Only the blog's own markup. frappe-ui's source globs are deliberately not
	// here: they add ~29 kB gzip of utilities that no static page uses. They are
	// scanned by tailwind.islands.config.js into a sheet that only island pages
	// load. See src/styles/islands.css.
	content: [
		'./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
		// Island sources are scanned by the islands pass instead; leaving them here
		// would leak their utilities into the sheet every static page downloads.
		'!./src/components/islands/**',
	],
};
