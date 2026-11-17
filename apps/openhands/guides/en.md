# OpenHands install guide

## Before you start
- **OS**: Windows 10/11 x64 or macOS 12+ (universal build)
- **Disk**: ~1.5GB (installer 168MB / dmg 350MB)
- **Permissions**: no admin rights — installs into your user folder
- **Required**: a model API key (OpenRouter / Anthropic / OpenAI / local Ollama)

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **OpenHands** → Install
2. The installer downloads (CN gateways auto-fallback) with hash verification
3. Launch OpenHands from the Start menu / Applications

## Manual install
- **Windows**: download `OpenHands-Agent-Canvas-1.41.0-Setup-1.41.0.exe` from GitHub Releases and run it (per-user, no UAC)
- **macOS**: download the universal dmg and drag OpenHands.app into Applications

## Configure (make it actually work)
1. Launch, open Settings, pick a provider (OpenRouter recommended: one key, every model)
2. Paste your API key (create at https://openrouter.ai/keys, starts with `sk-or-v1-`)
3. **The key stays on this machine** — neither AiBOX nor OpenHands uploads it

## Verify success
Give it a small task ("write a hello-world Python script and run it"). If it creates the file, executes the command and reports back, you're done.

## Troubleshooting
- **Model connection fails**: check the key is complete and your account has balance
- **Slow access from CN**: OpenRouter works, or use an official Anthropic/OpenAI key
- **Task stops mid-way**: likely model output limit — try a stronger model

## Uninstall
Windows: Settings → Apps → Uninstall. macOS: delete OpenHands.app from Applications.
Conversation history and workspace files live in the data folder (`%APPDATA%/Roaming/OpenHands` or `~/Library/Application Support/OpenHands`) — **deleting loses them; back up first**. AiBOX → Manage → Uninstall backs up automatically.
