# Ollama 安装与使用教程

一句话：**Ollama 是最流行的本地大模型运行器**——一条命令下载并运行上千个开源模型
（Qwen、Llama、Gemma 等），完全离线、完全免费，聊天和编程工具都能直连它。

## 你将得到

- 一个常驻本机的模型服务：`http://localhost:11434`，任何支持 OpenAI 接口的工具都能接
- 一条命令装模型：`ollama pull qwen2.5:7b`，8 GB 内存就能跑，无需显卡
- 彻底离线：模型下载完成后断网也能用；数据全在自己电脑
- 自带命令行聊天：`ollama run 模型名`，回车就能开聊

## 准备（2 分钟）

| 需要 | 说明 |
|---|---|
| **Windows 10+ x64** | 安装到当前用户目录，**全程无需管理员权限** |
| **macOS** | Intel / Apple Silicon 通用 |
| 内存 | 小模型 4–8 GB（`llama3.2:3b` 低配机可跑，`qwen2.5:7b` 中文好、8 GB 可跑） |
| 磁盘 | 每个模型 1–8 GB，留 10 GB 以上较从容 |
| 网络 | 仅在下载安装包和拉取模型时需要；之后可完全离线 |

不需要：显卡、Python、Node.js、Docker（可选）。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Ollama** → 点「安装」
2. AiBOX 下载官方安装包（sha256 校验，国内自动走 gh-proxy 加速、失败回落直连）：
   Windows 静默装到 `%LOCALAPPDATA%\Programs\Ollama`（当前用户，零提权）；
   macOS 拷入 `/Applications/Ollama.app`
3. 装完 Ollama 服务会自动在后台运行（Windows 通知栏/菜单栏有羊驼图标）

### 路线 B：手动安装（官方命令）

```powershell
# Windows PowerShell
irm https://ollama.com/install.ps1 | iex
```

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh
```

也可以去 [ollama.com/download](https://ollama.com/download) 手动下载 `OllamaSetup.exe` /
`Ollama.dmg` 双击安装；国内直连慢时可改用 GitHub Releases 的加速通道。

## 配置（下载第一个模型，你只需要做这一步）

```bash
ollama pull qwen2.5:7b     # 中文好，8 GB 内存可跑（AiBOX 推荐）
ollama run qwen2.5:7b      # 直接开聊，输入 exit 退出
```

- 想换模型：`ollama pull llama3.2:3b`（低配机入门）等，完整列表见 [ollama.com/library](https://ollama.com/library)
- 高级项（可选）：模型存放在 `%LOCALAPPDATA%\Ollama\models`（Windows）/ `~/.ollama/models`（macOS），
  可用环境变量 `OLLAMA_MODELS` 改位置、`OLLAMA_HOST` 改监听端口

## 验证：怎样算成功

1. `ollama --version` 输出 `0.40.16`（或你装的版本）
2. `ollama list` 能列出刚拉下来的模型
3. `curl http://localhost:11434/api/tags` 返回模型 JSON = 本地服务在跑
4. **对话验证**：`ollama run qwen2.5:7b` 问一句"你好"，**有正常回复** = 全链路通
5. 工具接入验证（可选）：任何 OpenAI 兼容客户端把地址填 `http://localhost:11434/v1`、
   Key 随便填一个字符串即可连通

## 常见问题

- **`ollama run` 报连接被拒 / API 不通**：服务没起来——启动 Ollama（菜单栏图标）或手动 `ollama serve`
- **拉模型很慢或中断**：下载走海外源，重试即可；大模型网络不稳时先试小模型 `llama3.2:3b`
- **端口 11434 被占用**：设 `OLLAMA_HOST=127.0.0.1:11435` 后重启 Ollama
- **回复很慢 / 内存不够**：换更小的量化模型（3B 级别），或关掉其他占内存的程序
- **想让局域网其他设备访问**：默认只监听本机（更安全）；确有需要再设 `OLLAMA_HOST=0.0.0.0:11434`
- **升级**：重装新版安装包覆盖即可，模型目录不受影响

## 卸载

- **Windows**：设置 → 应用 → Ollama → 卸载（先退出菜单栏图标）；
  再删 `%LOCALAPPDATA%\Ollama`（下载的模型，数 GB）与 `%LOCALAPPDATA%\Programs\Ollama` 残留
- **macOS**：退出菜单栏图标后把 `/Applications/Ollama.app` 拖进废纸篓；
  再删 `~/.ollama`（模型数据）

更多：[官方快速开始 docs.ollama.com/quickstart](https://docs.ollama.com/quickstart) · [API 文档](https://docs.ollama.com/api) · [模型库](https://ollama.com/library)
