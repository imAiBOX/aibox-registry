# Roo Code 安装与使用教程

一句话：**Roo Code 是装在 VS Code 里的 AI 编程助手扩展**（Apache 2.0 开源，源自 Cline 的分支），自带 Code / Architect / Ask / Debug 多种工作模式，模型随便挑——OpenRouter、Anthropic、OpenAI、Google，甚至本机 Ollama，API key 只保存在你自己电脑上。

> ⚠️ **现状须知**：Roo Code 官方 README 与文档首页已公告扩展于 **2026-05-15 停止运营与更新**（最后一版为 3.54.0）。扩展本体仍可安装、在本机 VS Code 内运行并用你自己的 key 调用模型；若你想要仍在活跃维护的替代品，官方点名推荐 [Cline](https://cline.bot/)（Roo 的来源）与社区分支 [ZooCode](https://github.com/Zoo-Code-Org/Zoo-Code/)。

## 你将得到

- 侧栏常驻的 AI 编程搭档：自然语言生成/重构代码、解释代码库、跑终端命令、接 MCP 服务器
- 五种工作模式随时切换：**Code**（写代码）、**Architect**（画方案）、**Ask**（只答疑）、**Debug**（查问题）、自定义模式
- 模型无关（model-agnostic）：一个扩展通吃云端 API 与本地模型，随时换供应商不换工具

## 准备（3 分钟）

| 需要 | 说明 |
|---|---|
| **VS Code 1.84.0 或更高** | [code.visualstudio.com](https://code.visualstudio.com) 免费下载；VSCodium / Windsurf 等走 Open VSX |
| 一个模型来源 | 云端 API key（OpenRouter / Anthropic / OpenAI / Google…）或本地 Ollama（免费离线） |
| 磁盘与网络 | 扩展约 30MB，安装后联网调用模型 |
| 权限 | **全程免管理员**，扩展装在你的用户目录 |

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Roo Code** → 点「安装」
2. AiBOX 下载扩展包（走国内可达通道，失败自动换源）并做哈希校验
3. 完成后打开 VS Code，左侧活动栏即可看到 Roo Code 图标

### 路线 B：手动安装（官方命令）

方式一：扩展面板（最直观）

1. VS Code 里按 `Ctrl+Shift+X`（macOS `Cmd+Shift+X`）打开扩展视图
2. 搜索 **Roo Code**，选作者为 **RooVeterinaryInc** 的那一个 → 点「安装」
3. 提示重载时重载 VS Code，活动栏出现 Roo Code 图标即成功

方式二：命令行 / 手动装 VSIX（Marketplace 打不开时用）

```bash
code --install-extension rooveterinaryinc.roo-cline
```

或从 [Open VSX](https://open-vsx.org/extension/RooVeterinaryInc/roo-cline) 下载 `.vsix` 文件 → 扩展视图右上「…」菜单 → **Install from VSIX…** 选中安装。

## 配置与验证

### 首次接模型（约 1 分钟）

1. 点侧栏 Roo Code 图标打开面板，欢迎页会让你**选择模型提供方（Provider）**
2. 粘贴对应平台的 API key → 继续 → **选择模型**（如 `claude-sonnet-4-5` 或 `anthropic/claude-sonnet-4`）→ 完成
3. 配置保存在本机（VS Code 用户设置 `~/AppData/Roaming/Code/User/settings.json`），key 不会上传到别处

### 换 / 加第二个 Provider

- 同一入口的 **Provider 下拉**里可随时切换（OpenRouter、Anthropic、OpenAI、Google、DeepSeek、OpenAI 兼容、Ollama、LM Studio 等 20+ 家）
- 切换后**模型列表会跟着换**，务必重新选一次模型——这是最常见的「切了没生效」原因
- 本机免费路线：先跑 `ollama serve && ollama pull qwen2.5:7b`，Provider 选 Ollama、地址 `http://127.0.0.1:11434`，无需 key

### 模型选择建议

| 场景 | 建议 | 理由 |
|---|---|---|
| 想省心 | Claude Sonnet 4.5（官方推荐） | 工具调用最稳，"开箱即用" |
| 一个 key 通吃 | OpenRouter：`anthropic/claude-sonnet-4` / `google/gemini-2.5-flash` | 100+ 模型按量付费，Flash 便宜快速 |
| 复杂任务 | GPT-5 / Claude Sonnet 4.5 | 多步推理更强，单价更高 |
| 完全免费离线 | Ollama：`qwen2.5:7b`、`llama3.2:3b` | 8GB 内存可跑，效果打折扣但零成本 |

### 怎样算成功

1. 面板里发一句「解释一下这个项目」，**几秒内有流式回复** = 模型链路通
2. 再发一个改文件的小任务（如「把 README 里的错别字改掉」），出现**待批准的改动**，点允许后文件真的变了 = 工作流通
3. 左下角切换一次模式（Code → Ask），提问风格明显变化 = 模式生效

## 常见问题

- **提示 key 无效 / 401 / invalid api key**：确认粘贴完整（首尾没漏字符）、key 对应的是**当前选中的 Provider**（拿 OpenRouter 的 key 填 Anthropic 必挂）、账户还有余额；Ollama 等本地 Provider 不要填 key
- **扩展图标不出现**：重启 VS Code → 扩展面板确认 Roo Code 已启用 → `View → Output` 下拉选 **Roo Code** 看报错；确认 VS Code ≥ 1.84.0；Marketplace 打不开就走 Open VSX 或 VSIX 安装
- **换了 Provider 但没生效**：切完 Provider 后**必须重新选模型**；报错先看 Output 面板
- **和 Cline 什么关系？**：Roo Code 由 Cline 分叉而来，界面与玩法更偏「多模式团队」；两者都能用同样的 Provider/key，官方也把 Cline 列为停止更新后的推荐去处
- **还会更新吗？**：官方已公告 2026-05-15 起停止运营，扩展不再发新版；本地使用不受影响，长期维护可迁移到 Cline / ZooCode
- **想离线用**：可以，配一个本地模型（Ollama / LM Studio）即可断网使用

## 卸载

```bash
code --uninstall-extension rooveterinaryinc.roo-cline
```

或在扩展面板找到 Roo Code → Uninstall。卸载前建议备份 `~/AppData/Roaming/Code/User/settings.json`（里面记录了你的 Provider 配置）。

更多：[官方文档](https://roocodeinc.github.io/Roo-Code/) · [Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline) · [GitHub](https://github.com/RooCodeInc/Roo-Code#readme)
