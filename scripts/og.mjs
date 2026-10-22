import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ImageResponse } from '@vercel/og';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const OUT = join(DIST, 'og');

const INK = '#0b1f2a';
const BRAND = '#23adef';
const DEFAULT_TITLE = 'Every Kiwi kid, riding a bike at school';
const DEFAULT_DESCRIPTION = 'A free guide for New Zealand schools setting up bikes, helmets, tracks, storage and skills training.';

const clip = (value, max, fallback) => {
  const text = (value ?? '').replace(/\s+/g, ' ').trim() || fallback;
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text;
};

const el = (type, style, children, props = {}) => ({ type, props: { style, children, ...props } });

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

function extract(html) {
  const attr = (name) => html.match(new RegExp(`<meta property="og:${name}" content="([^"]*)"`))?.[1] ?? '';
  const imgMatch = html.match(/<img[^>]+src="(\/_astro\/[^"]+\.(?:webp|jpe?g|png))"/);
  return { title: attr('title'), description: attr('description'), imgSrc: imgMatch?.[1] };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const [regular, bold, logoSvg, logoWhiteSvg] = await Promise.all([
    readFile(join(ROOT, 'scripts/og-assets/geist-400.woff')),
    readFile(join(ROOT, 'scripts/og-assets/geist-800.woff')),
    readFile(join(ROOT, 'scripts/og-assets/logo.svg'), 'utf8'),
    readFile(join(ROOT, 'scripts/og-assets/logo-white.svg'), 'utf8'),
  ]);
  const b64 = (data) => 'data:image/svg+xml;base64,' + Buffer.from(data, 'utf8').toString('base64');
  const logo = b64(logoSvg);
  const logoWhite = b64(logoWhiteSvg);

  let count = 0;
  for await (const file of htmlFiles(DIST)) {
    const url = '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '').replace(/\.html$/, '');
    const html = await readFile(file, 'utf8');
    const { title: ogTitle, description, imgSrc } = extract(html);
    const title = clip(ogTitle.replace(/^Bike On NZ — /, '').replace(/ — Bike On NZ$/, ''), 80, DEFAULT_TITLE);
    const desc = clip(description, 150, DEFAULT_DESCRIPTION);

    let photo = null;
    if (imgSrc) {
      try {
        const inFile = join(DIST, decodeURIComponent(imgSrc));
        photo = 'data:image/png;base64,' + Buffer.from(await sharp(inFile).resize(1200, 630, { fit: 'cover' }).png().toBuffer()).toString('base64');
      } catch (err) {
        console.warn('  photo skipped', url, err.message);
      }
    }

    const content = [
      el('div', { display: 'flex', width: 1200, height: 630, backgroundColor: '#fff' }),
    ];

    if (photo) {
      content.push(
        el('img', { position: 'absolute', top: 0, left: 0, width: 1200, height: 630, objectFit: 'cover' }, undefined, { src: photo, width: 1200, height: 630 }),
        el('div', { position: 'absolute', top: 0, left: 0, width: 1200, height: 630, background: 'linear-gradient(90deg, rgba(11,31,42,0.85) 0%, rgba(11,31,42,0.55) 55%, rgba(11,31,42,0.2) 100%)' }),
      );
    }

    content.push(
      el(
        'div',
        {
          position: 'absolute',
          left: 72,
          top: 56,
          bottom: 88,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 900,
        },
        [
          el('img', { display: 'flex', width: 320, height: 50 }, undefined, { src: photo ? logoWhite : logo, width: 320, height: 50 }),
          el(
            'div',
            { display: 'flex', flexDirection: 'column' },
            [
              el('div', { display: 'flex', fontSize: title.length > 40 ? 56 : 64, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, color: photo ? '#ffffff' : INK }, title),
              el('div', { display: 'flex', marginTop: 24, fontSize: 26, lineHeight: 1.35, color: photo ? '#dbe7f4' : '#2b3d4f' }, desc),
            ],
          ),
        ],
      ),
      el('div', { position: 'absolute', left: 0, bottom: 0, width: 1200, height: 14, backgroundColor: BRAND }),
    );

    const response = new ImageResponse(
      el('div', { display: 'flex', position: 'relative', width: 1200, height: 630 }, content),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: 'Geist', data: regular, weight: 400, style: 'normal' },
          { name: 'Geist', data: bold, weight: 800, style: 'normal' },
        ],
      },
    );
    const png = Buffer.from(await response.arrayBuffer());
    const jpg = await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    const name = (url === '/' ? 'home' : url.replace(/^\//, '').replaceAll('/', '-').replace(/-+$/, '')) + '.jpg';
    await writeFile(join(OUT, name), jpg);
    console.log(' ✓', name, (jpg.length / 1024).toFixed(0) + 'kB', photo ? '(photo)' : '(no photo)');
    count++;
  }
  console.log(count + ' cards written to dist/og');
}

main();
