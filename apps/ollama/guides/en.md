# Ollama install & setup guide

One line: **Ollama is the most popular local model runner** — one command downloads and runs
thousands of open models (Qwen, Llama, Gemma…), fully offline and free; any chat or coding tool
can connect to it.

## What you get

- A local model server on `http://localhost:11434` that any OpenAI-compatible tool can use
- One-command model installs: `ollama pull qwen2.5:7b` runs on 8 GB RAM, no GPU required
- Truly offline after download; all data stays on your machine
- Built-in CLI chat: `ollama run <model>` and start talking

## Before you start (2 minutes)

| Need | Notes |
|---|---|
| **Windows 10+ x64** | Installs per-user — **no administrator rights at any point** |
| **macOS** | One build for Intel and Apple Silicon |
| RAM | 4–8 GB for small models (`llama3.2:3b` for low-end machines, `qwen2.5:7b` good in Chinese / 8 GB) |
| Disk | Models are 1–8 GB each; 10 GB+ free is comfortable |
| Network | Needed only for the installer and model downloads; afterwards fully offline |

Not needed: a GPU, Python, Node.js, Docker (optional).

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Ollama** → **Install**
2. AiBOX downloads the official package (sha256-verified, CN traffic auto-switches to the
   gh-proxy gateway and falls back to direct): Windows is silently installed into
   `%LOCALAPPDATA%\Programs\Ollama` (current user, zero elevation); macOS is copied into
   `/Applications/Ollama.app`
3. The Ollama service starts automatically (menu-bar / tray llama icon)

### Route B: manual install (official commands)

```powershell
# Windows PowerShell
irm https://ollama.com/install.ps1 | iex
```

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh
```

Or download `OllamaSetup.exe` / `Ollama.dmg` from [ollama.com/download](https://ollama.com/download)
and double-click; if the CDN is slow, use the GitHub Releases channel with an accelerator.

## Configuration: pull your first model (the only step you do)

```bash
ollama pull qwen2.5:7b     # great in Chinese, runs on 8 GB RAM (AiBOX pick)
ollama run qwen2.5:7b      # chat immediately; type exit to quit
```

- Try other models: `ollama pull llama3.2:3b` (low-end starter) — full list at
  [ollama.com/library](https://ollama.com/library)
- Advanced (optional): models live in `%LOCALAPPDATA%\Ollama\models` (Windows) /
  `~/.ollama/models` (macOS); `OLLAMA_MODELS` moves them, `OLLAMA_HOST` changes the port

## Verification: what "success" looks like

1. `ollama --version` prints `0.40.16` (or your installed version)
2. `ollama list` shows the model you just pulled
3. `curl http://localhost:11434/api/tags` returns model JSON = the service is running
4. **Chat check**: `ollama run qwen2.5:7b`, say hello — a **normal reply** = full chain works
5. Tool integration (optional): point any OpenAI-compatible client at
   `http://localhost:11434/v1` (any dummy API key works)

## FAQ

- **Connection refused / API not reachable**: the service is down — start Ollama from the
  menu bar, or run `ollama serve` manually
- **Model downloads slow or interrupted**: the source is overseas; retry, or start with the
  small `llama3.2:3b` on unstable networks
- **Port 11434 already in use**: set `OLLAMA_HOST=127.0.0.1:11435` and restart Ollama
- **Slow replies / out of memory**: pick a smaller quantized model (3B class) and free up RAM
- **Expose to other devices on the LAN**: it listens on localhost only (safer); set
  `OLLAMA_HOST=0.0.0.0:11434` if you really need it
- **Upgrading**: run the new installer over the old one — your model directory is untouched

## Uninstall

- **Windows**: quit the tray icon, then Settings → Apps → Ollama → Uninstall;
  delete `%LOCALAPPDATA%\Ollama` (downloaded models, several GB) and any leftovers in
  `%LOCALAPPDATA%\Programs\Ollama`
- **macOS**: quit the menu bar icon, drag `/Applications/Ollama.app` to the Trash,
  and remove `~/.ollama` (model data)

More: [quickstart](https://docs.ollama.com/quickstart) · [API docs](https://docs.ollama.com/api) · [model library](https://ollama.com/library)
