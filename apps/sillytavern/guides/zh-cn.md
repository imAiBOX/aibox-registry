# SillyTavern 安装与使用教程

一句话：**SillyTavern（酒馆）是跑在你自己电脑上的角色扮演 AI 聊天前端**——浏览器里使用，支持几乎所有大模型接口（云端 API、本地模型都行），角色卡、预设、扩展一应俱全，数据全部留在本机。

## 你将得到

- 本地网页版聊天室：`127.0.0.1:8000`，角色卡 / 群聊 / 世界书 / 记忆应有尽有
- 模型随便接：OpenAI、Claude、Google、OpenRouter、DeepSeek、AI Horde（免费白嫖）、KoboldCpp、Ollama 本地模型……
- 扩展生态：翻译、图片生成、语音、TTS、表情图、检索增强等，面板里一键装

## 准备（5 分钟）

| 需要 | 说明 |
|---|---|
| **Windows 10/11 或 macOS 12+** | Linux 同样支持；全程**免管理员**，程序在你的用户目录 |
| **Node.js 18+** | [nodejs.org](https://nodejs.org) 下载 LTS 版；`node --version` 检查 |
| **Git** | 装扩展 / 更新都要用它；Windows 装 [git-scm.com](https://git-scm.com/download/win) 版 |
| 一个模型来源 | 云端 API key，或本地 Ollama / KoboldCpp；**零成本试玩**可用 AI Horde（key 填 `0000000000`） |

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **SillyTavern** → 点「安装」
2. AiBOX 克隆官方源码到 `~/SillyTavern`（哈希校验，国内自动走代理通道），首次启动自动执行 `start.sh` 装依赖
3. 完成后浏览器打开 `http://127.0.0.1:8000` 即可

### 路线 B：手动安装（官方命令）

```bash
git clone --depth 1 -b 1.19.0 https://github.com/SillyTavern/SillyTavern.git ~/SillyTavern
cd ~/SillyTavern && ./start.sh        # Windows 双击 Start.bat 或在 Git Bash 里执行
```

`start.sh` 每次都会先 `npm install`（幂等）再启动服务——**装到一半断网/中断了？直接重跑同一条命令就续上了**，不会重复下载已完成的部分出错。

### 版本与更新（release / staging 双分支）

- 官方维护两个分支：**`release`（推荐，约每月随大版本更新，最稳）** 和 `staging`（每天多次更新，可能随时弄坏，仅供爱折腾者）
- AiBOX 装的是 `release` 分支的固定 tag（如 1.19.0），要**升级**：在 `~/SillyTavern` 里 `git fetch && git checkout 1.x.y`（或直接 `git pull`）后重跑 `./start.sh`，依赖会自动补齐
- 想尝鲜新功能：`git checkout staging && ./start.sh`；出问题再切回 `git checkout release`

## 配置与验证

### 接模型（API 连接类型怎么选）

顶部菜单 **API Connections** → API 下拉里先选**大类**，再选**来源**：

| 类型 | 什么时候用 | 典型选项 |
|---|---|---|
| **Chat Completion** | 云端对话型 API（最省心） | OpenAI、Claude、Google、OpenRouter、DeepSeek |
| **Text Completion** | 本地模型 / 续写型 API，需配 Instruct 模板 | Ollama、KoboldCpp、TabbyAPI、llama.cpp |
| **AI Horde** | 完全免费、志愿者算力，速度看运气 | key 填 `0000000000` 即可开聊 |
| 其他 | 特殊需求 | NovelAI、Mancer、Pollinations 等 |

- 填完 key 或本地地址点 **Connect**，显示 **Valid** 才算连上
- 本地模型走 Text Completion 时，去 **Advanced Formatting** 选模型对应的 **Instruct 模板**（模型说明页一般写着）
- 设置存在 `~/SillyTavern/data/default-user/`，换机可整体拷走

### 角色卡导入

1. 顶栏 **角色管理** → **Import**：支持拖入 PNG 角色卡文件、贴角色卡网页 URL、或从内置列表挑
2. 从第三方网站导入 URL 时，域名需在 `config.yaml` 的 `whitelistImportDomains` 里（防止乱拉外部内容）
3. 选中角色，在底部输入框发消息，角色会按人设回复 = 导入成功

### 预设与采样入门

- **用户设置（User Settings）→ AI Response Formation**：预设下拉（经典 / Alpaca 等）决定整体提示词拼法，新手先用默认
- 同面板的 **Temperature、Top P、重复惩罚** 是最常动的三个采样参数：回复太呆板 → 温度调高（0.9~1.1）；开始胡言乱语 → 调低（0.6~0.8）
- 换模型后建议**换回该模型推荐的预设**，并到 Advanced Formatting 核对 Instruct 模板

### 怎样算成功

1. 浏览器打开 `http://127.0.0.1:8000`（终端输出的地址为准）
2. API Connections 显示 **Valid**
3. 随便挑个内置角色发一句话，**几秒内有符合人设的回复** = 全链路通

## 常见问题

- **`npm could not be found`**：装 Node.js 18+ 后**重开终端**再跑 `./start.sh`
- **端口被占**：`./start.sh --port 8001` 换端口（参数原样透传给服务端，`--listen` 可让局域网访问，`--browserLaunchEnabled false` 关闭自动开浏览器）
- **装到一半失败**：直接重跑 `./start.sh` 即可续装；`node_modules` 已装好的部分不会重来
- **扩展装不上**：装扩展**必须有 git**；面板 → Extensions → Download Extensions & Assets → Load Asset List → Download
- **连不上 API**：先确认 key 有效、余额够；本地模型确认服务在跑（如 `ollama serve`）且地址端口对
- **想要局域网/手机访问**：加 `--listen` 启动，并务必配 `whitelist`（`./start.sh --listen --whitelist`），别裸奔公网

## 卸载

```bash
rm -rf ~/SillyTavern                                  # 程序 + 角色卡 + 聊天记录都在这，先备份 data/
rm -rf ~/AppData/Roaming/SillyTavern                  # Windows 全局模式残留
rm -rf ~/Library/Application\ Support/SillyTavern     # macOS 全局模式残留
```

AiBOX「管理 → 卸载」可代劳；卸载前记得导出你的角色卡和聊天记录。

更多：[官方文档](https://docs.sillytavern.app/) · [快速开始](https://docs.sillytavern.app/usage/quick-start/) · [GitHub](https://github.com/SillyTavern/SillyTavern)
