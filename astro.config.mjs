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
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
