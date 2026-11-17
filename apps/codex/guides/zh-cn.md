# Codex 安装教程

## 准备
- **系统**：Windows 10/11 x64
- **磁盘**：约 400MB（单文件 382MB）
- **权限**：全程免管理员
- **必配**：ChatGPT 账号（Plus/Pro/Team）或 OpenAI API key

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **Codex** → 点「安装」
2. 下载单文件（国内自动走加速通道，哈希校验后放进用户目录）
3. 完成后**打开终端**（PowerShell 或 Windows Terminal）

## 手动安装
从 GitHub Releases 下载 `codex-x86_64-pc-windows-msvc.exe`，改名为 `codex.exe` 放到任意目录（如 `%LOCALAPPDATA%\Programs\Codex\`）。

## 配置（让它真正干活）
1. 终端里运行 `codex.exe login` —— 按提示用 ChatGPT 账号登录（或配置 API key）
2. **凭据只保存在本机** `~/.codex/`，AiBOX 与 Codex 都不会上传它

## 验证成功
在项目目录运行 `codex.exe "写一个 hello world 并运行"`，看到它自己改代码、执行命令并汇报结果，即安装配置成功。

## 常见问题
- **`codex` 不是内部或外部命令**：用完整路径运行，或把目录加进 PATH
- **登录失败**：检查网络能否访问 chatgpt.com / api.openai.com
- **国内访问慢**：ChatGPT 登录与 API 需要可直连的网络环境

## 卸载
删除 `%LOCALAPPDATA%\Programs\Codex` 与 `~/.codex`（后者含登录 token，建议删除）。
