## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

That server knows nothing about `netlify/functions/`, so likes and comments fall
back to an in-memory stub (`src/components/islands/engagement/api.ts`). To
exercise the real functions and Turso, run Netlify's proxy in front of it:

```
astro dev --background            # 4321
netlify dev --target-port 4321 --command "astro dev logs --follow"
```

Then browse **http://localhost:8888**, not 4321. On 4321 the island silently
serves the stub, which looks exactly like a working backend. The `--command`
override is needed because `astro dev` daemonises when spawned without a TTY, so
Netlify sees its own dev command exit and shuts down; following the logs keeps a
process in the foreground.

The path redirects in `netlify.toml` are replayed on 4321 by the
`netlifyRedirects` dev plugin in `astro.config.mjs`, which reads that file
directly — so `/meet`, `/school` and the rest resolve locally instead of 404ing,
and there is no second copy of the list to keep in sync. Host-level rules are
skipped; only `netlify dev` can serve those.

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

Author avatars live in `src/data/author-avatars/`, not `public/`, so the same
pipeline resizes and converts them. `avatar` in `src/data/authors.yaml` is a
path relative to that file and the schema declares it with Astro's `image()`
helper, so a wrong path fails the build. Two consumers do not take an
`ImageMetadata`: `scripts/generate-author-og.mjs` reads the original off disk
because its card renders at 300px, and the trainer list in `src/data/training.ts`
resolves a URL string through `getImage` for frappe-ui's `Avatar`.

Renaming a category folder changes the post URL. Add a 301 to `netlify.toml`
when that happens — and, because the post id is also the key likes and comments
are stored under, repoint the existing rows:

```sql
UPDATE post_likes SET post_id = 'new/slug' WHERE post_id = 'old/slug';
UPDATE comments   SET post_id = 'new/slug' WHERE post_id = 'old/slug';
```

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
those globs in the main config instead would add ~36 kB gzip (29 kB brotli) of
unused utilities to all 40 static pages. For the same reason `tailwind.config.js` excludes
`src/components/islands/**` — the islands pass already covers it.

`src/pages/playground.astro` is the working reference for an island. Component
demos under `src/components/islands/stories/` are copied from the matching file
in `node_modules/frappe-ui/src/components/<Name>/stories/`; each names its source
in a comment so it can be re-synced after an upgrade.

## Interaction sounds

`cuelume` synthesizes short interaction sounds with Web Audio — no audio files,
no runtime dependencies. Everything goes through `src/utils/sound.ts`, never the
package directly, because that module also sets the volume and mutes playback
under `prefers-reduced-motion`.

- `initSound()` sets that up and calls cuelume's `bind()`. It is called once,
  from the client script in `src/pages/train-your-team.astro`. `bind()`
  delegates from `document` in the capture phase, so it covers the Vue islands
  on that page even though they hydrate afterwards.
- It also builds a throwaway `AudioContext` at idle. The first one of a
  browsing session costs ~100 ms while Chrome starts the audio device, and
  cuelume builds its own lazily on the first sound — so without this the cost
  lands on a click, and a tab switch visibly drops frames. Later contexts are
  free, and closing the throwaway does not undo the warm-up.
- Its guard is `<html data-cuelume>`, not a module variable: a page script and
  an island are separate entry points, and two copies of the module would each
  bind their own listeners and double every sound.
- **Nothing sounds until the page has had a click or a keypress.** Chrome
  refuses to start audio without a user activation, and hover and scroll are
  not activations — so on a page nobody has clicked yet, hover cues are silent.
  cuelume checks `navigator.userActivation.hasBeenActive` and returns rather
  than fail. This is the platform, not a bug; do not go looking for one.
- Declarative for chrome (`data-cuelume-press`, `-release`, `-toggle`,
  `-hover`), imperative `cue(name)` for outcomes — a like, a posted comment, a
  failed request — and for the two `TabButtons`, whose model setter also fires
  for the segment that is already selected.
- frappe-ui's `Button` and `TabButtons` both set `inheritAttrs: false` and
  re-spread `$attrs` onto their root element, so a `data-cuelume-*` attribute
  written on the component does land on the real `<button>`.

## Likes and comments

Every post page mounts `src/components/islands/PostEngagement.vue` at the foot of
the article. It is why `BlogPostLayout.astro` uses `AppLayout`, and why post
pages carry the islands stylesheet that the other 27 pages do not — a deliberate
trade, paid once per visitor because all posts share one immutably cached asset.

The backend is three Netlify functions in `netlify/functions/`, sharing
`netlify/lib/`, over a Turso (libSQL) database whose schema lives in
`db/schema.sql` and is applied with `npm run db:migrate`.

Things worth knowing before changing any of it:

- **The post id is the key.** `<category>/<slug>`, threaded from
  `[...slug].astro` as `postId`. `netlify/lib/validate.ts` keeps its own copy of
  the category list, because a bundled function cannot import `src/consts.ts` —
  adding a category means adding it in both places.
- **`@libsql/client/web`, never bare `@libsql/client`.** The default entry pulls
  a native addon that esbuild cannot inline. The import appears in exactly one
  file, `netlify/lib/db.ts`.
- **The email is dropped in exactly one place**, `toPublicComment` in
  `netlify/functions/engagement.ts`. It is never sent to the browser; it only
  seeds an avatar colour.
- **Comment bodies are plain text**, rendered as a Vue interpolation. No
  markdown, no `v-html`, so there is nothing to sanitise. Keep it that way.
- **localStorage is not the like control.** It stops the same browser
  double-liking; the per-IP-per-post window in `netlify/lib/rate-limit.ts` is
  what actually bounds abuse. Likes are one-way — there is no decrement endpoint
  on purpose.
- **Comments are invisible to search engines** and absent from `rss.xml` and OG
  cards, because the build has no knowledge of them. Accepted, not overlooked.
- **frappe-ui 1.0 removed the named radius aliases.** `rounded`, `rounded-lg`
  and `rounded-xl` all resolve to nothing; the scale is `rounded-1` (4px)
  through `rounded-9`, plus `rounded-full`.

Secrets are `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` and `RATE_LIMIT_SALT`.
Locally they live in a gitignored `.env` and point at the development database;
production uses a separate one and its values exist only on Netlify:

```
netlify env:set TURSO_DATABASE_URL "libsql://..." --secret --context production
```

Two CLI quirks cost an hour, so they are worth writing down. `--secret` requires
an explicit `--context`; and passing `--scope` alongside `--context` is rejected
outright, while passing `--scope` on its own **silently does nothing and still
exits 0**. So the scope stays at Netlify's default and has to be narrowed to
Functions in the UI if you want it. Nothing under `src/` reads these anyway, and
Astro only inlines `import.meta.env.PUBLIC_*` into the client bundle, so they
cannot reach the browser regardless.

Only the production context has values. Deploy previews and branch deploys have
none, so the engagement endpoints return 500 there and the island renders its
error state — set the development credentials on those contexts if you would
rather previews worked against the dev database.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
