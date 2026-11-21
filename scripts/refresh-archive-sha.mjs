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
// It re-downloads the first archive channel of each affected package. In
// content mode, it refreshes byte metadata only if the pinned gzip content
// digest still matches. Byte-mode refreshes also update the script cache path.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expectedCacheName } from './lib/cache-name.mjs';
import { digestPolicy, downloadFullPackage, MAX_GZIP_BYTES, packageDigest } from './lib/package-digest.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Measure a downloaded archive and return a refreshed package, or throw
 * before editing if its pinned content cannot be verified.
 */
export function applyArchiveSha(pkg, buf) {
  let measured;
  try {
    measured = packageDigest(buf, pkg);
  } catch (e) {
    throw new Error(`${pkg.id}: archive verification failed: ${e.message}; manual review required`, { cause: e });
  }
  const { mode, matches, expected, sha256: digest, bytes } = measured;
  if (mode === 'content' && !matches) {
    throw new Error(`${pkg.id}: contentSha256 mismatch (expected ${expected}, got ${digest}); manual review required`);
  }
  const sha = mode === 'bytes' ? digest : createHash('sha256').update(buf).digest('hex');
  if (sha === pkg.sha256 && bytes === pkg.sizeBytes) return pkg;

  const next = JSON.parse(JSON.stringify(pkg));
  next.sha256 = sha;
  next.sizeBytes = bytes;
  const source = `GitHub tag source archive measured locally (${new Date().toISOString().slice(0, 10)})`;
  if (mode === 'content') {
    next.hashSource = `${source}; decompressed gzip content verified against pinned contentSha256`;
    return next;
  }

  next.hashSource = `${source}; source archives are NOT byte-stable across GitHub regenerations`;
  const oldRef = expectedCacheName(pkg);
  const newRef = expectedCacheName(next);
  const args = next.install?.args;
  if (oldRef && newRef && oldRef !== newRef && Array.isArray(args)) {
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] === 'string' && args[i].includes(`cache/downloads/${oldRef}`)) {
        args[i] = args[i].split(`cache/downloads/${oldRef}`).join(`cache/downloads/${newRef}`);
      }
    }
  }
  return next;
}

async function fetchArchive(url, mode, tries) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await downloadFullPackage(url, {
        timeoutMs: 120_000,
        maxInput: mode === 'content' ? MAX_GZIP_BYTES : Infinity,
        userAgent: 'aibox-probe',
      });
    } catch (e) {
      if (attempt >= tries) throw e;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

export async function refreshArchive(pkg, url, { tries = 3 } = {}) {
  const { mode } = digestPolicy(pkg);
  const buf = await fetchArchive(url, mode, tries);
  return applyArchiveSha(pkg, buf);
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
    const next = await refreshArchive(pkg, archiveCh.url);
    if (next === pkg) {
      console.log(`= ${pkg.id}: already current (${pkg.sha256.slice(0, 12)}…)`);
      continue;
    }
    const idx = app.packages.indexOf(pkg);
    app.packages[idx] = next;
    console.log(`~ ${pkg.id}: byte sha ${pkg.sha256.slice(0, 12)}… -> ${next.sha256.slice(0, 12)}… (${next.sizeBytes} bytes)`);
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
