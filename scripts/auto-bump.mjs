#!/usr/bin/env node
// auto-bump — turn A-class probe drifts (new upstream version) into review PRs.
//
// Drift classes (drifts.json, written by scripts/probe.mjs):
//   A (driftClass: 'A') — upstream published a new release tag / npm version.
//      This script measures the new artifacts, updates apps/<id>/app.json,
//      validates + re-HEADs every channel (0 failures), then pushes branch
//      chore/upstream-<app>-<version> and opens a PR for human review.
//   B (everything else) — same-version content mismatch, dead channel, dead
//      gateway. Never edited here: a same-version content change is a possible
//      tampering signal and always stays an issue for a human.
//
// Idempotency: if an open PR already exists for chore/upstream-<app>-, the
// group is skipped (the PR is the reminder; the run still fails until merge).
//
// Usage:
//   node scripts/auto-bump.mjs [--dry-run] [--drifts <path>]
//     --dry-run   measure + edit + validate + re-HEAD, then restore the file;
//                 no git/gh operations, no writes to drifts.json / auto-bumps.json
//
// Exports below are pure helpers covered by test/auto-bump.test.mjs.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TIMEOUT_MS = 10_000;
const DOWNLOAD_TIMEOUT_MS = 600_000;
const RETRIES = 3;
const BRANCH_PREFIX = 'chore/upstream-';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const nowIso = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

// ============================================================ pure helpers

export function stripV(v) {
  return typeof v === 'string' && v.startsWith('v') ? v.slice(1) : v;
}

export function semverTriple(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(stripV(String(v)));
  return m ? `${m[1]}.${m[2]}.${m[3]}` : null;
}

/** Version-token replacements for a drift: longest tokens first, deduped. */
export function tokenPairs(drift) {
  const cur = String(drift.currentTag);
  const lat = String(drift.latestTag);
  const raw = [[cur, lat]];
  const sc = stripV(cur);
  const sl = stripV(lat);
  if (sc !== cur) raw.push([sc, sl]);
  const tc = semverTriple(cur);
  const tl = semverTriple(lat);
  if (tc && tl && tc !== tl) raw.push([tc, tl]);
  const seen = new Set();
  const out = [];
  for (const [o, n] of raw) {
    if (o === n || o.length < 4 || seen.has(o)) continue;
    seen.add(o);
    out.push([o, n]);
  }
  out.sort((a, b) => b[0].length - a[0].length);
  return out;
}

export function applyTokens(str, pairs) {
  let s = String(str);
  for (const [o, n] of pairs) s = s.split(o).join(n);
  return s;
}

/** A = new upstream version (auto PR), B = everything else (issue flow). */
export function classifyDrift(d) {
  return d && d.driftClass === 'A' ? 'A' : 'B';
}

function dedupePairs(pairs) {
  const seen = new Set();
  const out = [];
  for (const [o, n] of pairs) {
    if (o === n || seen.has(o)) continue;
    seen.add(o);
    out.push([o, n]);
  }
  out.sort((a, b) => b[0].length - a[0].length);
  return out;
}

const isCustomChannel = (u) => !u.includes('github.com/') && !u.includes('/-/');

/**
 * Packages whose artifacts belong to the drifted source:
 *  - github drift: a channel under github.com/<repo>/ carrying a version token,
 *    or an "app"-kind package distributed entirely off-GitHub (vendor CDN /
 *    vendor install endpoints — those are the app's own release artifacts).
 *  - npm drift: a channel under /<name>/-/ (registry tarball), same custom rule.
 * runtime/dependency packages (Node, Git) are never touched by the custom rule.
 */
export function selectAffectedPackages(app, drift, pairs) {
  const tokens = pairs.map((p) => p[0]);
  const hasToken = (u) => tokens.some((t) => u.includes(t));
  const mark = drift.source === 'github'
    ? `github.com/${drift.repo}/`
    : `/${drift.package}/-/`;
  const affected = [];
  for (const pkg of app.packages || []) {
    const urls = (pkg.channels || []).map((c) => c.url);
    if (urls.length === 0) continue;
    if (urls.some((u) => u.includes(mark) && hasToken(u))) { affected.push(pkg.id); continue; }
    if (pkg.kind === 'app' && urls.every(isCustomChannel)) affected.push(pkg.id);
  }
  return affected;
}

/**
 * Build the edit plan for one app's A-class drifts.
 * Returns { stale: true } when every drift is already reflected in app.json.
 */
export function planBump(app, drifts) {
  const entries = [];
  for (const d of drifts) {
    if (d.source === 'github') {
      const ref = (app.upstream?.github || []).find((g) => g.repo === d.repo);
      if (!ref || ref.tag === d.latestTag) continue; // already current
      const norm = { ...d, currentTag: ref.tag };
      const pairs = tokenPairs(norm);
      entries.push({ drift: norm, pairs, affected: selectAffectedPackages(app, norm, pairs) });
    } else if (d.source === 'npm') {
      const ref = app.upstream?.npm;
      if (!ref || ref.version === d.latestTag) continue;
      const norm = { ...d, currentTag: ref.version };
      const pairs = tokenPairs(norm);
      entries.push({ drift: norm, pairs, affected: selectAffectedPackages(app, norm, pairs) });
    }
    // unknown source → not bumpable here, treated as stale/skip
  }
  if (entries.length === 0) return { stale: true, entries: [] };
  const pairs = dedupePairs(entries.flatMap((e) => e.pairs));
  const affected = [...new Set(entries.flatMap((e) => e.affected))];
  const primary = (entries.find((e) => e.drift.source === 'github') || entries[0]).drift;
  return {
    stale: false,
    entries,
    pairs,
    affected,
    rawVersion: stripV(primary.latestTag),
    oldVersion: app.version,
  };
}

export function branchName(appId, rawVersion) {
  return `${BRANCH_PREFIX}${appId}-${String(rawVersion).replace(/[^A-Za-z0-9._-]/g, '-')}`;
}

/** Apply a plan to an app object. Pure: clones, never mutates the input. */
export function applyBump(app, plan, evidence, stamp) {
  const out = JSON.parse(JSON.stringify(app));
  for (const e of plan.entries) {
    if (e.drift.source === 'github') {
      const ref = (out.upstream?.github || []).find((g) => g.repo === e.drift.repo);
      if (ref) ref.tag = e.drift.latestTag;
    } else if (e.drift.source === 'npm' && out.upstream?.npm) {
      out.upstream.npm.version = e.drift.latestTag;
    }
  }
  out.version = applyTokens(out.version, plan.pairs);
  out.updatedAt = stamp;
  for (const pkg of out.packages || []) {
    if (!plan.affected.includes(pkg.id)) continue;
    const entry = plan.entries.find((e) => e.affected.includes(pkg.id));
    // package version: token-replace first; stale values (older than the
    // recorded tag) fall back to the new raw version of the drifting source
    let nv = applyTokens(pkg.version, plan.pairs);
    if (nv === pkg.version) nv = stripV(entry.drift.latestTag);
    const argPairs = nv !== pkg.version ? [...plan.pairs, [pkg.version, nv]] : plan.pairs;
    for (const ch of pkg.channels || []) ch.url = applyTokens(ch.url, plan.pairs);
    if (Array.isArray(pkg.install?.args)) {
      pkg.install.args = pkg.install.args.map((a) =>
        typeof a === 'string' ? applyTokens(a, argPairs) : a);
    }
    pkg.version = nv;
    const ev = evidence[pkg.id];
    if (ev) {
      pkg.sha256 = ev.sha256;
      pkg.sizeBytes = ev.sizeBytes;
      pkg.hashSource = ev.hashSource;
    }
  }
  return out;
}

/**
 * Minimal-diff text patch: splice only the scalar values that changed into the
 * original file text (keeps compact one-line arrays/objects and the original
 * trailing-newline convention intact — no whole-file reformatting in PRs).
 */
function jsonTokens(text) {
  const toks = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    const c = text[i];
    if (c === ' ' || c === '\n' || c === '\r' || c === '\t') { i++; continue; }
    if ('{}[],:'.includes(c)) { toks.push({ t: c, s: i, e: i + 1 }); i++; continue; }
    if (c === '"') {
      let j = i + 1;
      while (j < n) {
        if (text[j] === '\\') { j += 2; continue; }
        if (text[j] === '"') { j++; break; }
        j++;
      }
      toks.push({ t: 'str', s: i, e: j });
      i = j;
      continue;
    }
    let j = i;
    while (j < n && !' \n\r\t{},:[]'.includes(text[j])) j++;
    toks.push({ t: 'lit', s: i, e: j });
    i = j;
  }
  return toks;
}

function parsePos(text) {
  const toks = jsonTokens(text);
  let p = 0;
  const val = () => {
    const tk = toks[p];
    if (!tk) throw new Error('unexpected end of JSON text');
    if (tk.t === '{') {
      p++;
      const children = {};
      while (toks[p] && toks[p].t !== '}') {
        if (toks[p].t !== 'str') throw new Error('expected object key');
        const key = JSON.parse(text.slice(toks[p].s, toks[p].e));
        p++;
        if (!toks[p] || toks[p].t !== ':') throw new Error('expected ":"');
        p++;
        children[key] = val();
        if (toks[p] && toks[p].t === ',') p++;
      }
      const node = { type: 'obj', children, s: tk.s, e: toks[p] ? toks[p].e : tk.e };
      p++;
      return node;
    }
    if (tk.t === '[') {
      p++;
      const arr = [];
      while (toks[p] && toks[p].t !== ']') {
        arr.push(val());
        if (toks[p] && toks[p].t === ',') p++;
      }
      const node = { type: 'arr', arr, s: tk.s, e: toks[p] ? toks[p].e : tk.e };
      p++;
      return node;
    }
    if (tk.t === 'str' || tk.t === 'lit') { p++; return { type: tk.t, s: tk.s, e: tk.e }; }
    throw new Error(`unexpected token ${tk.t}`);
  };
  const root = val();
  if (p !== toks.length) throw new Error('trailing tokens in JSON text');
  return root;
}

function collectChanges(before, after, node, path, out) {
  if (before === after) return;
  if (Array.isArray(before) && Array.isArray(after)) {
    if (!node || node.type !== 'arr' || node.arr.length !== before.length) {
      throw new Error(`array shape mismatch at ${path}`);
    }
    after.forEach((v, i) => collectChanges(before[i], v, node.arr[i], `${path}[${i}]`, out));
    return;
  }
  if (before && after && typeof before === 'object' && typeof after === 'object') {
    for (const k of Object.keys(before)) {
      if (!(k in after)) throw new Error(`key removed at ${path}.${k}`);
      if (!node || !node.children || !node.children[k]) throw new Error(`missing text node at ${path}.${k}`);
      collectChanges(before[k], after[k], node.children[k], `${path}.${k}`, out);
    }
    return;
  }
  if (after === undefined) throw new Error(`leaf removed at ${path}`);
  out.push({ path, node, old: before, new: after });
}

export function applyTextPatch(origText, before, after) {
  const root = parsePos(origText);
  const changes = [];
  collectChanges(before, after, root, '', changes);
  if (changes.length === 0) return origText;
  changes.sort((a, b) => b.node.s - a.node.s);
  let text = origText;
  for (const c of changes) {
    text = text.slice(0, c.node.s) + JSON.stringify(c.new) + text.slice(c.node.e);
  }
  return text;
}

export function buildPrBody(app, plan, evidence, verification, stamp) {
  const L = [];
  L.push(`Automated bump of \`${app.id}\`: ${plan.oldVersion} → ${verification.newVersion}.`);
  L.push('');
  L.push('### Upstream change(s)');
  L.push('| source | recorded | upstream |');
  L.push('|---|---|---|');
  for (const e of plan.entries) {
    if (e.drift.source === 'github') {
      L.push(`| github \`${e.drift.repo}\` | \`${e.drift.currentTag}\` | \`${e.drift.latestTag}\`${e.drift.publishedAt ? ` (published ${e.drift.publishedAt})` : ''} |`);
    } else {
      L.push(`| npm \`${e.drift.package}\` | \`${e.drift.currentTag}\` | \`${e.drift.latestTag}\` |`);
    }
  }
  L.push('');
  L.push('### Measured evidence (old → new)');
  L.push('| package | sha256 | sizeBytes | method |');
  L.push('|---|---|---|---|');
  for (const id of plan.affected) {
    const ev = evidence[id];
    if (!ev) continue;
    L.push(`| ${id} | \`${ev.old.sha256.slice(0, 16)}…\` → \`${ev.sha256.slice(0, 16)}…\` | ${ev.old.sizeBytes} → ${ev.sizeBytes} | ${ev.method} |`);
  }
  L.push('');
  L.push('Download sources (new):');
  for (const id of plan.affected) {
    const ev = evidence[id];
    if (ev) L.push(`- ${id}: ${ev.url}`);
  }
  L.push('');
  L.push('### Verification');
  L.push('- `scripts/validate.mjs`: passed');
  L.push(`- channel re-HEAD after bump: ${verification.ok}/${verification.total} OK (Content-Length == sizeBytes where reported), 0 failures`);
  L.push(`- measured at ${stamp}`);
  L.push('');
  L.push('Opened automatically by the daily liveness probe; please review the evidence table before merging.');
  return L.join('\n');
}

// ============================================================ network helpers

async function timedFetch(url, opts = {}, timeoutMs = TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
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
      lastErr = new Error(`HTTP ${r.status}`);
      lastErr.status = r.status;
      if (i === RETRIES) return r;
    } catch (e) {
      lastErr = e;
      if (i === RETRIES) throw e;
    }
    await sleep(1500 * (i + 1));
  }
  throw lastErr;
}

function ghHeaders() {
  const tok = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
  return {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'aibox-registry-auto-bump',
    ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
  };
}

async function head(url) {
  const res = await withRetry(() => timedFetch(url, { method: 'HEAD' }));
  if (!res.ok) throw Object.assign(new Error(`HEAD ${res.status}`), { status: res.status });
  return { status: res.status, contentLength: res.headers.get('content-length') };
}

async function downloadSha(url) {
  let lastErr;
  for (let i = 0; i <= RETRIES; i++) {
    try {
      const res = await timedFetch(url, {}, DOWNLOAD_TIMEOUT_MS);
      if (!res.ok) throw Object.assign(new Error(`GET ${res.status}`), { status: res.status });
      if (!res.body) throw new Error('empty response body');
      const hash = crypto.createHash('sha256');
      let bytes = 0;
      const reader = res.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        hash.update(value);
        bytes += value.length;
      }
      if (bytes === 0) throw new Error('zero-byte download');
      return { sha256: hash.digest('hex'), bytes };
    } catch (e) {
      lastErr = e;
      if (i === RETRIES) throw e;
      await sleep(1500 * (i + 1));
    }
  }
  throw lastErr;
}

const releaseCache = new Map();
async function releaseFor(repo, tag) {
  const key = `${repo}@${tag}`;
  if (releaseCache.has(key)) return releaseCache.get(key);
  let data = null;
  try {
    let res = await withRetry(() =>
      timedFetch(`https://api.github.com/repos/${repo}/releases/latest`, { headers: ghHeaders() }));
    if (res.ok) {
      const j = await res.json();
      if (j.tag_name === tag) data = j;
    }
    if (!data) {
      res = await withRetry(() =>
        timedFetch(`https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`,
          { headers: ghHeaders() }));
      if (res.ok) data = await res.json();
    }
  } catch {
    data = null;
  }
  releaseCache.set(key, data);
  return data;
}

// ============================================================ process helpers

function sh(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', cwd: root, ...opts });
  if (r.error) return { ok: false, out: '', err: String(r.error.message) };
  return { ok: r.status === 0, out: r.stdout || '', err: r.stderr || '' };
}
const git = (args) => sh('git', args);

async function measureAll(app, plan) {
  const evidence = {};
  for (const id of plan.affected) {
    const pkg = (app.packages || []).find((p) => p.id === id);
    if (!pkg || !(pkg.channels || []).length) continue;
    const direct = pkg.channels.find((c) => c.type === 'direct') || pkg.channels[0];
    const entry = plan.entries.find((e) => e.affected.includes(id));
    const newUrl = applyTokens(direct.url, entry.pairs);
    let ev = null;
    if (entry.drift.source === 'github' &&
        newUrl.includes(`github.com/${entry.drift.repo}/releases/download/`)) {
      const rel = await releaseFor(entry.drift.repo, entry.drift.latestTag);
      const assetName = newUrl.split('/').pop().split('?')[0];
      const asset = (rel?.assets || []).find((a) => a.name === assetName);
      const m = asset && /^sha256:([0-9a-f]{64})$/.exec(asset.digest || '');
      if (m && Number.isInteger(asset.size) && asset.size > 0) {
        ev = {
          sha256: m[1], sizeBytes: asset.size, url: newUrl,
          method: 'GitHub API release asset digest',
        };
      }
    }
    if (!ev) {
      const dl = await downloadSha(newUrl);
      ev = {
        sha256: dl.sha256, sizeBytes: dl.bytes, url: newUrl,
        method: `full download sha256 (${new URL(newUrl).host})`,
      };
    }
    ev.old = { sha256: pkg.sha256, sizeBytes: pkg.sizeBytes };
    ev.hashSource = ev.method.startsWith('GitHub')
      ? `GitHub API release asset digest (measured ${nowIso().slice(0, 10)} UTC by auto-bump CI)`
      : `Full download sha256 measured ${nowIso().slice(0, 10)} UTC by auto-bump CI (source ${new URL(newUrl).host})`;
    evidence[id] = ev;
  }
  return evidence;
}

async function verifyChannels(edited, plan) {
  const failures = [];
  let total = 0;
  for (const id of plan.affected) {
    const pkg = (edited.packages || []).find((p) => p.id === id);
    for (const ch of pkg?.channels || []) {
      total++;
      try {
        const h = await head(ch.url);
        if (h.contentLength && Number(h.contentLength) !== pkg.sizeBytes) {
          failures.push(`${id}/${ch.type}: Content-Length ${h.contentLength} != ${pkg.sizeBytes}`);
        }
      } catch (e) {
        failures.push(`${id}/${ch.type}: ${String(e.message || e).slice(0, 120)}`);
      }
    }
  }
  return { total, ok: total - failures.length, failures };
}

function runValidate() {
  return sh(process.execPath, [path.join(root, 'scripts', 'validate.mjs')]);
}

function findOpenBumpPr(appId) {
  const r = sh('gh', ['pr', 'list', '--state', 'open', '--limit', '100',
    '--json', 'headRefName,url,number']);
  if (!r.ok) throw new Error(`gh pr list failed: ${r.err.slice(0, 200)}`);
  let prs;
  try { prs = JSON.parse(r.out); } catch { throw new Error('gh pr list: bad JSON'); }
  return prs.find((p) => (p.headRefName || '').startsWith(BRANCH_PREFIX + appId + '-')) || null;
}

// ============================================================ main

async function processGroup(appId, groupDrifts, ctx) {
  const appPath = path.join(root, 'apps', appId, 'app.json');
  if (!fs.existsSync(appPath)) throw new Error(`apps/${appId}/app.json not found`);
  const orig = fs.readFileSync(appPath, 'utf8');
  const app = JSON.parse(orig);
  const plan = planBump(app, groupDrifts);
  if (plan.stale) {
    console.log(`auto-bump: ${appId} — drift already current in app.json, nothing to do`);
    return { status: 'stale' };
  }
  const branch = branchName(appId, plan.rawVersion);
  if (!ctx.dryRun) {
    const existing = findOpenBumpPr(appId);
    if (existing) {
      console.log(`auto-bump: ${appId} — open PR already exists (${existing.url}), skipping`);
      return { status: 'existing', branch: existing.headRefName, pr: existing.url };
    }
  }

  console.log(`auto-bump: ${appId} — measuring ${plan.affected.length} package(s) for ${plan.rawVersion} …`);
  const evidence = await measureAll(app, plan);
  const stamp = nowIso();
  const edited = applyBump(app, plan, evidence, stamp);
  const text = applyTextPatch(orig, app, edited);

  if (!ctx.dryRun) {
    const co = git(['checkout', '-B', branch, ctx.baseSha]);
    if (!co.ok) throw new Error(`git checkout -B ${branch} failed: ${co.err.slice(0, 200)}`);
  }
  const relPath = path.join('apps', appId, 'app.json');
  fs.writeFileSync(path.join(root, relPath), text);
  const restore = () => fs.writeFileSync(path.join(root, relPath), orig);

  const v = runValidate();
  if (!v.ok) {
    restore();
    throw new Error(`validate.mjs failed: ${(v.err || v.out).slice(0, 300)}`);
  }
  const verification = await verifyChannels(edited, plan);
  if (verification.failures.length) {
    restore();
    throw new Error(`channel re-HEAD failed: ${verification.failures.slice(0, 3).join('; ')}`);
  }

  const title = `chore: bump ${appId} to ${plan.rawVersion}`;
  const body = buildPrBody(edited, plan, evidence,
    { ...verification, newVersion: edited.version }, stamp);

  if (ctx.dryRun) {
    restore();
    const summary = {
      dryRun: true, app: appId, branch, title,
      version: `${plan.oldVersion} → ${edited.version}`,
      packages: plan.affected.map((id) => ({
        id,
        sha256: `${evidence[id].old.sha256.slice(0, 12)}… → ${evidence[id].sha256.slice(0, 12)}…`,
        sizeBytes: `${evidence[id].old.sizeBytes} → ${evidence[id].sizeBytes}`,
        method: evidence[id].method,
        url: evidence[id].url,
      })),
      verification: `${verification.ok}/${verification.total} OK, 0 failures`,
      prBody: body,
    };
    console.log(JSON.stringify(summary, null, 2));
    return { status: 'dry-run' };
  }

  const add = git(['add', '--', relPath]);
  if (!add.ok) throw new Error(`git add failed: ${add.err.slice(0, 200)}`);
  const commit = git(['commit', '-m', title]);
  if (!commit.ok) throw new Error(`git commit failed: ${commit.err.slice(0, 200)}`);
  const pushRef = `HEAD:refs/heads/${branch}`;
  let push = git(['push', 'origin', pushRef]);
  if (!push.ok) push = git(['push', '--force', 'origin', pushRef]);
  if (!push.ok) throw new Error(`git push failed: ${push.err.slice(0, 300)}`);

  const bodyFile = path.join(os.tmpdir(), `auto-bump-pr-${appId}-${process.pid}.md`);
  fs.writeFileSync(bodyFile, body);
  const create = sh('gh', ['pr', 'create', '--base', 'main', '--head', branch,
    '--title', title, '--body-file', bodyFile]);
  fs.rmSync(bodyFile, { force: true });
  if (!create.ok) {
    const again = findOpenBumpPr(appId);
    if (again) return { status: 'existing', branch: again.headRefName, pr: again.url };
    throw new Error(`gh pr create failed: ${create.err.slice(0, 300)}`);
  }
  const prUrl = create.out.trim().split('\n').pop();
  console.log(`auto-bump: ${appId} — opened ${prUrl}`);
  return { status: 'created', branch, pr: prUrl };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const di = args.indexOf('--drifts');
  const driftsPath = di >= 0 && args[di + 1]
    ? path.resolve(args[di + 1])
    : path.join(root, 'drifts.json');

  if (!fs.existsSync(driftsPath)) {
    console.log('auto-bump: no drifts.json — nothing to do');
    return 0;
  }
  const drifts = JSON.parse(fs.readFileSync(driftsPath, 'utf8'));
  const aDrifts = drifts.filter((d) => classifyDrift(d) === 'A');
  if (aDrifts.length === 0) {
    console.log('auto-bump: no new-version (A-class) drifts');
    return 0;
  }
  const bDrifts = drifts.filter((d) => classifyDrift(d) !== 'A');
  console.log(`auto-bump: ${aDrifts.length} A-class drift(s) across ` +
    `${new Set(aDrifts.map((d) => d.app)).size} app(s)`);

  const groups = new Map();
  for (const d of aDrifts) {
    if (!d.app) continue;
    if (!groups.has(d.app)) groups.set(d.app, []);
    groups.get(d.app).push(d);
  }

  const ctx = { dryRun };
  if (!dryRun) {
    const dirty = git(['status', '--porcelain']);
    if (!dirty.ok) throw new Error(`git status failed: ${dirty.err.slice(0, 200)}`);
    if (dirty.out.trim()) throw new Error('working tree not clean — commit or stash first');
    const head = git(['rev-parse', 'HEAD']);
    if (!head.ok) throw new Error('git rev-parse HEAD failed');
    ctx.baseSha = head.out.trim();
    git(['config', 'user.name', 'github-actions[bot]']);
    git(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  }

  const bumps = [];
  const failed = [];
  let remaining = [...bDrifts, ...aDrifts]; // A stays until its group resolves
  const persist = () => {
    if (dryRun) return;
    fs.writeFileSync(driftsPath, JSON.stringify(remaining, null, 2));
    if (bumps.length) {
      fs.writeFileSync(path.join(root, 'auto-bumps.json'),
        JSON.stringify(bumps, null, 2));
    }
  };

  for (const [appId, ds] of groups) {
    try {
      const res = await processGroup(appId, ds, ctx);
      remaining = remaining.filter((d) => !ds.includes(d));
      if (res.status === 'created' || res.status === 'existing') {
        bumps.push({
          app: appId, status: res.status, branch: res.branch, pr: res.pr || null,
          version: planRawFor(ds),
        });
      }
      persist();
    } catch (e) {
      const msg = String(e.message || e);
      console.error(`auto-bump: ${appId} FAILED — ${msg}`);
      for (const d of ds) {
        d.body = `${d.body}\n\nAuto-bump attempt failed: ${msg}\nManual PR needed.`;
      }
      failed.push(appId);
      persist();
    }
  }

  if (dryRun) {
    console.log('auto-bump: dry-run complete — no files, branches or PRs were written');
  } else {
    console.log(`auto-bump: done — ${bumps.length} PR(s)/open PR(s), ${failed.length} failure(s); ` +
      `drifts.json now holds ${remaining.length} issue-class item(s)`);
  }
  return failed.length ? 1 : 0;
}

function planRawFor(ds) {
  const primary = ds.find((d) => d.source === 'github') || ds[0];
  return stripV(primary.latestTag);
}

export { measureAll, verifyChannels }; // exported for debugging/introspection

// ============================================================ entry guard

const isMain = process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main()
    .then((code) => process.exit(code))
    .catch((e) => {
      console.error(`auto-bump failed: ${String(e.message || e)}`);
      process.exit(1);
    });
}
