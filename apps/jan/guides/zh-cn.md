# Jan 安装引导（简版）

> 完整图文教程见官网 /apps/jan/（与本页同源）。
> 口号：**装到能用为止。**

## 1. 体检（自动）
AiBOX 会先检查你的电脑。Jan 自带运行时——不需要 Node.js。

## 2. 选路线（自动）
- **国际网络**：GitHub Releases 官方直连。
- **中国大陆**：走 ghfast / gh-proxy 加速网关，失败自动回落直连。

## 3. 安装（一键）
自动下载 + SHA256 校验 + 静默安装（Windows x64/ARM64 装到
`%LOCALAPPDATA%\Jan`；macOS 用 universal dmg 拷贝到 `/Applications`，
Intel 与 Apple Silicon 同一个文件）。全程无需管理员权限。

## 4. 选模型（你只需要做这一步）
跑本地开源模型（免费、离线），或接一个 key：
OpenRouter（推荐）/ Anthropic / OpenAI / Google。

## 5. 验证（自动）
检查已安装版本与本地 API `http://localhost:1337`——
「装好了。它真的能用。」

---
问题反馈：https://github.com/imAiBOX/aibox-registry/issues
