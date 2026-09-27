// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bikeon.org.nz',
  vite: { plugins: [tailwindcss()] },
  integrations: [sitemap()],
  markdown: {
    rehypePlugins: [
      () => (tree) => {
        const visit = (node) => {
          if (node.type === 'element' && node.tagName === 'a' && node.properties && node.properties.href) {
            const href = node.properties.href;
            if (href.startsWith('http') && !href.startsWith('https://bikeon.org.nz')) {
              node.properties.target = '_blank';
              node.properties.rel = 'noopener noreferrer';
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
      () => (tree) => {
        if (!tree.children) return;

        const isImagePara = (node) =>
          node.type === 'element' && node.tagName === 'p' &&
          node.children && node.children.length === 1 &&
          node.children[0].type === 'element' && node.children[0].tagName === 'img' &&
          node.children[0].properties && node.children[0].properties.alt;

        const isWhitespace = (node) =>
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
