# Codex install guide

## Before you start
- **OS**: Windows 10/11 x64
- **Disk**: ~400MB (single 382MB binary)
- **Permissions**: no admin rights
- **Required**: a ChatGPT account (Plus/Pro/Team) or an OpenAI API key

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **Codex** → Install
2. The single binary downloads (CN gateways auto-fallback), is hash-verified and placed in your user folder
3. Open a terminal (PowerShell or Windows Terminal)

## Manual install
Download `codex-x86_64-pc-windows-msvc.exe` from GitHub Releases, rename to `codex.exe` and keep it anywhere (e.g. `%LOCALAPPDATA%\Programs\Codex\`).

## Configure (make it actually work)
1. Run `codex.exe login` in a terminal and sign in with your ChatGPT account (or configure an API key)
2. **Credentials stay on this machine** (`~/.codex/`) — neither AiBOX nor Codex uploads them

## Verify success
From a project folder run `codex.exe "write a hello world and run it"`. If it edits code, executes commands and reports back, you're done.

## Troubleshooting
- **'codex' is not recognized**: use the full path, or add the folder to PATH
- **Login fails**: check that chatgpt.com / api.openai.com are reachable
- **Slow from CN**: ChatGPT login and the API need a directly reachable network

## Uninstall
Delete `%LOCALAPPDATA%\Programs\Codex` and `~/.codex` (the latter holds your login token — remove it to clear credentials).
