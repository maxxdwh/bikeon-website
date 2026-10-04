import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const INK = '#0b1f2a';
const BLUE = '#0b6fa4';
const BRAND = '#23adef';
const TINT = '#e6f4fc';
const TEXT = '#2b3d4f';

const DEFAULT_TITLE = 'Every Kiwi kid, riding a bike at school';
const DEFAULT_DESCRIPTION = 'A free guide for New Zealand schools setting up bikes, helmets, tracks, storage and skills training.';

const clip = (value: string | null, max: number, fallback: string) => {
  const text = (value ?? '').replace(/\s+/g, ' ').trim() || fallback;
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};

const el = (type: string, style: Record<string, unknown>, children?: unknown, props: Record<string, unknown> = {}) => ({
  type,
  props: { style, children, ...props },
});

export default async function handler(request: Request) {
  const url = new URL(request.url);
  const title = clip(url.searchParams.get('title'), 80, DEFAULT_TITLE);
  const description = clip(url.searchParams.get('description'), 150, DEFAULT_DESCRIPTION);

  const [regular, bold, logoSvg] = await Promise.all([
    fetch(new URL('./_assets/geist-400.woff', import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL('./_assets/geist-800.woff', import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL('./_assets/logo.svg', import.meta.url)).then((r) => r.text()),
  ]);
  const logo = `data:image/svg+xml;base64,${btoa(logoSvg)}`;

  const card = el(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      padding: '64px 72px 56px',
      backgroundColor: '#ffffff',
      borderBottom: `20px solid ${BRAND}`,
      fontFamily: 'Geist',
    },
    [
      el('img', { width: 412, height: 64 }, undefined, { src: logo, width: 412, height: 64 }),
      el('div', { display: 'flex', flexDirection: 'column' }, [
        el(
          'div',
          {
            display: 'flex',
            fontSize: title.length > 40 ? 68 : 84,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: INK,
          },
          title,
        ),
        el('div', { display: 'flex', marginTop: 28, fontSize: 32, lineHeight: 1.35, color: TEXT }, description),
      ]),
      el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        el(
          'div',
          {
            display: 'flex',
            padding: '10px 22px',
            borderRadius: 999,
            backgroundColor: TINT,
            fontSize: 26,
            fontWeight: 800,
            color: BLUE,
          },
          'bikeon.org.nz',
        ),
        el('div', { display: 'flex', fontSize: 24, color: TEXT }, 'Bike On New Zealand Charitable Trust'),
      ]),
    ],
  );

  return new ImageResponse(card as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', data: regular, weight: 400, style: 'normal' },
      { name: 'Geist', data: bold, weight: 800, style: 'normal' },
    ],
    headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800' },
  });
}
