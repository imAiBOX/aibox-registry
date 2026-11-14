# Continue 安装与使用教程

一句话：**Continue（GitHub 3.6 万+ Star）是 VS Code / JetBrains 里的开源 AI 编程副驾**——它住在侧边栏，
陪你聊代码、改文件、做补全；所有配置就是你自己电脑上的一个 YAML 文件。

## 你将得到

- 侧边栏里的对话、自动补全与多文件编辑（`Ctrl/Cmd + L` 唤起）
- 本地优先的配置：`~/.continue/config.yaml`——可以进版本库，配合本地模型完全离线可用
- 模型随你选：Anthropic / OpenAI / OpenRouter 的 Key，或用 Ollama 跑免费本地模型

## 准备（2 分钟）

- **Visual Studio Code 1.70 或更高版本**（官方 VSIX 的 `engines` 字段硬性要求，随包实测；JetBrains 也可用）
- 一个模型来源：自己的 API Key，或本地 Ollama 服务（任选其一）
- macOS 若走命令行安装：在 VS Code 命令面板执行一次 `Shell Command: Install 'code' command in PATH`
- 不需要：管理员权限、Docker、Node.js（扩展跑在 VS Code 自带运行时里）
- 小提示：上游仓库已设为只读、官方发完 2.0.0 最终版（官方 README 实证）——扩展本身照常可用

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Continue** → 点「安装」
2. AiBOX 从 Open VSX 下载对应平台的 VSIX（带 sha256 校验），用 VS Code 自己的
   `code --install-extension` 装进去——和商店安装是同一条通道，**全程无需管理员**
3. 侧边栏出现 Continue 图标即装好

### 路线 B：手动安装（官方渠道）

- **扩展商店**：VS Code → 扩展面板（`Ctrl/Cmd + Shift + X`）→ 搜 **Continue** → Install
  （[直达页](https://marketplace.visualstudio.com/items?itemName=Continue.continue)）
- **命令行**：`code --install-extension Continue.continue`
- Open VSX 系编辑器（VSCodium / Windsurf / Cursor）：在 Open VSX 里装 **Continue**，流程相同
- JetBrains：从 JetBrains 插件市场安装（官方 README 现在同时推荐配套的 Continue CLI）

## 配置

1. 打开侧边栏 Continue 面板（`Ctrl/Cmd + L`）→ 聊天输入框上方的配置选择器 → 齿轮图标 → **Local Config**
2. 首次使用会自动生成 `~/.continue/config.yaml`（Windows 在 `%USERPROFILE%\.continue\config.yaml`），带合理默认值
3. 选模型：在 YAML 的 `models:` 里加 Anthropic / OpenAI / Ollama 等，或直接用模型下拉框；
   官方最佳实践是用环境变量引用 Key（如 `os.environ/ANTHROPIC_API_KEY`），不要把密钥写进文件
4. 保存即生效——Continue 自动重载配置，无需重启
5. 项目级规则写在仓库内的 `.continue/config.yaml`，或者全部放全局，随你习惯

## 验证：怎样算成功

1. Continue 面板能打开，模型下拉框里能看到你配置的模型
2. 随便开个小项目，问"解释一下这个文件"→ 能正常流式回答
3. 让它改代码 → 编辑器里出现 Diff → 你确认后应用
4. 终端验证（可选）：

```bash
code --list-extensions --show-versions | rg Continue
# 输出应含 Continue.continue@x.y.z
```

## 常见问题

- **提示 `code` 不是命令**：macOS 在 VS Code 命令面板执行 `Shell Command: Install 'code' command in PATH`
  后重开终端；Windows 重装 VS Code 时勾选 "Add to PATH"
- **配置不生效**：确认文件路径与系统一致、YAML 语法正确（Continue 会行内标错）
- **Key 放哪安全**：放环境变量——config.yaml 就能放心提交到仓库，不含任何密钥（官方建议）
- **升级**：扩展商店自动更新，或用 AiBOX 重装新版 VSIX（`--force` 覆盖）
- **断网可用吗**：配好本地 Ollama 模型后可以完全离线（官方指南）

## 卸载

- 扩展面板 → Continue → **Uninstall**（或 `code --uninstall-extension Continue.continue`）
- 残留目录：`~/.vscode/extensions/Continue.continue-*`（VSCodium 在 `~/.vscode-oss/extensions`），
  只删这个子目录，**别动整个 extensions 文件夹**
- ⚠️ 本机配置（`~/.continue/config.yaml`）是独立文件——想保留规则和模型选择请先导出

更多：[安装文档](https://docs.continue.dev/ide-extensions/install) · [配置指南](https://docs.continue.dev/guides/understanding-configs) · [官方文档](https://docs.continue.dev)
