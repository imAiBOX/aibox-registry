# Fooocus install guide

## Before you start
- **OS**: Windows 10/11 or macOS 12+ (GPU recommended)
- **Prerequisite**: Git + Python 3.10+ (free, user-level)
- **Disk**: first run pulls PyTorch (~2.5GB) + a model
- **Permissions**: zero admin

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **Fooocus** → Install
2. Source archive hash-verified, cloned to `~/Fooocus`, venv deps installed
3. Launch — Fooocus is the "one-click, few knobs" image generator

## Manual install
```bash
git clone --depth 1 -b v2.5.5 https://github.com/lllyasviel/Fooocus.git ~/Fooocus
cd ~/Fooocus && python -m venv venv && ./venv/bin/pip install -r requirements_versions.txt
./venv/bin/python entry_point.py
```

## Configure & verify
1. First run downloads the model (CN mirror: `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`)
2. Open `http://127.0.0.1:7860`
3. One prompt → one image means it works

## Troubleshooting
- **Fooocus vs A1111**: simple output → Fooocus; plugin ecosystem → A1111
- Slow first start is the model download

## Uninstall
Delete `~/Fooocus` (models + outputs inside — back up first); AiBOX → Manage → Uninstall.
