# Cline 安装与使用教程

一句话：**Cline（GitHub 7 万+ Star）是 VS Code 里的开源编码代理**：它自己改文件、跑命令、开浏览器，
但每一步都要你点头——比"一键生成"更可控，比手写更省事。

## 你将得到

- 侧边栏常驻的 AI 编程助手：Plan（先出计划）/ Act（动手执行）两种模式
- 自动读项目结构、改多文件、跑终端命令、盯 lint 报错，全部带 Diff 预览和检查点（可回滚）
- 模型随你选：Cline 官方云端模型、ClinePass 订阅，或自带 Anthropic / OpenAI / OpenRouter / 本地 Ollama 的 Key

## 准备（2 分钟）

- **Visual Studio Code 1.101 或更高版本**（硬性前置，官方 vsix 要求；没有就先装 VS Code——这是手动路线的前提）
- 一个模型来源：Cline 云端 / ClinePass / 自带 Key（四选一即可）
- macOS 首次用命令行安装的话：VS Code 命令面板执行一次 `Shell Command: Install 'code' command in PATH`
- 不需要：管理员权限、Docker、Node.js（扩展跑在 VS Code 自带的运行时里）

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Cline** → 点「安装」
2. AiBOX 下载官方发布页的 VSIX 扩展包（带 sha256 校验，国内自动走加速通道），用 VS Code 自己的
   `code --install-extension` 装进去——和商店安装是同一条通道，**全程无需管理员**
3. 侧边栏出现 Cline 图标即装好

### 路线 B：手动安装（官方渠道）

- **扩展商店**：VS Code → 扩展面板（`Ctrl/Cmd + Shift + X`）→ 搜 **Cline** → Install
  （[直达页](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)）
- **命令行**：`code --install-extension saoudrizwan.claude-dev`
- VSCodium / Windsurf 走 Open VSX，安装流程相同（官方文档）
- 顺带一提：Cline 还有桌面版（[cline.bot/desktop](https://cline.bot/desktop)）和终端 CLI（`npm i -g cline`）

## 配置（选一个模型来源）

1. 点侧边栏 Cline 图标 → **API Configuration**
2. 三选一：
   - **Cline Provider**：按量付费的官方云端模型，登录即用
   - **ClinePass**：包月订阅
   - **自带 Key**：选 Anthropic / OpenAI / OpenRouter 粘贴 Key；或选 Ollama 填本地端点（免费离线）
3. 项目级规则写在仓库根目录 `.clinerules` 文件里（编码规范、构建命令等），Cline 会自动读取

## 验证：怎样算成功

1. 侧边栏能打开 Cline 面板，API Configuration 里模型列表正常加载
2. 随便开个小项目，输入"帮我把这个函数加上单元测试"→ 出现 **Plan** 计划 → 你点批准 → 它开始改文件
3. 每处修改都有 Diff 预览，点 Accept 才落盘；右上角检查点能一键回滚
4. 终端验证（可选）：

```bash
code --list-extensions --show-versions | grep saoudrizwan
# 输出应含 saoudrizwan.claude-dev@x.y.z
```

## 常见问题

- **提示 `code` 不是命令**：macOS 在 VS Code 命令面板执行 `Shell Command: Install 'code' command in PATH`
  后重开终端；Windows 重装 VS Code 时勾选 "Add to PATH"
- **Key 安全吗**：Cline 把 Key 存在 VS Code 自己的凭据库（SecretStorage，系统级加密），不落明文配置文件
- **额度/报错**：先看 Cline 面板里的用量与报错弹窗；换模型或换 Key 通常即可恢复
- **升级**：扩展面板点 Update，或用 AiBOX 重新安装新版 VSIX（`--force` 覆盖）
- **不想让它自动执行**：保持 Plan 模式，或在 Act 模式下收紧 Auto-approve 勾选项

## 卸载

- 扩展面板 → Cline → **Uninstall**（或 `code --uninstall-extension saoudrizwan.claude-dev`）
- 残留目录：`~/.vscode/extensions/saoudrizwan.claude-dev-*`（VSCodium 在 `~/.vscode-oss/extensions`），
  只删这个子目录，**别动整个 extensions 文件夹**
- ⚠️ 任务历史、检查点与扩展设置会随之删除，Key 也会失效——有需要先备份

更多：[安装文档](https://docs.cline.bot/getting-started/installing-cline) · [Cline 文档](https://docs.cline.bot) · [规则配置](https://docs.cline.bot/customization/cline-rules)
