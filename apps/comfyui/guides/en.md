# ComfyUI install & setup guide

One line: **ComfyUI (140k+ stars on GitHub) is a node-based AI image & video generation studio** — you wire workflow nodes together (models, prompts, samplers) and queue renders; the official Windows portable runs after extraction, macOS installs from source into your home folder.

## What you get

- A local, node-based workflow canvas for image and video generation — everything runs on your machine
- Official workflow templates for hundreds of models (SDXL, Flux, Wan video, …) via [comfy.org/workflows](https://comfy.org/workflows)
- Huge model ecosystem: checkpoints drop into `models/`, or point ComfyUI at folders you already have (`extra_model_paths.yaml`)
- Optional cloud "partner nodes" (e.g. Google's Nano Banana) inside the same canvas

## Before you start (2 minutes)

- **Disk**: the Windows portable is a ~2 GB download and several GB extracted; models add many more GB — keep 20 GB+ free
- **Windows route**: Windows 10/11 x64 — the portable bundles Python 3.13 + PyTorch (CUDA 13.0), works on NVIDIA 20-series-and-up **or CPU only** (other GPUs: AMD/Intel use the manual install)
- **macOS route**: Python 3.10–3.13 (`python3 --version`) and a few GB for PyTorch + dependencies
- Not needed: administrator rights, Docker, a separate Python install on Windows

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **ComfyUI** → **Install**
2. AiBOX downloads the official artifact (sha256-verified; CN traffic auto-uses the accelerated channel):
   - **Windows**: extracts the official portable 7z into `%LOCALAPPDATA%\Programs\ComfyUI_windows_portable` with the built-in `tar` — **zero admin, no Python needed**
   - **macOS**: unpacks the source archive into `~/ComfyUI`, creates `.venv` and installs `requirements.txt`
3. First run (below) → the browser opens at `http://127.0.0.1:8188`

### Route B: manual install (official channels)

- **Windows portable (official README)**: download [ComfyUI_windows_portable_nvidia.7z](https://github.com/Comfy-Org/ComfyUI/releases/latest) → extract with 7-Zip or Explorer → double-click `run_nvidia_gpu.bat` (`run_cpu.bat` under `ComfyUI\advanced` for CPU-only)
- **macOS / any platform (manual)**: clone or download the source, then:

```bash
cd ComfyUI
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python main.py        # → http://127.0.0.1:8188
```

- **Official desktop app**: [comfy.org/download](https://www.comfy.org/download) (installer for Windows/macOS) — an alternative if you prefer it
- **comfy-cli** (official): `pip install comfy-cli` then `comfy install`

## Configuration

1. **Models**: put checkpoints in `ComfyUI/models/checkpoints` (portable: `ComfyUI_windows_portable\ComfyUI\models\checkpoints`); video/VAE/LoRA go in their own subfolders — the UI shows the expected layout
2. **Reuse existing model folders**: copy `extra_model_paths.yaml.example` → `extra_model_paths.yaml` and edit the paths (README)
3. **Workflows**: start from the built-in default workflow, or import templates from [comfy.org/workflows](https://comfy.org/workflows)
4. **GPU note (Windows portable)**: ships PyTorch CUDA 13.0 — update NVIDIA drivers if it won't start; AMD/Intel/Apple follow the manual-install sections of the README

## Verification: what "works" looks like

1. `http://127.0.0.1:8188` opens the node canvas with the default workflow loaded
2. A model from `models/checkpoints` is selectable in the loader node (first use requires downloading a model — several GB)
3. Press **Queue Prompt** → the node graph runs → a generated image appears
4. Version check (installed by AiBOX):

```bash
cat ~/ComfyUI/comfyui_version.py            # macOS: __version__ = "x.y.z"
type "%LOCALAPPDATA%\Programs\ComfyUI_windows_portable\ComfyUI\comfyui_version.py"   # Windows
```

## FAQ

- **Nothing opens / port busy**: ComfyUI defaults to port **8188**; another instance or a stale process may hold it — close it or start with `--port 8189`
- **`tar` cannot extract the 7z (Windows)**: install [7-Zip](https://7-zip.org) and extract manually — same result, still zero admin
- **Black screen / crash on start (portable)**: update the NVIDIA driver (CUDA 13.0 build), or grab the `cu126` portable for older cards
- **Which portable do I need**: `nvidia` (20-series+, or CPU), `nvidia_cu126` (10-series and older), `amd`, `intel` — all on the releases page
- **`python3` too old (macOS)**: install Python 3.12 from python.org (per-user, no admin) and re-run the venv steps
- **Huge downloads are slow (CN)**: set `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple` before installing requirements

## Uninstall

- **Windows**: delete `%LOCALAPPDATA%\Programs\ComfyUI_windows_portable` (portable — no installer entry)
- **macOS**: delete `~/ComfyUI` (venv + source live together)
- ⚠️ Models, workflows and custom nodes live inside those folders and can be tens of GB — **back them up first**

More: [README install section](https://github.com/Comfy-Org/ComfyUI#installing) · [docs.comfy.org](https://docs.comfy.org) · [workflow templates](https://comfy.org/workflows)
