# BWH Tech Blog

Static Astro blog for `blog.bwh.tech`, styled with Tailwind CSS 4 and Frappe UI's Espresso design tokens.

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
