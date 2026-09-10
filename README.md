# BWH

Static Astro site for `bwh.tech`, styled with Tailwind CSS 4 and Frappe UI's Espresso design tokens. The
landing page is the site root and the blog lives under `/blog`.

## Development

Install dependencies:

```sh
npm install
```

Run Astro in background mode:

```sh
npm run astro -- dev --background
```

Manage the server with:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

Create a production build:

```sh
npm run build
```

## Content

Posts are local Markdown files in `src/content/blog`. Every post must reference an author and include at least one tag:

```yaml
---
title: Example post
description: A short summary.
author: hussain-nagaria
tags: [Frappe Framework, Tutorial]
pubDate: 2026-11-13
image: /blog-media/example/cover.png
---
```

Author records live in `src/data/authors.json`. Their `id` values are referenced from post frontmatter and validated by Astro's content schema.

Post media is stored under `public/blog-media`, and author avatars are stored under `public/authors`. The site does not fetch content or media from the original LMS at build time or runtime.

## Newsletter

The signup forms are one Vue island, `src/components/islands/NewsletterForm.vue`, mounted on
every post, the home page and `/train-your-team`. It posts to `netlify/functions/subscribe.ts`,
which adds the address to a Kit (kit.com) form through API v4. No Kit JavaScript is loaded.

The function reads two environment variables. Set them on Netlify for the production context
(Site configuration → Environment variables, or the CLI):

```sh
netlify env:set KIT_API_KEY "..." --secret --context production
netlify env:set KIT_FORM_ID "123456" --context production
```

- `KIT_API_KEY`: a V4 API key, from Kit → Settings → Developer.
- `KIT_FORM_ID`: the numeric id of the form below. It is in the form's URL in the Kit app.

It also rate-limits by IP through the same Turso table likes and comments use, so it needs
`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` and `RATE_LIMIT_SALT` as well.

Kit setup, once:

1. Create one form. Its style does not matter; it is never embedded. The site's own form posts
   to it, and Kit records the page it sat on (`blog-post`, `home`, `train-your-team`) as the
   referrer.
2. In the form's settings, turn double opt-in on and make the incentive email deliver the
   Missing Frappe Manual PDF. The function creates subscribers as `inactive`, and only the
   confirmation link makes them `active` — a form without double opt-in leaves them inactive.
3. Copy the form id into `KIT_FORM_ID`.

Under `astro dev` (port 4321) there is no function, so the form falls back to a stub in
`src/components/islands/newsletter/api.ts`: any address succeeds after a short delay, and
`fail@example.com` shows the error state. To hit the real function, put both variables in
`.env`, run `netlify dev` and browse port 8888.

## Netlify

`netlify.toml` contains the build command, publish directory, caching rules, security headers, and redirects from the old `/blog/<slug>/` paths.

Validate the production build locally without linking a Netlify project:

```sh
netlify build --dry --offline
netlify build --offline
```

When the Netlify project has been created, link this checkout once:

```sh
netlify link
```

Deployments can then run through the connected Git repository or manually with:

```sh
netlify deploy --prod
```
