import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { gzipSync } from 'node:zlib';
import http from 'node:http';
import fs from 'node:fs';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { packageDigest, gzipContentDigest, probePackage } from '../scripts/lib/package-digest.mjs';
import { refreshArchive } from '../scripts/refresh-archive-sha.mjs';
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const payload = Buffer.from('source tar content '.repeat(100));
const a = gzipSync(payload, { level: 1 });
const b = gzipSync(payload, { level: 9 });
const pkg = { hashMode: 'content', contentSha256: sha(payload), sha256: sha(a), sizeBytes: a.length };

test('content wrappers, complete members, corruption and expansion limits', () => {
  assert.notDeepEqual(a, b);
  assert.equal(packageDigest(b, pkg).matches, true);
  assert.equal(packageDigest(b, { ...pkg, hashMode: 'bytes' }).matches, false);
  const extra = gzipSync('injected');
  const multi = Buffer.concat([b, extra]);
  assert.equal(packageDigest(multi, pkg).matches, false);
  assert.equal(gzipContentDigest(multi), sha(Buffer.concat([payload, Buffer.from('injected')])));
  const corrupt = Buffer.from(b); corrupt[corrupt.length - 8] ^= 1;
  for (const bad of [corrupt, b.subarray(0, -1), Buffer.concat([b, Buffer.from('junk')]), Buffer.concat([b, Buffer.from([0]), extra])]) {
    assert.throws(() => gzipContentDigest(bad));
  }
  assert.throws(() => gzipContentDigest(b, 10));
  assert.throws(() => packageDigest(b, { ...pkg, contentSha256: undefined }));
  assert.throws(() => packageDigest(b, { ...pkg, hashMode: 'typo' }));
});

test('probe GET ignores pinned compressed size but enforces transport, deadline and cap', async () => {
  const server = http.createServer((req, res) => {
    if (req.url === '/short') {
      res.writeHead(200, { 'Content-Length': b.length + 10 });
      res.write(b); res.socket.end();
    } else if (req.url === '/hang') {
      res.writeHead(200, { 'Content-Length': b.length }); res.flushHeaders();
    } else { res.writeHead(200, { 'Content-Length': b.length }); res.end(b); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await probePackage(base, pkg)).matches, true);
    await assert.rejects(probePackage(base + '/short', pkg));
    await assert.rejects(probePackage(base + '/hang', pkg, { timeoutMs: 80 }));
    await assert.rejects(probePackage(base, pkg, { maxInput: 1 }));
  } finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
});

test('probe and archive refresh both require a full HTTP 200 and enforce gzip header bounds', async () => {
  function withGzipFields(nameLength, commentLength) {
    const header = Buffer.from(b.subarray(0, 10));
    header[3] |= 8 | 16;
    return Buffer.concat([
      header, Buffer.alloc(nameLength, 0x61), Buffer.from([0]),
      Buffer.alloc(commentLength, 0x62), Buffer.from([0]), b.subarray(10),
    ]);
  }
  const range = `bytes 0-${b.length - 1}/${b.length + 100}`;
  const fixtures = {
    '/ok': { status: 200, body: b },
    '/created': { status: 201, body: b },
    '/partial': { status: 206, body: b, range },
    '/partial-no-range': { status: 206, body: b },
    '/range-on-200': { status: 200, body: b, range },
    '/max-fields': { status: 200, body: withGzipFields(65_535, 65_535) },
    '/long-name': { status: 200, body: withGzipFields(65_536, 0) },
    '/long-comment': { status: 200, body: withGzipFields(0, 65_536) },
  };
  const server = http.createServer((req, res) => {
    const { status, body, range } = fixtures[req.url];
    res.writeHead(status, { 'Content-Length': body.length, ...(range ? { 'Content-Range': range } : {}) });
    res.end(body);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const contentPkg = { ...pkg, id: 'demo' };
  const bytePkg = { ...contentPkg, hashMode: 'bytes' };
  const probe = (url, p) => probePackage(base + url, p);
  const refresh = (url, p) => refreshArchive(p, base + url, { tries: 1 });
  try {
    for (const [url, expected] of [
      ['/created', { status: 201 }],
      ['/partial', { status: 206 }],
      ['/partial-no-range', { status: 206 }],
      ['/range-on-200', /unexpected Content-Range/],
    ]) {
      for (const p of [contentPkg, bytePkg]) {
        await assert.rejects(probe(url, p), expected);
        await assert.rejects(refresh(url, p), expected);
      }
    }
    for (const url of ['/ok', '/max-fields']) {
      assert.equal((await probe(url, contentPkg)).matches, true);
      const updated = await refresh(url, contentPkg);
      assert.equal(updated.contentSha256, contentPkg.contentSha256);
      assert.equal(updated.sha256, sha(fixtures[url].body));
    }
    for (const url of ['/long-name', '/long-comment']) {
      await assert.rejects(probe(url, contentPkg), /gzip header field too long/);
      await assert.rejects(refresh(url, contentPkg), /gzip header field too long.*manual review required/);
    }
    assert.equal((await refresh('/ok', bytePkg)).sha256, sha(b));
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});

test('registry schema requires contentSha256 specifically in content mode', () => {
  const schema = JSON.parse(fs.readFileSync(new URL('../schemas/app.schema.json', import.meta.url)));
  const ajv = new Ajv({ strict: false }); addFormats(ajv);
  const validate = ajv.compile(schema);
  const app = JSON.parse(fs.readFileSync(new URL('../apps/aidog/app.json', import.meta.url)));
  assert.equal(validate(app), true);
  delete app.packages[0].contentSha256;
  assert.equal(validate(app), false);
  assert.ok(validate.errors.some((e) => e.params.missingProperty === 'contentSha256'));
  app.packages[0].hashMode = 'bytes';
  assert.equal(validate(app), true);
});
