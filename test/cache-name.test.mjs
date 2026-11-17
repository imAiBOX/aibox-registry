// Guard: install scripts must reference the content-addressed cache name.
// Regression suite for the 2026-11-18 fix (27 raw-name refs across 16 apps
// would all fail at exec time because no placeholder substitution exists).
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  destNameOf,
  cacheFileName,
  expectedCacheName,
  badScriptRefs,
} from '../scripts/lib/cache-name.mjs';

const SHA = 'a'.repeat(64);
const SHA_B = 'b'.repeat(64);

test('destNameOf strips query/hash and path', () => {
  assert.equal(destNameOf('https://x/y/Chatbox-1.24.4.dmg?x=1'), 'Chatbox-1.24.4.dmg');
  assert.equal(destNameOf('https://x/y/llamafile-0.10.6'), 'llamafile-0.10.6');
});

test('cacheFileName mirrors Rust/TS: <sha><ext>, no-dot names keep no ext', () => {
  assert.equal(cacheFileName('a.dmg', SHA), `${SHA}.dmg`);
  assert.equal(cacheFileName('llamafile-0.10.6', SHA), `${SHA}.6`);
  assert.equal(cacheFileName('install.sh', SHA), `${SHA}.sh`);
});

test('script referencing the cache name passes', () => {
  const pkg = {
    sha256: SHA,
    channels: [{ url: 'https://x/y/App-1.0.dmg' }],
    install: { type: 'script', args: ['bash', '-lc', `hdiutil attach "$HOME/.aibox/cache/downloads/${SHA}.dmg"`] },
  };
  assert.equal(expectedCacheName(pkg), `${SHA}.dmg`);
  assert.deepEqual(badScriptRefs(pkg), []);
});

test('script referencing the raw file name fails (pre-fix shape)', () => {
  const pkg = {
    sha256: SHA,
    channels: [{ url: 'https://x/y/App-1.0.dmg' }],
    install: { type: 'script', args: ['bash', '-lc', 'hdiutil attach "$HOME/.aibox/cache/downloads/App-1.0.dmg"'] },
  };
  const bad = badScriptRefs(pkg);
  assert.equal(bad.length, 1);
  assert.equal(bad[0].ref, 'App-1.0.dmg');
  assert.equal(bad[0].expected, `${SHA}.dmg`);
});

test('placeholder <dmg> fails (no substitution exists at exec time)', () => {
  const pkg = {
    sha256: SHA,
    channels: [{ url: 'https://x/y/App-1.0.dmg' }],
    install: { type: 'script', args: ['bash', '-lc', 'hdiutil attach <dmg>'] },
  };
  const bad = badScriptRefs(pkg);
  assert.equal(bad.length, 1);
  assert.equal(bad[0].ref, '<dmg>');
});

test('stale bumped URL with old script name fails (half-bump shape)', () => {
  const pkg = {
    sha256: SHA_B,
    channels: [{ url: 'https://x/y/App-2.0.dmg' }],
    install: { type: 'script', args: ['bash', '-lc', 'hdiutil attach "$HOME/.aibox/cache/downloads/App-1.0.dmg"'] },
  };
  const bad = badScriptRefs(pkg);
  assert.equal(bad.length, 1);
  assert.equal(bad[0].ref, 'App-1.0.dmg');
  assert.equal(bad[0].expected, `${SHA_B}.dmg`);
});

test('non-script installs (nsis/msi/npm) have no refs to check', () => {
  const pkg = {
    sha256: SHA,
    channels: [{ url: 'https://x/y/Setup.exe' }],
    install: { type: 'nsis-silent', args: ['/S'] },
  };
  assert.deepEqual(badScriptRefs(pkg), []);
});
