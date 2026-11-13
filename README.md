# aibox-registry

**English | [简体中文](README.zh-CN.md)**

**Single source of truth (SSOT) for AiBOX.im** — a public repository anyone can audit.
The installer and the website both read data from here; this repo has no backend or database.

Slogan: **Installed until it works.**

## Its place in the three-layer data flow

```
[GitHub aibox-registry]  ← the only SSOT: apps/*.json, locales/*.json, netConfig, maintenance
      │  push → Actions (schema validation + liveness probe); daily probe cron at 04:00 UTC
      ▼
[aibox.im website]       build-time pull of the registry → static pages (directory/tutorials/downloads)
      ▲
[AiBOX installer]        primary channel reads GitHub directly with cross-checks
                         (jsDelivr / raw / GitHub API)
                         secondary channel reads aibox.im/meta/*.json (announcements, directory snapshot,
                         latest versions)
```

- Website rebuild chain: push to this repo → `repository_dispatch` to the aibox-site repo → CF Pages build.
- Adding a language = add one file under `locales/` + a PR, **zero releases**.

## Repository layout

```
index.json                     # app index (data source for the website /apps directory)
apps/<id>/app.json             # per-app profile: version + dependency DAG + channels + config + maintenance
apps/<id>/guides/{zh-cn,en}.md # install guides (DONE page and website share this source)
locales/{en,zh-CN}.json        # installer UI language packs (en is the baseline)
schemas/{index,app}.schema.json# JSON Schema (draft-07, enforced in CI)
scripts/                       # validate / check-locales / probe / auto-bump / prepush-scan
.github/workflows/ci.yml       # validation + daily probe + auto-bump PRs
```

## Schema and invariants (validation chain)

`schemas/app.schema.json` enforces:

| Invariant | Meaning |
|---|---|
| **V1** | every package exposing `channels[].url` must carry a package-level `sha256` (plus `sizeBytes`) — all channels of a package share one hash; hashless URLs may not merge |
| **V2** | every package's `install.probe` must exist (an install task that cannot verify its version is a failed task; `probe.expect` must compile as a regular expression) |
| **V3** | `configTarget` / `dataPaths` / `residualPaths` must be user-home (`~/…`) paths — no system directories, no `..` traversal |
| **V4** | `netConfig.registrySources` declares ≥2 cross-checkable sources (jsDelivr / raw / GitHub API); hashes are never fetched through PROXY prefixes |

Additional cross-checks in `scripts/validate.mjs`: `routes` ↔ `routePlans` ↔ `packages` references are consistent,
referenced `locales/*.json` and `guides/*.md` files exist; `scripts/check-locales.mjs` guarantees
**zh-CN never misses any key of the en baseline**.

## Daily liveness probe (push + cron `0 4 * * *`)

1. HEAD every channel of every package (10s timeout per attempt, up to 3 retries — absorbs network flakiness so no issues are opened by mistake);
2. packages smaller than 5MB are re-downloaded and their `sha256` re-compared (V1: no channel is exempt);
3. GitHub `releases/latest` and npm `dist-tags/latest` are compared against the recorded `upstream` versions;
4. every `netConfig.proxyGateways` prefix is HEAD-ed (the S3 hot-updatable gateway list);
5. **every drift is classified, then handled automatically:**
   - **A — new upstream version** (release tag or npm `latest` moved): `scripts/auto-bump.mjs`
     measures the new artifacts — GitHub release assets take the API asset `digest` + size (zero
     download); vendor CDN files, source archives, npm tarballs and install scripts are fully
     downloaded and `sha256`-computed — then rewrites **only version-related fields** of
     `apps/<id>/app.json` (`version`, `upstream` tag, channel URLs, `sha256`/`sizeBytes`/`hashSource`,
     install args), runs `scripts/validate.mjs` and re-HEADs every channel (**0 failures required**),
     pushes branch `chore/upstream-<app>-<version>` and opens a PR whose body carries the old→new
     evidence table (hashes, sizes, download sources, measured UTC) for human review. Idempotent:
     if a bump PR is already open for the app, the run skips it instead of opening a duplicate. The
     run stays red until the PR merges, and no issue is filed for A-class drift (the PR is the
     reminder). If the automatic bump cannot complete, the drift falls back to the issue flow.
   - **B — same-version problem** (sha256/size mismatch, dead channel, dead gateway): filed as an
     Issue (label `upstream-drift`) + red run, unchanged from before. **B-class data is never edited
     automatically** — content changing while the version stays put is a possible tampering signal
     and always needs a human.

Probe artifacts `probe-report.json` / `drifts.json` / `auto-bumps.json` are kept as workflow artifacts.
The probe job runs with `contents: write` + `pull-requests: write` so same-repo bump PRs can be opened
with the default `GITHUB_TOKEN` (no PAT). Note: PRs created by `GITHUB_TOKEN` do not trigger further
workflow runs — CI validates the bump on merge to `main`. Effective across site + installer within ≤12h
of the merge.

## How to add an app

1. `apps/<new-id>/app.json`: fill it against `schemas/app.schema.json` — the core is
   `packages[]` (per-package sha256/sizeBytes measured from the upstream + channels), `routes`/`routePlans`,
   `modelProviders` (data-driven config paths), `maintenance`, `locales`.
2. Add one entry to `index.json` `apps[]` (`id` must equal the directory name).
3. Write a full tutorial-level `apps/<new-id>/guides/{zh-cn,en}.md` (prepare / install / configure / verify / FAQ, in both languages).
4. Locally run `npm install && npm test`, open a PR — CI runs schema/locale validation and the probe.
5. Merge = live (website and installer hot-read this repo, no release needed).

## Data baseline (live-verified)

- npm `openclaw@2026.11.3`: tarball sha256 computed from **full downloads on both npmjs and npmmirror** (two sources identical, sha1 = `dist.shasum`).
- Node.js `v26.13.0` (recommended line): sha256 from the official `SHASUMS256.txt`, additionally **re-downloaded from direct + mirror** and compared.
- GitHub release assets: sha256 taken from the **GitHub API release asset `digest` field**; all channels HEAD 200 with Content-Length equal to `sizeBytes`.
  (2026-11-11 batch: Ollama v0.40.16, Cherry Studio v2.2.0, Jan v0.8.8 — GitHub assets; Chatbox v1.24.3 ships on the vendor CDN since v1.21, so its three assets were **fully downloaded and hashed locally**, cross-checked against the official `latest.yml` sizes.)
- 2026-11-12 additions: AiDog `v0.5.87` (tag source archive — full-download sha256 on direct + gh-proxy channels), Hermes Agent `v0.23.1` (official installer scripts, hashed on both endpoints), nanobot `v0.4.1` and CowAgent `2.2.2` (GitHub asset `digest` field; both gateways measured 200 / identical size on their assets).
- Gateway baseline: `ghfast.top` / `gh-proxy.com` measured 200 (same size); failed candidates are recorded in `netConfig.retiredCandidates` and only re-admitted after a retest.
  Note: `ghfast.top` answered 403 for every `ollama/ollama` asset (measured 2026-11-11) — the Ollama profile therefore ships only the `gh-proxy` channel.

## TODO

- `icons/openclaw.png` is a placeholder (final logo pending).
- Windows silent-install parameters and install paths pending real-machine verification (per-app notes carry `TODO` markers).
- macOS dmg install scripts, Gatekeeper guidance, and CN proxy channels for macOS pending real-machine verification.
- Upstream `openclaw/openclaw` has not published a Windows NSIS asset — the Windows mainline is the Windows Hub (see `routePlans` notes).
- `recommendedModels` lists and pricing to be re-checked before the CONFIG screens go live.

---
Feedback: https://github.com/imAiBOX/aibox-registry/issues
