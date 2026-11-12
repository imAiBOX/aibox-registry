# CowAgent 安装与使用教程

一句话：**CowAgent（前 chatgpt-on-wechat，4.7 万+ Star）是中文圈流行的开源个人 AI 助手**：装一个桌面客户端就能用，网页控制台一站式聊天、连微信/飞书/Telegram 等渠道、一键安装技能，模型随你换。

## 你将得到

- 桌面客户端开箱即用（内置运行时，双击就跑，不用装 Python）
- 统一网页控制台（`http://localhost:9899`）：聊天、配模型、连渠道、装技能
- 多渠道并行服务 + Skill Hub 技能市场 + 定时任务/记忆/知识库

## 准备（2 分钟）

- **Windows 10/11 x64** 或 **macOS（Intel / Apple Silicon 均有安装包）**
- 一个模型 Key（DeepSeek、Claude、OpenAI、Gemini、通义、GLM、Kimi……任选），或用 CowAgent 官方聚合 Key
- 不需要：管理员权限（安装在你的用户目录）、Docker、Python

> 想跑"服务端/无界面"模式（挂在服务器上接微信等渠道）的高级用户，见下文手动路线，需要 Python 3.7+。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **CowAgent** → 点「安装」
2. AiBOX 下载官方安装包（带 sha256 校验，国内自动走加速通道）：Windows 静默安装到 `%LOCALAPPDATA%\Programs\CowAgent`，macOS 挂载 dmg 拖入应用目录——**全程无需管理员**
3. 从开始菜单 / 启动台打开 **CowAgent**

### 路线 B：手动安装（官方渠道）

- **桌面客户端**：去 [cowagent.ai/download](https://cowagent.ai/download/) 下载对应系统的安装包，双击安装
- **服务端一行命令**（Linux / macOS，装进当前目录的 `CowAgent` 文件夹）：

```bash
bash <(curl -fsSL https://cdn.link-ai.tech/code/cow/run.sh)
```

Windows PowerShell 服务端：

```powershell
irm https://cdn.link-ai.tech/code/cow/run.ps1 | iex
```

装好后浏览器打开 **http://localhost:9899**（服务端模式）。

## 配置（连模型 + 连渠道）

1. 打开控制台 → **模型设置**：选服务商（表格里的 DeepSeek / Claude / OpenAI / Gemini / 通义……）填 Key 保存——**全部在网页里点选，不用改配置文件**
2. 只想用一个 Key 全搞定：选 CowAgent 聚合模型服务
3. 本地免费路线：装 [Ollama](https://ollama.com) 起模型，在「自定义」里填本地端点
4. **渠道**：控制台里按引导连 Telegram / Discord / 微信客服等；**技能**：Skill Hub 一键安装

## 验证：怎样算成功

1. 客户端能正常打开，控制台 `http://localhost:9899` 可访问
2. 聊天框发一句"你好" → **收到正常回复** = 模型通了
3. `cow status`（服务端路线）显示运行中；`cow logs` 无报错
4. 进阶：装一个 Skill Hub 技能，对话里 `/skill list` 能看到它

## 常见问题

- **Windows 提示无法验证发布者**：官方安装包已签名；仍被拦时到「更多信息 → 仍要运行」，或从 AiBOX 路线安装
- **端口 9899 被占用**：先 `cow stop` 停掉旧实例，或改配置里的端口
- **微信等国内渠道连不上**：多为网络/扫码过期，控制台里重新走一遍渠道向导
- **升级**：桌面客户端下载新版覆盖安装即可；服务端执行 `cow update`
- **旧名字 chatgpt-on-wechat**：仓库已改名 CowAgent，旧链接自动跳转，`git remote set-url` 可同步更新

## 卸载

- **桌面客户端**：Windows「设置 → 应用 → CowAgent → 卸载」；macOS 把 CowAgent.app 移到废纸篓
- **服务端**：`cow stop` 后删除 `CowAgent` 目录
- ⚠️ 聊天记录、模型 Key、已装技能在应用数据目录（`%APPDATA%\CowAgent` / `~/Library/Application Support/CowAgent`），卸载程序**不会**删它们，手动清理前请**先备份**

更多：[快速上手文档](https://docs.cowagent.ai/guide/quick-start) · [CLI 参考](https://docs.cowagent.ai/cli/index) · [技能市场](https://skills.cowagent.ai/)
