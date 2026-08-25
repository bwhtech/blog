// @ts-check
import { createRequire } from 'node:module';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';
import { barrelImports, lucideIcons } from 'frappe-ui/vite';

/**
 * frappe-ui's barrel imports `dayjs/esm`, and that import survives tree-shaking
 * because the module calls `dayjs.extend()` at load time. `dayjs/esm/index.js`
 * in turn imports `./constant` with no file extension — legal for a bundler,
 * rejected by Node's ESM resolver, which is what renders the pages at build
 * time. `ssr.noExternal` does not reach it, so resolve the subtree to absolute
 * file paths: a non-bare id is never externalised, and its relative imports
 * then go through Vite's own extension-guessing resolver.
 */
function bundleDayjsEsm() {
	const require = createRequire(import.meta.url);
	return {
		name: 'bundle-dayjs-esm',
		enforce: 'pre',
		resolveId(source) {
			if (source !== 'dayjs/esm' && !source.startsWith('dayjs/esm/')) return null;
			// CommonJS resolution, which fills in the `/index.js` the ESM one refuses to.
			return { id: require.resolve(source), external: false };
		},
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://bwh.tech',
	devToolbar: {
		enabled: false,
	},
	integrations: [
		vue({ devtools: false }),
	],
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
		plugins: [
			bundleDayjsEsm(),
			// Keeps `import { Button } from 'frappe-ui'` in source but resolves it to
			// the declaring module, so dev never serves the whole barrel.
			barrelImports(),
			// frappe-ui templates use `<LucideChevronDown />` with no import.
			lucideIcons(),
		],
		// frappe-ui ships raw .ts/.vue, so Vite has to compile it for the SSG render
		// rather than hand it to Node as a prebuilt external. dayjs is listed for the
		// same reason bundleDayjsEsm exists; the dev server needs both.
		ssr: { noExternal: ['frappe-ui', 'dayjs'] },
		// Not pre-bundlable: the dep optimiser cannot read .vue source.
		optimizeDeps: { exclude: ['frappe-ui'] },
	},
});
