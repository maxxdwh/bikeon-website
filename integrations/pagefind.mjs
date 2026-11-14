import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createIndex } from 'pagefind';
import sirv from 'sirv';

export const schoolSlug = (school) =>
  `${school.name} ${school.town}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default function pagefind() {
  return {
    name: 'pagefind',
    hooks: {
      'astro:server:setup': ({ server }) => {
        const serve = sirv(path.join(server.config.root, server.config.build.outDir), { dev: true, etag: true });
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/pagefind/')) serve(req, res, next);
          else next();
        });
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const { index, errors } = await createIndex();
        if (!index) {
          errors.forEach(logger.error);
          return;
        }
        const pages = await index.addDirectory({ path: outDir });
        if (pages.errors.length) {
          pages.errors.forEach(logger.error);
          return;
        }
        const schools = JSON.parse(readFileSync(new URL('../src/data/schools.json', import.meta.url), 'utf8'));
        for (const school of schools) {
          const place = `${school.town}, ${school.region}`;
          const record = await index.addCustomRecord({
            url: `/map?school=${schoolSlug(school)}`,
            content: `${school.name}. ${place}`,
            language: 'en-nz',
            meta: { title: school.name, kind: 'school', place },
          });
          if (record.errors.length) record.errors.forEach(logger.error);
        }
        logger.info(`Pagefind indexed ${pages.page_count} pages and ${schools.length} schools`);
        const written = await index.writeFiles({ outputPath: path.join(outDir, 'pagefind') });
        if (written.errors.length) written.errors.forEach(logger.error);
      },
    },
  };
}
