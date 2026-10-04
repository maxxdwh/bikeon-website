---
name: site-standards
description: Maxwell's standing expectations for the Bikes in Schools site (bikeon-website). Read before adding or changing images, pages, components, layout, or copy in this repo.
---

# Site standards

Standing expectations for this repo. Each section is a short list of rules. Add new rules as plain bullets under the section they belong to, or add a new section.

`CLAUDE.md` covers how the codebase works (architecture, tokens, component classes). This file covers what is expected of any change.

## Images

- All images should be served through Astro's image optimiser.
- Image files live in `src/assets/images/`, never in `public/`. Only favicons stay in `public/`.
- In `.astro` files, import the file and render it with `<Image>` from `astro:assets`. Do not write a raw `<img>` tag for a local file.
- Give `<Image>` the `width` (and `height` plus `fit="cover"` when cropping) it is displayed at on desktop. `astro.config.mjs` sets `image.layout: 'constrained'`, so WebP output, `srcset` and `sizes` are generated from that.
- Use `layout="fixed"` for images that never resize (logo, avatars).
- Images visible on first load get `loading="eager"`; the main one gets `priority`. Everything else keeps the default lazy loading.
- In guide markdown, reference images by relative path (`../../assets/images/...`) so they are optimised. Frontmatter `heroImage` uses the same relative path and is validated by the `image()` schema helper in `src/content.config.ts`.
- Remote images go through `<Image>` too. Add the host to `image.domains` in `astro.config.mjs` and pass explicit `width` and `height`.
- Current exceptions, which stay as plain `<img>`: supplier logos from logo.dev (already served as sized WebP by their CDN, and the URL carries a key) and the 16–20px publisher favicons on the media page.
- Keep source files at the highest resolution available; the optimiser handles downsizing. Do not hand-resize or pre-compress before adding them.
- After changing `src/content.config.ts`, restart the dev server. It serves stale content otherwise.

## Typography and layout

- Add rules here.

## Links

- Links in page content open in a new tab: inline text links (internal or external), external links, and PDFs. Use `target="_blank"` with `rel="noopener"` (add `noreferrer` for external sites). Guide markdown gets this automatically from the rehype plugin in `astro.config.mjs`.
- Navigation stays in the same tab: header, footer, guide section bar, "On this page" links, previous/next, and buttons or cards that move around the site. Same-page `#` links and `mailto:` links also stay put.
- After changing the rehype plugins, delete `.astro/data-store.json` and restart the dev server; rendered markdown is cached.

## Content and copy

- Add rules here.

## Workflow

- Add rules here.
