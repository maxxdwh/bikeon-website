# Bike On NZ — Notes & Things to Check

## Schools data
- [x] Schools data imported from Excel (352 schools with projects/coordinates). Source: `Schools database  schools for Google Map (1).xlsx`. Note: The spreadsheet has 835 total entries but only 352 have coordinates — the rest are prospects/in discussion/fundraising with no project yet.
- [ ] Note: Lat/lng columns in the Excel file are labelled in reverse (column "Longitude" contains latitude values, column "Latitude" contains longitude values). This is handled correctly in the generated `src/data/schools.json`.
- [ ] Consider adding a status filter (OPENED, ACC Y1-Y3, NCES Y1-Y7) to the map if useful — the spreadsheet has this data but it's currently not included.

## Link audit
- [ ] Work through `LINK-AUDIT.md` (dead links, PDFs still hosted on the old site, media stories to archive or bring across) before the old WordPress site is switched off.

## Research links — broken
The following research links from the old bikeon.org.nz site are broken and were NOT included:
- [ ] **EIT report** (allteams.co.nz) — 404. May need to re-upload to bikeon.org.nz or find a new host.
- [ ] **SROI report** (akina.org.nz) — site unreachable (000). Check if Akina still hosts this or if it needs re-uploading.
- [ ] **Mackie 2019 final report** (accsportsmart.co.nz) — site unreachable (000). Check if ACC still hosts this.
- [ ] **Mackie 2019 evaluation summary video** (accsportsmart.co.nz) — site unreachable (000). Same issue as above.

## GWRC Schools Guide
- [ ] **GWRC Bikes in Schools Schools Guide PDF** — returns 403 from gw.govt.nz. May need a different URL or the document may have moved. Try contacting GWRC or checking their current site structure. Link used: `https://www.gw.govt.nz/assets/Transport/Schools/Bikes-in-Schools/GW-Bike-in-Schools-School-Guide-FINAL-March-2017.pdf`

## Bike example images
- [ ] **Bike example photos are low-res** — downloaded from the old WordPress site (i0.wp.com resized versions). Replace with higher-res versions when available. Currently in `public/images/bikes/`.

## Testimonial images
- [ ] **Some testimonial images are very small** (200px) — downloaded from old site thumbnails. Need higher-res versions for: Michelle Jadoo, Rob Posthumus, Billie-Jean Potaka-Ayton, Simon Bridges (second quote).

## Environment variables (for Vercel)
- [ ] `PUBLIC_GOOGLE_MAPS_API_KEY` — create in GCP Console, restrict to bikeon.org.nz + preview domains
- [ ] `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` — create at Cloudflare Turnstile
- [ ] `RESEND_API_KEY` — create at Resend, verify bikeon.org.nz domain for deliverability
- [ ] Update `from` address in `api/contact.ts` from `onboarding@resend.dev` to `contact@bikeon.org.nz` once domain verified

## Branding
- [ ] **Logo** — currently using the old logo from WordPress. May want a refreshed logo for the new site.
- [ ] **Brand colours** — primary is #23ADEF. Rest of palette TBC.
- [ ] **Favicon** — still the Astro default. Needs a Bike On NZ favicon.

## Content review
- [ ] **Review all politician titles** — verified John Key (Former PM), Simon Bridges (Former Minister of Transport), Nikki Kaye (Former Minister of Education). All correct as of their time in office.
- [ ] **Opening event photos** — currently using old site photos. May want updated/newer photos.

## Hosting / Vercel
- [ ] Set up Vercel project with staging (preview) + prod (main branch)
- [ ] Configure custom domain bikeon.org.nz in Vercel
- [ ] Set up redirect from old WordPress URLs to new Astro URLs (important for SEO)
- [ ] Verify sitemap.xml is accessible at bikeon.org.nz/sitemap-index.xml
