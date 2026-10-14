import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROGRAMS } from '../../data/site.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = path.resolve(here, '../hit-core/starter-data');
const embeddedOut = path.resolve(here, '../hit-core/includes/starter-data.php');

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['wordpress', '.git', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...await walk(full));
    else if (entry.name === 'index.html') found.push(full);
  }
  return found;
}

const decode = (value = '') => value
  .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#039;', "'")
  .replaceAll('&lt;', '<').replaceAll('&gt;', '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

function phpValue(value, depth = 0) {
  const indent = '  '.repeat(depth);
  const next = '  '.repeat(depth + 1);
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : '0';
  if (typeof value === 'string') return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
  if (Array.isArray(value)) {
    if (!value.length) return 'array()';
    return `array(\n${value.map(item => `${next}${phpValue(item, depth + 1)},`).join('\n')}\n${indent})`;
  }
  const entries = Object.entries(value);
  if (!entries.length) return 'array()';
  return `array(\n${entries.map(([key, item]) => `${next}${phpValue(key)} => ${phpValue(item, depth + 1)},`).join('\n')}\n${indent})`;
}

async function writeData(name, value) {
  await writeFile(path.join(out, `${name}.json`), JSON.stringify(value, null, 2) + '\n');
  await writeFile(path.join(out, `${name}.php`), `<?php\n/** Generated HIT starter data. */\nif ( ! defined( 'ABSPATH' ) ) exit;\nreturn ${phpValue(value)};\n`);
}

function localise(html, route) {
  return html.replace(/\b(href|src|data-preview)="([^"]+)"/g, (match, attr, value) => {
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/i.test(value)) return match;
    const url = new URL(value, `https://hit.local/${route}`);
    if (url.pathname.startsWith('/assets/')) return `${attr}="{{theme_url}}${url.pathname}${url.search}${url.hash}"`;
    return `${attr}="{{home_url}}${url.pathname}${url.search}${url.hash}"`;
  }).replace(/data-base="[^"]*"/g, 'data-base="{{home_url}}/"');
}

const pages = [];
for (const file of await walk(root)) {
  const source = await readFile(file, 'utf8');
  const relative = path.relative(root, file).replaceAll('\\', '/');
  const route = relative === 'index.html' ? '' : relative.replace(/index\.html$/, '');
  const main = source.match(/<main\s+id="main-content"(?:\s+class="([^"]*)")?>([\s\S]*?)<\/main>/i);
  if (!main) throw new Error(`No main element in ${relative}`);
  const title = decode((source.match(/<title>([\s\S]*?)<\/title>/i) || [,'Untitled'])[1]).replace(/\s*\|\s*Helvetic Tech\s*$/, '');
  const description = decode((source.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [,''])[1]);
  const kind = (source.match(/<body[^>]*data-page="([^"]+)"/i) || [,'page'])[1];
  const canonical = (source.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i) || [,''])[1];
  const cleanRoute = route.replace(/\/$/, '');
  const bits = cleanRoute ? cleanRoute.split('/') : [];
  const parentRoute = bits.length > 1 ? `${bits.slice(0, -1).join('/')}/` : '';
  pages.push({
    route, slug: bits.at(-1) || 'home', parentRoute,
    title, description, kind, mainClass: main[1] || '',
    content: localise(main[2], route), source: canonical,
    frontPage: route === ''
  });
}
pages.sort((a, b) => a.route.localeCompare(b.route));

const programs = PROGRAMS.map(program => ({ ...program, route: `${program.href}/` }));
const intakes = ['January', 'April', 'September'].map((title, index) => ({ title, order: index + 1 }));
await writeData('pages', pages);
await writeData('programs', programs);
await writeData('intakes', intakes);
await writeFile(embeddedOut, `<?php\n/** Generated, self-contained HIT starter content bundle. */\nif ( ! defined( 'ABSPATH' ) ) exit;\nfunction hit_core_bundled_starter_data( $name ) {\n\tswitch ( $name ) {\n\t\tcase 'pages':\n\t\t\treturn ${phpValue(pages, 3)};\n\t\tcase 'programs':\n\t\t\treturn ${phpValue(programs, 3)};\n\t\tcase 'intakes':\n\t\t\treturn ${phpValue(intakes, 3)};\n\t\tdefault:\n\t\t\treturn array();\n\t}\n}\n`);
console.log(`Exported ${pages.length} pages, ${programs.length} programs and ${intakes.length} intakes.`);

