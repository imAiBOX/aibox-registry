# OpenHands 安装教程

## 准备
- **系统**：Windows 10/11 x64 或 macOS 12+（Apple 芯片与 Intel 通用包）
- **磁盘**：约 1.5GB（安装包 168MB / dmg 350MB）
- **权限**：全程免管理员，装在你的用户目录
- **必配**：需要一个模型 API key（OpenRouter / Anthropic / OpenAI / 本地 Ollama 均可）

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **OpenHands** → 点「安装」
2. 下载安装包（国内自动走加速通道，哈希校验后安装）
3. 完成后启动 OpenHands（开始菜单 / 应用程序）

## 手动安装
- **Windows**：从 GitHub Releases 下载 `OpenHands-Agent-Canvas-Setup-1.42.0.exe`，双击安装（用户级，不弹管理员）
- **macOS**：下载 universal dmg，把 OpenHands.app 拖进「应用程序」

## 配置（让它真正干活）
1. 启动后进入设置，选择模型提供方（推荐 OpenRouter：一个 key 通吃所有模型）
2. 粘贴 API key（在 https://openrouter.ai/keys 创建，`sk-or-v1-` 开头）
3. **key 只保存在本机**，AiBOX 与 OpenHands 都不会上传它

## 验证成功
给它一个小任务（例如"写一个 hello world 的 Python 脚本并运行"），看到它自己创建文件、执行命令并汇报结果，即安装配置成功。

## 常见问题
- **连接模型失败**：检查 key 是否复制完整、账户是否有余额
- **国内访问慢**：OpenRouter 支持，或换 Anthropic/OpenAI 官方 key
- **任务执行到一半停了**：可能是模型输出超限，换更强的模型再试

## 卸载
Windows：系统设置 → 应用 → 卸载；macOS：删除应用程序里的 OpenHands.app。
对话历史与工作区文件在数据目录（`%APPDATA%/Roaming/OpenHands` 或 `~/Library/Application Support/OpenHands`），**删除即丢失，建议先备份**——AiBOX「管理 → 卸载」会自动帮你备份。
