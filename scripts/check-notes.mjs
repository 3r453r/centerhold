// Post-build: notes must survive for readers without JS and for machine readers,
// and nothing internal may reach the public HTML.
import { readdirSync, readFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
let failures = 0;
const fail = (file, msg) => {
  failures++;
  console.error(`FAIL ${file}: ${msg}`);
};

for (const name of readdirSync(dist).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(new URL(name, dist), 'utf8');
  if (html.includes('INTERNAL NOTES')) fail(name, 'internal notes block leaked');
  const refs = [...html.matchAll(/href="#(user-content-fn-[^"]+)"[^>]*data-footnote-ref/g)].map((m) => m[1]);
  if (refs.length === 0) continue;
  if (!html.includes('data-footnotes')) fail(name, 'refs present but no footnote list');
  for (const id of refs) if (!html.includes(`id="${id}"`)) fail(name, `ref #${id} has no note`);
  if (!/class="notes-toggle"[^>]*hidden/.test(html)) fail(name, 'notes toggle missing or visible without JS');
  console.log(`ok ${name}: ${refs.length} notes`);
}

if (failures) {
  console.error(`${failures} failure(s)`);
  process.exit(1);
}
console.log('notes check passed');
