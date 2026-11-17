# OpenCode install guide

## Before you start
- **OS**: Windows 10/11 (x64/ARM64) or macOS 12+ (Apple silicon / Intel)
- **Disk**: ~400MB (installers 119-156MB)
- **Permissions**: no admin rights — installs into your user folder
- **Required**: a model API key (OpenRouter / Anthropic / local Ollama)

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **OpenCode** → Install
2. The installer downloads (CN gateways auto-fallback), is hash-verified and installed silently
3. Launch OpenCode from the Start menu / Applications

## Manual install
- **Windows**: download the `opencode-desktop-win-*.exe` for your arch from GitHub Releases and run it (per-user, no UAC)
- **macOS**: download the dmg for your chip, open it and drag **OpenCode.app** into Applications

## Configure (make it actually work)
1. Open OpenCode → Settings → pick a provider (OpenRouter recommended: one key, every model)
2. Paste your API key (create at https://openrouter.ai/keys, starts with `sk-or-v1-`)
3. **The key stays on this machine** (`~/.config/opencode/`) — neither AiBOX nor OpenCode uploads it

## Verify success
Open a project in OpenCode and ask it to "write a hello world and run it". If it edits files, executes commands and reports back, you're done.

## Troubleshooting
- **Model connection fails**: check the key is complete and your account has balance
- **Slow access from CN**: OpenRouter works, or go local with Ollama (free)
- **Prefer the terminal**: the desktop build ships the terminal TUI too — see Settings for CLI usage

## Uninstall
Windows: Settings → Apps → Uninstall. macOS: delete OpenCode.app from Applications.
Provider keys, session history and config live in `~/.config/opencode/` and `~/.local/share/opencode` — **deleting loses them; back up first**. AiBOX → Manage → Uninstall backs up automatically.
