# OpenClaw 安装引导

> 完整图文教程在 充实（官网 /apps/openclaw/ 与本页同源）。
> 口号：**装到能用为止。**

## 1. 体检（自动）
AiBOX 会先检查你的电脑：Node 版本是否受支持（推荐 ≥26.12.1，支持 ≥24.22.1(<25)；
**22/23/25 不支持**，我们会另装新版本，不动你现有的）。

## 2. 选路线（自动）
- **国际网络**：走官方 Windows Hub 安装包（GitHub 直连）。
- **中国大陆**：走 npm 加速路线（Node + OpenClaw 全走 npmmirror，避开 GitHub 大文件）。

## 3. 安装（一键）
按计划自动下载、哈希校验（SHA256）、静默安装，全程无需管理员权限。

## 4. 填 Key（你只需要做这一步）
六选一：OpenRouter（推荐）/ Anthropic / OpenAI / Google / Claude 订阅登录 / 本地 Ollama。
粘贴 Key → 自动写入 `~/.config/openclaw/openclaw.json5`（先备份原文件）。

## 5. 验证（自动）
发一条真实测试请求，收到回复才算装好——「装好了。它真的能用。」

---
问题反馈：https://github.com/imAiBOX/aibox-registry/issues
