#!/usr/bin/env node
// aibox-registry daily probe (minimal version, push + 04:00 UTC cron)
//
// Checks, for every apps/*/app.json:
//   1. every package channel: HEAD (10s timeout, 2 attempts)          → URL liveness
//   2. packages with sizeBytes < 5 MiB: re-download + sha256 compare  → integrity (S1)
//   3. GitHub releases/latest tag vs upstream.github[].tag            → version drift
//   4. npm dist-tags latest vs upstream.npm.version                   → version drift
//   5. every netConfig.proxyGateways[].prefix HEAD via a real asset   → gateway liveness (S3)
//
// Outputs (cwd):
//   probe-report.json  — full evidence for every check
//   drifts.json        — [{driftClass, kind, title, body, ...}] items consumed by
//                        the workflow: driftClass 'A' (new upstream version) is
//                        turned into a PR by scripts/auto-bump.mjs; 'B'
//                        (content/liveness/gateway problems) is filed as an
//                        issue (label upstream-drift)
// Exit code is always 0 on completed runs; the workflow turns drifts into issues + red run.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TIMEOUT_MS = 10_000;
const RETRIES = 3;
const SMALL_FILE_BYTES = 5 * 1024 * 1024;
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const now = () => new Date().toISOString();

const report = { startedAt: now(), checks: [], errors: [] };
const drifts = [];

function addDrift(kind, title, body, extra = {}) {
  drifts.push({ kind, ...extra, title: `[upstream-drift] ${title}`, body });
}
// A-class = upstream shipped a new version (auto-bump opens a PR);
// B-class = same-version content/liveness problem (stays an issue, never auto-fixed)
const B = (app) => ({ driftClass: 'B', ...(app ? { app } : {}) });

async function timedFetch(url, opts = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal, redirect: 'follow' });
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(fn) {
  let lastErr;
  for (let i = 0; i <= RETRIES; i++) {
    try {
      const r = await fn();
      if (r.ok) return r;
      // 4xx/5xx: retry once (CDN blips), then treat as definitive failure
      lastErr = new Error(`HTTP ${r.status}`);
      lastErr.status = r.status;
      if (i === RETRIES) return r;
    } catch (e) {
      lastErr = e;
      if (i === RETRIES) throw e;
    }
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  throw lastErr;
}

async function head(url) {
  const res = await withRetry(() => timedFetch(url, { method: 'HEAD' }));
  if (!res.ok) throw Object.assign(new Error(`HEAD ${res.status}`), { status: res.status });
  return { status: res.status, contentLength: res.headers.get('content-length') };
}

async function sha256Of(url) {
  const res = await withRetry(() => timedFetch(url, { method: 'GET' }));
  if (!res.ok) throw Object.assign(new Error(`GET ${res.status}`), { status: res.status });
  const buf = Buffer.from(await res.arrayBuffer());
  return { sha256: crypto.createHash('sha256').update(buf).digest('hex'), bytes: buf.length };
}

function ghHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'aibox-registry-probe',
    ...(GH_TOKEN ? { Authorization: `Bearer ${GH_TOKEN}` } : {}),
  };
}

// ---------------------------------------------------------------- load data
const apps = [];
for (const dir of fs.readdirSync(path.join(root, 'apps'))) {
  const p = path.join(root, 'apps', dir, 'app.json');
  if (fs.existsSync(p)) apps.push({ dir, app: JSON.parse(fs.readFileSync(p, 'utf8')) });
}
if (apps.length === 0) {
  console.error('no apps/*/app.json found');
  process.exit(1);
}

// ------------------------------------------------- 1+2: channel liveness / integrity
for (const { dir, app } of apps) {
  for (const pkg of app.packages || []) {
    const wantDownload = Number.isInteger(pkg.sizeBytes) && pkg.sizeBytes < SMALL_FILE_BYTES;
    for (const ch of pkg.channels || []) {
      const check = {
        type: 'channel', app: dir, package: pkg.id, channel: ch.type,
        url: ch.url, checkedAt: now(), sha256Checked: false,
      };
      try {
        const h = await head(ch.url);
        check.status = h.status;
        if (wantDownload) {
          const { sha256, bytes } = await sha256Of(ch.url);
          check.sha256Checked = true;
          check.bytes = bytes;
          if (sha256 !== pkg.sha256) {
            check.status = 'SHA256_MISMATCH';
            addDrift('integrity',
              `${dir}: sha256 mismatch ${pkg.id} (${ch.type})`,
              `Channel \`${ch.url}\` returned content whose sha256 does not match the registry record.\n\n` +
              `- expected: \`${pkg.sha256}\`\n- actual:   \`${sha256}\`\n- bytes: ${bytes} / ${pkg.sizeBytes}\n\n` +
              `Hash provenance: ${pkg.hashSource || 'n/a'}\nChecked at: ${check.checkedAt}`,
              B(dir));
          }
        } else if (h.contentLength && Number(h.contentLength) !== pkg.sizeBytes) {
          check.status = 'SIZE_MISMATCH';
          addDrift('integrity',
            `${dir}: size mismatch ${pkg.id} (${ch.type})`,
            `Channel \`${ch.url}\` Content-Length ${h.contentLength} != recorded sizeBytes ${pkg.sizeBytes}.\n` +
            `Checked at: ${check.checkedAt}`,
            B(dir));
        }
      } catch (e) {
        check.status = e.status ? `HTTP_${e.status}` : 'UNREACHABLE';
        check.error = String(e.message || e).slice(0, 200);
        addDrift('liveness',
          `${dir}: channel down — ${pkg.id} (${ch.type})`,
          `HEAD failed after ${RETRIES} retries.\n\n- package: \`${pkg.id}\`\n- channel: \`${ch.type}\`\n` +
          `- url: ${ch.url}\n- error: \`${check.error}\`\n- recorded sha256: \`${pkg.sha256}\`\n\n` +
          `Checked at: ${check.checkedAt}\nIf this endpoint is permanently gone, update app.json (or retire the channel) in a PR.`,
          B(dir));
      }
      report.checks.push(check);
      process.stdout.write('.');
    }
  }
}

// ------------------------------------------------- 3: GitHub release drift
for (const { dir, app } of apps) {
  for (const ref of app.upstream?.github || []) {
    const url = `https://api.github.com/repos/${ref.repo}/releases/latest`;
    const check = { type: 'github-release', app: dir, repo: ref.repo, expected: ref.tag, checkedAt: now() };
    try {
      const res = await withRetry(() => timedFetch(url, { headers: ghHeaders() }));
      if (!res.ok) {
        if (res.status === 404 || res.status === 403 || res.status === 429) {
          // can't conclude drift — record as error, don't file an issue
          check.status = `API_${res.status}`;
          report.errors.push(`${dir}: GitHub API ${res.status} for ${ref.repo} (rate-limited or repo moved?)`);
        } else {
          check.status = `HTTP_${res.status}`;
          addDrift('version', `${dir}: GitHub releases/latest unreachable — ${ref.repo}`,
            `GET ${url} → ${res.status} after retries.\nChecked at: ${check.checkedAt}`,
            B(dir));
        }
      } else {
        const data = await res.json();
        check.actual = data.tag_name;
        check.status = data.tag_name === ref.tag ? 'ok' : 'DRIFT';
        if (data.tag_name !== ref.tag) {
          addDrift('version', `${dir}: upstream ${ref.repo} released ${data.tag_name} (registry has ${ref.tag})`,
            `New upstream release detected — auto-bump measures the new artifacts and opens a PR for review.\n\n` +
            `- repo: \`${ref.repo}\`\n- registry tag: \`${ref.tag}\`\n` +
            `- upstream latest: \`${data.tag_name}\`\n- published: ${data.published_at}\n\n` +
            `If no bump PR appears, update app.json manually (version / channels sha256 & sizeBytes / upstream tag), review, merge — effective ≤12h across site + installer.\nChecked at: ${check.checkedAt}`,
            { driftClass: 'A', app: dir, source: 'github', repo: ref.repo,
              currentTag: ref.tag, latestTag: data.tag_name, publishedAt: data.published_at });
        }
      }
    } catch (e) {
      check.status = 'UNREACHABLE';
      check.error = String(e.message || e).slice(0, 200);
      report.errors.push(`${dir}: GitHub API error for ${ref.repo}: ${check.error}`);
    }
    report.checks.push(check);
    process.stdout.write('.');
  }
}

// ------------------------------------------------- 4: npm dist-tag drift
for (const { dir, app } of apps) {
  const ref = app.upstream?.npm;
  if (!ref) continue;
  const url = `https://registry.npmjs.org/${encodeURIComponent(ref.name)}/latest`;
  const check = { type: 'npm-latest', app: dir, package: ref.name, expected: ref.version, checkedAt: now() };
  try {
    const res = await withRetry(() => timedFetch(url, { headers: { 'User-Agent': 'aibox-registry-probe' } }));
    if (!res.ok) {
      check.status = `HTTP_${res.status}`;
      addDrift('version', `${dir}: npm registry latest unreachable — ${ref.name}`,
        `GET ${url} → ${res.status} after retries.\nChecked at: ${check.checkedAt}`,
        B(dir));
    } else {
      const data = await res.json();
      check.actual = data.version;
      check.status = data.version === ref.version ? 'ok' : 'DRIFT';
      if (data.version !== ref.version) {
        addDrift('version', `${dir}: npm ${ref.name} ${data.version} published (registry has ${ref.version})`,
          `New npm version detected — auto-bump measures the new tarball and opens a PR for review.\n\n` +
          `- package: \`${ref.name}\`\n- registry: \`${ref.version}\`\n- npm latest: \`${data.version}\`\n\n` +
          `If no bump PR appears, update app.json manually (upstream.npm.version + affected package version/sha256/channels/install args), review, merge.\nChecked at: ${check.checkedAt}`,
          { driftClass: 'A', app: dir, source: 'npm', package: ref.name,
            currentTag: ref.version, latestTag: data.version });
      }
    }
  } catch (e) {
    check.status = 'UNREACHABLE';
    report.errors.push(`${dir}: npm registry error for ${ref.name}: ${e.message}`);
  }
  report.checks.push(check);
  process.stdout.write('.');
}

// ------------------------------------------------- 5: proxy gateway liveness (S3)
let gatewayTarget = null;
for (const { app } of apps) {
  for (const pkg of app.packages || []) {
    // GitHub source archives redirect to codeload and answer HEAD without a
    // Content-Length header — they can never prove gateway liveness, so
    // prefer asset/release URLs when picking the shared probe target.
    const direct = (pkg.channels || []).find(
      (c) => c.type === 'direct' && c.url.includes('github.com') && !c.url.includes('/archive/')
    );
    if (direct) { gatewayTarget = direct.url; break; }
  }
  if (gatewayTarget) break;
}
for (const { dir, app } of apps) {
  for (const gw of app.netConfig?.proxyGateways || []) {
    const check = { type: 'proxy-gateway', prefix: gw.prefix, target: gatewayTarget, checkedAt: now() };
    try {
      if (!gatewayTarget) throw new Error('no GitHub direct URL available as probe target');
      const h = await head(gw.prefix + gatewayTarget);
      check.status = h.status === 200 && h.contentLength ? 'active' : 'degraded';
      if (check.status !== 'active') {
        addDrift('gateway', `netConfig gateway ${gw.prefix} returned HTTP ${h.status}`,
          `Gateway \`${gw.prefix}\` answered ${h.status} without a content length for\n${gw.prefix}${gatewayTarget}\nChecked at: ${check.checkedAt}`,
          B(dir));
      }
    } catch (e) {
      check.status = 'unreachable';
      check.error = String(e.message || e).slice(0, 200);
      addDrift('gateway', `netConfig gateway down — ${gw.prefix}`,
        `HEAD failed after ${RETRIES} retries.\n\n- prefix: \`${gw.prefix}\`\n- probe url: ${gw.prefix}${gatewayTarget}\n` +
        `- error: \`${check.error}\`\n- recorded status: ${gw.status} (checkedAt ${gw.checkedAt})\n\n` +
        `Checked at: ${check.checkedAt}\nIf permanently dead: PR setting status=retired (S3 hot-updatable list).`,
        B(dir));
    }
    report.checks.push(check);
    process.stdout.write('.');
  }
}

// ------------------------------------------------- write outputs
report.finishedAt = now();
report.summary = {
  totalChecks: report.checks.length,
  drifts: drifts.length,
  errors: report.errors.length,
};
fs.writeFileSync(path.join(root, 'probe-report.json'), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(root, 'drifts.json'), JSON.stringify(drifts, null, 2));

console.log(`\nprobe: ${report.checks.length} checks, ${drifts.length} drift(s), ${report.errors.length} error(s)`);
if (report.errors.length) {
  for (const e of report.errors) console.log('  ! ' + e);
}
if (drifts.length) {
  for (const d of drifts) console.log('  ✗ ' + d.title);
}
process.exit(0);
