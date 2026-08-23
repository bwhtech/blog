// @ts-check
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://bwh.tech',
	devToolbar: {
		enabled: false,
	},
	markdown: {
		syntaxHighlight: {
			type: 'shiki',
			// Mermaid blocks are rendered client-side by src/components/Mermaid.astro,
			// so they must reach the browser as plain text, not Shiki-highlighted spans.
			excludeLangs: ['mermaid', 'math'],
		},
		shikiConfig: {
			// Dual themes emit --shiki-light / --shiki-dark custom properties instead of
			// a hardcoded inline colour. src/styles/prose.css picks one per colour scheme.
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
