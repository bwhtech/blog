import frappeUIPreset, { content as frappeUIContent } from 'frappe-ui/tailwind';

/**
 * Second Tailwind pass, wired up by the `@config` directive in
 * src/styles/islands.css. Tailwind v3 ignores `content` declared in a preset,
 * so frappe-ui's own source globs have to be spread in or its components ship
 * unstyled.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
	presets: [frappeUIPreset],
	content: [...frappeUIContent, './src/**/*.{astro,js,jsx,ts,tsx,vue}'],
};
