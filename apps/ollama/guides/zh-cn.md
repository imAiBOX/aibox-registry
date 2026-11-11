# Ollama 安装引导（简版）

> 完整图文教程见官网 /apps/ollama/（与本页同源）。
> 口号：**装到能用为止。**

## 1. 体检（自动）
AiBOX 会先检查你的电脑（磁盘空间等，全程无需管理员权限）。
Ollama 自带运行时——不需要 Node.js 或 Python。

## 2. 选路线（自动）
- **国际网络**：GitHub Releases 官方直连。
- **中国大陆**：走 gh-proxy 加速网关，失败自动回落直连。

## 3. 安装（一键）
自动下载 + SHA256 校验 + 静默安装（Windows 装到
`%LOCALAPPDATA%\Programs\Ollama`；macOS 拷贝到 `/Applications`）。

## 4. 下载模型（你只需要做这一步）
拉取第一个模型，例如 `ollama pull qwen2.5:7b`——小模型 8GB 内存就能跑，
完全免费、离线可用。

## 5. 验证（自动）
执行 `ollama --version` 并检查本地服务 `http://127.0.0.1:11434`——
「装好了。它真的能用。」

---
问题反馈：https://github.com/imAiBOX/aibox-registry/issues
