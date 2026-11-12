# Jan install & setup guide

One line: **Jan is the offline-first open-source ChatGPT alternative** — download and run
open models (Llama, Qwen, Gemma…) on your own computer, or plug in a cloud key; chats,
assistants and documents all stay local, working even without the internet.

## What you get

- In-app model hub: pull open models from HuggingFace and run them locally, free and offline
- Cloud when you want it: OpenRouter (recommended) / Anthropic / OpenAI / Google, switch anytime
- A local OpenAI-compatible API (default `http://localhost:1337`) so other tools can use your models
- Custom assistants, MCP extensions; everything stored on your machine

## Before you start (3 minutes)

| Need | Notes |
|---|---|
| **Windows 10+ x64 / ARM64** | Both architectures available; installs per-user — **no admin rights** |
| **macOS** | One universal file for Intel and Apple Silicon |
| Disk | App is a few hundred MB; local models 2–8 GB each — keep 10 GB+ free |
| Model source | Either ① a local open model (free) or ② a cloud API key |

Not needed: Python, Node.js, Docker, a GPU (a GPU just makes it faster).

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Jan** → **Install**
2. AiBOX downloads the official package (sha256-verified; CN traffic auto-switches to the
   ghfast / gh-proxy gateways with direct fallback): Windows installs silently into
   `%LOCALAPPDATA%\Jan` (zero elevation); macOS copies the universal dmg content into
   `/Applications` — one file for Intel and Apple Silicon

### Route B: manual install (official channels)

- [jan.ai](https://jan.ai/) or direct links: Windows
  [win-x64](https://app.jan.ai/download/latest/win-x64), macOS
  [mac-universal](https://app.jan.ai/download/latest/mac-universal),
  or [GitHub Releases](https://github.com/janhq/jan/releases)
- Also available: Microsoft Store, Flathub for Linux
- ⚠️ If Jan is already installed from the Microsoft Store, **keep only one copy** so two data
  sets don't collide

## Configuration: pick a model (the only step you do)

**Local model route (free, offline)**:

1. Open Jan → left sidebar **Models** → search and download an open model (Qwen / Llama /
   Gemma from HuggingFace; first downloads are large — wait for the progress bar)
2. New chat → select the model you downloaded → talk

**Cloud key route**:

1. **Settings → Model Providers** → choose OpenRouter (recommended, one key for many vendors) /
   Anthropic / OpenAI / Google (Mistral, Groq and others also supported) → paste the key
2. Switch to that provider's model in the chat

## Verification: what "success" looks like

1. `Jan-Desktop.exe --version` prints `0.8.8` (AiBOX verifies this after install)
2. Local route: after the model finishes downloading, a message gets a **normal reply** = model chain works
3. Cloud route: a message replies after pasting the key = key configured correctly
4. **API check (optional)**: with the local API enabled in Settings,
   `curl http://localhost:1337/v1/models` lists your models = other tools can connect

## FAQ

- **Model downloads slow or failing**: the source is HuggingFace — retry, pick a smaller
  model on unstable networks, or use the cloud key route for now
- **Slow replies**: local models are CPU/RAM hungry — choose a smaller quantization or free
  up memory
- **Local API won't connect**: confirm the API server is enabled in Settings and the port is
  1337 (localhost only)
- **Poor answer quality**: small models are limited — move to a bigger model or a cloud provider
- **Backing up data**: config lives in `%APPDATA%\Jan` (Windows) /
  `~/Library/Application Support/Jan` (macOS) — copy it out before uninstalling

## Uninstall

- **Windows**: Settings → Apps → Jan → Uninstall; then delete `%LOCALAPPDATA%\Jan` (program)
  and `%APPDATA%\Jan` (config, chats, downloaded models — **back up first**)
- **macOS**: quit the app, drag `Jan.app` to the Trash, and remove
  `~/Library/Application Support/Jan` for a full clean

More: [docs](https://jan.ai/docs) · [repo](https://github.com/janhq/jan) · [changelog](https://jan.ai/changelog)
