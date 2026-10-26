// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

const LATIN = ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'];
const LATIN_EXT = ['U+0100-02BA', 'U+02BD-02C5', 'U+02C7-02CC', 'U+02CE-02D7', 'U+02DD-02FF', 'U+0304', 'U+0308', 'U+0329', 'U+1D00-1DBF', 'U+1E00-1E9F', 'U+1EF2-1EFF', 'U+2020', 'U+20A0-20AB', 'U+20AD-20C0', 'U+2113', 'U+2C60-2C7F', 'U+A720-A7FF'];

const geist = (/** @type {'normal' | 'italic'} */ style, /** @type {'latin' | 'latin-ext'} */ subset) => ({
  src: /** @type {[string]} */ ([`@fontsource-variable/geist/files/geist-${subset}-wght-${style}.woff2`]),
  weight: '100 900',
  style,
  unicodeRange: /** @type {[string, ...string[]]} */ (subset === 'latin' ? LATIN : LATIN_EXT),
});

export default defineConfig({
  fonts: [
    {
      name: 'Geist',
      cssVariable: '--font-geist',
      fallbacks: ['system-ui', 'sans-serif'],
      provider: fontProviders.local(),
      options: {
        variants: [geist('normal', 'latin'), geist('normal', 'latin-ext'), geist('italic', 'latin'), geist('italic', 'latin-ext')],
      },
    },
  ],
  site: 'https://bikeon.org.nz',
  trailingSlash: 'never',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap({ filter: (page) => !/\/(101|guide\/print)\/?$/.test(page) }), icon()],
  image: {
    layout: 'constrained',
    domains: ['img.youtube.com'],
  },
  markdown: {
    rehypePlugins: [
      () => (/** @type {any} */ tree) => {
        const visit = (/** @type {any} */ node) => {
          if (node.type === 'element' && node.tagName === 'a' && node.properties && node.properties.href) {
            const href = node.properties.href;
            const external = href.startsWith('http') && !href.startsWith('https://bikeon.org.nz');
            if (!href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
              node.properties.target = '_blank';
              node.properties.rel = external ? 'noopener noreferrer' : 'noopener';
            }
            if (external) {
              if (node.children) {
                node.children.push({
                  type: 'element',
                  tagName: 'svg',
                  properties: {
                    class: 'external-link-icon',
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 2,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    ariaHidden: 'true',
                  },
                  children: [
                    { type: 'element', tagName: 'path', properties: { d: 'M7 17 17 7' }, children: [] },
                    { type: 'element', tagName: 'path', properties: { d: 'M7 7h10v10' }, children: [] },
                  ],
                });
              }
            }
          }
          if (node.children) node.children.forEach(visit);
        };
        visit(tree);
      },
      () => (/** @type {any} */ tree) => {
        if (!tree.children) return;

        const isImagePara = (/** @type {any} */ node) =>
          node.type === 'element' && node.tagName === 'p' &&
          node.children && node.children.length === 1 &&
          node.children[0].type === 'element' && node.children[0].tagName === 'img' &&
          node.children[0].properties && node.children[0].properties.alt;

        const isWhitespace = (/** @type {any} */ node) =>
          node.type === 'text' && (!node.value || node.value.trim() === '');

        const newChildren = [];
        let i = 0;
        while (i < tree.children.length) {
          const node = tree.children[i];

          if (isWhitespace(node)) {
            newChildren.push(node);
            i++;
            continue;
          }

          if (!isImagePara(node)) {
            newChildren.push(node);
            i++;
            continue;
          }

          const group = [node.children[0]];
          let j = i + 1;
          while (j < tree.children.length) {
            if (isWhitespace(tree.children[j])) { j++; continue; }
            if (!isImagePara(tree.children[j])) break;
            group.push(tree.children[j].children[0]);
            j++;
          }

          if (group.length === 1) {
            const img = group[0];
            newChildren.push({
              type: 'element', tagName: 'figure', properties: {},
              children: [
                img,
                { type: 'element', tagName: 'figcaption', properties: {},
                  children: [{ type: 'text', value: img.properties.alt }] },
              ],
            });
          } else {
            const figs = group.map((img) => ({
              type: 'element', tagName: 'figure', properties: {},
              children: [
                img,
                { type: 'element', tagName: 'figcaption', properties: {},
                  children: [{ type: 'text', value: img.properties.alt }] },
              ],
            }));
            newChildren.push({
              type: 'element', tagName: 'div',
              properties: { className: ['fig-grid'] },
              children: figs,
            });
          }
          i = j;
        }
        tree.children = newChildren;
      },
    ],
  },
});
