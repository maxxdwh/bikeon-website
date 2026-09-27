# Bike On NZ — Website

Static Astro site replacing the old WordPress site at bikeon.org.nz. Built for speed, accessibility (WCAG AA), and easy content updates.

## What's here

- **Homepage** — Hero, stats, guide overview, testimonials, call to action
- **Guide** — 8 markdown chapters covering bikes, helmets, storage, tracks, training, costs, maintenance, and an introduction
- **Schools map** — Google Maps integration showing 352 schools with Bikes in Schools projects, with fuzzy search and keyboard navigation
- **About** — Trust info, history, people
- **Resources** — Research reports, guides, links
- **Media** — Photos and videos
- **Contact** — Form with spam protection (Cloudflare Turnstile) and email delivery (Resend)

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 7 (static output) |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Fonts | Geist Variable (body), Inclusive Sans Variable (headings) — self-hosted via Fontsource |
| Maps | Google Maps JavaScript API |
| Email | Resend |
| Spam protection | Cloudflare Turnstile |
| Hosting | Vercel (static + serverless functions) |
| Logos | logo.dev API (supplier logos) |

## Project structure

```
api/
  contact.ts              Vercel serverless function (Resend + Turnstile)
src/
  components/             Header, Footer
  content/guide/          8 markdown guide chapters
  data/
    schools.json          352 schools with coordinates
    suppliers.ts          Bike supplier data (names, URLs, emails)
  layouts/Layout.astro    Base layout (fonts, meta, skip link)
  pages/
    index.astro            Homepage
    about.astro            About page
    contact.astro          Contact form
    map.astro              Schools map
    media.astro            Media gallery
    resources.astro        Resources page
    guide/[slug].astro     Guide template (sidebar + article + suppliers)
  styles/global.css       Tailwind theme, prose styles, design tokens
astro.config.mjs          Rehype plugins (external links, figure grouping)
content.config.ts         Content collection schema
vercel.json               Build config
```

## Local development

```bash
npm install
cp .env.example .env     # Fill in your API keys
npm run dev              # http://localhost:4321
```

### Environment variables

| Variable | Where to get it |
|----------|----------------|
| `PUBLIC_GOOGLE_MAPS_API_KEY` | Google Cloud Console — create a Maps JavaScript API key, restrict to your domains |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Dashboard → Turnstile → Create widget |
| `TURNSTILE_SECRET_KEY` | Same as above (secret key) |
| `RESEND_API_KEY` | Resend Dashboard → API Keys |
| `PUBLIC_LOGO_DEV_KEY` | logo.dev — get a publishable key |
| `CONTACT_EMAIL` | Email address to receive contact form submissions (testing only) |

All `PUBLIC_` vars are exposed to the browser. The rest are server-side only.

## Deployment

The site is hosted on Vercel, connected to the GitHub repo at `https://github.com/maxxdwh/bikeon-website`.

### Branches

- **`main`** — Production. Pushes auto-deploy to https://bikeon-website.vercel.app
- **`staging`** — Preview. Pushes auto-deploy to a preview URL

### Making a change (staging → production)

```bash
# 1. Switch to staging
git checkout staging
git pull origin staging

# 2. Make your changes, then commit
git add .
git commit -m "your change"
git push origin staging

# 3. Vercel auto-deploys staging to a preview URL
#    Check it at: https://vercel.com/maxdwh/bikeon-website

# 4. When happy, merge to main
git checkout main
git pull origin main
git merge staging
git push origin main

# 5. Vercel auto-deploys to production
#    Live at: https://bikeon-website.vercel.app
```

### Manual deploy (if needed)

```bash
vercel --prod    # Deploy current state to production
vercel           # Deploy as preview
```

### Custom domain

Not yet configured. When ready, add `bikeon.org.nz` in Vercel → Project → Settings → Domains, and update DNS at the registrar.

## Key design decisions

- **16px minimum font size** everywhere — no `text-sm` or `text-xs`
- **17px body text** in longform prose (`text-[17px]`)
- **72ch max-width** for guide article prose
- **Underlined links in prose** — not bold, subtle hover to brand blue
- **External links** auto-iconed with an up-right arrow SVG (rehype plugin)
- **Figures** — image paragraphs wrapped in `<figure><figcaption>`, consecutive images grouped in a 3-column grid
- **WCAG AA** contrast on all text and non-text elements

## TODO

See [TODO.md](./TODO.md) for outstanding items: broken research links, low-res images, branding, custom domain, SEO redirects.
