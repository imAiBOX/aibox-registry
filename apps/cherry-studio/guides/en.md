# Cherry Studio install & setup guide

One line: **Cherry Studio is a polished desktop AI workspace** — connect several model
providers in one client for chat, knowledge bases, agents, translation and image creation,
with conversation history stored on your own machine.

## What you get

- Multiple models side by side: cloud keys for OpenAI, Anthropic, Gemini, OpenRouter — plus
  local Ollama / LM Studio
- Knowledge bases (RAG): drop in files, reference them in conversations
- Agents with MCP extensions, multi-model comparisons, Markdown/diagram/formula rendering
- Translation, image generation, voice input; history stored locally with local & WebDAV backup

## Before you start (3 minutes)

| Need | Notes |
|---|---|
| **Windows 10+** | x64 and ARM64 installers, installed per-user — **no admin rights needed** |
| **macOS** | Separate dmg for Intel / Apple Silicon |
| One model source | Either ① any cloud API key (one OpenRouter key covers many vendors) or ② a local Ollama / LM Studio (free, offline) |
| Disk | App is a few hundred MB; local models are extra |

Not needed: Node.js, Python, Docker.

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Cherry Studio** → **Install**
2. AiBOX downloads the official package (sha256-verified; CN traffic auto-switches to the
   ghfast / gh-proxy gateways with direct fallback): Windows installs silently into
   `%LOCALAPPDATA%\Programs\Cherry Studio` (zero elevation); macOS copies the Intel/Apple
   Silicon dmg content into `/Applications`

### Route B: manual install (official channels)

- [cherryai.com/download](https://cherryai.com/download) or
  [GitHub Releases](https://github.com/CherryHQ/cherry-studio/releases):
  Windows `Cherry-Studio-…-Setup.exe` (double-click), macOS drag the dmg content into
  Applications, Linux has an official AppImage
- Upgrading: run the new installer over the old one — settings and chats stay

## Configuration: connect a model (the only step you do)

1. Open Cherry Studio → bottom-left **Settings** → **Model Providers**
2. Pick one of four providers and paste the key (created on that vendor's console):
   - **OpenRouter (recommended)**: one key for Claude / GPT / Gemini and more
   - **Anthropic** / **OpenAI** / **Google**: direct official APIs
3. **Add the models you want** under that provider — only checked models appear in the chat model picker
4. **Local models (optional)**: start Ollama first; Cherry Studio detects it — pick a model, no key needed
5. New chat → choose the model at the top → talk

## Verification: what "success" looks like

1. `Cherry Studio.exe --version` prints the version (AiBOX verifies this automatically)
2. Send a message in a new chat → a **streaming reply** means key + model chain works
3. Switch to another model and reply again — both answering = multi-model config is right
4. Stronger check (knowledge base, optional): create one → upload a file → after embedding,
   ask a question — the answer draws on your file = RAG works

## FAQ

- **401 / invalid key errors**: key mis-copied or no balance left — re-check on the provider's
  console, and remember quota vs. balance are different things
- **New model missing from the dropdown**: it was never added under the provider — go back to
  settings and check it
- **Local Ollama not detected**: make sure `ollama serve` is running (`ollama list` works in a
  terminal), then refresh in Cherry Studio
- **Migrating data**: everything lives in `%APPDATA%\CherryStudio` (Windows); the app also has
  local backup and WebDAV backup in settings
- **Network in CN**: direct connections to provider APIs generally work; model-list loading may
  be slow — just retry

## Uninstall

- **Windows**: Settings → Apps → Cherry Studio → Uninstall; then delete
  `%APPDATA%\CherryStudio` (chats and config — export a backup from settings first)
- **macOS**: quit the app, drag `Cherry Studio.app` to the Trash, and remove
  `~/Library/Application Support/CherryStudio` for a full clean

More: [docs](https://cherryai.com/docs/en/) · [repo](https://github.com/CherryHQ/cherry-studio) · [site](https://cherryai.com)
