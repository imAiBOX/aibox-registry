# aibox-registry

[English](README.md) | 简体中文

**AiBOX.im（智能盒子）的唯一事实源（SSOT）**——公有仓库，任何人都可审计。
安装器与官网读这里的数据，本仓库没有任何后端/数据库。

口号：**装到能用为止 / Installed until it works.**

## 在数据流三层中的位置

```
[GitHub aibox-registry]  ← 唯一 SSOT：apps/*.json、locales/*.json、netConfig、maintenance
      │  push → Actions（schema 校验 + 探活）；每日 04:00 UTC 探活 cron
      ▼
[aibox.im 官网]  构建时拉 registry → 静态页（目录/教程/下载）
      ▲
[AiBOX 安装器]  主通道多源直读 GitHub（jsDelivr / raw / GitHub API 交叉校验）
                副通道 aibox.im/meta/*.json（公告、目录快照、latest 版本）
```

- 官网重建链：本仓 push → site 仓 `repository_dispatch` → CF Pages 构建。
- 加语言 = 往 `locales/` 加一个文件 + PR，**零发版**。

## 目录结构

```
index.json                    # 应用索引（官网 /apps 目录数据源）
apps/<id>/app.json            # 应用主档案：版本 + 依赖 DAG + 通道 + 配置 + 维护
apps/<id>/guides/{zh-cn,en}.md # 安装引导（DONE 页与官网同源复用）
locales/{en,zh-CN}.json       # 安装器 UI 语言包（en=基线）
schemas/{index,app}.schema.json # JSON Schema（draft-07，CI 强制）
scripts/                      # validate / check-locales / probe / prepush-scan
.github/workflows/ci.yml      # 校验 + 每日探活
```

## Schema 与不变式（校验链）

`schemas/app.schema.json` 强制：

| 不变式 | 内容 |
|---|---|
| **V1** | 每个有 `channels[].url` 的包**必带**包级 `sha256`（+`sizeBytes`）——所有通道共用同一哈希，无哈希的 URL 禁止合入 |
| **V2** | 每个包 `install.probe` 必须存在（装完必须能探出版本；`probe.expect` 必须是可编译正则） |
| **V3** | `configTarget` / `dataPaths` / `residualPaths` 必须是用户目录 `~/…` 路径，禁止系统目录与 `..` |
| **V4** | `netConfig.registrySources` ≥2 个声明源（jsDelivr/raw/GitHub API 交叉校验），哈希获取永不走 PROXY |

另有脚本级交叉校验（`scripts/validate.mjs`）：`routes` ↔ `routePlans` ↔ `packages` 引用一致、
引用的 `locales/*.json` 与 `guides/*.md` 文件存在；`scripts/check-locales.mjs` 强制
**zh-CN 不得缺 en 基线的任何 key**。

## 每日探活 CI（push + cron `0 4 * * *`）

1. 逐包逐通道 `HEAD`（单次超时 10s，失败最多 3 次重试——抗网络抖动，防误开 Issue）；
2. `sizeBytes < 5MB` 的包重新下载比对 `sha256`（V1 全通道零豁免）；
3. GitHub `releases/latest` 与 npm `dist-tags/latest` 对比 `upstream` 记录版本；
4. `netConfig.proxyGateways` 全部网关 HEAD（S3 可热更下架）；
5. **任何不一致 → 自动开 Issue（label `upstream-drift`）+ 红灯**；同标题已有开放 Issue 不重复开。

探活产物 `probe-report.json` / `drifts.json` 作为 workflow artifact 留证。
版本落后处置：CI 检测到上游新 tag → PR 更新 app.json（新 SHA256）→ 人工 review → ≤12h 全网生效。

## 如何新增一个应用

1. `apps/<new-id>/app.json`：对着 `schemas/app.schema.json` 填——核心是
   `packages[]`（每包 sha256/sizeBytes 实测取证 + channels）、`routes`/`routePlans`、
   `modelProviders`（CONFIG 路径数据驱动）、`maintenance`、`locales`。
2. `index.json` 的 `apps[]` 加一条（`id` 必须等于目录名）。
3. `apps/<new-id>/guides/{zh-cn,en}.md` 写 3-5 步引导。
4. 本地 `npm install && npm test`，开 PR——CI 会跑 schema/locales 校验与探活。
5. 合并即生效（官网与安装器热读，无需发版）。

## 数据真实性基线（实测）

- npm `openclaw@2026.11.3`（2026-11-11 更新）：tarball sha256 分别从 **npmjs 与 npmmirror 全量下载**计算，两源一致且 sha1 = `dist.shasum`。
- Node.js `v26.13.0`（推荐线）：sha256 取自官方 `SHASUMS256.txt`，并**实下载 direct+mirror 两源**比对一致。
- GitHub release 资产：sha256 取自 **GitHub API 资产 `digest` 字段**，全部通道 HEAD 200 且 Content-Length 与 `sizeBytes` 一致
  （2026-11-11 上架：Ollama v0.40.16、Cherry Studio v2.2.0、Jan v0.8.8；Chatbox v1.24.3 自 v1.21 起改发官方 CDN，
  三个资产**本地全量下载实测** sha256，sizeBytes 与官方 `latest.yml` 一致）。
- 网关基线：`ghfast.top` / `gh-proxy.com` 实测 200（同大小）；失败候选记录在 `netConfig.retiredCandidates`，复测通过再入库。
  注：`ghfast.top` 对 `ollama/ollama` 全部资产实测 403（2026-11-11）→ Ollama 档案仅走 `gh-proxy` 通道。

## TODO

- `icons/openclaw.png` 占位（VI 图标待补）。
- Windows 静默安装参数与安装路径待真机取证（各应用档案内标 `TODO`）。
- macOS dmg 安装脚本与 Gatekeeper 引导待实机取证；macOS CN 序 proxy 通道届时补。
- 上游 `openclaw/openclaw` 未发布 Windows NSIS 资产，Windows 主线=Windows Hub（见 `routePlans` note）。
- `recommendedModels` 单价/清单在 CONFIG 上线前复核。

---
问题反馈：https://github.com/imAiBOX/aibox-registry/issues
