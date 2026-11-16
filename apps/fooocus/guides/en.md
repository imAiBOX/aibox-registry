# Fooocus install & setup guide

One line: **Fooocus is one-click AI image generation** — Midjourney's ease of use with Stable Diffusion's free, offline, local-first model: write a prompt, get a good image, no parameter PhD required (4GB VRAM is enough).

## What you get

- Dead-simple generation: the project's own goal is "fewer than 3 clicks between downloading and your first image", and prompts work even when they're sloppy (built-in GPT-2 prompt expansion)
- Fully offline and open source: once models are local, it works with the network unplugged and nothing leaves your machine
- Depth when you need it: style packs, presets, img2img / inpaint / upscale / face swap, plus SDXL models and LoRAs straight from Civitai

## Fooocus or A1111? (read this first)

| You want | Pick |
|---|---|
| Open it and generate, zero parameters to learn | **Fooocus** (this page) |
| Plugins (ControlNet etc.), per-parameter control, batch automation | Stable Diffusion WebUI (A1111) |
| Models & prompt syntax | They overlap: Fooocus **uses A1111's reweighting algorithm**, so `(word:1.5)` and embedding syntax carry over unchanged |

## Before you start (3 minutes)

| Need | Notes |
|---|---|
| **Windows 10/11 or macOS 12+** | Linux works too; **no admin rights** |
| **Git + Python 3.10** | Source route requires Python 3.10; Windows users can skip Python with the official one-click bundle |
| GPU | Minimum **4GB NVIDIA VRAM + 8GB RAM** (pre-Pascal GPUs unsupported); AMD goes through DirectML (~3× slower), Mac/CPU much slower |
| Disk | First launch auto-downloads ~2.5GB of PyTorch plus multi-GB SDXL weights — keep 20GB+ free |

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Fooocus** → **Install**
2. It downloads the official tag archive (hash-verified, CN traffic switches gateway automatically) and clones into `~/Fooocus`
3. A user-level venv is created and `requirements_versions.txt` is installed — no admin rights, system Python untouched

### Route B: manual install (official commands)

```bash
git clone --depth 1 -b v2.5.5 https://github.com/lllyasviel/Fooocus.git ~/Fooocus
cd ~/Fooocus
python -m venv venv
./venv/bin/pip install -r requirements_versions.txt    # Windows: .\venv\Scripts\pip
./venv/bin/python entry_point.py                      # the official Windows bundle uses run.bat
```

On first launch models are downloaded into `Fooocus/models/checkpoints` (pre-place them to skip the wait).

## Configuration & verification

### Generation parameters — the five that matter

1. **Performance**: `Speed` (30 steps, default) / `Quality` (60 steps, finer) / `Extreme Speed` and `Lightning` (8 or 4 steps with their LoRAs, very fast). Start on Speed, switch to Extreme Speed when rushing, Quality when polishing
2. **Style**: tick style templates from the `sdxl_styles` folder — keep **Fooocus V2** (prompt expansion) on by default; put what you *don't* want into Advanced → Negative Prompt
3. **Aspect Ratios** and **Image Number** are self-explanatory; **Guidance / Sharpness** live under Advanced → Advanced (lower = more obedient, higher = more stylized)
4. **Prompt weighting**: same as A1111 — `(sunset:1.4)` to emphasize; anti-prompts go in the Negative Prompt
5. **Input Image**: drop an image to get Upscale / Variation / Inpaint / Outpaint / Image Prompt (including FaceSwap)

### Presets and models (style packs)

- Switch the **preset** at the top: `default` (all-round, juggernautXL_v8Rundiffusion), `realistic` (realisticStockPhoto_v20), `anime` (animaPencilXL_v500) — switching auto-downloads the matching model, or block that with `--disable-preset-download` and place models manually
- From the CLI: `--preset anime`. Your own checkpoints (Civitai SDXL models) and LoRAs go into `models/checkpoints` / `models/loras`, then get picked in the UI

### Offline mode

Once dependencies and weights are downloaded, Fooocus **is offline software** — it generates with the network unplugged. On a flaky connection use `--hf-mirror https://hf-mirror.com` to fetch models from a CN mirror, and `--disable-preset-download` to stop any automatic downloading altogether. Heads-up: the first inpainting run also pulls a 1.28GB control model, so do one warm-up pass while online.

```bash
./venv/bin/python entry_point.py --preset realistic --port 7860
```

Other handy flags: `--listen` (LAN access), `--language` (UI language), `--theme dark`.

### What "success" looks like

1. The terminal prints `http://127.0.0.1:7860` — open it in a browser
2. Type any prompt ("a cat in a garden") and hit **Generate**
3. An image appears within seconds to a minute, with its generation info viewable = you're set

## FAQ

- **First launch is painfully slow**: expected — it's downloading PyTorch and models; watch the terminal
- **`MetadataIncompleteBuffer` / `PytorchStreamReader`**: the model file is corrupt; delete and download again
- **Out of VRAM / `RuntimeError: CPUAllocator`**: check the 4GB VRAM + 8GB RAM floor; Windows needs virtual memory (page file) enabled, and the error page suggests 40GB+ free on each drive
- **Generation speed randomly tanks**: some NVIDIA drivers after 532 are reported ~10× slower; the project suggests rolling back to driver 531
- **Model downloads blocked or slow**: use `--hf-mirror`, or download weights manually into `models/checkpoints`
- **Port in use**: `--port 7861`

## Uninstall

```bash
rm -rf ~/Fooocus    # models, LoRAs and outputs live here — back up models/ and outputs/ first
```

AiBOX's **Manage → Uninstall** handles it.

More: [GitHub README](https://github.com/lllyasviel/Fooocus#readme) · [troubleshoot](https://github.com/lllyasviel/Fooocus/blob/main/troubleshoot.md) · [update log](https://github.com/lllyasviel/Fooocus/blob/main/update_log.md)
