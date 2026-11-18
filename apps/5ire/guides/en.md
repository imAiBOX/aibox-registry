# 5ire install guide

## Before you start
- **OS**: Windows 10/11 x64, or macOS 12+ (separate builds for Apple silicon / Intel)
- **Disk**: ~1GB (installer 132MB / mac dmg 143-152MB)
- **Permissions**: the Windows installer asks for administrator rights (it installs machine-wide into `C:\Program Files\5ire`); macOS installs into /Applications
- **Required**: a model API key (OpenAI / Anthropic / Gemini / DeepSeek / local Ollama)

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **5ire** → Install
2. The installer downloads (CN gateways auto-fallback) with hash verification
3. Launch 5ire from the Start menu / Applications

## Manual install
- **Windows**: download `5ire-Setup-0.15.4.exe` from GitHub Releases and run the installer (an administrator prompt appears — it installs machine-wide into `C:\Program Files\5ire`)
- **macOS**: download the dmg for your chip (arm64 = Apple silicon, x64 = Intel), open it and drag **5ire.app** into Applications

## Configure (make it actually work)
1. First launch walks you through picking a model provider — OpenAI, Anthropic, Gemini, DeepSeek, Zhipu, Doubao, Moonshot, Mistral, Grok, Perplexity and more are built in, plus local Ollama / LMStudio
2. Paste your API key (create one at the provider's own console)
3. **The key stays on this machine** (`~/.5ire/config.json` on macOS, `%APPDATA%\5ire` on Windows) — neither AiBOX nor 5ire uploads it

## Beyond chat
- **MCP client**: connect MCP servers (tools, data sources) from the MCP settings screen
- **Knowledge base**: drop in txt / md / pdf / docx / xlsx files; embeddings are computed locally
- **Bilingual UI**: the interface follows your system language (English / 中文)

## Verify success
Ask 5ire something small ("summarize this PDF"). If it answers using your file, your setup is complete.

## Troubleshooting
- **Model connection fails**: check the key is complete and your account has balance
- **Slow access from CN**: use a domestic provider (DeepSeek / Zhipu / Doubao) or a local Ollama model
- **MCP tool not showing up**: the server usually needs its own command or API key filled in
- **Want more providers**: 5ire also accepts any OpenAI-compatible endpoint

## Uninstall
Windows: Start menu → 5ire → Uninstall. macOS: delete 5ire.app from Applications.
Provider keys, conversations and the local knowledge base live in the data folder (`%APPDATA%\5ire`, `~/Library/Application Support/5ire`) — **deleting loses them; back up first**. AiBOX → Manage → Uninstall backs up automatically.
