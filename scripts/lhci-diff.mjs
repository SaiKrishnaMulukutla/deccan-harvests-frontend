import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const METRICS = [
  ['performance',              'Performance score',    'category', 0],
  ['accessibility',            'Accessibility score',  'category', 0],
  ['best-practices',           'Best Practices score', 'category', 0],
  ['seo',                      'SEO score',            'category', 0],
  ['largest-contentful-paint', 'LCP',                  'audit',    0],
  ['first-contentful-paint',   'FCP',                  'audit',    0],
  ['cumulative-layout-shift',  'CLS',                  'audit',    3],
  ['total-blocking-time',      'TBT',                  'audit',    0],
  ['speed-index',              'Speed Index',          'audit',    0],
  ['interactive',              'Time to Interactive',  'audit',    0],
];

function loadMedian(dir) {
  const files = readdirSync(dir).filter((f) => f.endsWith('.json') && f.includes('lhr'));
  if (!files.length) throw new Error(`No LHR JSONs found in ${dir}`);
  const lhrs = files.map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  lhrs.sort((a, b) => a.categories.performance.score - b.categories.performance.score);
  return lhrs[Math.floor(lhrs.length / 2)];
}

function val(lhr, id, kind) {
  if (kind === 'category') return lhr.categories[id].score * 100;
  const a = lhr.audits[id];
  return a.numericValue ?? a.score * 100;
}

function fmt(v, decimals, kind) {
  if (kind === 'category') return `${v.toFixed(0)}`;
  return v < 10 ? v.toFixed(decimals) : `${Math.round(v)}`;
}

function delta(before, after, kind) {
  const d = after - before;
  const better = kind === 'category' ? d > 0 : d < 0;
  const sign = d > 0 ? '+' : '';
  const arrow = better ? '✓' : Math.abs(d) < 0.5 ? '·' : '✗';
  return `${arrow} ${sign}${d.toFixed(Math.abs(d) < 1 ? 2 : 0)}`;
}

const before = loadMedian('.lighthouseci.before');
const after  = loadMedian('.lighthouseci.after');

console.log('\n  Metric                       Before      After      Δ');
console.log(  '  ───────────────────────────  ─────────  ─────────  ──────────');
for (const [id, label, kind, decimals] of METRICS) {
  const b = val(before, id, kind);
  const a = val(after,  id, kind);
  const unit = kind === 'audit' && id !== 'cumulative-layout-shift' ? 'ms' : '';
  console.log(
    `  ${label.padEnd(28)} ${fmt(b, decimals, kind).padStart(7)}${unit.padEnd(2)}  ` +
    `${fmt(a, decimals, kind).padStart(7)}${unit.padEnd(2)}  ${delta(b, a, kind)}`
  );
}
console.log();
