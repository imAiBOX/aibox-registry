# AnythingLLM install & setup guide

One line: **AnythingLLM (68k+ stars on GitHub) is a desktop knowledge-base AI**: drag PDFs and
notes into a workspace — it chunks, embeds and indexes them, then answers questions **with the
source passages cited**. Built-in local model engine out of the box, cloud keys optional.

## What you get

- A private knowledge base: documents → vector store → answers with citations (RAG), all on your machine
- Built-in local LLM engine (Lemonade + llama.cpp; GPU support files are fetched during install),
  usable without buying any API key
- Cloud models too: OpenAI / Anthropic / OpenRouter / Google / local Ollama, etc.
  (full list in the official docs)
- Isolated workspaces, Agent skills, audio transcription, scheduled tasks and more

## Before you start (2 minutes)

- **Windows 10+ (x64 or ARM64)** or **macOS** (separate builds for Apple Silicon / Intel)
- Keep 5 GB+ free (app + built-in engine + GPU support files; optional meeting-transcription
  model is ~2 GB more)
- Network needed while installing to fetch the engine/GPU files (vendor CDN); after that you can
  run local models fully offline
- ⚠️ Official requirement: **install "current user only"** — "all users" is not supported; no
  administrator rights needed at any point
- Not needed: Docker, Python, Node

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **AnythingLLM** → **Install**
2. AiBOX downloads the official installer (sha256-verified, accelerated automatically in CN):
   Windows uses the vendor's silent mode `/S` into `%LOCALAPPDATA%\Programs\AnythingLLM`
   (current user, zero elevation); macOS picks Silicon/Intel dmg by machine and copies into
   `/Applications`

### Route B: manual install (official channels)

- **Windows**: download the installer for your architecture from
  [anythingllm.com/download](https://anythingllm.com/download/) and double-click it
  (keep the "current user" option); silent install (official docs, v1.16.1+):

```powershell
.\AnythingLLMDesktop.exe /S                     # silent, skips the transcription model
.\AnythingLLMDesktop.exe /S /DOWNLOAD_MODEL=yes # silent + download the ~2GB transcription model
```

- **macOS**: download `AnythingLLMDesktop-Silicon.dmg` (M-series) or `AnythingLLMDesktop.dmg`
  (Intel), drag AnythingLLM into Applications; or `brew install --cask anythingllm`

## Configuration (connect a model)

1. First launch runs onboarding: pick a **Workspace** and name it
2. Gear icon (top right) → **AI Providers**:
   - **Built-in engine (default)**: works out of the box — zero configuration
   - **Cloud keys**: paste an OpenAI / Anthropic / OpenRouter key (from that vendor's console)
   - **Ollama**: auto-detected if Ollama is running — choose a model
3. **Add knowledge**: workspace → Upload Documents → drop PDF/Word/Markdown → click **Ingest**
4. Chat with that workspace selected — answers will cite your documents

## Verification: what "success" looks like

1. The app opens and shows its version (top right; "Open storage" jumps to the data folder)
2. Create a workspace, upload a PDF, ingestion finishes with a green check
3. Ask a question **only that PDF can answer** → correct reply **with the cited source** = RAG chain works
4. Settings → AI Providers shows the model connected and replying = key configured correctly

## FAQ

- **"AnythingLLM cannot be closed" during install**: an old instance is still in the tray —
  right-click the tray icon → Quit, then retry (official troubleshooting doc)
- **A previous "all users" install exists**: uninstall it first with
  `Uninstall AnythingLLM.exe` from its install folder, then reinstall for the current user
- **Local model slow / no GPU**: if the GPU support files failed to download during install the
  app falls back to CPU — check the network and reinstall, or read `*_install.log` in the install folder
- **Upgrading**: run the new installer over the old version — data stays put; the in-app update
  banner also notifies you
- **Where is my data?** Windows `%APPDATA%\anythingllm-desktop\storage`,
  macOS `~/Library/Application Support/anythingllm-desktop/storage`

## Uninstall

- **Windows** (official silent flags): run
  `"%LOCALAPPDATA%\Programs\AnythingLLM\Uninstall AnythingLLM.exe" /S` (keeps data);
  add `/S /DELETE_DATA=yes` to purge data too (**irreversible**)
- **macOS**: quit the app and drag AnythingLLM.app to the Trash,
  or `brew uninstall --cask anythingllm` (add `--zap` to remove data)
- ⚠️ Workspaces, parsed documents, vectors, chat history and local models all live in the data
  folder — **back up before deleting**

More: [install docs](https://docs.anythingllm.com/installation-desktop/overview) · [storage locations](https://docs.anythingllm.com/installation-desktop/storage) · [uninstall](https://docs.anythingllm.com/installation-desktop/uninstall)
