# nanobot install & setup guide

One line: **nanobot (HKUDS, 50k+ stars) is an ultra-lightweight open-source personal agent**: it works from a browser, a terminal or your chat apps, reads and writes your files, remembers preferences and runs scheduled tasks — pure Python, with config and history stored in your own `~/.nanobot`.

## What you get

- Browser WebUI (localhost) + terminal TUI + chat channels (Telegram/QQ…) in one tool
- File tools, scheduled tasks, MCP tools, skill packages, SQLite session history
- Model freedom: OpenAI, Claude, DeepSeek, Qwen… or fully local and free via Ollama

## Before you start (3 minutes)

| Need | Notes |
|---|---|
| **Python 3.11+** | Check with `python --version`; grab it from [python.org](https://www.python.org/downloads/) if missing (Windows: tick "Add to PATH") |
| A model | A provider key (OpenAI/Claude/DeepSeek…) or local [Ollama](https://ollama.com) (free, offline) |
| System | Windows x64 (SSE4.2 required) / macOS 13+ (Intel and Apple Silicon) |

Not needed: administrator rights, Docker, a server. The install target is an isolated virtualenv at `~/.nanobot/venv` — your system Python is never touched.

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **nanobot** → **Install**
2. AiBOX downloads the official release wheel (sha256-verified, accelerated automatically in CN) and installs it into `~/.nanobot/venv` — the same layout as the official installer
3. When it finishes, run `nanobot webui` in a terminal to configure it

### Route B: manual install (official commands)

Official recommended installer (creates the environment and opens the WebUI):

```powershell
# Windows PowerShell
irm https://raw.githubusercontent.com/HKUDS/nanobot/main/scripts/install.ps1 | iex
```

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/HKUDS/nanobot/main/scripts/install.sh | sh
```

Already using uv / pip? Install the same `nanobot-ai` package yourself:

```bash
uv tool install nanobot-ai        # or: python -m pip install nanobot-ai
```

## Configuration (connect a model)

```bash
nanobot webui     # opens the WebUI (copy the full login link from the terminal, including the # fragment)
```

1. **Settings → Models** → save a provider/model preset (enter your key or local endpoint)
2. Free local route: run `ollama serve` and `ollama pull qwen2.5:7b`, then pick the Ollama provider in nanobot
3. Settings are written to `~/.nanobot/config.json` (you can reference secrets as `${VAR}` environment variables instead)

## Verification: what "success" looks like

1. `nanobot --version` prints `0.4.1` (or the version you installed)
2. Send `Hello!` in the WebUI → a **normal reply** means the model is connected
3. Stronger check: start a new topic, ask it to "read notes.txt and write summary.md", then open the generated file
4. Chat channels: follow the WebUI onboarding to connect Telegram and get a reply there

## FAQ

- **`nanobot` is not recognized**: the installer prints the exact command to reuse; or run `python -m nanobot webui` (uv/pipx users: locate the environment with the original tool)
- **pip says `externally-managed-environment`**: do not add `--break-system-packages` — use the official installer or `uv tool install nanobot-ai` instead
- **PyPI downloads are slow in CN**: point pip at a domestic mirror (e.g. TUNA), or use the AiBOX route (its download layer is already accelerated)
- **Port in use / WebUI won't open**: the login link printed in the terminal is authoritative; for remote servers forward port 8765 over SSH
- **Upgrading**: stick to your install method — `uv tool upgrade nanobot-ai` or `python -m pip install -U nanobot-ai`; stop the gateway and back up `~/.nanobot` first

## Uninstall

```bash
# Stop the gateway first (gateway stop in the WebUI, or Ctrl+C)
rm -rf ~/.nanobot      # venv, config.json and chat history live here — back up before deleting
```

More: [stable docs at nanobot.wiki](https://nanobot.wiki/docs/latest/getting-started/nanobot-overview) · [repo docs](https://github.com/HKUDS/nanobot/blob/main/docs/README.md)
