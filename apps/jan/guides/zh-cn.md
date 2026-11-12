# Jan 安装与使用教程

一句话：**Jan 是离线优先的开源 ChatGPT 替代品**——在自己电脑上下载并运行开源模型
（Llama、Qwen、Gemma 等），也能接云端 Key；聊天、助手、文档数据全部留在本地，不联网也能用。

## 你将得到

- 应用内模型市场：从 HuggingFace 下载开源模型到本地跑，免费离线
- 云端可选：OpenRouter（推荐）/ Anthropic / OpenAI / Google 等服务商随时切换
- 本地 OpenAI 兼容 API（默认 `http://localhost:1337`），其他软件可直接调用你电脑上的模型
- 自定义助手（Assistants）、MCP 扩展；数据全部本机存储

## 准备（3 分钟）

| 需要 | 说明 |
|---|---|
| **Windows 10+ x64 / ARM64** | 两种架构安装包；装到当前用户目录，**无需管理员权限** |
| **macOS** | universal 单文件，Intel 与 Apple Silicon 通用 |
| 磁盘 | 应用几百 MB；本地模型 2–8 GB/个，建议留 10 GB+ |
| 模型来源 | 二选一：① 本地开源模型（免费）② 云端 API Key |

不需要：Python、Node.js、Docker、显卡（有显卡更快）。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Jan** → 点「安装」
2. AiBOX 下载官方安装包（sha256 校验，国内走 ghfast / gh-proxy 加速、失败回落直连）：
   Windows 静默装到 `%LOCALAPPDATA%\Jan`（零提权）；macOS 用 universal dmg 拷入 `/Applications`，
   Intel 与 Apple Silicon 是同一个文件

### 路线 B：手动安装（官方渠道）

- 官网 [jan.ai](https://jan.ai/) 或直接下：Windows
  [win-x64](https://app.jan.ai/download/latest/win-x64)、macOS
  [mac-universal](https://app.jan.ai/download/latest/mac-universal)，
  或 [GitHub Releases](https://github.com/janhq/jan/releases)
- 其他渠道：微软商店（Microsoft Store）、Linux 的 Flathub 包
- ⚠️ 如果你从微软商店装过 Jan，建议**只保留一个版本**，避免两套数据互相干扰

## 配置（选一个模型，你只需要做这一步）

**本地模型路线（免费离线）**：

1. 打开 Jan → 左侧 **Models** → 搜索并下载一个开源模型（如 Qwen / Llama / Gemma，
   来自 HuggingFace；首次下载体积大，请耐心等进度条走完）
2. 新建对话 → 选择刚下载的模型 → 开聊

**云端 Key 路线**：

1. **Settings → Model Providers** → 选 OpenRouter（推荐，一个 Key 通吃多家）/
   Anthropic / OpenAI / Google（也支持 Mistral、Groq 等）→ 粘贴 Key
2. 对话页切换到该服务商的模型

## 验证：怎样算成功

1. `Jan-Desktop.exe --version` 输出 `0.8.8`（AiBOX 安装后自动校验）
2. 本地路线：下载完模型后发一句话，**有正常回复** = 模型链路通
3. 云端路线：粘贴 Key 后发一句能回复 = Key 配置正确
4. **API 验证（可选）**：Settings 里开启本地 API 后，
   `curl http://localhost:1337/v1/models` 能列出模型 = 其他工具可接入

## 常见问题

- **模型下载很慢/失败**：源在 HuggingFace，网络不稳时换小体积模型或重试；
  也可以先用云端 Key 路线
- **聊天回复很慢**：本地模型吃 CPU/内存，换更小的量化模型或关掉占内存的程序
- **本地 API 连不上**：确认 Settings 中 API 服务已开启、端口是 1337（只监听本机）
- **回答质量差**：小模型能力有限；换更大的模型或改用云端服务商
- **数据想备份**：配置在 `%APPDATA%\Jan`（Windows）/ `~/Library/Application Support/Jan`（macOS），
  卸载前先拷贝出来

## 卸载

- **Windows**：设置 → 应用 → Jan → 卸载；再删 `%LOCALAPPDATA%\Jan`（程序）与
  `%APPDATA%\Jan`（配置、对话、已下载模型——**删前先备份**）
- **macOS**：退出应用后把 `Jan.app` 拖进废纸篓；
  数据在 `~/Library/Application Support/Jan`，要清干净一并删除

更多：[官方文档 jan.ai/docs](https://jan.ai/docs) · [仓库](https://github.com/janhq/jan) · [更新日志](https://jan.ai/changelog)
