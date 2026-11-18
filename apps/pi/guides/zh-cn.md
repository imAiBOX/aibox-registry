# Pi 安装教程

## 准备
- **系统**：Windows 10/11（x64/ARM64）或 macOS 12+（Apple 芯片 / Intel）
- **磁盘**：约 200MB（安装包 48-62MB）
- **权限**：全程免管理员，装在你的用户目录
- **必配**：需要一个模型 API key（OpenRouter / Anthropic / Ollama 本地均可）
- **无需 Node**：平台包自包含运行时，不用装 Node.js

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **Pi** → 点「安装」
2. 下载平台包（国内自动走加速通道，哈希校验后解压安装）
3. 完成后**打开终端**（PowerShell / Terminal）

## 手动安装
- **Windows**：从 GitHub Releases 下载 `pi-windows-x64.zip`，解压后把 `pi.exe` 放到任意目录
- **macOS**：下载对应芯片的 `pi-darwin-*.tar.gz`，解压得到 `pi/` 目录（可执行文件是 `pi/pi`）

## 配置（让它真正干活）
1. 终端里进入你的项目目录，运行 `pi` 启动
2. 首次使用按提示配置模型（推荐 OpenRouter：一个 key 通吃所有模型，`/model` 可随时切换）
3. **key 只保存在本机** `~/.pi/`，AiBOX 与 Pi 都不会上传它

## 验证成功
在项目目录运行 `pi`，让它"写一个 hello world 并运行"，看到它自己读写文件、执行命令并汇报结果，即安装配置成功。

## 常见问题
- **`pi` 不是内部或外部命令**：用完整路径运行（Windows: `%LOCALAPPDATA%\Programs\Pi\pi.exe`）
- **连接模型失败**：检查 key 是否完整、账户是否有余额
- **升级**：运行 `pi update`（或在 AiBOX 目录里重新安装新版本）

## 卸载
Windows：删除 `%LOCALAPPDATA%\Programs\Pi`；macOS：删除 `/Applications/Pi`。
会话历史与模型配置在 `~/.pi/`，**删除即丢失，建议先备份**——AiBOX「管理 → 卸载」会自动帮你备份。
