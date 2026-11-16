# Fooocus 安装与使用教程

一句话：**Fooocus 是「一键出图」的 AI 绘图工具**——学 Midjourney 的省心、学 Stable Diffusion 的免费离线：不用研究参数，写句话就能出好图，4GB 显存起步。

## 你将得到

- 极简出图：官方目标是「从点下载到第一张图，鼠标点击少于 3 次」，提示词写得糙也能出好图（内置 GPT-2 提示词自动扩写）
- 完全离线、开源免费：模型下到本地后断网可用，数据不出机器
- 需要精细控制时也有：风格包、预设、图生图 / 重绘 / 放大 / 面部替换、SDXL 模型与 LoRA 兼容 Civitai

## 和 A1111 怎么选（先看这段）

| 你想要 | 选谁 |
|---|---|
| 打开就出图、不想学任何参数 | **Fooocus**（本页） |
| 要装插件（ControlNet 等）、逐参数微调、批量自动化 | Stable Diffusion WebUI（A1111） |
| 模型 / 提示词语法 | 两者通用：Fooocus **采用 A1111 的权重算法**，`(word:1.5)`、embedding 写法照搬可用 |

## 准备（3 分钟）

| 需要 | 说明 |
|---|---|
| **Windows 10/11 或 macOS 12+** | Linux 亦可；**全程免管理员** |
| **Git + Python 3.10** | 官方要求 Python 3.10（源码路线）；Windows 也有免 Python 的官方一键包 |
| 显卡 | 最低 **4GB 显存 NVIDIA + 8GB 内存**（GTX 10 系以下不支持）；AMD 走 DirectML 慢约 3 倍，Mac/纯 CPU 更慢 |
| 磁盘 | 首次启动自动下载 PyTorch ~2.5GB + SDXL 模型数 GB，预留 20GB+ |

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Fooocus** → 点「安装」
2. 下载官方 tag 源码包（哈希校验，国内自动走代理通道）→ 克隆到 `~/Fooocus`
3. 自动创建用户级 venv 并安装 `requirements_versions.txt` 依赖——不需要管理员、不碰系统 Python

### 路线 B：手动安装（官方命令）

```bash
git clone --depth 1 -b v2.5.5 https://github.com/lllyasviel/Fooocus.git ~/Fooocus
cd ~/Fooocus
python -m venv venv
./venv/bin/pip install -r requirements_versions.txt    # Windows: .\venv\Scripts\pip
./venv/bin/python entry_point.py                      # 官方 Windows 包则是双击 run.bat
```

首次启动会自动下载模型到 `Fooocus/models/checkpoints`（可提前手动放好跳过等待）。

## 配置与验证

### 生成参数入门（会这五个就够用）

1. **Performance**：`Speed`（30 步，默认）/ `Quality`（60 步，更细）/ `Extreme Speed`、`Lightning`（8 或 4 步，出图飞快，配专用 LoRA）——先用 Speed，赶时间换 Extreme Speed，追质量换 Quality
2. **Style**：勾选风格模板（`sdxl_styles` 目录），推荐默认勾着 **Fooocus V2**（提示词自动扩写）；负向效果用 Advanced → Negative Prompt
3. **Aspect Ratios**：出图比例；**Image Number**：一次出几张；**Guidance / Sharpness**：Advanced → Advanced 里调，越低越"听话"、越高越有风格
4. **提示词权重**：与 A1111 一致——`(sunset:1.4)` 强调、`--no` 想法写进 Negative Prompt
5. **Input Image**：拖图进去可用 Upscale / Variation / Inpaint / Outpaint / Image Prompt（含 FaceSwap）

### 预设与模型（风格包）

- 顶部可切 **preset**：`default`（通用，juggernautXL_v8Rundiffusion）、`realistic`（写实，realisticStockPhoto_v20）、`anime`（动漫，animaPencilXL_v500）——切 preset 会自动补下对应模型（想避免自动下载加 `--disable-preset-download`，并手动把模型放进 `models/checkpoints`）
- 命令行指定：`--preset anime`；自备模型（含 Civitai 的 SDXL 模型、LoRA）直接丢进 `models/checkpoints` / `models/loras` 后在 UI 里选

### 离线模式

模型与依赖下载完后，Fooocus **本身就是离线软件**（不联网也能出图）。网络不畅时：加 `--hf-mirror https://hf-mirror.com` 换国内镜像下模型；完全不想让它联网下载就加 `--disable-preset-download`。注意首次用 Inpaint 还会下 1.28GB 的专用模型，最好提前跑一次。

```bash
./venv/bin/python entry_point.py --preset realistic --port 7860
```

其他常用参数：`--listen`（局域网访问）、`--language`（界面语言）、`--theme dark`。

### 怎样算成功

1. 终端给出 `http://127.0.0.1:7860`，浏览器打开
2. 随便写句提示词（如「一只在花园里的猫」）点 **Generate**
3. **几秒到几十秒出图**，且点开图片能看到生成信息 = 安装成功

## 常见问题

- **首次启动特别慢**：正常，正在下 PyTorch 和模型；进度看终端输出
- **报 `MetadataIncompleteBuffer` / `PytorchStreamReader`**：模型文件损坏，删掉重新下载
- **显存不够 / `RuntimeError: CPUAllocator`**：确认达到 4GB 显存 + 8GB 内存；Windows 需开启虚拟内存（页面文件），报错页面各盘留 40GB+ 可用空间
- **出图忽快忽慢**：部分 NVIDIA 驱动（532 之后）有 10 变慢的报告，官方建议换回 531 版驱动再试
- **模型下载被墙 / 太慢**：用 `--hf-mirror` 镜像，或手动下载模型放进 `models/checkpoints`
- **端口被占**：`--port 7861` 换端口

## 卸载

```bash
rm -rf ~/Fooocus    # 模型、LoRA、生成图都在里面，删前先备份 models/ 和 outputs/
```

AiBOX「管理 → 卸载」可代劳。

更多：[GitHub README](https://github.com/lllyasviel/Fooocus#readme) · [常见问题](https://github.com/lllyasviel/Fooocus/blob/main/troubleshoot.md) · [更新日志](https://github.com/lllyasviel/Fooocus/blob/main/update_log.md)
