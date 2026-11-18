# Dyad 安装教程

## 准备
- **系统**：Windows 10/11 x64，或 macOS 12+（Apple 芯片 / Intel 各有专用包）
- **磁盘**：约 1GB（安装包 170MB / mac 包 125-134MB）
- **权限**：全程免管理员，装在你的用户目录
- **必配**：需要一个模型 API key（OpenAI / Anthropic），或本机 Ollama 模型

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **Dyad** → 点「安装」
2. 下载安装包（国内自动走加速通道，哈希校验后安装）
3. 完成后启动 Dyad（开始菜单 / 应用程序）

## 手动安装
- **Windows**：从 GitHub Releases 下载 `dyad-1.23.0.Setup.exe`，双击安装（用户级，不弹管理员；批量部署可用 `/S` 静默参数）
- **macOS**：下载对应芯片的 zip（Apple 芯片选 arm64，Intel 选 x64），解压后把 **dyad.app** 拖进「应用程序」

## 配置（让它真正干活）
1. 首次启动选择模型供应商 —— 内置 OpenAI 和 Anthropic，也能用本机 Ollama
2. 粘贴 API key（在 https://platform.openai.com/api-keys 或 https://console.anthropic.com/settings/keys 创建）
3. **key 只留在你自己电脑上**（用户数据目录）—— AiBOX 和 Dyad 都不会上传
4. Dyad 可能让你登录 GitHub 以启用仓库相关功能，这一步是可选的

## 做你的第一个应用
1. 用大白话描述你想要的应用（「一个把待办事项存在本地文件里的小工具」）
2. Dyad 写出代码、给你实时预览，你可以接着用对话不断改
3. 应用源码落在 `dyad-apps` 目录 —— 那是真实文件夹里的真实文件，你可以自己打开、改、跑、发到任何地方

## 验证成功
让它做一个很小的应用，看预览能不能渲染出来。能同时看到代码和预览，说明一切正常。

## 遇到问题
- **模型连不上**：检查 key 是否完整、账户是否有余额
- **国内访问慢**：换国内模型接口，或用本地 Ollama
- **生成的应用跑不起来**：生成的项目需要本机装 Node.js 18 或更高版本
- **想留着代码**：所有东西都在 `dyad-apps` 里，随时拷走

## 卸载
Windows：开始菜单 → Dyad → 卸载。macOS：把 dyad.app 从「应用程序」删掉。
模型 key、聊天记录以及 Dyad 帮你生成的所有应用都在数据目录（`%APPDATA%\dyad`、`~/Library/Application Support/dyad`、`~/dyad-apps`）—— **删掉就没了，建议先备份**。AiBOX → 管理 → 卸载会自动备份。
