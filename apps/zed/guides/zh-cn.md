# Zed 安装教程

## 准备
- **系统**：Windows 10（1903+）/ Windows 11，或 macOS 12+（Apple 芯片 / Intel 各有专用包）
- **磁盘**：约 500MB（安装包 56-63MB / mac 包 85-93MB）
- **权限**：全程免管理员，装在你的用户目录
- **必装**：什么都不用装。Zed 是原生 Rust 程序——不需要 Node、Python、.NET 或 VC++ 运行库；但需要支持 DirectX 11 的显卡

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **Zed** → 点「安装」
2. 下载安装包（国内自动走加速通道，哈希校验后安装）
3. 完成后启动 Zed（开始菜单 / 应用程序）

## 手动安装
- **Windows**：从 GitHub Releases 下载 `Zed-x86_64.exe`（Intel/AMD）或 `Zed-aarch64.exe`（Windows ARM 机型），双击安装即可（装到 `%LOCALAPPDATA%\Programs\Zed`，不弹管理员）。用 AiBOX 装还会自动带上 `/TASKS` 参数，**不会改动你的文件关联、右键菜单和 PATH**
- **macOS**：下载对应芯片的 dmg（Apple 芯片选 arm64，Intel 选 x64），打开后把 **Zed.app** 拖进「应用程序」

## 配置（让它真正干活）
Zed 首先是个代码编辑器 —— 打开一个文件夹就能用。AI 部分：
1. 打开窗口右侧的 **Agent Panel**（智能体面板）
2. 填入 Anthropic 或 OpenAI 的 API key 即可用
3. 也可以从 Agent Panel 的注册表里接入**外部智能体**：Claude Code、Codex、Gemini CLI、OpenCode、Pi 等（各智能体自己负责登录）

**key 只留在你自己电脑上** —— 存在用户目录下的 `settings.json` 里。

## 为什么值得用
- **秒开**：原生 Rust 二进制，不是 Electron，不跑网页
- **为智能体而生**：Agent Panel 是一等功能，不是外挂的聊天框
- **可扩展**：扩展跑在沙箱化的 WASM 运行时里，语言服务器帮你装好
- **免费开源**：GPL-3.0-or-later，部分组件为 Apache-2.0

## 验证成功
打开一个含有文本文件的文件夹，随便敲点内容，然后在 Agent Panel 里问「解释一下这个文件」。如果它能基于你的文件回答，说明配置成功。

## 遇到问题
- **提示「不支持的显卡」/ 白屏**：Zed 需要支持 DirectX 11 的显卡（微软基础显示适配器不支持）—— 通常是显卡驱动没装
- **扩展或语言服务器加载不了**：到 设置 → Zed Tasks 看报错，有些需要你另外装工具链（比如 rust-analyzer）
- **找不到外部智能体**：先自己装好那个命令行工具（例如 `npm i -g @openai/codex`），再从 Agent Panel 里连接
- **国内访问慢**：用 AiBOX 装（它会自动走国内镜像）

## 卸载
Windows：设置 → 应用 → Zed → 卸载。macOS：把 Zed.app 拖进废纸篓。
卸载会移除它添加的文件关联、PATH 项和右键菜单包，但设置、快捷键、主题和代码片段会保留在 `%APPDATA%\Zed`（Windows）或 `~/.config/zed`（macOS）—— **只有想彻底清空才手动删这些目录**。AiBOX → 管理 → 卸载会自动备份。
