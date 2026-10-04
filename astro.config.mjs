// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
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
