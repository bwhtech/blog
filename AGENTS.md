## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Content

Each post is a folder. The folder path is the post URL:

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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
