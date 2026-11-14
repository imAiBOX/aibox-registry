# LobeHub (LobeChat) desktop install & setup guide

One line: **LobeHub (84k+ stars on GitHub) is an open-source AI chat workspace** — the official desktop app puts one polished client on your machine for many model providers, with multi-agent chats, memory and MCP connectors; credentials are stored encrypted.

## What you get

- A native desktop app for Windows and macOS (Apple Silicon / Intel) with built-in auto-update
- One client, many providers: OpenAI, Anthropic, Google, OpenRouter, DeepSeek… plus local Ollama / LM Studio
- Agent-focused extras: multi-agent chats, memory, knowledge files, and MCP connectors installed on your computer
- Same product everywhere: desktop, web ([app.lobehub.com](https://app.lobehub.com)) and mobile apps share one account
- Your data on your device: local conversations live in the app's own data directory; sign-in syncs your account content across devices

## Before you start (2 minutes)

- Windows 10/11 (x64) or macOS (Apple Silicon or Intel) — pick the matching download
- One model source: a cloud API key, or a local Ollama server (any one)
- Not needed: administrator rights (the Windows installer is per-user), Docker, Node.js, a self-hosted server
- Heads-up: the desktop app is not fully offline — cloud models, sign-in and sync need a network (official docs)

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **LobeHub** → **Install**
2. AiBOX downloads the official GitHub release installer (sha256-verified; CN traffic auto-uses the accelerated channel) and runs the NSIS silent install (`/S`) on Windows / mounts the DMG and copies the app on macOS — **zero admin rights**
3. Launch **LobeHub** from the Start menu / Applications — that's it

### Route B: manual install (official channels)

- **Official downloads page**: [lobehub.com/downloads](https://lobehub.com/downloads) → Windows installer or macOS DMG (Apple Silicon / Intel)
- **Windows**: run `LobeHub-x.y.z-setup.exe` — installs for the current user into `%LOCALAPPDATA%\Programs\LobeHub`
- **macOS**: open the DMG and drag **LobeHub.app** into `/Applications` (signed & notarized)
- The web edition at [app.lobehub.com](https://app.lobehub.com) needs no install at all
- Mobile (iOS/Android) is available from the same downloads page — sign in with the same account

## Configuration

1. First launch: create / sign in with your personal account (same account syncs across desktop, web and mobile; files stored only on this device do **not** sync automatically — official docs)
2. Add a model: **Settings → AI Providers** → pick a provider → flip its switch on → paste the API key (most providers; Bedrock/Azure also ask for region/endpoint)
3. Local models: choose Ollama / LM Studio / vLLM and enter the local endpoint in the **Proxy URL** field
4. Per-agent model choice: each Agent can pick its own default model — set it in the agent settings

## Verification: what "works" looks like

1. The window opens and you are signed in (or in local mode)
2. In **Settings → AI Providers** your provider's switch is green
3. Send a test chat ("hello") from the main window → a streaming reply comes back
4. Optional terminal check (Windows):

```powershell
"%LOCALAPPDATA%\Programs\LobeHub\LobeHub.exe" --version
# should print x.y.z (matches the release AiBOX installed)
```

## FAQ

- **Where is my data**: local conversations and sessions live in `%APPDATA%\LobeHub` (Windows) / `~/Library/Application Support/LobeHub` (macOS); account content lives with your sign-in
- **Key safety**: credentials are stored encrypted by the desktop app (official desktop README)
- **Provider connection fails**: check the key, or set the provider's **Proxy URL** to an API-compatible endpoint / your Ollama address
- **Side-by-side work**: the desktop app adds a work panel next to the chat and multi-tab browsing — see the official "Getting LobeHub" page
- **CN access**: if a provider's endpoint is slow, use its Proxy URL field with a mirror endpoint; the app itself downloads from GitHub releases (AiBOX uses accelerated channels)
- **Updates**: the app auto-updates; AiBOX re-install also overwrites cleanly with a newer release
- **Uninstall keeps nothing secret**: local-only chats don't survive an uninstall — export first

## Uninstall

- **Windows**: Settings → Apps → LobeHub → Uninstall (or the bundled uninstaller in `%LOCALAPPDATA%\Programs\LobeHub`)
- **macOS**: quit LobeHub and drag **LobeHub.app** from `/Applications` to the Trash
- Leftovers: `%APPDATA%\LobeHub` / `~/Library/Application Support/LobeHub` — delete them for a clean slate
- ⚠️ Content that exists only on this device does not sync automatically — back up / export before deleting

More: [downloads](https://lobehub.com/downloads) · [getting LobeHub](https://lobehub.com/docs/usage/getting-started/get-lobehub) · [model providers](https://lobehub.com/docs/usage/providers) · [self-hosting (web)](https://lobehub.com/docs/self-hosting/start)
