// Should an upstream tag bump be treated as an installable upgrade?
//
// Upstreams sometimes publish a new tag with no desktop artifacts at all
// (metadata-only release, source tarball only, moved packaging to nightly).
// Reporting those as A-class upgrades would keep the probe red forever with
// nothing to bump — so a bump is only "installable" when the new release
// carries at least one asset whose extension matches one of the registry
// package URLs (e.g. .exe / .dmg / .zip / .tar.gz).

/** Extension of a URL's file name (lowercased, includes the dot). '' if none. */
export function urlExt(url) {
  const dn = String(url || '').split('?')[0].split('#')[0].split('/').pop() || '';
  const i = dn.lastIndexOf('.');
  return i > 0 ? dn.slice(i).toLowerCase() : '';
}

/**
 * @param {Array<{name?: string}>} releaseAssets assets of the NEW upstream release
 * @param {string[]} packageUrls channels[0].url of the registry packages
 * @returns {boolean} true when at least one asset extension matches a package
 *                    URL extension (or there is nothing to compare — fail open,
 *                    so a weird layout still gets reported as a bump).
 */
export function hasInstallableAsset(releaseAssets, packageUrls) {
  const exts = [...new Set((packageUrls || []).map(urlExt).filter(Boolean))];
  if (exts.length === 0) return true; // no extension info — don't suppress
  if (releaseAssets == null) return true; // assets field missing (API shape change) — fail open
  const assets = Array.isArray(releaseAssets) ? releaseAssets : [];
  if (assets.length === 0) return false; // empty release — nothing to install
  return assets.some((a) => {
    const n = String(a?.name || '').toLowerCase();
    return exts.some((e) => n.endsWith(e));
  });
}
