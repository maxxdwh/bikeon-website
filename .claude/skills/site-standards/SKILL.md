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
- Supplier logos are local files in `src/assets/images/suppliers/` rendered with `<Image layout="fixed">`. To add or refresh one, fetch `https://img.logo.dev/<hostname>?token=$PUBLIC_LOGO_DEV_KEY&size=128&format=webp&retina=true` and save it into that directory as `<hostname>.webp`.
- Keep source files at the highest resolution available; the optimiser handles downsizing. Do not hand-resize or pre-compress before adding them.
- After changing `src/content.config.ts`, restart the dev server. It serves stale content otherwise.

## Typography and layout

- Add rules here.

## Links

- Links to other pages on this site open in the same tab, including inline text links. Readers can open a new tab themselves.
- Links that leave the site, and links to PDFs and other downloads, open in a new tab with `target="_blank"` and `rel="noopener"` (add `noreferrer` for external sites).
- Every link that opens a new tab says so to screen readers with `<span class="sr-only">(opens in a new tab)</span>` inside the link. Guide markdown gets this, and the external-link icon, from the rehype plugin in `astro.config.mjs`.
- Same-page `#` links, `mailto:` and `tel:` links stay put.
- After changing the rehype plugins, delete `.astro/data-store.json` and restart the dev server; rendered markdown is cached.

## Content and copy

- Add rules here.

## Workflow

- Add rules here.
