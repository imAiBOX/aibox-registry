# Chatbox install & setup guide

One line: **Chatbox is a lightweight cross-platform AI chat client** — simple UI, ready as
soon as it installs, switch providers freely, and conversations stay on your own machine.

## What you get

- Minimal learning curve: install, paste one key, start chatting
- Multi-provider switching: built-in OpenRouter / Anthropic / OpenAI / Google, plus local
  Ollama or any custom OpenAI-compatible endpoint
- Local-first data: chats stored on-device, exportable; desktop builds for Windows, macOS, Linux
- Streaming replies, Markdown with code highlighting, prompt library, dark theme

## Before you start (3 minutes)

| Need | Notes |
|---|---|
| **Windows 10+ (x64)** | Official system requirement; installs per-user — **no admin rights needed** |
| **macOS 11+** | Separate builds for Intel and Apple Silicon |
| One model key | OpenRouter recommended (one key for many vendors); or local Ollama (free, offline) |
| Disk | The app is small (~100 MB class) |

Not needed: Node.js, Python, Docker, a GPU.

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Chatbox** → **Install**
2. AiBOX downloads from the **official CDN (download.chatboxai.app)** (sha256-verified, same
   source worldwide): Windows installs silently into `%LOCALAPPDATA%\Programs\Chatbox`
   (zero elevation); macOS picks the Apple Silicon / Intel dmg and copies into `/Applications`

### Route B: manual install (official channels)

- [chatboxai.app](https://chatboxai.app) (choose Windows / Mac Intel / Mac Apple Silicon / Linux),
  or [GitHub Releases](https://github.com/chatboxai/chatbox/releases)
- Linux ships as AppImage; iOS/Android store apps exist (separate data from the desktop app)

## Configuration: paste one key (the only step you do)

1. Open Chatbox → bottom-left **Settings** → **AI Provider**
2. Pick one of four providers (key created on that vendor's console):
   - **OpenRouter (recommended)**: one key for Claude / GPT / Gemini and more
   - **Anthropic** / **OpenAI** / **Google**: direct official APIs
3. Select the **Model** to use and save
4. **Free local route (optional)**: set the provider to **Ollama** (with Ollama running), or a
   custom endpoint at `http://localhost:11434/v1` (any OpenAI-compatible server)
5. Back to the chat page and send a message

## Verification: what "success" looks like

1. `Chatbox.exe --version` prints `1.24.3` (AiBOX verifies this after install)
2. Say hello in a new chat → a **streaming reply** = key + model chain works
3. Switch to another provider/model and reply again — both working = config is right
4. Restart Chatbox — history is still there = local storage is healthy

## FAQ

- **401 / unauthorized**: key mis-copied or no balance — re-check on the provider's console
- **Model dropdown is empty**: no model selected for that provider yet — go back to
  Settings → AI Provider and pick one
- **Changing models**: switch anytime in Settings → AI Provider; history is unaffected
- **Network in CN**: the official CDN downloads worldwide; slow replies usually come from the
  chosen provider — try OpenRouter or a local Ollama instead
- **Backup / migration**: chats live on-device (config at `%APPDATA%\Chatbox`); export data
  from settings before moving machines

## Uninstall

- **Windows**: Settings → Apps → Chatbox → Uninstall; then delete `%APPDATA%\Chatbox`
  (config + chats — export from settings first)
- **macOS**: quit the app, drag `Chatbox.app` to the Trash, and remove
  `~/Library/Application Support/Chatbox` for a full clean

More: [chatboxai.app](https://chatboxai.app) · [repo](https://github.com/chatboxai/chatbox) · [FAQ](https://github.com/chatboxai/chatbox/blob/master/doc/FAQ.md)
