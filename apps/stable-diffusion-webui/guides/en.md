# Stable Diffusion WebUI (A1111) install & setup guide

One line: **A1111 is the classic Stable Diffusion web interface** — txt2img, img2img, inpainting, upscaling, embedding training, plus the thickest plugin and model ecosystem around; most community tutorials and models target it first.

## What you get

- A full AI image workbench in your browser: text-to-image, image-to-image, inpainting, X/Y/Z parameter grids, hires upscaling
- A huge community: plugins (ControlNet, prompt helpers…) and models — drop any Civitai SD1.5 / SDXL checkpoint in and it appears in the dropdown
- An `--api` flag that exposes the whole thing as a local HTTP API for scripting

## Before you start (read the Python note)

| Need | Notes |
|---|---|
| **Python 3.10.6 (recommended)** | **Official instruction: install 3.10.6 and tick "Add Python to PATH"** — newer Python versions don't work with torch (3.11+ requires setting `python_cmd` manually; not beginner-friendly) |
| **Git** | Free from [git-scm.com](https://git-scm.com/download/win) |
| GPU | NVIDIA discrete GPU preferred (4GB VRAM floor); iGPU/CPU works but is slow |
| Disk | ~1GB for the program, **plus ~2.5GB of PyTorch on first launch** and a model (SDXL checkpoints are 6–7GB) |
| Permissions | **Zero admin** — installs into your user folder |

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Stable Diffusion WebUI** → **Install**
2. It downloads the official tag archive (hash-verified, CN traffic switches gateway automatically) and clones it to `~/sd-webui`
3. A **user-level venv** is created and dependencies installed — your system Python stays untouched, no admin rights
4. The first launch pulls PyTorch and friends (set `PIP_INDEX_URL` to a domestic mirror if it's slow)

### Route B: manual install (official commands)

```bash
git clone --depth 1 -b v1.10.1 https://github.com/AUTOMATIC1111/stable-diffusion-webui.git ~/sd-webui
cd ~/sd-webui
python -m venv venv                                  # isolated environment
./venv/bin/pip install -r requirements.txt           # Windows: .\venv\Scripts\pip
./venv/bin/python launch.py                          # first run finishes the setup
```

On Windows you can also use the official script: with Python 3.10.6 and Git installed, double-click `webui-user.bat` in the cloned folder **as a normal user** (never "Run as administrator"). Linux needs system packages first: `sudo apt install wget git python3 python3-venv libgl1 libglib2.0-0`.

## Configuration & verification

### Launch flags (the four that matter)

Put flags in `COMMANDLINE_ARGS=` inside `webui-user.bat` (Windows) or `webui-user.sh` (Linux):

| Flag | What it does |
|---|---|
| `--medvram` / `--lowvram` | **Add this on CUDA out-of-memory errors** — trades speed for VRAM |
| `--xformers` | Memory-efficient attention, faster on NVIDIA |
| `--api` | Enables the local API (`/sdapi/v1/*`, Swagger UI at `/docs`) |
| `--listen --port 7860` | LAN access (keep the firewall restricted to your network) |
| `--precision full --no-half` | Common fix for completely black images |

Example: `set COMMANDLINE_ARGS=--medvram --xformers` in `webui-user.bat`.

### Downloading and placing models

1. Grab a `.safetensors` checkpoint from [Civitai](https://civitai.com/) or Hugging Face
2. Drop it into **`~/sd-webui/models/Stable-diffusion/`**, refresh, and it shows up in the top dropdown
3. Same idea for the rest: `models/VAE`, `models/Lora`, `embeddings/`, `models/ControlNet`
4. With no model present, the first launch auto-downloads the official SD 1.5 / SDXL weights (or pre-place them to skip the wait)

### Installing plugins (one line)

Sidebar **Extensions → Install from URL**, paste the plugin repo (or search under the **Available** tab via Load from index), install, then **Apply and restart UI**.

### What "success" looks like

1. The terminal prints `Running on local URL: http://127.0.0.1:7860` — open it
2. Pick a model at the top, type any prompt, hit **Generate**
3. The progress bar completes and an image appears (the **PNG Info** tab shows its generation parameters)

## FAQ

- **Slow dependency / PyTorch downloads**: `set PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple` and reinstall (the AiBOX route mirrors automatically)
- **torch / CUDA version errors**: confirm Python is **3.10.6**; if you installed the wrong version, delete `venv` and recreate it
- **CUDA out of memory**: add `--medvram` (then `--lowvram` if needed) or generate at smaller resolutions
- **All-black images**: add `--precision full --no-half`
- **`MetadataIncompleteBuffer` / `PytorchStreamReader` on a model**: the file is corrupt — download it again
- **Port in use**: add `--port 7861` to `COMMANDLINE_ARGS`

## Uninstall

```bash
rm -rf ~/sd-webui     # venv, models and outputs all live here — back up models/ and outputs/ first
```

AiBOX's **Manage → Uninstall** handles it.

More: [GitHub README](https://github.com/AUTOMATIC1111/stable-diffusion-webui#readme) · [install & run wiki](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs) · [features wiki](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features)
