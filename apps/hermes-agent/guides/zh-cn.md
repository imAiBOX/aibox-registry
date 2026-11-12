# Hermes Agent 安装与使用教程

一句话：**Hermes Agent（Nous Research，26 万+ Star）是一个开源个人 Agent**：终端里直接聊天，也能接管 Telegram / Discord / Slack / WhatsApp 等消息渠道；一条命令装好，自带全套运行工具链，全程装在你自己的用户目录、不需要管理员权限。

## 你将得到

- 终端 TUI 聊天 + 消息网关（一条命令 `hermes` 开聊）
- 技能、子代理、定时任务、会话压缩、工作区隔离等完整 Agent 能力
- 自带 Python 3.14 / Node / npm / pnpm / ripgrep / FFmpeg 工具链，不污染系统环境

## 准备（2 分钟）

- **Windows**：Windows 10/11 原生 PowerShell 即可（**不需要 WSL**）；装到 `%LOCALAPPDATA%\hermes`
- **macOS**：一条 curl 命令，装到 `~/.hermes`
- 一个模型 Key（OpenAI / Anthropic / OpenRouter……），或者直接用 **Nous Portal** 订阅（一个订阅包模型 + 联网搜索 + 生图 + 语音）
- 不需要：管理员权限、Docker、Python/Node（安装器自带）

> ⚠️ **杀软误报提醒**（官方说明）：Windows Defender / Bitdefender 可能拦截 `hermes\bin\uv.exe`——它是 Astral 的 Python 包管理器 uv，属于知名误报。按官方指引把 `bin` 目录加入白名单（白名单**目录**而非文件哈希）即可。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Hermes Agent** → 点「安装」
2. AiBOX 先下载官方安装脚本并做哈希校验（`install.ps1` / `install.sh`），再以官方同样的方式执行它：Windows 走 `Invoke-Expression`，macOS 走管道给 `bash`
3. 装完按提示重开终端，输入 `hermes` 进入

### 路线 B：手动安装（官方命令）

Windows（PowerShell）：

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

macOS / Linux / WSL2：

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

装完 `source ~/.bashrc`（或 `~/.zshrc`）后即可使用。

## 配置（选模型 + 连 Key）

第一次用推荐跑引导向导：

```bash
hermes setup            # 一条命令配置全部：模型、工具、消息渠道
hermes setup --portal   # 或者用 Nous Portal：OAuth 登录即包办模型与工具网关
```

- 手动方式：`hermes model` 选服务商和模型（OpenRouter / OpenAI / Anthropic / Nous……），`hermes tools` 管理工具开关
- 配置写在 `~/.hermes/config.yaml`（Windows 为 `%LOCALAPPDATA%\hermes\config.yaml`），密钥只落在本机
- 想从别的 Agent 迁移：`hermes setup` 会自动发现 `~/.openclaw`、`~/.claude` 等并引导导入

## 验证：怎样算成功

1. `hermes --version` 输出版本号（如 `0.23.1`）
2. 终端输入 `hermes`，随便问一句，**能正常回复** = 模型通了
3. 想用消息渠道：`hermes gateway setup` → `hermes gateway start`，然后给你的 Telegram bot 发一句话收到回复
4. `hermes doctor` 无异常 = 环境健康

## 常见问题

- **装完找不到 `hermes` 命令**：重开一个终端（安装器更新了 PATH）；PowerShell 里仍找不到就检查 `$env:LOCALAPPDATA\hermes\bin` 是否在 PATH
- **uv.exe 被杀软隔离**：误报，按上文把 `bin` 目录加白名单
- **升级**：直接 `hermes update`（官方自更新命令）
- **想换模型随时**：`hermes model`，无需改代码、无锁定

## 卸载

```bash
hermes uninstall        # 官方卸载命令
# 残留时手动删除：
#   macOS/Linux: rm -rf ~/.hermes
#   Windows:     删除 %LOCALAPPDATA%\hermes
```

⚠️ 卸载会删掉 `config.yaml` 里的 Key、聊天会话和已装技能——**先备份 `~/.hermes`**。

更多：[官方文档](https://hermes-agent.nousresearch.com/docs/) · [快速上手](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
