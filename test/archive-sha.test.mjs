// Regression: archive refresh honors the pinned digest and cache naming mode.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { applyArchiveSha } from '../scripts/refresh-archive-sha.mjs';
import { badScriptRefs } from '../scripts/lib/cache-name.mjs';

const OLD = 'a'.repeat(64);
const payload = Buffer.from('archive data\n'.repeat(256));
const compressed = gzipSync(payload, { level: 1 });
const recompressed = gzipSync(payload, { level: 9 });
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const NEW = sha(recompressed);

function archivePkg() {
  return {
    id: 'demo',
    sha256: OLD,
    sizeBytes: 1000,
    hashSource: 'GitHub tag source archive measured locally (2026-11-17)',
    channels: [{ type: 'direct', url: 'https://github.com/o/r/archive/refs/tags/v1.0.0.tar.gz' }],
    install: {
      type: 'script',
      args: ['bash', '-lc', `tar -xzf "$HOME/.aibox/cache/downloads/${OLD}.gz" -C /tmp && ls`],
    },
  };
}

test('applyArchiveSha swaps sha, size, hashSource and script cache ref', () => {
  const next = applyArchiveSha(archivePkg(), recompressed);
  assert.equal(next.sha256, NEW);
  assert.equal(next.sizeBytes, recompressed.length);
  assert.match(next.hashSource, /NOT byte-stable/);
  assert.ok(next.install.args[2].includes(`cache/downloads/${NEW}.gz`));
  assert.ok(!next.install.args[2].includes(OLD), 'old sha reference must be gone');
  // validate's guard must pass on the refreshed package
  assert.deepEqual(badScriptRefs(next), []);
});

test('original package object is not mutated', () => {
  const p = archivePkg();
  applyArchiveSha(p, recompressed);
  assert.equal(p.sha256, OLD);
  assert.equal(p.sizeBytes, 1000);
});

test('non-archive packages are untouched in shape (no script refs to rewrite)', () => {
  const p = {
    id: 'nsis-pkg',
    sha256: OLD,
    sizeBytes: 10,
    channels: [{ type: 'direct', url: 'https://x/Setup.exe' }],
    install: { type: 'nsis-silent', args: ['/S'] },
  };
  const next = applyArchiveSha(p, recompressed);
  assert.equal(next.sha256, NEW);
  assert.deepEqual(next.install.args, ['/S']);
  assert.deepEqual(badScriptRefs(next), []);
});

function contentPkg() {
  const p = archivePkg();
  p.hashMode = 'content';
  p.contentSha256 = sha(payload);
  p.sha256 = sha(compressed);
  p.sizeBytes = compressed.length;
  p.install.args[2] = p.install.args[2].replace(OLD, p.contentSha256);
  return p;
}

test('compression-only refresh updates byte metadata and preserves the content cache name', () => {
  const p = contentPkg();
  assert.notEqual(p.sha256, NEW);
  const next = applyArchiveSha(p, recompressed);
  assert.equal(next.sha256, NEW);
  assert.equal(next.sizeBytes, recompressed.length);
  assert.equal(next.contentSha256, p.contentSha256);
  assert.match(next.hashSource, /verified against pinned contentSha256/);
  assert.deepEqual(next.install, p.install);
  assert.deepEqual(badScriptRefs(next), []);
  assert.equal(applyArchiveSha(next, recompressed), next);
});

test('changed archive content is refused even when byte metadata is already current', () => {
  const changed = gzipSync(Buffer.from('different archive data'));
  const p = { ...contentPkg(), sha256: sha(changed), sizeBytes: changed.length };
  const original = structuredClone(p);
  assert.throws(() => applyArchiveSha(p, changed), /contentSha256 mismatch.*manual review required/);
  assert.deepEqual(p, original);
});

test('malformed archive and missing content pin are refused', () => {
  assert.throws(() => applyArchiveSha(contentPkg(), Buffer.from('not gzip')), /verification failed.*manual review required/);
  const { contentSha256: _, ...missingPin } = contentPkg();
  assert.throws(() => applyArchiveSha(missingPin, recompressed), /missing\/invalid contentSha256.*manual review required/);
});
