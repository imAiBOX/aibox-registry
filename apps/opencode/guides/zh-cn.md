# OpenCode 安装教程

## 准备
- **系统**：Windows 10/11（x64/ARM64）或 macOS 12+（Apple 芯片 / Intel）
- **磁盘**：约 400MB（安装包 119-156MB）
- **权限**：全程免管理员，装在你的用户目录
- **必配**：需要一个模型 API key（OpenRouter / Anthropic / Ollama 本地均可）

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **OpenCode** → 点「安装」
2. 下载安装包（国内自动走加速通道，哈希校验后静默安装）
3. 完成后启动 OpenCode（开始菜单 / 应用程序）

## 手动安装
- **Windows**：从 GitHub Releases 下载对应架构的 `opencode-desktop-win-*.exe`，双击即装（用户级，不弹管理员）
- **macOS**：下载对应芯片的 dmg，打开后把 **OpenCode.app** 拖进「应用程序」

## 配置（让它真正干活）
1. 打开 OpenCode → 设置里选择模型提供方（推荐 OpenRouter：一个 key 通吃所有模型）
2. 粘贴 API key（在 https://openrouter.ai/keys 创建，`sk-or-v1-` 开头）
3. **key 只保存在本机** `~/.config/opencode/`，AiBOX 与 OpenCode 都不会上传它

## 验证成功
在 OpenCode 里打开一个项目，让它"写一个 hello world 并运行"，看到它自己改文件、执行命令并汇报结果，即安装配置成功。

## 常见问题
- **连接模型失败**：检查 key 是否完整、账户是否有余额
- **国内访问慢**：OpenRouter 可直连，或用本地 Ollama（零成本）
- **想要终端体验**：桌面版内置终端 TUI，或在设置里查看 CLI 用法

## 卸载
Windows：系统设置 → 应用 → 卸载；macOS：删除应用程序里的 OpenCode.app。
模型 key、会话历史与配置在数据目录（`~/.config/opencode/`、`~/.local/share/opencode`），**删除即丢失，建议先备份**——AiBOX「管理 → 卸载」会自动帮你备份。
