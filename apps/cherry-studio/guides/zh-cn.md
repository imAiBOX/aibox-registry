# Cherry Studio 安装与使用教程

一句话：**Cherry Studio 是颜值与功能兼顾的桌面 AI 工作台**——一个客户端同时连接多家模型
服务商，聊天、知识库、智能体、翻译、绘图开箱即用，对话数据保存在自己电脑上。

## 你将得到

- 多模型一屏管理：OpenAI、Anthropic、Gemini、OpenRouter 等云端 Key，以及本地 Ollama / LM Studio
- 知识库（RAG）：拖入文件建本地知识库，对话中引用
- 智能体（Agents）与 MCP 扩展、多模型对比回答、Markdown/图表/公式渲染
- 翻译、绘图、语音输入等日常工具；对话历史本机存储，支持本地与 WebDAV 备份

## 准备（3 分钟）

| 需要 | 说明 |
|---|---|
| **Windows 10+** | x64 与 ARM64 各有安装包，装到当前用户目录，**无需管理员权限** |
| **macOS** | Intel / Apple Silicon 各有 dmg |
| 一个模型来源 | 二选一：① 任一云端 API Key（OpenRouter 一个 Key 可用多家模型）② 本地 Ollama/LM Studio（免费离线） |
| 磁盘 | 应用约几百 MB；本地模型另算 |

不需要：Node.js、Python、Docker。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Cherry Studio** → 点「安装」
2. AiBOX 下载官方安装包（sha256 校验，国内走 ghfast / gh-proxy 加速、失败回落直连）：
   Windows 静默装到 `%LOCALAPPDATA%\Programs\Cherry Studio`（零提权）；
   macOS 按机型选 Intel/Apple Silicon dmg 拷入 `/Applications`

### 路线 B：手动安装（官方渠道）

- 官网 [cherryai.com/download](https://cherryai.com/download) 或
  [GitHub Releases](https://github.com/CherryHQ/cherry-studio/releases)：
  Windows 下载 `Cherry-Studio-…-Setup.exe` 双击；macOS 下载对应架构 dmg 拖入 Applications；
  Linux 官方提供 AppImage
- 升级：新版安装包覆盖安装即可，配置和对话不丢

## 配置（连一个模型，你只需要做这一步）

1. 打开 Cherry Studio → 左下角 **设置** → **模型服务商（Model Providers）**
2. 四选一填 Key（都在对应平台申请，粘贴即用）：
   - **OpenRouter（推荐）**：一个 Key 通吃 Claude / GPT / Gemini 等多家模型
   - **Anthropic** / **OpenAI** / **Google**：直连各家官方 API
3. 在该服务商下 **添加要使用的模型**（勾选后才会出现在对话的模型下拉里）
4. **本地模型（可选）**：先启动 Ollama，Cherry Studio 会检测到它——选模型即可，不用 Key
5. 新建对话 → 顶部选择模型 → 开聊

## 验证：怎样算成功

1. `Cherry Studio.exe --version` 输出版本号（AiBOX 安装后会自动校验）
2. 新建对话发一句话，**有流式回复** = Key 与模型链路通
3. 切换另一个模型再发一句，都能回复 = 多模型配置正确
4. 强验证（知识库，可选）：新建知识库 → 上传文件 → 嵌入完成后提问，
   回答引用了你的文件内容 = RAG 通

## 常见问题

- **回复 401 / invalid key**：Key 复制错或余额不足——回服务商页面核对，注意区分"余额"与"额度"
- **模型下拉里没有刚加的模型**：服务商设置里还没"添加模型"——回到设置补勾选
- **检测不到本地 Ollama**：先确认 `ollama serve` 在跑（终端 `ollama list` 不报错），再回 Cherry 刷新
- **界面 / 配置想迁移**：数据在 `%APPDATA%\CherryStudio`（Windows），
  设置里也有本地备份与 WebDAV 备份功能
- **国内网络**：云端 Key 各家直连一般可用；模型列表加载慢属正常，可重试

## 卸载

- **Windows**：设置 → 应用 → Cherry Studio → 卸载；再删 `%APPDATA%\CherryStudio`（对话与配置，删前先在设置里导出备份）
- **macOS**：退出应用后把 `Cherry Studio.app` 拖进废纸篓；
  数据在 `~/Library/Application Support/CherryStudio`，要清干净就一并删除

更多：[官方文档 cherryai.com/docs](https://cherryai.com/docs/en/) · [仓库](https://github.com/CherryHQ/cherry-studio) · [官网](https://cherryai.com)
