# 5ire 安装教程

## 准备
- **系统**：Windows 10/11 x64，或 macOS 12+（Apple 芯片 / Intel 各有专用包）
- **磁盘**：约 1GB（安装包 132MB / mac 包 143-152MB）
- **权限**：Windows 安装会弹管理员授权（装到 `C:\Program Files\5ire`，全机范围）；macOS 装进「应用程序」即可
- **必配**：需要一个模型 API key（OpenAI / Anthropic / Gemini / DeepSeek / 本地 Ollama 均可）

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **5ire** → 点「安装」
2. 下载安装包（国内自动走加速通道，哈希校验后安装）
3. 完成后启动 5ire（开始菜单 / 应用程序）

## 手动安装
- **Windows**：从 GitHub Releases 下载 `5ire-Setup-0.15.4.exe`，双击安装（会弹管理员授权，装到 `C:\Program Files\5ire` 全机范围）
- **macOS**：下载对应芯片的 dmg（Apple 芯片选 arm64，Intel 选 x64），打开后把 **5ire.app** 拖进「应用程序」

## 配置（让它真正干活）
1. 首次启动会引导选择模型供应商 —— 内置 OpenAI、Anthropic、Gemini、DeepSeek、智谱、豆包、Kimi、Mistral、Grok、Perplexity 等，也能用本机 Ollama / LMStudio
2. 粘贴 API key（在对应供应商官网创建）
3. **key 只留在你自己电脑上**（Windows 在 `%APPDATA%\5ire`，macOS 在 `~/.5ire/config.json`）—— AiBOX 和 5ire 都不会上传

## 不只是聊天
- **MCP 客户端**：在 MCP 设置里接入各种 MCP 服务器（工具、数据源）
- **知识库**：丢进 txt / md / pdf / docx / xlsx 文件，向量在本地算
- **中英双语界面**：跟随系统语言（English / 中文）

## 验证成功
让它做件小事（「总结一下这个 PDF」）。如果能基于你的文件回答，说明配置成功。

## 遇到问题
- **模型连不上**：检查 key 是否完整、账户是否有余额
- **国内访问慢**：换国内供应商（DeepSeek / 智谱 / 豆包）或用本地 Ollama
- **MCP 工具没出现**：通常是该服务器自己要填命令或 API key
- **想接更多供应商**：5ire 也支持任何 OpenAI 兼容接口

## 卸载
Windows：开始菜单 → 5ire → 卸载。macOS：把 5ire.app 从「应用程序」删掉。
模型 key、会话和本地知识库都在数据目录（`%APPDATA%\5ire`、`~/Library/Application Support/5ire`）—— **删掉就没了，建议先备份**。AiBOX → 管理 → 卸载会自动备份。
