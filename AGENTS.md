## Development

```bash
npm run dev          # Start dev server at localhost:4321
npm run build        # Production build to dist/
npx astro check      # Typecheck
```

## Architecture

Astro 7 static site. No client-side framework. Pages are `.astro` files in `src/pages/`. Guide content is markdown in `src/content/guide/`, rendered through `src/pages/guide/[slug].astro`.

The only serverless function is `api/contact.ts` (Vercel Node runtime, not Edge — uses `req`/`res` style, not Fetch API).

## Icons

Uses **Tabler Icons** (free, MIT) via `astro-icon` + `@iconify-json/tabler`. Usage:

```astro
import { Icon } from 'astro-icon/components';
<Icon name="tabler:bike" class="h-5 w-5" />
```

Icons render as inline SVGs with `<symbol>`/`<use>` for deduplication. The one exception is the external-link icon in the rehype plugin (`astro.config.mjs`) — that's a raw SVG in the markdown AST and can't use the component.

## Styling rules

Visual language is ported from the `bikes-in-schools` repo: flat, ink-on-white, tinted bands, ruled headings, pill buttons. No gradients, shadows, or bordered cards.

- **Tailwind v4** via `@tailwindcss/vite` — config and tokens are in `src/styles/global.css`, not a `tailwind.config.js`
- **Font**: Geist Variable throughout, set up with Astro's Fonts API in `astro.config.mjs` (self-hosted variable woff2 from `@fontsource-variable/geist`, regular and italic, Latin and Latin Extended). `<Font cssVariable="--font-geist" />` is in `Layout.astro`, which also preloads the Latin regular file. Headings are weight 800 with `-0.02em` tracking; body is 17px
- **Colours**: `--ink #0b1f2a` (text, rules, footer), `--blue-700 #0b6fa4` (links, primary buttons; Tailwind `primary`/`link`), `--brand #23adef` (decorative only: focus ring, quote border; never text on white), `--tint`/`--tint-2` (bands and panels), `--text` (body copy), `--line`/`--line-soft` (keylines)
- **Component classes** (in `global.css`): `.container-page` (75rem), `.measure` (47.5rem), `.section`, `.page-top`, `.page-end`, `.h-hero`, `.h-page`, `.h2`, `.h3`, `.lead`, `.copy`, `.meta`, `.eyebrow`, `.stat`, `.panel` (+ `.panel--white`), `.quote`, `.field`, `.btn` (+ `.btn-secondary`, `.btn-sm`)
- **Text wrap**: headings, `.lead`, `.copy` and the footer blurb use `text-wrap: balance`; long prose uses `pretty`
- **Prose**: custom `.prose` rules in `global.css` (no typography plugin). 18px / 1.7, H2s get a 1px keyline. Wrap non-prose children in `.not-prose`
- **16px minimum font** — never use `text-xs` (12px). Exception: `text-sm` / `.meta` (14px) for meta/secondary text (dates, sources, captions)
- **Prose links**: underlined, `font-weight: 400`, not bold
- **Prose strong**: `font-weight: 400`, ink colour (not bold)
- **Header** is `sticky top-0` with a fixed height (`--header-h`, 4rem); the guide section nav sticks directly beneath it. Offset any other sticky element or `scroll-margin` by `--header-h`

## Images

All images are served through Astro's image optimiser. Files live in `src/assets/images/` and are rendered with `<Image>` from `astro:assets`, or by relative path in guide markdown. Rules and the two exceptions are in `.claude/skills/site-standards/SKILL.md`, which also holds the owner's other standing expectations; read it before changing images, pages or components.

## Rehype plugins (astro.config.mjs)

Two custom rehype plugins process guide markdown:

1. **External link icon** — adds `target="_blank"`, `rel="noopener noreferrer"`, and an up-right arrow SVG to external links
2. **Figure grouping** — wraps image-only paragraphs in `<figure><figcaption>`, groups consecutive images in `<div class="fig-grid">` (3-col grid, 4:3 aspect ratio, `object-fit: cover`)

## Guide layout

`src/pages/guide/[slug].astro` uses a flex layout:
- Article column (`--measure`, 47.5rem) with page header, hero image and prose
- 260px sticky "On this page" panel on the right (inline panel on mobile)
- Prev/next navigation at bottom

## Printing and downloads

- **Print or save menu** (`src/components/GuideExport.astro`) sits under "On this page" on guide pages: this page or the whole guide, with or without images, print/save as PDF or copy as text.
- **Whole guide** is `src/pages/guide/print.astro` (`/guide/print`, noindex, excluded from the sitemap). `?print=1` opens the print dialog on load; `?images=0` hides images.
- **Print styles** are the `@media print` block in `global.css`. Compact by design: 10.5pt body, thin rules, no header, footer, navs or hero image. Mark screen-only elements with `.no-print`.
- **Bikes in Schools 101** is `src/pages/101.astro` (`/101`, two A4 sheets, noindex). The PDF in `public/downloads/bikes-in-schools-101.pdf` is generated from it; after editing the page, regenerate with headless Chrome: `--headless=new --no-pdf-header-footer --print-to-pdf=public/downloads/bikes-in-schools-101.pdf http://localhost:4321/101`.
- Other PDFs live in `public/downloads/`; old WordPress addresses redirect to them in `vercel.json`.

## Content collection

Schema defined in `src/content.config.ts`. Guide markdown files have frontmatter: `title`, `description`, `order` (for sidebar sort), `heroImage` (relative path to a file in `src/assets/images/`, validated with `image()`).

## Contact form

- `src/pages/contact.astro` — form with Cloudflare Turnstile widget (explicit rendering, `data-action="contact"`, widget reset on retry)
- `api/contact.ts` — Vercel serverless function. Canonical siteverify: validates `success`, `action === "contact"`, and `hostname` against `TURNSTILE_HOSTNAMES` allowlist. Sends email via Resend to `CONTACT_EMAIL` env var
- Env vars: `PUBLIC_TURNSTILE_SITE_KEY` (client), `TURNSTILE_SECRET_KEY` (server), `TURNSTILE_HOSTNAMES` (comma-separated frontend hostnames; local `.env` includes `localhost,127.0.0.1,bikeon.org.nz`; production Vercel must set `bikeon.org.nz` only)
- Uses Node.js `req`/`res` style (not Fetch API `Request`/`Response` objects) — Vercel Node runtime wraps these differently
- From address is `onboarding@resend.dev` (Resend sandbox) — update to `contact@bikeon.org.nz` once domain is verified

## Suppliers

`src/data/suppliers.ts` — sorted alphabetically. Each has `name`, `url`, `email`, `region`. Logos fetched via logo.dev API at build time. Supplier rows use keylines only (no boxes/borders), ghost buttons for email (copy-to-clipboard) and website (external link).

## Schools map

`src/data/schools.json` — 352 schools with `name`, `lat`, `lng`, `status`. Rendered with Google Maps JavaScript API. Fuzzy search, keyboard accessible.

## SEO and analytics

- `src/layouts/Layout.astro` sets the canonical URL and Open Graph and Twitter tags. The share image is a per-page card drawn by `api/og.ts` (Vercel OG, edge runtime) from the page title and description; its fonts and logo are in `public/og/`. A photo generated from `bledisloe-opening.jpg` is listed second as a fallback. Pass `noindex` for pages that should stay out of search.
- URLs have no trailing slash: `trailingSlash: 'never'` in `astro.config.mjs`, matched by `trailingSlash: false` and `cleanUrls` in `vercel.json`.
- `public/robots.txt` points to the sitemap. `/101`, `/guide/print` and the 404 page are excluded from it.
- Links prefetch on hover (`prefetch` in `astro.config.mjs`).
- PostHog (EU host) loads from `src/components/PostHog.astro`, in production builds only. The project key is a public client key and lives in that file.
- `vercel.json` also sets long-lived caching for `/_astro/*` and basic security headers.
- `npx astro check` should report 0 errors.

## Deployment

- **`main` branch** → production (auto-deploys on push)
- **`staging` branch** → preview (auto-deploys on push)
- Vercel project: `bikeon-website`
- Env vars set for both production and preview environments

## Don't

- Don't add `text-sm` or `text-xs` — 16px minimum
- Don't use `@vercel/node` Edge runtime for the contact function — it needs Node runtime
- Don't bold prose links or prose strong text
- Don't add comments unless asked
- Don't commit `.env`
- Don't run `npm run build` after every edit — only build when explicitly asked or before committing
