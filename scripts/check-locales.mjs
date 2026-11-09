#!/usr/bin/env node
// locale key-parity check: en.json is the baseline; zh-CN (and any future
// pack) must contain every en key — nested objects flattened with dot notation.
// New languages = add locales/<code>.json + a PR; no installer release.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'locales');

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const packs = {};
for (const f of files) {
  packs[f] = flatten(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

if (!packs['en.json']) {
  console.error('✗ locales/en.json (baseline) is missing');
  process.exit(1);
}

const baseline = Object.keys(packs['en.json']).sort();
const errors = [];

for (const [file, keys] of Object.entries(packs)) {
  if (file === 'en.json') continue;
  const missing = baseline.filter((k) => !keys.hasOwnProperty(k));
  for (const k of missing) errors.push(`${file}: missing baseline key "${k}"`);
  // sanity: pack must declare its own locale + fallback to en
  const meta = packs[file];
  if (!meta['meta.locale']) errors.push(`${file}: missing meta.locale`);
  if (meta['meta.fallback'] !== 'en') errors.push(`${file}: meta.fallback must be "en" (fallback chain)`);
}

if (errors.length) {
  console.error(`✗ locale parity failed (${errors.length}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ locales OK: en baseline ${baseline.length} keys, ${files.length - 1} translated pack(s) in sync`);
