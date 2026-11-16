# Stable Diffusion WebUI (A1111) install guide

## Before you start
- **OS**: Windows 10/11 or macOS 12+ (a discrete GPU helps; CPU works too)
- **Prerequisite**: Git + Python 3.10+ (free, user-level)
- **Disk**: ~1GB for the app; first run pulls PyTorch (~2.5GB) + a model
- **Permissions**: zero admin — everything lives in your user folder

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **Stable Diffusion WebUI** → Install
2. Downloads the source archive (hash-verified), clones to `~/sd-webui`, builds a venv
3. Launch the local server and open it in your browser

## Manual install
```bash
git clone --depth 1 -b v1.10.1 https://github.com/AUTOMATIC1111/stable-diffusion-webui.git ~/sd-webui
cd ~/sd-webui && python -m venv venv && ./venv/bin/pip install -r requirements.txt
./venv/bin/python launch.py
```

## Configure & verify
1. First run downloads a model (CN mirror tip: `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`)
2. Open `http://127.0.0.1:7860`
3. Generating one image means it works

## Troubleshooting
- **Slow deps**: use the mirror above and rerun
- **Low VRAM**: add `--medvram` or `--lowvram`

## Uninstall
Delete `~/sd-webui` (models + outputs live there — back up first); AiBOX → Manage → Uninstall.
