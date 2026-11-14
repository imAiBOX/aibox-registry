# ComfyUI 安装与使用教程

一句话：**ComfyUI（GitHub 14 万+ Star）是节点式 AI 图像 / 视频创作工作台**——把模型、提示词、采样器
等节点连成工作流再排队渲染；Windows 官方便携版解压即用，macOS 源码装进用户目录。

## 你将得到

- 完全本地的节点式工作流画布，图像与视频生成都在你自己机器上跑
- 官方工作流模板库，覆盖数百种模型（SDXL、Flux、Wan 视频……）：[comfy.org/workflows](https://comfy.org/workflows)
- 庞大的模型生态：检查点放进 `models/` 即可，已有模型目录可用 `extra_model_paths.yaml` 直接挂接
- 同一画布里还能用云端"合作节点"（如 Google 的 Nano Banana）

## 准备（2 分钟）

- **磁盘**：Windows 便携版约 2 GB 下载、解压后数 GB；模型还要再加很多 GB——预留 20 GB+
- **Windows 路线**：Windows 10/11 x64——便携版自带 Python 3.13 + PyTorch（CUDA 13.0），
  支持 NVIDIA 20 系及以上，**也可纯 CPU**（AMD/Intel 显卡走手动安装）
- **macOS 路线**：Python 3.10–3.13（`python3 --version` 检查），PyTorch 与依赖约占数 GB
- 不需要：管理员权限、Docker、Windows 上另装 Python

## 安装

### 路线 A：用 AiBOX 安装（推荐）

1. 打开 AiBOX → 应用目录 → **ComfyUI** → 点「安装」
2. AiBOX 下载官方产物（带 sha256 校验，国内自动走加速通道）：
   - **Windows**：用系统自带 `tar` 把官方便携 7z 解压到 `%LOCALAPPDATA%\Programs\ComfyUI_windows_portable`——**零提权、不用装 Python**
   - **macOS**：把源码包解到 `~/ComfyUI`，建 `.venv` 并安装 `requirements.txt`
3. 首次启动（见下）→ 浏览器打开 `http://127.0.0.1:8188`

### 路线 B：手动安装（官方渠道）

- **Windows 便携版（官方 README）**：下载 [ComfyUI_windows_portable_nvidia.7z](https://github.com/Comfy-Org/ComfyUI/releases/latest)
  → 用 7-Zip 或资源管理器解压 → 双击 `run_nvidia_gpu.bat`（纯 CPU 用 `ComfyUI\advanced` 里的 `run_cpu.bat`）
- **macOS / 任意平台（手动）**：拿到源码后：

```bash
cd ComfyUI
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python main.py        # → http://127.0.0.1:8188
```

- **官方桌面版**：[comfy.org/download](https://www.comfy.org/download)（Windows/macOS 安装器，可替代手动路线）
- **comfy-cli（官方）**：`pip install comfy-cli` 后 `comfy install`

## 配置

1. **模型**：检查点放进 `ComfyUI/models/checkpoints`（便携版在
   `ComfyUI_windows_portable\ComfyUI\models\checkpoints`）；视频/VAE/LoRA 各有子目录——界面会提示布局
2. **复用已有模型目录**：把 `extra_model_paths.yaml.example` 复制为 `extra_model_paths.yaml` 改路径（README）
3. **工作流**：先用内置默认工作流，或从 [comfy.org/workflows](https://comfy.org/workflows) 导入模板
4. **显卡说明（Windows 便携版）**：自带 PyTorch CUDA 13.0，启动不了先更新 NVIDIA 驱动；
   AMD/Intel/Apple 按 README 的手动安装章节走

## 验证：怎样算成功

1. `http://127.0.0.1:8188` 打开节点画布，默认工作流已加载
2. 加载节点里能选中 `models/checkpoints` 里的模型（首次需先下载一个模型，数 GB）
3. 点 **Queue Prompt** → 节点图执行 → 生成图像出现
4. 版本核对（AiBOX 安装后可查）：

```bash
cat ~/ComfyUI/comfyui_version.py            # macOS：__version__ = "x.y.z"
type "%LOCALAPPDATA%\Programs\ComfyUI_windows_portable\ComfyUI\comfyui_version.py"   # Windows
```

## 常见问题

- **打不开 / 端口被占**：默认端口 **8188**；可能有残留进程占用——关掉它或用 `--port 8189` 启动
- **Windows 解不开 7z**：装 [7-Zip](https://7-zip.org) 手动解压——结果一样，仍然零提权
- **便携版启动黑屏/崩溃**：更新 NVIDIA 驱动（CUDA 13.0 版）；老显卡改用 `cu126` 便携版
- **该下哪个便携版**：`nvidia`（20 系及以上，或纯 CPU）、`nvidia_cu126`（10 系及更老）、`amd`、`intel`——Releases 页都有
- **macOS `python3` 版本太旧**：去 python.org 装 Python 3.12（按用户安装、无需管理员）再走 venv 步骤
- **依赖下载慢（国内）**：安装依赖前 `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`

## 卸载

- **Windows**：删除 `%LOCALAPPDATA%\Programs\ComfyUI_windows_portable`（便携版，无安装条目）
- **macOS**：删除 `~/ComfyUI`（venv 与源码在同一目录）
- ⚠️ 模型、工作流与自定义节点都在这些目录里，动辄几十 GB——**先备份**

更多：[README 安装章节](https://github.com/Comfy-Org/ComfyUI#installing) · [官方文档](https://docs.comfy.org) · [工作流模板](https://comfy.org/workflows)
