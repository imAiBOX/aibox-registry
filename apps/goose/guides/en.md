# Goose install guide

## Before you start
- **OS**: Windows 10/11 x64 or macOS 12+ (separate builds for Apple silicon / Intel)
- **Disk**: ~1GB (installer 138MB / mac zip 183-193MB)
- **Permissions**: no admin rights — installs into your user folder
- **Required**: a model API key (OpenRouter / Anthropic / OpenAI / local Ollama)

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **Goose** → Install
2. The installer downloads (CN gateways auto-fallback) with hash verification
3. Launch Goose from the Start menu / Applications

## Manual install
- **Windows**: download `Goose-win32-x64-setup.exe` from GitHub Releases and run the wizard (per-user, no UAC; use the `/S` switch for silent deploys)
- **macOS**: download the zip for your chip (arm64 = Apple silicon, x64 = Intel), unzip and drag **Goose.app** into Applications

## Configure (make it actually work)
1. First launch walks you through picking an LLM provider (OpenRouter recommended: one key, every model)
2. Paste your API key (create at https://openrouter.ai/keys, starts with `sk-or-v1-`)
3. **The key stays on this machine** (`~/.config/goose/config.yaml`) — neither AiBOX nor Goose uploads it

## Verify success
Ask Goose to do something small ("create a hello-world project and run it"). If it executes commands, touches files and reports back, you're done.

## Troubleshooting
- **Model connection fails**: check the key is complete and your account has balance
- **Slow access from CN**: OpenRouter works, or use an official Anthropic/OpenAI key
- **More capabilities**: Goose Extensions (MCP tools) can be toggled in Settings

## Uninstall
Windows: Start menu → Goose → Uninstall. macOS: delete Goose.app from Applications.
Provider keys, conversation history and extension config live in the data folders (`%APPDATA%\Goose`, `~/.config/goose`) — **deleting loses them; back up first**. AiBOX → Manage → Uninstall backs up automatically.
