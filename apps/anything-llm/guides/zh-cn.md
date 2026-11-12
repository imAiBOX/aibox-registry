# AnythingLLM 安装与使用教程

一句话：**AnythingLLM（GitHub 6.8 万+ Star）是桌面知识库 AI**：把 PDF、笔记拖进工作区，
它自动切分、向量化、建立索引，之后你问问题——**回答会标注出处原文**。内置本地模型引擎，也能接云端 Key。

## 你将得到

- 私人知识库：文档 → 向量库 → 带引用出处的问答（RAG），数据全在自己电脑
- 内置本地 LLM 引擎（Lemonade + llama.cpp，安装时自动拉取 GPU 支持文件），不买 Key 也能用
- 也支持云端模型：OpenAI / Anthropic / OpenRouter / Google / 本地 Ollama 等（官方文档全列表）
- 多工作区隔离、Agent 技能、语音转写、定时任务等进阶功能

## 准备（2 分钟）

- **Windows 10+（x64 或 ARM64）** 或 **macOS（Apple Silicon / Intel 各有安装包）**
- 磁盘留 5 GB 以上（应用 + 内置引擎 + GPU 支持文件；可选的会议转写模型约 2 GB）
- 网络：安装时需联网下载内置引擎/GPU 文件（厂商 CDN），之后可离线用本地模型
- ⚠️ 官方要求 **只以当前用户身份安装**（不支持"为所有用户安装"），全程**无需管理员权限**
- 不需要：Docker、Python、Node

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **AnythingLLM** → 点「安装」
2. AiBOX 下载官方安装包（sha256 校验，国内自动走加速通道）：
   Windows 走官方静默模式 `/S`，装到 `%LOCALAPPDATA%\Programs\AnythingLLM`（当前用户，零提权）；
   macOS 按机型选 Silicon/Intel dmg 挂载后拷入 `/Applications`

### 路线 B：手动安装（官方渠道）

- **Windows**：去 [anythingllm.com/download](https://anythingllm.com/download/) 下载对应架构的 exe，
  双击安装（保持"当前用户"选项）；静默安装（官方文档 v1.16.1+）：

```powershell
.\AnythingLLMDesktop.exe /S                    # 静默安装，跳过会议转写模型
.\AnythingLLMDesktop.exe /S /DOWNLOAD_MODEL=yes # 静默安装 + 下载约 2GB 转写模型
```

- **macOS**：下载 `AnythingLLMDesktop-Silicon.dmg`（M 系列）或 `AnythingLLMDesktop.dmg`（Intel），
  打开后把 AnythingLLM 拖进 Applications；或 `brew install --cask anythingllm`

## 配置（连一个模型）

1. 首次启动会进入引导页：选 **Workspace**（工作区）→ 命名
2. 右上角齿轮 → **AI Providers**：
   - **本地引擎（默认）**：开箱即用，无需任何配置——内置模型自动可用
   - **云端 Key**：粘贴 OpenAI / Anthropic / OpenRouter 等 Key（在对应平台申请）
   - **Ollama**：已装 Ollama 的话会自动检测，选个模型即可
3. **加知识**：工作区 → Upload Documents → 拖入 PDF/Word/Markdown → 点 **Ingest**（向量化）
4. 对话页勾选该工作区，提问时它会引用你的文档

## 验证：怎样算成功

1. 应用能打开，右上角能看到版本号（点它 → Open storage 可直达数据目录）
2. 建一个工作区，上传一份 PDF，向量化完成显示绿色勾
3. 在对话里问一个**只有这份 PDF 里才有答案**的问题 → 回答正确且**标注了出处** = 全链路通了
4. 设置 → AI Providers 里模型状态为已连接、能正常回复 = Key 配置成功

## 常见问题

- **安装时报"AnythingLLM cannot be closed"**：旧版还在托盘里——右下角托盘图标右键 Quit 后重试（官方排障文档）
- **曾"为所有用户"装过**：先用安装目录里的 `Uninstall AnythingLLM.exe` 卸掉旧版，再按当前用户重装
- **本地模型很慢/没用上显卡**：安装时 GPU 支持文件下载失败会退回 CPU——检查网络后重装，或看安装目录的 `*_install.log`
- **升级**：下载新版安装包覆盖安装即可，数据目录不动；应用内更新横幅也会提示
- **数据在哪**：Windows `%APPDATA%\anythingllm-desktop\storage`，macOS `~/Library/Application Support/anythingllm-desktop/storage`

## 卸载

- **Windows**（官方静默参数）：运行 `"%LOCALAPPDATA%\Programs\AnythingLLM\Uninstall AnythingLLM.exe" /S`
  （保留数据）；想连数据一起清：加 `/S /DELETE_DATA=yes`（**不可恢复**）
- **macOS**：退出应用后把 AnythingLLM.app 拖进废纸篓；或 `brew uninstall --cask anythingllm`（加 `--zap` 连数据删）
- ⚠️ 工作区、已解析文档、向量库、聊天记录、本地模型都在数据目录——**删除前先备份**

更多：[安装文档](https://docs.anythingllm.com/installation-desktop/overview) · [数据存储位置](https://docs.anythingllm.com/installation-desktop/storage) · [卸载说明](https://docs.anythingllm.com/installation-desktop/uninstall)
