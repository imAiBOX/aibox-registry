# Stable Diffusion WebUI（A1111）安装与使用教程

一句话：**A1111 是最经典的 Stable Diffusion 网页界面**——txt2img / img2img / 修复 / 放大 / 训练 Embedding 全都有，插件与模型生态最厚，几乎所有教程和模型都先兼容它。

## 你将得到

- 浏览器里的全能 AI 绘图工作台：文生图、图生图、局部重绘、X/Y/Z 参数图、高清放大
- 海量社区插件（ControlNet、提示词辅助等）与模型（Civitai 上的 SD1.5 / SDXL 模型直接放进去就能用）
- `--api` 开关把整套能力暴露成本地 HTTP 接口，方便脚本调用

## 准备（重点看 Python 版本）

| 需要 | 说明 |
|---|---|
| **Python 3.10.6（推荐）** | **官方明确：装 3.10.6，勾选 "Add Python to PATH"**；更新的 Python 版本 torch 装不上（3.11+ 需自行设 `python_cmd`，不建议新手） |
| **Git** | [git-scm.com](https://git-scm.com/download/win) 免费安装 |
| 显卡 | NVIDIA 独显最佳（4GB 显存起步）；核显/CPU 也能跑，很慢 |
| 磁盘 | 程序约 1GB；**首次启动还要下载 PyTorch 约 2.5GB** + 模型文件（SDXL 模型 6~7GB） |
| 权限 | **全程免管理员**，装在用户目录 |

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **Stable Diffusion WebUI** → 点「安装」
2. 下载官方 tag 源码包（哈希校验，国内自动走代理通道）→ 克隆到 `~/sd-webui`
3. 自动创建**用户级 venv 虚拟环境**并装依赖——不污染系统 Python、不需要管理员
4. 首次启动会拉 PyTorch 等大依赖（慢可先设 `PIP_INDEX_URL` 换国内镜像）

### 路线 B：手动安装（官方命令）

```bash
git clone --depth 1 -b v1.10.1 https://github.com/AUTOMATIC1111/stable-diffusion-webui.git ~/sd-webui
cd ~/sd-webui
python -m venv venv                                  # 建独立虚拟环境
./venv/bin/pip install -r requirements.txt           # 装依赖（Windows 用 .\venv\Scripts\pip）
./venv/bin/python launch.py                          # 首次启动自动补环境
```

Windows 也可用官方脚本：装好 Python 3.10.6 + Git 后，在克隆目录里**普通双击** `webui-user.bat`（不要右键管理员运行）。Linux 需先装系统依赖：`sudo apt install wget git python3 python3-venv libgl1 libglib2.0-0`。

## 配置与验证

### 启动参数（常用这几个）

把参数写进 `webui-user.bat` 的 `COMMANDLINE_ARGS=`（Linux 写 `webui-user.sh` 的 `COMMANDLINE_ARGS`）：

| 参数 | 作用 |
|---|---|
| `--medvram` / `--lowvram` | **显存不够（报 CUDA OOM）就加**，用速度换显存 |
| `--xformers` | 显存优化加速（NVIDIA） |
| `--api` | 开启本地 API（`/sdapi/v1/*`，Swagger 在 `/docs`） |
| `--listen --port 7860` | 局域网可访问（务必配合防火墙只对内网开放） |
| `--precision full --no-half` | 出图全黑时的常用救招 |

例：`set COMMANDLINE_ARGS=--medvram --xformers`（Windows，写在 `webui-user.bat` 里）。

### 模型下载与放置

1. 从 [Civitai](https://civitai.com/) 或 Hugging Face 下载 `.safetensors` 模型
2. 放进 **`~/sd-webui/models/Stable-diffusion/`**，刷新页面即可在顶部下拉选择
3. 附属目录同理：`models/VAE`、`models/Lora`、`embeddings/`、`models/ControlNet`
4. 首次启动模型缺失会自动下载官方 SD 1.5 / SDXL 模型（慢就手动下好放进去）

### 插件安装（一句话）

侧栏 **Extensions → Install from URL** 粘贴插件仓库地址（或在 **Available** 标签点 Load from index 搜），Install 后点 **Apply and restart UI** 即生效。

### 怎样算成功

1. 终端出现 `Running on local URL: http://127.0.0.1:7860`，浏览器打开该地址
2. 顶部选中模型，随便写句提示词点 **Generate**
3. **进度条走完并出图**（右下角 PNG Info 能看到生成参数）= 安装成功

## 常见问题

- **依赖/PyTorch 下载慢**：`set PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple` 后重装（AiBOX 路线已内置换源）
- **torch / CUDA 版本报错**：先确认 Python 是 **3.10.6**；装错版本就删掉 `venv` 重建
- **CUDA out of memory**：加 `--medvram`（还不够再 `--lowvram`），或降低图片尺寸
- **出图全黑**：加 `--precision full --no-half`
- **模型报 `MetadataIncompleteBuffer` / `PytorchStreamReader`**：模型文件损坏，重新下载
- **端口被占 / 想换端口**：`COMMANDLINE_ARGS` 里加 `--port 7861`

## 卸载

```bash
rm -rf ~/sd-webui     # venv、模型、生成图都在里面，删前先备份 models/ 和 outputs/
```

AiBOX「管理 → 卸载」可代劳。

更多：[GitHub README](https://github.com/AUTOMATIC1111/stable-diffusion-webui#readme) · [安装与显卡说明 Wiki](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs) · [功能特性](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features)
