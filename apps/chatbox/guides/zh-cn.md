# Chatbox 安装与使用教程

一句话：**Chatbox 是轻量跨平台 AI 聊天客户端**——界面简单、装完就能聊，支持多家模型
随时切换，对话数据只保存在你自己电脑上。

## 你将得到

- 极简上手：装好、填一个 Key、开聊，没有多余概念
- 多服务商切换：OpenRouter / Anthropic / OpenAI / Google 内置支持，也能接本地 Ollama 或自定义接口
- 本机数据：对话存在本机，支持导出备份；桌面版支持 Windows / macOS / Linux
- 流式回复、Markdown 与代码高亮、提示词库、深色主题

## 准备（3 分钟）

| 需要 | 说明 |
|---|---|
| **Windows 10+（x64）** | 官方系统要求；装到当前用户目录，**无需管理员权限** |
| **macOS 11+** | Intel 与 Apple Silicon 各有安装包 |
| 一个模型 Key | 推荐 OpenRouter（一个 Key 用多家模型）；或用本地 Ollama（免费离线） |
| 磁盘 | 应用很小（约 100 MB 级） |

不需要：Node.js、Python、Docker、显卡。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Chatbox** → 点「安装」
2. AiBOX 从**官方 CDN（download.chatboxai.app）**下载安装包（sha256 校验，全球同源）：
   Windows 静默装到 `%LOCALAPPDATA%\Programs\Chatbox`（零提权）；
   macOS 按机型选 Apple Silicon / Intel dmg 拷入 `/Applications`

### 路线 B：手动安装（官方渠道）

- 官网 [chatboxai.app](https://chatboxai.app)（选 Windows / Mac Intel / Mac Apple Silicon / Linux），
  或 [GitHub Releases](https://github.com/chatboxai/chatbox/releases)
- Linux 官方给 AppImage；也有 iOS / Android 商店版（与桌面版数据不互通）

## 配置（填一个 Key，你只需要做这一步）

1. 打开 Chatbox → 左下角 **Settings（设置）** → **AI Provider（模型服务商）**
2. 四选一填 Key（都在对应平台申请）：
   - **OpenRouter（推荐）**：一个 Key 通吃 Claude / GPT / Gemini 等
   - **Anthropic** / **OpenAI** / **Google**：直连官方 API
3. 选择要使用的 **Model（模型）**，保存
4. **本地免费路线（可选）**：Provider 选 **Ollama**（先让 Ollama 在跑），或选自定义接口填
   `http://localhost:11434/v1`（任意 OpenAI 兼容端点）
5. 回到对话页发一句话即可

## 验证：怎样算成功

1. `Chatbox.exe --version` 输出 `1.24.3`（AiBOX 安装后自动校验）
2. 新建对话发一句"你好"，**有流式回复** = Key 与模型链路通
3. 切换到另一个服务商/模型再发一句，都能回复 = 配置正确
4. 重启 Chatbox 后历史对话还在 = 本机存储正常

## 常见问题

- **回复 401 / unauthorized**：Key 复制不完整或未充值——回服务商控制台核对后再贴
- **模型下拉是空的**：该服务商还没选模型——回 Settings → AI Provider 补选
- **想换模型**：随时在 Settings → AI Provider 里切换，对话历史不受影响
- **网络问题（国内）**：官方 CDN 全球可下；模型回复慢多是所选服务商的网络，可换 OpenRouter 或本地 Ollama
- **数据备份 / 迁移**：对话保存在本机（配置位于 `%APPDATA%\Chatbox`），
  设置里可导出数据；换电脑前先备份

## 卸载

- **Windows**：设置 → 应用 → Chatbox → 卸载；再删 `%APPDATA%\Chatbox`（配置与对话，删前先在设置里导出）
- **macOS**：退出应用后把 `Chatbox.app` 拖进废纸篓；
  数据在 `~/Library/Application Support/Chatbox`，要清干净一并删除

更多：[官网 chatboxai.app](https://chatboxai.app) · [仓库](https://github.com/chatboxai/chatbox) · [FAQ](https://github.com/chatboxai/chatbox/blob/master/doc/FAQ.md)
