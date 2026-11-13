// Offline unit tests for scripts/auto-bump.mjs pure helpers (node --test).
// No network, no git, no PR creation — evidence maps are fixtures.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  stripV, semverTriple, tokenPairs, applyTokens, classifyDrift,
  selectAffectedPackages, planBump, applyBump, branchName, buildPrBody,
  applyTextPatch,
} from '../scripts/auto-bump.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---------------------------------------------------------------- fixtures

function githubApp() {
  return {
    id: 'demo', name: 'Demo', version: '2.2.0', updatedAt: '2026-11-01T00:00:00Z',
    upstream: { github: [{ repo: 'acme/demo', tag: 'v2.2.0' }] },
    packages: [{
      id: 'demo-win', kind: 'app', version: '2.2.0',
      sha256: 'a'.repeat(64), sizeBytes: 100,
      hashSource: 'old provenance',
      channels: [
        { type: 'direct', url: 'https://github.com/acme/demo/releases/download/v2.2.0/Demo-2.2.0-setup.exe' },
        { type: 'proxy', url: 'https://ghfast.top/https://github.com/acme/demo/releases/download/v2.2.0/Demo-2.2.0-setup.exe' },
      ],
      install: { type: 'nsis-silent', args: ['/S', 'Demo-2.2.0-setup.exe'] },
    }],
    routes: { windows: ['direct'] }, routePlans: { direct: { steps: ['demo-win'] } },
  };
}

function openclawLike() {
  return {
    id: 'openclaw', name: 'OpenClaw', version: '2026.11.3', updatedAt: '2026-11-01T00:00:00Z',
    upstream: {
      github: [
        { repo: 'openclaw/openclaw', tag: 'v2026.11.3' },
        { repo: 'openclaw/openclaw-windows-node', tag: 'v2026.11.1' },
      ],
      npm: { name: 'openclaw', version: '2026.11.3' },
    },
    packages: [
      { id: 'openclaw-mac-arm64', kind: 'app', version: 'v2026.11.3', sha256: 'b'.repeat(64), sizeBytes: 1,
        channels: [{ type: 'direct', url: 'https://github.com/openclaw/openclaw/releases/download/v2026.11.3/OpenClaw-2026.11.3-arm64.dmg' }],
        install: { type: 'script', args: ['hdiutil', 'OpenClaw-2026.11.3-arm64.dmg'] } },
      { id: 'openclaw-hub-win-x64', kind: 'app', version: 'v2026.11.1', sha256: 'c'.repeat(64), sizeBytes: 1,
        channels: [{ type: 'direct', url: 'https://github.com/openclaw/openclaw-windows-node/releases/download/v2026.11.1/OpenClawCompanion-Setup-x64.exe' }],
        install: { type: 'script', args: [] } },
      { id: 'openclaw-cli', kind: 'app', version: '2026.11.3', sha256: 'd'.repeat(64), sizeBytes: 1,
        channels: [{ type: 'direct', url: 'https://registry.npmjs.org/openclaw/-/openclaw-2026.11.3.tgz' }],
        install: { type: 'script', args: ['install', '-g', 'openclaw@2026.11.3'] } },
      { id: 'node-win-x64', kind: 'runtime', version: 'v26.13.0', sha256: 'e'.repeat(64), sizeBytes: 1,
        channels: [{ type: 'direct', url: 'https://nodejs.org/dist/v26.13.0/node-v26.13.0-x64.msi' }],
        install: { type: 'script', args: ['node-v26.13.0-x64.msi'] } },
    ],
  };
}

function cdnApp() {
  return {
    id: 'chatbox', name: 'Chatbox', version: '1.24.4', updatedAt: '2026-11-01T00:00:00Z',
    upstream: { github: [{ repo: 'chatboxai/chatbox', tag: 'v1.24.4' }] },
    packages: [{
      id: 'chatbox-win-x64', kind: 'app', version: '1.24.3', sha256: 'f'.repeat(64), sizeBytes: 5,
      channels: [{ type: 'direct', url: 'https://download.chatboxai.app/releases/Chatbox-1.24.4-Setup.exe' }],
      install: { type: 'nsis-silent', args: ['/S'] },
    }],
  };
}

function hermesLike() {
  return {
    id: 'hermes-agent', name: 'Hermes', version: '0.23.1', updatedAt: '2026-11-01T00:00:00Z',
    upstream: { github: [{ repo: 'NousResearch/hermes-agent', tag: 'v0.23.1' }] },
    packages: [
      { id: 'hermes-win', kind: 'app', version: '0.23.1', sha256: '1'.repeat(64), sizeBytes: 7,
        channels: [{ type: 'direct', url: 'https://hermes-agent.nousresearch.com/install.ps1' }],
        install: { type: 'script', args: ['irm', 'https://hermes-agent.nousresearch.com/install.ps1'] } },
      { id: 'hermes-mac', kind: 'app', version: '0.23.1', sha256: '2'.repeat(64), sizeBytes: 8,
        channels: [{ type: 'direct', url: 'https://hermes-agent.nousresearch.com/install.sh' }],
        install: { type: 'script', args: ['sh', '-c', 'curl install.sh'] } },
    ],
  };
}

function staleArgsApp() {
  return {
    id: 'aidog', name: 'AiDog', version: '0.5.88', updatedAt: '2026-11-01T00:00:00Z',
    upstream: { github: [{ repo: 'AiDog-im/AiDog', tag: 'v0.5.88' }] },
    packages: [{
      id: 'aidog-win', kind: 'app', version: '0.5.87', sha256: '3'.repeat(64), sizeBytes: 9,
      channels: [
        { type: 'direct', url: 'https://github.com/AiDog-im/AiDog/archive/refs/tags/v0.5.88.tar.gz' },
        { type: 'proxy', url: 'https://gh-proxy.com/https://github.com/AiDog-im/AiDog/archive/refs/tags/v0.5.88.tar.gz' },
      ],
      install: { type: 'script', args: ['tar', 'v0.5.87.tar.gz', 'AiDog-0.5.87/'] },
    }],
  };
}

const ghDrift = (over = {}) => ({
  kind: 'version', driftClass: 'A', app: 'demo', source: 'github', repo: 'acme/demo',
  currentTag: 'v2.2.0', latestTag: 'v2.2.1', publishedAt: '2026-11-13T00:00:00Z', ...over,
});
const evidenceFor = (ids, over = {}) => Object.fromEntries(ids.map((id) => [id, {
  sha256: '9'.repeat(64), sizeBytes: 42, method: 'GitHub API release asset digest',
  url: 'https://example/new', hashSource: 'measured by test',
  old: { sha256: 'a'.repeat(64), sizeBytes: 100 }, ...over,
}]));

// ---------------------------------------------------------------- tests

test('stripV / semverTriple', () => {
  assert.equal(stripV('v2.2.1'), '2.2.1');
  assert.equal(stripV('2.2.1'), '2.2.1');
  assert.equal(semverTriple('v2.56.1.windows.1'), '2.56.1');
  assert.equal(semverTriple('2026.11.3'), '2026.11.3');
  assert.equal(semverTriple('nope'), null);
});

test('tokenPairs: github tag covers path tag, filename version and semver triple', () => {
  const pairs = tokenPairs({ currentTag: 'v2.56.1.windows.1', latestTag: 'v2.57.0.windows.1' });
  const map = Object.fromEntries(pairs);
  assert.equal(map['v2.56.1.windows.1'], 'v2.57.0.windows.1');
  assert.equal(map['2.56.1.windows.1'], '2.57.0.windows.1');
  assert.equal(map['2.56.1'], '2.57.0');
  // identical triple (same base version, suffix-only bump) must not add a triple pair
  const p2 = tokenPairs({ currentTag: 'v2.56.1.windows.1', latestTag: 'v2.56.1.windows.2' });
  assert.ok(!p2.some(([o]) => o === '2.56.1'));
});

test('applyTokens rewrites every version segment of a URL', () => {
  const pairs = tokenPairs({ currentTag: 'v2.2.0', latestTag: 'v2.2.1' });
  assert.equal(
    applyTokens('https://github.com/acme/demo/releases/download/v2.2.0/Demo-2.2.0-setup.exe', pairs),
    'https://github.com/acme/demo/releases/download/v2.2.1/Demo-2.2.1-setup.exe');
  assert.equal(
    applyTokens('https://ghfast.top/https://github.com/acme/demo/releases/download/v2.2.0/Demo-2.2.0-setup.exe', pairs),
    'https://ghfast.top/https://github.com/acme/demo/releases/download/v2.2.1/Demo-2.2.1-setup.exe');
});

test('classifyDrift: only explicit A-class is A; legacy/missing field is B', () => {
  assert.equal(classifyDrift({ driftClass: 'A' }), 'A');
  assert.equal(classifyDrift({ driftClass: 'B', kind: 'integrity' }), 'B');
  assert.equal(classifyDrift({ kind: 'version', title: 'x' }), 'B');
  assert.equal(classifyDrift(null), 'B');
});

test('selectAffectedPackages: github drift is repo-scoped (no cross-repo, no npm, no runtime)', () => {
  const app = openclawLike();
  const pairs = tokenPairs({ currentTag: 'v2026.11.3', latestTag: 'v2026.11.4' });
  const ids = selectAffectedPackages(app, ghDrift({ app: 'openclaw', repo: 'openclaw/openclaw' }), pairs);
  assert.deepEqual(ids, ['openclaw-mac-arm64']); // hub (other repo), cli (npm), node (runtime) excluded
});

test('selectAffectedPackages: npm drift only hits the npm tarball package', () => {
  const app = openclawLike();
  const pairs = tokenPairs({ currentTag: '2026.11.3', latestTag: '2026.11.4' });
  const ids = selectAffectedPackages(app, ghDrift({
    app: 'openclaw', source: 'npm', package: 'openclaw', currentTag: '2026.11.3', latestTag: '2026.11.4',
  }), pairs);
  assert.deepEqual(ids, ['openclaw-cli']);
});

test('selectAffectedPackages: vendor-CDN and custom-endpoint app packages are included', () => {
  const cdnPairs = tokenPairs({ currentTag: 'v1.24.4', latestTag: 'v1.24.5' });
  assert.deepEqual(
    selectAffectedPackages(cdnApp(), ghDrift({ app: 'chatbox', repo: 'chatboxai/chatbox', currentTag: 'v1.24.4', latestTag: 'v1.24.5' }), cdnPairs),
    ['chatbox-win-x64']);
  const hp = tokenPairs({ currentTag: 'v0.23.1', latestTag: 'v0.24.0' });
  assert.deepEqual(
    selectAffectedPackages(hermesLike(), ghDrift({ app: 'hermes-agent', repo: 'NousResearch/hermes-agent', currentTag: 'v0.23.1', latestTag: 'v0.24.0' }), hp),
    ['hermes-win', 'hermes-mac']);
});

test('planBump: stale drift (already current) yields stale plan', () => {
  const app = githubApp();
  assert.equal(planBump(app, [ghDrift({ currentTag: 'v2.2.0', latestTag: 'v2.2.0' })]).stale, true);
  assert.equal(planBump(app, [ghDrift({ latestTag: 'v9.9.9' })]).stale, false);
  // unknown upstream repo in the drift → skipped, not bumped
  assert.equal(planBump(app, [ghDrift({ repo: 'other/repo' })]).stale, true);
});

test('applyBump updates only version-related fields', () => {
  const app = githubApp();
  const plan = planBump(app, [ghDrift()]);
  const ev = evidenceFor(plan.affected);
  const out = applyBump(app, plan, ev, '2026-11-13T10:00:00Z');

  assert.equal(out.version, '2.2.1');
  assert.equal(out.updatedAt, '2026-11-13T10:00:00Z');
  assert.equal(out.upstream.github[0].tag, 'v2.2.1');
  const pkg = out.packages[0];
  assert.equal(pkg.version, '2.2.1');
  assert.equal(pkg.sha256, '9'.repeat(64));
  assert.equal(pkg.sizeBytes, 42);
  for (const ch of pkg.channels) assert.ok(ch.url.includes('v2.2.1/Demo-2.2.1-setup.exe'), ch.url);
  assert.deepEqual(pkg.install.args, ['/S', 'Demo-2.2.1-setup.exe']);
  // untouched structures
  assert.deepEqual(out.routes, app.routes);
  assert.deepEqual(out.routePlans, app.routePlans);
  assert.equal(app.version, '2.2.0'); // input not mutated
  // changed-field whitelist
  const changed = [];
  const walk = (a, b, p) => {
    if (JSON.stringify(a) === JSON.stringify(b)) return;
    if (Array.isArray(a) && Array.isArray(b)) {
      for (let i = 0; i < Math.max(a.length, b.length); i++) walk(a[i], b[i], `${p}[${i}]`);
    } else if (a && b && typeof a === 'object' && typeof b === 'object') {
      for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) walk(a[k], b[k], `${p}.${k}`);
    } else changed.push(p);
  };
  walk(app, out, '');
  for (const c of changed) {
    assert.match(c, /^(\.version|\.updatedAt|\.upstream\.github\[0\]\.tag|\.packages\[0\]\.(version|sha256|sizeBytes|hashSource|channels\[\d\]\.url|install\.args\[\d\]))$/,
      `unexpected changed field: ${c}`);
  }
});

test('applyBump: stale package version and stale install args are rewritten to the new version', () => {
  const app = staleArgsApp();
  const drift = ghDrift({ app: 'aidog', repo: 'AiDog-im/AiDog', currentTag: 'v0.5.88', latestTag: 'v0.5.89' });
  const plan = planBump(app, [drift]);
  const out = applyBump(app, plan, evidenceFor(plan.affected), '2026-11-13T10:00:00Z');
  const pkg = out.packages[0];
  assert.equal(pkg.version, '0.5.89');
  assert.equal(pkg.channels[0].url, 'https://github.com/AiDog-im/AiDog/archive/refs/tags/v0.5.89.tar.gz');
  assert.ok(pkg.channels[1].url.includes('v0.5.89.tar.gz'));
  assert.deepEqual(pkg.install.args, ['tar', 'v0.5.89.tar.gz', 'AiDog-0.5.89/']);
  assert.equal(out.version, '0.5.89');
});

test('applyBump: multi-source app — github drift leaves npm/runtime data alone', () => {
  const app = openclawLike();
  const plan = planBump(app, [ghDrift({ app: 'openclaw', repo: 'openclaw/openclaw', currentTag: 'v2026.11.3', latestTag: 'v2026.11.4' })]);
  const out = applyBump(app, plan, evidenceFor(plan.affected), '2026-11-13T10:00:00Z');
  assert.equal(out.version, '2026.11.4');
  assert.equal(out.upstream.github[0].tag, 'v2026.11.4');
  assert.equal(out.upstream.github[1].tag, 'v2026.11.1'); // other repo untouched
  assert.equal(out.upstream.npm.version, '2026.11.3'); // npm untouched
  const cli = out.packages.find((p) => p.id === 'openclaw-cli');
  assert.equal(cli.version, '2026.11.3');
  assert.ok(cli.channels[0].url.includes('openclaw-2026.11.3.tgz'));
  const node = out.packages.find((p) => p.id === 'node-win-x64');
  assert.equal(node.version, 'v26.13.0');
  const hub = out.packages.find((p) => p.id === 'openclaw-hub-win-x64');
  assert.equal(hub.version, 'v2026.11.1');
});

test('applyBump: npm drift bumps npm ref, tarball url and install args only', () => {
  const app = openclawLike();
  const plan = planBump(app, [ghDrift({
    app: 'openclaw', source: 'npm', package: 'openclaw',
    currentTag: '2026.11.3', latestTag: '2026.11.4',
  })]);
  const out = applyBump(app, plan, evidenceFor(plan.affected), '2026-11-13T10:00:00Z');
  assert.equal(out.upstream.npm.version, '2026.11.4');
  assert.equal(out.upstream.github[0].tag, 'v2026.11.3'); // github untouched
  assert.equal(out.version, '2026.11.4');
  const cli = out.packages.find((p) => p.id === 'openclaw-cli');
  assert.equal(cli.version, '2026.11.4');
  assert.ok(cli.channels[0].url.includes('openclaw-2026.11.4.tgz'));
  assert.deepEqual(cli.install.args, ['install', '-g', 'openclaw@2026.11.4']);
  assert.equal(out.packages.find((p) => p.id === 'node-win-x64').version, 'v26.13.0');
});

test('branchName sanitizes the version segment', () => {
  assert.equal(branchName('cherry-studio', '2.2.2'), 'chore/upstream-cherry-studio-2.2.2');
  assert.equal(branchName('openclaw', stripV('v2026.11.4')), 'chore/upstream-openclaw-2026.11.4');
  assert.equal(branchName('x', 'a/b c'), 'chore/upstream-x-a-b-c');
});

test('buildPrBody carries evidence table, sources, UTC stamp and 0-fail statement', () => {
  const app = githubApp();
  const plan = planBump(app, [ghDrift()]);
  const ev = evidenceFor(plan.affected, { method: 'GitHub API release asset digest' });
  const body = buildPrBody(app, plan, ev,
    { ok: 2, total: 2, newVersion: '2.2.1' }, '2026-11-13T10:00:00Z');
  assert.match(body, /`demo`.*2\.2\.0.*2\.2\.1/);
  assert.match(body, /\| demo-win \|/);
  assert.match(body, /GitHub API release asset digest/);
  assert.match(body, /https:\/\/example\/new/);
  assert.match(body, /2\/2 OK/);
  assert.match(body, /0 failures/);
  assert.match(body, /2026-11-13T10:00:00Z/);
  assert.match(body, /validate\.mjs.*passed/);
  // public-surface sanitization: no internal wording may leak into PR bodies
  assert.doesNotMatch(body, /批\s*次|方\s*案\s*书|C\s*总|PH\s*ASE|PRODUC\s*T[-]PL\s*AN|AD\s*R-0/i);
});

test('applyTextPatch: no-op returns the original bytes; scalar edits are minimal', () => {
  for (const rel of ['apps/cherry-studio/app.json', 'apps/hermes-agent/app.json']) {
    const p = path.join(root, rel);
    const orig = fs.readFileSync(p, 'utf8');
    assert.equal(applyTextPatch(orig, JSON.parse(orig), JSON.parse(orig)), orig);
  }
  // targeted edit keeps every other byte (compact one-liners stay compact)
  const p = path.join(root, 'apps/hermes-agent/app.json');
  const orig = fs.readFileSync(p, 'utf8');
  const before = JSON.parse(orig);
  const after = JSON.parse(JSON.stringify(before));
  after.version = '0.24.0';
  after.upstream.github[0].tag = 'v0.24.0';
  const patched = applyTextPatch(orig, before, after);
  assert.equal(JSON.parse(patched).version, '0.24.0');
  assert.ok(patched.includes('{ "repo": "NousResearch/hermes-agent", "tag": "v0.24.0" }'));
  // prose fields that mention the old version are not touched (version-related fields only)
  assert.ok(patched.includes('releases/latest v0.23.1 has 0 assets'));
  assert.equal(patched.length, orig.length); // same-length value splice, no reflow
});
