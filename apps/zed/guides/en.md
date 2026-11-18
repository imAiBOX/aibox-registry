# Zed install guide

## Before you start
- **OS**: Windows 10 (1903+) / Windows 11, or macOS 12+ (separate builds for Apple silicon / Intel)
- **Disk**: ~500MB (installer 56-63MB / mac dmg 85-93MB)
- **Permissions**: no admin rights — installs into your user folder
- **Required**: nothing extra. Zed is a native Rust app — no Node, Python, .NET or VC++ runtime needed. A DirectX 11 GPU is required.

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **Zed** → Install
2. The installer downloads (CN gateways auto-fallback) with hash verification
3. Launch Zed from the Start menu / Applications

## Manual install
- **Windows**: download `Zed-x86_64.exe` (Intel/AMD) or `Zed-aarch64.exe` (Windows on ARM) from GitHub Releases and run it. It installs into `%LOCALAPPDATA%\Programs\Zed` with no admin prompt. AiBOX adds `/TASKS` flags so a fresh install does **not** change your file associations, context menu or PATH.
- **macOS**: download the dmg for your chip (arm64 = Apple silicon, x64 = Intel), open it and drag **Zed.app** into Applications.

## Configure (make it actually work)
Zed is a code editor first — open a folder and it works. For the AI side:
1. Open the **Agent Panel** (right side of the window)
2. Add a provider key — Anthropic or OpenAI work out of the box
3. Or connect an **external agent** from the Agent Panel's registry: Claude Code, Codex, Gemini CLI, OpenCode, Pi and others install from there (each agent brings its own login)

**Your keys stay on your machine** — they live in `settings.json` under your user profile.

## Why people like it
- **Instant start**: native Rust binary, no Electron, no web view
- **Built for agents**: the Agent Panel is a first-class citizen, not a bolted-on chat box
- **Extensible**: extensions run in a sandboxed WASM runtime; language servers are installed for you
- **Free and open source**: GPL-3.0-or-later, with some Apache-2.0 components

## Verify success
Open a folder with a text file, type something, then ask the agent panel "explain this file". If it answers with your file's content, you're set.

## Troubleshooting
- **"Unsupported GPU" / blank window**: Zed needs a DirectX 11 GPU (Microsoft Basic Display Adapter is not supported) — this usually means missing graphics drivers
- **Extension or language server does not load**: check Settings → Zed Tasks for an error; some need a toolchain (rust-analyzer, etc.) installed separately
- **External agent not found**: install that agent's CLI yourself first (for example `npm i -g @openai/codex`), then connect it from the Agent Panel
- **Slow access from CN**: use the AiBOX install (it picks a CN mirror automatically)

## Uninstall
Windows: Settings → Apps → Zed → Uninstall. macOS: drag Zed.app to the Trash.
The uninstaller removes the file associations, PATH entry and context-menu package it added, but your settings, key bindings, themes and snippets stay behind in `%APPDATA%\Zed` (Windows) or `~/.config/zed` (macOS) — **delete those folders by hand only if you want a clean slate**. AiBOX → Manage → Uninstall backs up automatically.
