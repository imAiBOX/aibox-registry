# MoneyPrinterTurbo 安装与使用教程

一句话：**MoneyPrinterTurbo 是输入一个主题就自动出片的 AI 短视频工具**——AI 写脚本、抓素材、配音、加字幕、合成一条龙，中文生态友好，Windows 便携包双击即用。

## 你将得到

- 从一句话主题到成片：脚本 → 素材 → 配音 → 字幕 → 剪辑合成全流程自动
- 四种用法：WebUI 界面、API 服务、命令行 CLI、AI Agent 调用
- 素材免费（Pexels / Pixabay 库存）、配音有免费路线（Edge TTS 无需 key）

## 准备（3 分钟）

| 需要 | 说明 |
|---|---|
| **Windows 10/11 x64** | 便携包自带运行时，**无需安装 Python**（macOS 请走源码部署，需 Python 3.11+） |
| **7-Zip** | 便携包是 `.7z` 格式，装 [7-zip.org](https://www.7-zip.org/) 免费版（解压**不需要**管理员） |
| 磁盘 | 约 2GB（便携包 555MB + 解压后运行时与缓存） |
| API key | 至少一个 LLM key（生成脚本用）；素材和配音可全程免费 |
| 权限 | **全程免管理员**，解压到用户目录即可 |

> ⚠️ **路径红线（官方明确要求）**：解压/安装路径**不能有中文、空格、特殊字符**。若你的 Windows 用户名是中文（会让 `C:\Users\中文名\...` 中招），请改解压到 `D:\Apps\MoneyPrinterTurbo` 之类的纯英文路径。

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **MoneyPrinterTurbo** → 点「安装」
2. 下载 555MB 官方便携包（国内自动走代理通道换源），哈希校验通过后**自动解压到 `%LOCALAPPDATA%\MoneyPrinterTurbo`**
3. 完成后从 AiBOX 或解压目录启动主程序；若你的用户名含中文，按上文提示改到纯英文路径再启动

### 路线 B：手动安装（官方便携包）

1. 打开 [Releases 页](https://github.com/harry0703/MoneyPrinterTurbo/releases/latest)，在 **Assets** 区下载 `MoneyPrinterTurbo-Portable-Windows-1.3.10.7z`
   （**别点** GitHub 自动生成的 `Source code (zip/tar.gz)`——那只是源码，解压出来没有启动器）
2. 右键 `.7z` → 7-Zip → **Extract Here** / Extract to 纯英文目录（例：`D:\Apps\MoneyPrinterTurbo`）
3. 双击 `MoneyPrinterTurbo.exe` 启动；如果压缩包里是 `start.bat`，先双击 `update.bat` 更新到最新代码，再 `start.bat`

## 首次配置（逐项对照）

启动后进入设置页，按下面顺序填，能少走很多弯路：

1. **LLM（脚本生成）**：`llm_provider` 默认 **moonshot（Kimi）**；也支持 OpenAI、Anthropic Claude、Google Gemini、DeepSeek、阿里通义、讯飞星火、Ollama 本地模型，以及任何 OpenAI 兼容网关——选一家填 key 即可
2. **视频素材源**：默认 `pexels`，去 [Pexels API](https://www.pexels.com/api/) / [Pixabay](https://www.pixabay.com/api/docs/) 免费注册 key 粘贴（支持多 key 轮换）；也可上传自己的图片/视频，或用付费 AI 文生视频源
3. **配音（TTS）**：首选 **Edge TTS**——**免费、无需任何 key**，音色试听后挑一个；要更高音质再上 Azure / SiliconFlow / ElevenLabs 等（需对应平台 key）
4. **字幕**：默认 `edge`（用 TTS 时间戳生成，免 GPU 免下载）；要更精准时间轴可切 `whisper`（本地 `faster-whisper`，首次自动下 1.6~3GB 模型）
5. **画幅与比例**：竖屏 `9:16`（抖音/TikTok/Shorts）、横屏 `16:9`、方形 `1:1`

## 生成流程分步

1. 在首页**输入视频主题**（一句话即可，也可直接粘贴自己的脚本）
2. 点「开始生成」，进度条分阶段显示：**脚本 → 素材下载/处理 → 配音 → 字幕 → 最终渲染**
3. 中途可点开各阶段查看产物：脚本文案可手动改写后重跑，配音可整段试听
4. 完成后在任务历史里**预览、下载成片**；支持批量一次出多条

**命令行玩法**（源码/开发部署时，无浏览器或接自动化）：

```powershell
python cli.py --video-subject "人工智能如何改变日常生活"
python cli.py --help        # 全部参数
```

另有 API 服务：`python main.py` 启动后文档在 `http://127.0.0.1:8080/docs`。

## 验证：怎样算成功

1. 双击启动器，浏览器**自动打开 WebUI**（空白页就换 Chrome / Edge 手动开终端里显示的地址）
2. 设置里 LLM 显示已填、素材 key 通过校验
3. 用默认设置跑一个主题，几分钟内产出**可播放的成片** = 全链路通

## 成本提示

- **免费组合**：素材用 Pexels/Pixabay + 配音 Edge TTS + 字幕 edge → 只花 LLM 的 token 钱（一段 60 秒脚本通常几厘到几分钱）
- **别乱开付费项**：AI 文生视频素材源（Seedance / LoomLoom 等）按次计费，新手先用免费库存素材
- **Whisper 字幕**：本地跑不花钱，只是首次要下模型；网络不畅可手动下模型放进 `models\whisper-large-v3`

## 常见问题

- **解压失败 / 打不开 .7z**：先装 7-Zip；解压本身不需要管理员，但**目标路径别有中文空格**
- **`RuntimeError: No ffmpeg exe could be found`**：程序通常会自动下载 ffmpeg；失败就去 [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) 下载，把 `config.toml` 里 `ffmpeg_path` 指过去
- **Whisper 模型下载失败**：从 Hugging Face 手动下载 `whisper-large-v3` 解压到 `.\MoneyPrinterTurbo\models\whisper-large-v3`
- **启动后页面空白**：换 Chrome / Edge 打开终端显示的地址（默认 `http://127.0.0.1:8501`）
- **生成很慢**：瓶颈多为云端 LLM/素材接口速度；本地转录或批量任务想提速可配 4GB+ 显存的显卡

## 卸载

```powershell
# 先退出程序，再删除整个目录（成片草稿、配置、任务历史都在里面，务必先备份）
Remove-Item -Recurse "$env:LOCALAPPDATA\MoneyPrinterTurbo"
```

AiBOX「管理 → 卸载」可代劳。

更多：[GitHub README](https://github.com/harry0703/MoneyPrinterTurbo#readme) · [Releases 下载](https://github.com/harry0703/MoneyPrinterTurbo/releases)
