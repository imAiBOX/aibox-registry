// Content-addressed download cache naming — single source of truth for the
// registry side. MUST stay structurally identical to:
//   - Rust: crates/aibox-core/src/download.rs :: content_name
//   - TS:   aibox-app/src/state/plan.ts      :: cacheFileName
// (changing one requires changing all three; see the doc comments there).
//
// Why this exists: install scripts receive `args` verbatim (no placeholder
// substitution happens at exec time), so any `cache/downloads/...` reference
// inside a script must already be the content-addressed name `<sha256><ext>`.

/** File name from a URL (query/hash stripped, last path segment). */
export function destNameOf(url) {
  const u = url.split('#')[0].split('?')[0];
  return u.slice(u.lastIndexOf('/') + 1);
}

/** `<sha256><ext>`; ext taken from destName (kept when it looks like one). */
export function cacheFileName(destName, sha256) {
  const sha = String(sha256 || '').trim().toLowerCase();
  const i = destName.lastIndexOf('.');
  const ext = i > 0 && i + 1 < destName.length ? destName.slice(i) : '';
  return `${sha}${ext}`;
}

/**
 * Expected cache file name for a package (first channel URL + package sha).
 *
 * `hashMode === "content"`（源码归档）：缓存名用 **内容摘要**（contentSha256）——
 * 因为安装器在 content 模式下也按内容摘要去校验，缓存名必须与校验用的一致。
 */
export function expectedCacheName(pkg) {
  const url = pkg?.channels?.[0]?.url;
  const sha = pkg?.hashMode === 'content' ? pkg?.contentSha256 || pkg?.sha256 : pkg?.sha256;
  if (!url || !sha) return null;
  return cacheFileName(destNameOf(url), sha);
}

/**
 * All `cache/downloads/<name>` references inside the package's install script.
 * Returns [{ ref, expected }] where ref !== expected marks a broken script
 * (the exec stage would fail with a missing-file error).
 */
export function badScriptRefs(pkg) {
  const expected = expectedCacheName(pkg);
  if (!expected) return [];
  const args = pkg?.install?.args || [];
  const out = [];
  for (const a of args) {
    if (typeof a !== 'string') continue;
    const re = /cache\/downloads\/([^\s";]+)/g;
    let m;
    while ((m = re.exec(a)) !== null) {
      if (m[1] !== expected) out.push({ ref: m[1], expected });
    }
    // bare placeholders (<dmg>, <download>, …) — nothing substitutes them
    for (const ph of a.match(/<[a-z]+>/gi) || []) {
      out.push({ ref: ph, expected });
    }
  }
  return out;
}
