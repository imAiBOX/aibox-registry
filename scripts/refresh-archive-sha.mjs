#!/usr/bin/env node
// Recalibrate sha256/sizeBytes for GitHub *source archive* packages.
//
// Why: `github.com/<owner>/<repo>/archive/refs/tags/<tag>.tar.gz` is NOT
// byte-stable — GitHub periodically regenerates the tarball (gzip metadata /
// compression level), which changes its sha256 without any content change.
// Release *assets* are stable; source archives are not. When the daily probe
// reports "archive regenerated", run:
//
//   node scripts/refresh-archive-sha.mjs <app-dir>   (e.g. aidog)
//
// It re-downloads each archive channel of each affected package, updates
// sha256 + sizeBytes + the script's cache-path reference, then runs validate.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expectedCacheName, destNameOf, cacheFileName } from './lib/cache-name.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Pure patcher: given a package and freshly measured values, return the
 * updated package (new sha/size + script cache references rewritten).
 * Exported for tests.
 */
export function applyArchiveSha(pkg, newSha, newBytes) {
  const oldSha = (pkg.sha256 || '').toLowerCase();
  const next = JSON.parse(JSON.stringify(pkg));
  next.sha256 = newSha.toLowerCase();
  next.sizeBytes = newBytes;
  next.hashSource =
    `GitHub tag source archive measured locally (${new Date().toISOString().slice(0, 10)}); ` +
    'source archives are NOT byte-stable across GitHub regenerations — probe re-measures, ' +
    'a sha drift means re-measure, not tampering';
  const dest = destNameOf(pkg.channels?.[0]?.url || '');
  const ext = dest.includes('.') ? dest.slice(dest.lastIndexOf('.')) : '';
  const oldRef = oldSha + ext;
  const newRef = next.sha256 + ext;
  const args = next.install?.args;
  if (Array.isArray(args)) {
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'string' && args[i].includes(`cache/downloads/${oldRef}`)) {
        args[i] = args[i].split(`cache/downloads/${oldRef}`).join(`cache/downloads/${newRef}`);
      }
    }
  }
  return next;
}

async function fetchSha(url, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(120000), headers: { 'user-agent': 'aibox-probe' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      const { createHash } = await import('node:crypto');
      return { sha: createHash('sha256').update(buf).digest('hex'), bytes: buf.length };
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw lastErr;
}

async function main() {
  const appDir = process.argv[2];
  if (!appDir) {
    console.error('usage: node scripts/refresh-archive-sha.mjs <app-dir>');
    process.exit(2);
  }
  const file = path.join(root, 'apps', appDir, 'app.json');
  const app = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = 0;
  for (const pkg of app.packages || []) {
    const archiveCh = (pkg.channels || []).find((c) => c.url.includes('/archive/'));
    if (!archiveCh) continue;
    const { sha, bytes } = await fetchSha(archiveCh.url);
    if (sha === (pkg.sha256 || '').toLowerCase() && bytes === pkg.sizeBytes) {
      console.log(`= ${pkg.id}: already current (${sha.slice(0, 12)}…)`);
      continue;
    }
    const before = expectedCacheName(pkg);
    const next = applyArchiveSha(pkg, sha, bytes);
    const idx = app.packages.indexOf(pkg);
    app.packages[idx] = next;
    console.log(`~ ${pkg.id}: ${before?.slice(0, 12)}… -> ${sha.slice(0, 12)}… (${bytes} bytes)`);
    changed++;
  }
  if (changed === 0) {
    console.log('nothing to refresh');
    return;
  }
  fs.writeFileSync(file, JSON.stringify(app, null, 2) + '\n');
  console.log(`updated ${file} (${changed} package(s)); now run: npm test`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
