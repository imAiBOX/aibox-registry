# nanobot 安装与使用教程

一句话：**nanobot（HKUDS，5 万+ Star）是一个超轻量的开源个人 Agent**：网页、终端、聊天应用三种方式都能用，会读写你的文件、记住你的偏好、跑定时任务；纯 Python，配置和聊天记录都存在你自己的 `~/.nanobot`。

## 你将得到

- 浏览器 WebUI（localhost）+ 终端 TUI + Telegram/QQ 等聊天渠道三合一
- 文件读写、定时任务、MCP 工具、技能包、SQLite 会话历史
- 模型自由：OpenAI、Claude、DeepSeek、通义……或完全免费的本地 Ollama

## 准备（3 分钟）

| 需要 | 说明 |
|---|---|
| **Python 3.11+** | `python --version` 检查；没有就先去 [python.org](https://www.python.org/downloads/) 装一个（Windows 记得勾选 "Add to PATH"） |
| 一个模型 | 服务商 Key（OpenAI/Claude/DeepSeek…），或者本地跑 [Ollama](https://ollama.com)（免费离线） |
| 系统 | Windows x64（需 SSE4.2）/ macOS 13+（Intel 与 Apple Silicon 都支持） |

不需要：管理员权限、Docker、服务器。安装目标是用户目录下的独立虚拟环境 `~/.nanobot/venv`，**绝不动系统 Python**。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **nanobot** → 点「安装」
2. AiBOX 下载官方发布轮子（wheel，带 sha256 校验，国内自动走加速通道），在 `~/.nanobot/venv` 里完成安装——和官方安装器同一布局
3. 装完打开终端运行 `nanobot webui` 进入配置

### 路线 B：手动安装（官方命令）

官方推荐安装器（自动建虚拟环境并打开 WebUI）：

```powershell
# Windows PowerShell
irm https://raw.githubusercontent.com/HKUDS/nanobot/main/scripts/install.ps1 | iex
```

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/HKUDS/nanobot/main/scripts/install.sh | sh
```

已会用 uv / pip 的用户（装同一个 `nanobot-ai` 包）：

```bash
uv tool install nanobot-ai        # 或: python -m pip install nanobot-ai
```

## 配置（连接模型）

```bash
nanobot webui     # 浏览器打开 WebUI（终端里会打印登录链接，带 # 后缀要完整复制）
```

1. **Settings → Models** → 保存一个服务商/模型预设（填 Key 或本地端点）
2. 想用本地免费模型：先 `ollama serve` 并 `ollama pull qwen2.5:7b`，在 nanobot 里选 Ollama 提供商
3. 配置写入 `~/.nanobot/config.json`（想把 Key 放环境变量也可以，支持 `${VAR}` 引用）

## 验证：怎样算成功

1. `nanobot --version` 输出 `0.4.1`（或你安装的版本）
2. WebUI 里发一句 `Hello!` → **收到正常回复** = 模型通了
3. 进阶验证：新建话题，让它"读 notes.txt 写一份 summary.md"，打开生成的文件确认内容
4. 想用聊天渠道：在 WebUI 里按引导连 Telegram，发一句话收到回复

## 常见问题

- **`nanobot` 不是内部或外部命令**：安装器会打印可用命令；或直接用 `python -m nanobot webui`（uv/pipx 用户按原工具定位环境）
- **pip 报 `externally-managed-environment`**：别加 `--break-system-packages`——改用官方安装器或 `uv tool install nanobot-ai`
- **国内下载 PyPI 慢**：手动给 pip 配国内镜像（如清华 TUNA），或用 AiBOX 路线（下载层已走国内加速）
- **端口被占 / WebUI 打不开**：终端打印的登录链接是权威入口；服务器场景用 SSH 隧道转发 8765 端口
- **升级**：和安装方式保持一致——`uv tool upgrade nanobot-ai` 或 `python -m pip install -U nanobot-ai`，升级前先停网关并备份 `~/.nanobot`

## 卸载

```bash
# 先停网关（WebUI 里 gateway stop，或 Ctrl+C）
rm -rf ~/.nanobot      # 虚拟环境、config.json、聊天记录都在这里，删除前请备份
```

更多：[稳定版文档 nanobot.wiki](https://nanobot.wiki/docs/latest/getting-started/nanobot-overview) · [仓库文档](https://github.com/HKUDS/nanobot/blob/main/docs/README.md)
