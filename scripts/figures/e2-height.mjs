// Generates public/figures/e2-height.svg: two normal curves a standardised
// distance d apart, with the shared area shaded and both quantities labelled.
//   node scripts/figures/e2-height.mjs [d]
// The essay (02) cites this figure; keep the numbers here and there in step.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Default d is the NHANES-derived value pinned in E2 endnote 1 (Series 3 No. 50,
// Aug 2021-Aug 2023, Table 7: 13.9 cm mean gap over a pooled SD of 7.33).
const d = Number(process.argv[2] ?? 1.90);

// Standard normal CDF (Abramowitz & Stegun 7.1.26, |err| < 1.5e-7).
function Phi(x) {
  const z = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * z);
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const erf = 1 - poly * Math.exp(-z * z);
  return 0.5 * (1 + Math.sign(x) * erf);
}
const pdf = (x, mu) => Math.exp(-0.5 * (x - mu) ** 2) / Math.sqrt(2 * Math.PI);

const pPair = Phi(-d / Math.SQRT2);      // P(random woman > random man)
const overlap = 2 * Phi(-d / 2);         // area-overlap coefficient

// Geometry
const W = 720, H = 360;
const L = 40, R = 40, T = 46, B = 64;
const muW = -d / 2, muM = d / 2;
const xMin = muW - 3.4, xMax = muM + 3.4;
const yMax = pdf(0, 0) * 1.08;
const sx = (x) => L + ((x - xMin) / (xMax - xMin)) * (W - L - R);
const sy = (y) => T + (1 - y / yMax) * (H - T - B);

const N = 240;
const xs = Array.from({ length: N + 1 }, (_, i) => xMin + ((xMax - xMin) * i) / N);
const path = (mu) => xs.map((x, i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(pdf(x, mu)).toFixed(1)}`).join(' ');
const area = (mu) => `${path(mu)} L${sx(xMax).toFixed(1)},${sy(0)} L${sx(xMin).toFixed(1)},${sy(0)} Z`;
// Shared area = min of the two densities.
const shared = xs.map((x, i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(Math.min(pdf(x, muW), pdf(x, muM))).toFixed(1)}`).join(' ')
  + ` L${sx(xMax).toFixed(1)},${sy(0)} L${sx(xMin).toFixed(1)},${sy(0)} Z`;

const gold = '#D9A441', teal = '#5FB3A3', ivory = '#EDE7D9', silt = '#9AA3A8', bed = '#0E141A';
const pct = (v) => `${Math.round(v * 100)}%`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="t">
<title id="t">Two overlapping height distributions: shared area ${pct(overlap)}, chance a random woman is taller than a random man ${pct(pPair)}</title>
<style>
  text { font-family: "Spline Sans Mono", ui-monospace, SFMono-Regular, Menlo, monospace; fill: ${ivory}; }
  .lab { font-size: 13px; letter-spacing: 1.2px; text-transform: uppercase; }
  .num { font-size: 22px; }
  .small { font-size: 12px; fill: ${silt}; }
</style>
<rect width="${W}" height="${H}" rx="18" fill="${bed}"/>
<path d="${area(muW)}" fill="${teal}" fill-opacity="0.16"/>
<path d="${area(muM)}" fill="${gold}" fill-opacity="0.16"/>
<path d="${shared}" fill="${ivory}" fill-opacity="0.28"/>
<path d="${path(muW)}" fill="none" stroke="${teal}" stroke-width="2.2"/>
<path d="${path(muM)}" fill="none" stroke="${gold}" stroke-width="2.2"/>
<line x1="${L}" y1="${sy(0)}" x2="${W - R}" y2="${sy(0)}" stroke="${silt}" stroke-opacity="0.5"/>
<line x1="${sx(muW).toFixed(1)}" y1="${sy(pdf(0, 0))}" x2="${sx(muW).toFixed(1)}" y2="${sy(0)}" stroke="${teal}" stroke-dasharray="3 5" stroke-opacity="0.7"/>
<line x1="${sx(muM).toFixed(1)}" y1="${sy(pdf(0, 0))}" x2="${sx(muM).toFixed(1)}" y2="${sy(0)}" stroke="${gold}" stroke-dasharray="3 5" stroke-opacity="0.7"/>
<text class="lab" x="${sx(muW).toFixed(1)}" y="${T - 14}" text-anchor="middle" fill="${teal}" style="fill:${teal}">women</text>
<text class="lab" x="${sx(muM).toFixed(1)}" y="${T - 14}" text-anchor="middle" style="fill:${gold}">men</text>
<text class="small" x="${W / 2}" y="${sy(0) + 22}" text-anchor="middle">height, in units of one within-sex spread &#183; means ${d.toFixed(2)} spreads apart</text>
<g transform="translate(${L + 6}, ${sy(0) - 150})">
  <text class="num">${pct(overlap)}</text>
  <text class="lab" y="20">shared area</text>
  <text class="small" y="38">shared by both curves</text>
</g>
<g transform="translate(${W - R - 6}, ${sy(0) - 150})" text-anchor="end">
  <text class="num">${pct(pPair)}</text>
  <text class="lab" y="20">she is taller</text>
  <text class="small" y="38">one pairing in ${Math.round(1 / pPair)}</text>
</g>
</svg>
`;

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/figures/e2-height.svg');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, svg);
console.log(`d=${d}  P(woman>man)=${pPair.toFixed(4)}  overlap=${overlap.toFixed(4)}  -> ${out}`);
