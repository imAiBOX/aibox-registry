# LobeHub（LobeChat）桌面版安装与使用教程

一句话：**LobeHub（GitHub 8.4 万+ Star）是开源 AI 聊天工作台**——官方桌面版把多家模型、
多 Agent 对话、记忆与 MCP 连接器装进一个精致的客户端，凭据加密存在本机。

## 你将得到

- Windows / macOS（Apple Silicon 与 Intel 均有）原生桌面应用，内置自动更新
- 一个客户端接多家服务商：OpenAI、Anthropic、Google、OpenRouter、DeepSeek……以及本地 Ollama / LM Studio
- Agent 相关能力：多 Agent 会话、记忆、知识文件、在本机运行的 MCP 连接器
- 数据留在设备上：本地对话存在应用自己的数据目录；登录账号后内容跨桌面/网页/手机同步

## 准备（2 分钟）

- Windows 10/11（x64）或 macOS（Apple Silicon / Intel）——下载对应安装包
- 一个模型来源：云端 API Key，或本地 Ollama 服务（任选其一）
- 不需要：管理员权限（Windows 安装器按用户安装）、Docker、Node.js、自建服务器
- 小提示：桌面版并非完全离线——云模型、登录与同步都需要网络（官方文档）

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **LobeHub** → 点「安装」
2. AiBOX 下载官方 GitHub Release 安装包（带 sha256 校验，国内自动走加速通道），
   Windows 走 NSIS 静默安装（`/S`），macOS 挂载 DMG 拷贝应用——**全程无需管理员**
3. 从开始菜单 / 应用程序启动 **LobeHub** 即可

### 路线 B：手动安装（官方渠道）

- **官方下载页**：[lobehub.com/downloads](https://lobehub.com/downloads) → Windows 安装器或 macOS DMG（Apple Silicon / Intel）
- **Windows**：运行 `LobeHub-x.y.z-setup.exe`——按用户安装到 `%LOCALAPPDATA%\Programs\LobeHub`
- **macOS**：打开 DMG 把 **LobeHub.app** 拖进 `/Applications`（已签名并公证）
- 网页版 [app.lobehub.com](https://app.lobehub.com) 则完全免安装

## 配置

1. 首次启动：注册 / 登录个人账号（同一账号跨桌面、网页、手机同步；**只存在本机**的文件不会自动同步——官方文档）
2. 接模型：**Settings → AI Providers** → 选服务商 → 打开开关 → 粘贴 API Key
   （多数服务商只需 Key；Bedrock / Azure 还会要求区域、端点等字段）
3. 本地模型：选 Ollama / LM Studio / vLLM，在 **Proxy URL** 栏填本地服务地址
4. 每个 Agent 可以单独选默认模型——在 Agent 设置里改

## 验证：怎样算成功

1. 窗口正常打开，已登录（或处于本地模式）
2. **Settings → AI Providers** 里你的服务商开关是绿色
3. 主窗口发一条测试消息（"你好"）→ 能流式收到回复
4. 终端验证（Windows，可选）：

```powershell
"%LOCALAPPDATA%\Programs\LobeHub\LobeHub.exe" --version
# 输出 x.y.z，与 AiBOX 安装的版本一致
```

## 常见问题

- **数据在哪**：本地对话与会话在 `%APPDATA%\LobeHub`（Windows）/ `~/Library/Application Support/LobeHub`（macOS）；账号内容跟登录走
- **Key 安全吗**：凭据由桌面应用加密存储（官方 desktop README 实证）
- **服务商连不上**：检查 Key，或在 **Proxy URL** 填 API 兼容端点 / Ollama 地址
- **国内网络**：服务商端点慢可用 Proxy URL 换镜像端点；应用本体从 GitHub Release 下载（AiBOX 自动走加速通道）
- **升级**：应用自动更新；用 AiBOX 重装也会被新版覆盖更新
- **卸载前想留东西**：只存在于本机的对话不会保留——先导出/备份

## 卸载

- **Windows**：设置 → 应用 → LobeHub → 卸载（或 `%LOCALAPPDATA%\Programs\LobeHub` 里的卸载器）
- **macOS**：退出 LobeHub，把 `/Applications` 里的 **LobeHub.app** 拖进废纸篓
- 残留目录：`%APPDATA%\LobeHub` / `~/Library/Application Support/LobeHub`——想清干净就删掉
- ⚠️ 只存在这台设备上的内容不会自动同步——删除前先备份/导出

更多：[下载页](https://lobehub.com/downloads) · [桌面版说明](https://lobehub.com/docs/usage/getting-started/get-lobehub) · [模型服务商](https://lobehub.com/docs/usage/providers) · [自托管（网页版）](https://lobehub.com/docs/self-hosting/start)
