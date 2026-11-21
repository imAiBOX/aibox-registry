// Same bounds/policy as aibox-net::digest. Content mode hashes ALL gzip members.
import crypto from 'node:crypto';
import { crc32, inflateRawSync } from 'node:zlib';
export const MAX_GZIP_BYTES = 32 * 1024 * 1024;
export const MAX_CONTENT_BYTES = 128 * 1024 * 1024;
const MAX_GZIP_HEADER_FIELD_BYTES = 65_535; // flate2's maximum, excluding the terminating NUL

export function digestPolicy(pkg) {
  const mode = pkg.hashMode ?? 'bytes';
  if (!['bytes', 'content'].includes(mode)) throw new Error('unknown hashMode');
  const expected = mode === 'content' ? pkg.contentSha256 : pkg.sha256;
  if (!/^[a-f0-9]{64}$/.test(expected ?? '')) throw new Error(`missing/invalid ${mode === 'content' ? 'contentSha256' : 'sha256'}`);
  return { mode, expected };
}

// Node's gunzip accepts zero padding and can silently ignore data after it.
// Parse member boundaries explicitly to reject unauthenticated trailing bytes.
export function gzipContentDigest(buf, maxOutput = MAX_CONTENT_BYTES) {
  if (buf.length > MAX_GZIP_BYTES) throw new Error('gzip input limit exceeded');
  const hash = crypto.createHash('sha256');
  let pos = 0, total = 0, members = 0;
  const need = (n) => { if (pos + n > buf.length) throw new Error('truncated gzip'); };
  do {
    const start = pos;
    need(10);
    if (buf[pos] !== 31 || buf[pos + 1] !== 139 || buf[pos + 2] !== 8 || (buf[pos + 3] & 0xe0)) throw new Error('invalid gzip header/trailing data');
    const flags = buf[pos + 3];
    pos += 10;
    if (flags & 4) { need(2); const n = buf.readUInt16LE(pos); pos += 2; need(n); pos += n; }
    for (const flag of [8, 16]) { // FNAME and FCOMMENT have independent limits.
      if (!(flags & flag)) continue;
      const field = buf.subarray(pos, pos + MAX_GZIP_HEADER_FIELD_BYTES + 1);
      const end = field.indexOf(0);
      if (end === -1) {
        if (field.length > MAX_GZIP_HEADER_FIELD_BYTES) throw new Error('gzip header field too long');
        throw new Error('truncated gzip');
      }
      pos += end + 1;
    }
    if (flags & 2) {
      need(2);
      if ((crc32(buf.subarray(start, pos)) & 0xffff) !== buf.readUInt16LE(pos)) throw new Error('gzip header CRC mismatch');
      pos += 2;
    }
    // Bounded output allocation even for a hostile compression bomb.
    const { buffer, engine } = inflateRawSync(buf.subarray(pos), { info: true, maxOutputLength: Math.max(1, maxOutput - total + 1) });
    total += buffer.length;
    if (total > maxOutput) throw new Error('gzip expansion limit exceeded');
    pos += engine.bytesWritten;
    need(8);
    if (crc32(buffer) !== buf.readUInt32LE(pos) || (buffer.length >>> 0) !== buf.readUInt32LE(pos + 4)) throw new Error('gzip CRC/size mismatch');
    pos += 8;
    members++;
    hash.update(buffer);
  } while (pos < buf.length);
  if (!members) throw new Error('empty gzip');
  return hash.digest('hex');
}

export function packageDigest(buf, pkg) {
  const { mode, expected } = digestPolicy(pkg);
  const sha256 = mode === 'content' ? gzipContentDigest(buf) : crypto.createHash('sha256').update(buf).digest('hex');
  return { sha256, bytes: buf.length, matches: sha256 === expected, mode, expected };
}

// Full-package GET only. The deadline covers headers and body.
export async function downloadFullPackage(url, { timeoutMs = 10_000, maxInput = MAX_GZIP_BYTES, userAgent } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const headers = { 'Accept-Encoding': 'identity' };
  if (userAgent) headers['User-Agent'] = userAgent;
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers, redirect: 'follow' });
    if (res.status !== 200) throw Object.assign(new Error(`GET ${res.status}`), { status: res.status });
    if (res.headers.has('content-range')) throw new Error('unexpected Content-Range on full-package GET');
    if (res.headers.get('content-encoding') && res.headers.get('content-encoding') !== 'identity') throw new Error('unexpected transport content-encoding');
    const rawLength = res.headers.get('content-length');
    const length = rawLength === null ? null : Number(rawLength);
    if (length !== null && (!Number.isSafeInteger(length) || length < 0 || length > maxInput)) throw new Error('invalid/excessive transport length');
    const chunks = [];
    let bytes = 0;
    for await (const chunk of res.body) {
      bytes += chunk.length;
      if (bytes > maxInput) throw new Error('download input limit exceeded');
      chunks.push(chunk);
    }
    if (length !== null && length !== bytes) throw new Error('transport length mismatch');
    return Buffer.concat(chunks, bytes);
  } finally {
    ctrl.abort();
    clearTimeout(timer);
  }
}

export async function probePackage(url, pkg, options) {
  digestPolicy(pkg);
  return packageDigest(await downloadFullPackage(url, options), pkg);
}
