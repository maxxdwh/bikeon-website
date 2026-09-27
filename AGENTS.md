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

- **Tailwind v4** via `@tailwindcss/vite` — config is in `src/styles/global.css`, not a `tailwind.config.js`
- **16px minimum font** — never use `text-xs` (12px). Use `text-base` (16px) or larger. Exception: `text-sm` (14px) is allowed for meta/secondary text (dates, sources, captions)
- **Body text in prose**: `text-[17px]`
- **Prose max-width**: `72ch`
- **Heading font**: Inclusive Sans Variable. **Body font**: Geist Variable
- **Headings**: `text-4xl md:text-5xl` for H2s on homepage/about/resources
- **Prose links**: underlined, `font-weight: 400`, not bold. Hover changes decoration color to `--link`
- **Prose strong**: `font-normal` (not bold)
- **Brand colors**: `--primary: #23adef` (decorative), `--link: #0c6d9c` (text/links). Dark text on primary backgrounds

## Rehype plugins (astro.config.mjs)

Two custom rehype plugins process guide markdown:

1. **External link icon** — adds `target="_blank"`, `rel="noopener noreferrer"`, and an up-right arrow SVG to external links
2. **Figure grouping** — wraps image-only paragraphs in `<figure><figcaption>`, groups consecutive images in `<div class="fig-grid">` (3-col grid, 4:3 aspect ratio, `object-fit: cover`)

## Guide layout

`src/pages/guide/[slug].astro` uses a 12-column grid:
- 3 cols: sticky sidebar nav (`top-28`), pill-style active states
- 7 cols: article (prose, 72ch max-width)
- Prev/next navigation at bottom

## Content collection

Schema defined in `src/content.config.ts`. Guide markdown files have frontmatter: `title`, `description`, `order` (for sidebar sort).

## Contact form

- `src/pages/contact.astro` — form with Cloudflare Turnstile widget
- `api/contact.ts` — Vercel serverless function. Verifies Turnstile token, sends email via Resend to `CONTACT_EMAIL` env var
- Uses Node.js `req`/`res` style (not Fetch API `Request`/`Response` objects) — Vercel Node runtime wraps these differently
- From address is `onboarding@resend.dev` (Resend sandbox) — update to `contact@bikeon.org.nz` once domain is verified

## Suppliers

`src/data/suppliers.ts` — sorted alphabetically. Each has `name`, `url`, `email`, `region`. Logos fetched via logo.dev API at build time. Supplier rows use keylines only (no boxes/borders), ghost buttons for email (copy-to-clipboard) and website (external link).

## Schools map

`src/data/schools.json` — 352 schools with `name`, `lat`, `lng`, `status`. Rendered with Google Maps JavaScript API. Fuzzy search, keyboard accessible.

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
