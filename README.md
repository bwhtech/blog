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
which sends the signup to BWH OS, the Frappe app that holds the email list. No third-party
JavaScript is loaded.

Each placement passes a `placement` (`blog-post`, `home`, `train-your-team`). The function reads
the BWH OS form id for that placement from an environment variable, so a form can change without
a code change. Each id must match a Signup Form in BWH OS (`/os/forms`). The form in OS sets the
tags and the success message. Add `collectName` to show a first name field.

The function reads these environment variables. Set them on Netlify for the production context
(Site configuration → Environment variables, or the CLI):

```sh
netlify env:set FRAPPE_URL "https://os.example.com" --context production
netlify env:set FRAPPE_API_TOKEN "api_key:api_secret" --secret --context production
netlify env:set OS_FORM_BLOG_POST "blog-post" --context production
netlify env:set OS_FORM_HOME "home" --context production
netlify env:set OS_FORM_TRAIN_YOUR_TEAM "train-your-team" --context production
```

- `FRAPPE_URL`: the site that runs BWH OS, without a trailing slash.
- `FRAPPE_API_TOKEN`: `api_key:api_secret` of a Frappe user whose only role is `OS Signup API`.
  The role lets the user add subscribers, comments, and likes, and nothing else.
  Make the user in Desk, give it that role, and generate the keys from the user's settings.
- `OS_FORM_BLOG_POST`, `OS_FORM_HOME`, `OS_FORM_TRAIN_YOUR_TEAM`: the Signup Form id for the
  foot of each post, the home page and `/train-your-team`. A new placement needs a new entry in
  `FORM_ID_ENV` in `netlify/lib/frappe.ts`.

A lead magnet form is the exception: it belongs to one post, so its form id is fixed in
`FORM_ID_FIXED` in the same file rather than in an environment variable, and a new one is a
code change and not a Netlify change. The post embeds the form itself and sets
`newsletter: false` in its frontmatter, which drops the signup card at the foot so the reader
is not shown two forms. See "Lead magnet posts" in AGENTS.md.

The likes and comments functions use the same `FRAPPE_URL` and `FRAPPE_API_TOKEN`. BWH OS
stores the likes and comments and rate-limits every call by the reader's IP.

Under `astro dev` (port 4321) there is no function, so the form falls back to a stub in
`src/components/islands/newsletter/api.ts`: any address succeeds after a short delay, and
`fail@example.com` shows the error state. To hit the real function, put these variables in
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
