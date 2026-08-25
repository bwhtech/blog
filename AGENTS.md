## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Commits

Never add yourself as a co-author. Do not put a `Co-Authored-By` trailer, a
generated-with note, or any other agent attribution in a commit message or a
pull request body. The person who asked for the work is the only author.

## Content

The site root is the landing page. Posts live under the `/blog` prefix and
author pages stay at `/author/<id>/`.

Each post is a folder. The folder path is the post URL after `/blog/`:

```
src/content/blog/<category>/<post-slug>/
  index.md
  screenshot.png      -> ![alt](./screenshot.png)
```

The category folder must have a matching entry in `CATEGORIES` in `src/consts.ts`.
The build fails otherwise. Tags are only tags; they no longer decide the URL.

Images referenced with a relative path go through Astro's image pipeline: they
are resized, converted to WebP, and a broken path fails the build. Use markdown
image syntax, not a raw `<img>` tag, or the path will not be resolved. To keep a
layout wrapper, leave blank lines around the image so markdown is still parsed:

```html
<figure style="max-width:500px; margin:1.5em auto;">

![](./screenshot.png)

<figcaption>Caption</figcaption>
</figure>
```

Astro cannot process GIF or video. Put those in `public/media/<post-slug>/` and
reference them by absolute path.

Renaming a category folder changes the post URL. Add a 301 to `netlify.toml`
when that happens.

A ` ```mermaid ` code block becomes a diagram. Astro leaves the block
unhighlighted (`markdown.syntaxHighlight.excludeLangs` in `astro.config.mjs`)
and `src/components/Mermaid.astro` renders it in the browser, matching the
light or dark theme. Mermaid loads only on pages that contain a diagram.

## Styling and Vue islands

Every design token comes from `frappe-ui` — the Espresso palette, the semantic
`surface-*` / `ink-*` / `outline-*` colours, the radius scale, the elevation and
focus effects, and the `text-<size>-<weight>` / `text-p-*` type utilities. They
are not copied into this repo. `tailwind.config.js` spreads
`frappe-ui/tailwind`'s preset; upgrading the package upgrades the tokens.

This pins the blog to Tailwind v3. frappe-ui ships a v3 preset and plugin and
has no v4 support, so do not upgrade Tailwind until it does.

Dark mode is `[data-theme="dark"]` on `<html>`, not a media query. An inline
script in `BaseHead.astro` stamps it before first paint, using the same
`localStorage.theme` contract as frappe-ui's `useColorScheme` (`light` | `dark` |
`system`). Anything reading the scheme must read the attribute.

`src/styles/prose.css` retunes `.prose` variables that the typography plugin
sets at the same specificity, so it is imported *after* `global.css` in
`BaseLayout.astro` rather than from inside it. Moving it earlier silently breaks
code-block colours in dark mode.

Vue islands live in `src/components/islands/` and their pages must use
`AppLayout.astro`, not `BaseLayout.astro`. AppLayout adds `src/styles/islands.css`,
a second Tailwind pass (`tailwind.islands.config.js`) that scans frappe-ui's own
source *and* the island sources. Without it the island renders unstyled; putting
those globs in the main config instead would add ~29 kB gzip of unused utilities
to all 40 static pages. For the same reason `tailwind.config.js` excludes
`src/components/islands/**` — the islands pass already covers it.

`src/pages/playground.astro` is the working reference for an island. Component
demos under `src/components/islands/stories/` are copied from the matching file
in `node_modules/frappe-ui/src/components/<Name>/stories/`; each names its source
in a comment so it can be re-synced after an upgrade.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
