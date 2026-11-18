// Regression: LobeHub v2.3.4 shipped a metadata-only release (one 301-byte
// json) while desktop packaging moved to nightly prereleases — the probe must
// NOT report an installable upgrade in that case, or the run stays red with
// nothing to bump.
import test from 'node:test';
import assert from 'node:assert/strict';
import { hasInstallableAsset, urlExt } from '../scripts/lib/release-drift.mjs';

const PKG_URLS = [
  'https://github.com/lobehub/lobehub/releases/download/v2.3.3/LobeHub-2.3.3-setup.exe',
  'https://github.com/lobehub/lobehub/releases/download/v2.3.3/LobeHub-2.3.3-arm64.dmg',
];

test('urlExt handles query/hash and missing extension', () => {
  assert.equal(urlExt('https://x/y/App.exe?x=1'), '.exe');
  assert.equal(urlExt('https://x/y/archive.tar.gz'), '.gz');
  assert.equal(urlExt('https://x/y/llamafile-0.10.6'), '.6');
  assert.equal(urlExt('https://x/y/noext'), '');
});

test('metadata-only release is NOT an installable upgrade', () => {
  assert.equal(hasInstallableAsset([{ name: 'desktop-sources.v1.json' }], PKG_URLS), false);
});

test('empty release is NOT an installable upgrade', () => {
  assert.equal(hasInstallableAsset([], PKG_URLS), false);
});

test('release with matching exe/dmg IS an installable upgrade', () => {
  assert.equal(hasInstallableAsset([{ name: 'LobeHub-2.3.4-setup.exe' }], PKG_URLS), true);
  assert.equal(hasInstallableAsset([{ name: 'notes.txt' }, { name: 'LobeHub-2.3.4-arm64.dmg' }], PKG_URLS), true);
});

test('unrelated artifacts (source tarball only) are NOT installable', () => {
  assert.equal(hasInstallableAsset([{ name: 'source.zip' }], ['https://x/y/Setup.exe']), false);
});

test('fails open when package urls carry no extension info', () => {
  assert.equal(hasInstallableAsset([{ name: 'anything.bin' }], ['https://x/y/noext']), true);
});

test('fails open when release assets are missing entirely (API shape change)', () => {
  assert.equal(hasInstallableAsset(undefined, PKG_URLS), true);
});
