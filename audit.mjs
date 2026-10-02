import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './data/pages.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const failures = [];

for (const page of PAGES) {
  const output = page.route ? path.join(...page.route.split('/'), 'index.html') : 'index.html';
  const file = path.join(root, output);
  await access(file);
  const html = await readFile(file, 'utf8');
  const menuHtml = html.match(/<aside class="menu"[\s\S]*?<\/aside>/)?.[0] || '';
  const checks = [
    ['one h1', (html.match(/<h1\b/g) || []).length === 1],
    ['main landmark', html.includes('<main id="main-content">')],
    ['skip link', html.includes('class="skip-link"')],
    ['source trace', html.includes('<!-- Content source: https://')],
    ['no placeholder testimonials', !html.includes('At AUS sustainability')],
    ['no disputed statistics', !html.includes('CHF 90') && !html.includes('+1M') && !html.includes('+15%')],
    ['no unsupported faculty entry', page.route !== 'faculty' || !html.includes('Dr. Kevin Koidl')],
    ['no unsupported policy inventory', !html.includes('Staff Disciplinary Policy') && !html.includes('Student Finance Policy')],
    ['no synthesized insights copy', !html.includes('Perspective from Helvetic Institute') && !html.includes('Learning built around how technology is actually used')],
    ['all menu destinations are local', !/href="https?:\/\/(?:www\.)?helvetictech\.ch/i.test(menuHtml)],
  ];
  for (const [name, ok] of checks) if (!ok) failures.push(`${output}: ${name}`);

  const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  for (const href of links) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    let target = path.resolve(path.dirname(file), clean);
    if (clean.endsWith('/')) target = path.join(target, 'index.html');
    try { await access(target); } catch { failures.push(`${output}: broken local link ${href}`); }
  }

  const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  for (const src of images) {
    const clean = src.split('?')[0];
    if (!/\.(webp|svg)$/i.test(clean)) failures.push(`${output}: non-WebP raster image ${src}`);
    try { await access(path.resolve(path.dirname(file), clean)); } catch { failures.push(`${output}: missing image ${src}`); }
  }
}

for (const asset of ['assets/styles.css', 'assets/main.js']) {
  try { await access(path.join(root, asset)); } catch { failures.push(`missing ${asset}`); }
}

const imageFiles = await readdir(path.join(root, 'assets', 'images'));
for (const file of imageFiles) {
  if (!/\.(webp|svg)$/i.test(file)) failures.push(`assets/images/${file}: unsupported image format`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`audit passed: ${PAGES.length} pages, source traces and disputed-content checks`);
}
