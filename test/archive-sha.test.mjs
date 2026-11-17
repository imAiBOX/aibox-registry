// Regression: GitHub source archives are not byte-stable — when the probe
// reports a regenerated archive, refresh-archive-sha.mjs must produce a
// package whose script references the NEW cache name (validate would fail
// otherwise) and keep size/hashSource coherent.
import test from 'node:test';
import assert from 'node:assert/strict';
import { applyArchiveSha } from '../scripts/refresh-archive-sha.mjs';
import { badScriptRefs } from '../scripts/lib/cache-name.mjs';

const OLD = 'a'.repeat(64);
const NEW = 'b'.repeat(64);

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
  const next = applyArchiveSha(archivePkg(), NEW, 2222);
  assert.equal(next.sha256, NEW);
  assert.equal(next.sizeBytes, 2222);
  assert.match(next.hashSource, /NOT byte-stable/);
  assert.ok(next.install.args[2].includes(`cache/downloads/${NEW}.gz`));
  assert.ok(!next.install.args[2].includes(OLD), 'old sha reference must be gone');
  // validate's guard must pass on the refreshed package
  assert.deepEqual(badScriptRefs(next), []);
});

test('original package object is not mutated', () => {
  const p = archivePkg();
  applyArchiveSha(p, NEW, 2222);
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
  const next = applyArchiveSha(p, NEW, 20);
  assert.equal(next.sha256, NEW);
  assert.deepEqual(next.install.args, ['/S']);
  assert.deepEqual(badScriptRefs(next), []);
});
