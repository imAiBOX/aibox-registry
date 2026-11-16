# MoneyPrinterTurbo 安装教程

## 准备
- **系统**：Windows 10/11 x64（本应用暂无 macOS 版）
- **磁盘**：约 2GB（便携包自带运行时与模型组件）
- **权限**：全程免管理员，解压到你的用户目录

## 用 AiBOX 安装（推荐）
1. 打开 AiBOX → 目录找到 **MoneyPrinterTurbo** → 点「安装」
2. 下载 555MB 便携包（国内走网关通道自动换源），哈希校验通过后自动解压
3. 完成后从 AiBOX 或解压目录启动主程序

## 手动安装
1. 从 GitHub Releases 下载 `MoneyPrinterTurbo-Portable-Windows-1.3.10.7z`
2. 用 7-Zip 解压到 `%LOCALAPPDATA%\MoneyPrinterTurbo`
3. 双击 `MoneyPrinterTurbo.exe`

## 配置与验证
1. 首次启动进入设置：填入 LLM API Key（用于生成脚本/字幕）与 TTS 配置
2. 输入一个主题点「开始生成」，能产出视频草稿即成功

## 常见问题
- **解压失败**：装 7-Zip 或用管理员资源管理器重试（解压本身不需要管理员）
- **生成慢**：模型调用受你的 API 速度影响，与本机无关

## 卸载
删除 `%LOCALAPPDATA%\MoneyPrinterTurbo` 整个目录（视频草稿也在里面，先备份）；AiBOX「管理 → 卸载」可代劳。
