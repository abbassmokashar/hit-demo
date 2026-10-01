import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './data/pages.mjs';
import { documentFor } from './lib/render.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));

for (const page of PAGES) {
  const output = page.route ? path.join(...page.route.split('/'), 'index.html') : 'index.html';
  const target = path.join(root, output);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, documentFor(page), 'utf8');
  console.log(`built ${output}`);
}
