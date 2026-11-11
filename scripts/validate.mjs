#!/usr/bin/env node
// aibox-registry schema + invariant validation (CI: validate job)
// - validates index.json and every apps/*/app.json against their JSON Schemas (draft-07)
// - extra invariants that JSON Schema cannot express cleanly:
//     * probe.expect / provider keyFormat must compile as JS RegExp
//     * routes[*] ids must exist in routePlans; routePlans steps must be real package ids
//     * referenced files (locales packs, guides) must exist in the repo
//     * app.json id must match its directory name
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (msg) => errors.push(msg);

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
// schemas carry a $id — compile each file once and reuse (multiple apps would
// otherwise re-register the same $id and throw)
const validators = new Map();

function load(p) {
  return JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
}

function validateAgainst(schemaFile, data, label) {
  let validate = validators.get(schemaFile);
  if (!validate) {
    const schema = load(schemaFile);
    validate = ajv.compile(schema);
    validators.set(schemaFile, validate);
  }
  if (!validate(data)) {
    for (const e of validate.errors) {
      fail(`${label}: schema ${e.instancePath || '<root>'} ${e.message}` +
        (e.params ? ` ${JSON.stringify(e.params)}` : ''));
    }
  }
}

function compileRegex(source, label) {
  try {
    // eslint-disable-next-line no-new
    new RegExp(source);
  } catch (e) {
    fail(`${label}: invalid regular expression ${JSON.stringify(source)}: ${e.message}`);
  }
}

// ---- index.json ----
const index = load('index.json');
validateAgainst('schemas/index.schema.json', index, 'index.json');

// ---- apps/* ----
const appsDir = path.join(root, 'apps');
const appDirs = fs.existsSync(appsDir)
  ? fs.readdirSync(appsDir).filter((d) => fs.statSync(path.join(appsDir, d)).isDirectory())
  : [];
if (appDirs.length === 0) fail('apps/: at least one app directory is required');

for (const dir of appDirs) {
  const rel = `apps/${dir}/app.json`;
  const app = load(rel);
  const label = rel;

  validateAgainst('schemas/app.schema.json', app, label);

  if (app.id !== dir) fail(`${label}: id "${app.id}" must match directory "${dir}"`);

  // index entry must exist for this app
  const inIndex = (index.apps || []).some((a) => a.id === app.id);
  if (!inIndex) fail(`index.json: missing entry for app "${app.id}"`);

  // V2: every package probe must exist and its expect must compile
  for (const pkg of app.packages || []) {
    if (!pkg.install?.probe) {
      fail(`${label}: package "${pkg.id}" missing install.probe (V2)`);
    } else {
      compileRegex(pkg.install.probe.expect, `${label}: package "${pkg.id}" probe.expect`);
    }
    if ((pkg.channels || []).length > 0 && !/^[a-f0-9]{64}$/.test(pkg.sha256 || '')) {
      fail(`${label}: package "${pkg.id}" has channels but no valid sha256 (V1)`);
    }
  }

  // routes ↔ routePlans ↔ packages cross-reference
  for (const order of Object.values(app.routes || {})) {
    for (const routeId of order) {
      const plan = app.routePlans?.[routeId];
      if (!plan) {
        fail(`${label}: routes references unknown routePlan "${routeId}"`);
        continue;
      }
      for (const step of plan.steps || []) {
        if (!(app.packages || []).some((p) => p.id === step)) {
          fail(`${label}: routePlan "${routeId}" step "${step}" is not a package id`);
        }
      }
    }
  }

  // V3: configTargets
  for (const [name, prov] of Object.entries(app.modelProviders || {})) {
    const t = prov.configTarget || '';
    if (!/^~[/\\]/.test(t) || t.includes('..') ||
        /^~[/\\](etc|usr|bin|Windows|Program Files|ProgramData)/.test(t)) {
      fail(`${label}: modelProviders.${name}.configTarget "${t}" is not a user-home path (V3)`);
    }
    if (prov.authType === 'api-key') {
      if (!prov.keyFormat) fail(`${label}: modelProviders.${name} (api-key) missing keyFormat`);
      else compileRegex(prov.keyFormat, `${label}: modelProviders.${name}.keyFormat`);
    }
  }

  // referenced files must exist
  const checkFile = (p, what, base = root) => {
    if (!fs.existsSync(path.join(base, p))) fail(`${label}: referenced ${what} not found: ${p}`);
  };
  for (const p of Object.values(app.locales?.packs || {})) checkFile(p, 'locale pack');
  for (const p of Object.values(app.guides || {})) checkFile(p, 'guide', path.join(root, 'apps', dir));
  for (const p of app.maintenance?.dataPaths || []) {
    if (!/^~[/\\]/.test(p) || p.includes('..')) {
      fail(`${label}: maintenance.dataPaths "${p}" is not a user-home path (V3)`);
    }
  }
  for (const p of app.maintenance?.uninstall?.residualPaths || []) {
    if (!/^~[/\\]/.test(p) || p.includes('..')) {
      fail(`${label}: maintenance.uninstall.residualPaths "${p}" is not a user-home path (V3)`);
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} validation error(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(`✓ schemas OK: index.json + ${appDirs.length} app profile(s) (V1/V2/V3 + cross-references)`);
