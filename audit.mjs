import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES } from './data/pages.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const failures = [];
const rasterUsage = new Map();

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
    ['canonical URL', html.includes('<link rel="canonical" href="https://')],
    ['education organization schema', html.includes('"@type":"EducationalOrganization"')],
    ['no blocking loader', !html.includes('data-site-loader')],
    ['no page transition curtain', !html.includes('data-transition')],
    ['no looping signal strip', !html.includes('class="signal-strip"')],
    ['truthful accommodation wording', !html.includes('Guaranteed accommodation')],
    ['privacy label matches destination', !html.includes('View Compliance Policy')],
    ['no placeholder testimonials', !html.includes('At AUS sustainability')],
    ['no disputed statistics', !html.includes('CHF 90') && !html.includes('+1M') && !html.includes('+15%')],
    ['no unsupported faculty entry', page.route !== 'faculty' || !html.includes('Dr. Kevin Koidl')],
    // The policy inventory is scoped to the public privacy policy
    // (helvetictech.ch/privacy), so it must appear on the policies route and
    // nowhere else. Items from the separate policies index are not used.
    ['policy inventory scoped to policies page', page.route === 'policies'
      ? (html.includes('Rights of the data subjects') && html.includes('Website analytics'))
      : (!html.includes('Rights of the data subjects') && !html.includes('Website analytics'))],
    ['no synthesized insights copy', !html.includes('Perspective from Helvetic Institute') && !html.includes('Learning built around how technology is actually used')],
    ['all menu destinations are local', !/href="https?:\/\/(?:www\.)?helvetictech\.ch/i.test(menuHtml)],
    ['homepage trust facts', page.route !== '' || (html.includes('class="home-facts"') && html.includes('class="international chapter"'))],
    ['desktop primary navigation', html.includes('class="desktop-nav"')],
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
    if (/\.webp$/i.test(clean)) {
      const name = path.basename(clean).toLowerCase();
      const uses = rasterUsage.get(name) || [];
      uses.push(output);
      rasterUsage.set(name, uses);
    }
  }
}

for (const [image, uses] of rasterUsage) {
  if (uses.length > 1) failures.push(`assets/images/${image}: reused in ${uses.join(', ')}`);
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
  console.log(`audit passed: ${PAGES.length} pages, unique raster usage, source traces and disputed-content checks`);
}
