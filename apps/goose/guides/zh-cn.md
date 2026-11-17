# Goose 安装教程

## 准备
- **系统**：Windows 10/11 x64 或 macOS 12+（Apple 芯片 / Intel 各有专用包）
- **磁盘**：约 1GB（安装包 138MB / mac 包 183-193MB）
- **权限**：全程免管理员，装在你的用户目录
- **必配**：需要一个模型 API key（OpenRouter / Anthropic / OpenAI / 本地 Ollama 均可）

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **Goose** → 点「安装」
2. 下载安装包（国内自动走加速通道，哈希校验后安装）
3. 完成后启动 Goose（开始菜单 / 应用程序）

## 手动安装
- **Windows**：从 GitHub Releases 下载 `Goose-win32-x64-setup.exe`，双击向导安装（用户级，不弹管理员；批量部署可用 `/S` 静默参数）
- **macOS**：下载对应芯片的 zip（Apple 芯片选 arm64，Intel 选 x64），解压后把 **Goose.app** 拖进「应用程序」

## 配置（让它真正干活）
1. 首次启动会引导选择 LLM 提供方（推荐 OpenRouter：一个 key 通吃所有模型）
2. 粘贴 API key（在 https://openrouter.ai/keys 创建，`sk-or-v1-` 开头）
3. **key 只保存在本机** `~/.config/goose/config.yaml`，AiBOX 与 Goose 都不会上传它

## 验证成功
在 Goose 里让它做一件小事（例如"帮我创建一个 hello world 项目并运行"），看到它自己执行命令、读写文件并汇报结果，即安装配置成功。

## 常见问题
- **连接模型失败**：检查 key 是否完整、账户是否有余额
- **国内访问慢**：OpenRouter 可直连，或换 Anthropic/OpenAI 官方 key
- **想扩展能力**：Goose 支持 Extensions（MCP 工具），在设置里开启

## 卸载
Windows：开始菜单 → Goose → Uninstall；macOS：删除应用程序里的 Goose.app。
模型 key、会话记录与扩展配置在数据目录（`%APPDATA%\Goose`、`~/.config/goose`），**删除即丢失，建议先备份**——AiBOX「管理 → 卸载」会自动帮你备份。
