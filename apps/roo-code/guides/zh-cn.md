# Roo Code 安装教程

## 准备
- **系统**：Windows 10/11 或 macOS 12+
- **前置**：已安装 Visual Studio Code（没有先去 https://code.visualstudio.com 下载，免费）
- **权限**：全程免管理员

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录里找到 **Roo Code** → 点「安装」
2. AiBOX 会下载扩展包（走国内可达通道，失败自动换源）并校验哈希
3. 完成后打开 VSCode 即可看到 Roo Code 图标

## 手动安装
```bash
code --install-extension rooveterinaryinc.roo-cline
```
或在 VSCode 扩展面板搜索 "Roo Code" 安装。

## 配置与验证
1. 打开 VSCode 侧栏的 Roo Code 图标
2. 按引导选择模型提供方（OpenRouter / Anthropic / OpenAI 等），填入 API key
3. 发一条消息，模型正常回复即安装成功

## 常见问题
- **扩展没出现**：确认安装的 VSCode 是同一用户账户；重启 VSCode
- **key 填哪**：Roo Code 面板内设置，key 只保存在本机

## 卸载
VSCode 扩展面板 → Roo Code → Uninstall；或让 AiBOX「管理 → 卸载」清理配置。
