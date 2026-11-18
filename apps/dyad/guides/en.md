# Dyad install guide

## Before you start
- **OS**: Windows 10/11 x64, or macOS 12+ (separate builds for Apple silicon / Intel)
- **Disk**: ~1GB (setup 170MB / mac zip 125-134MB)
- **Permissions**: no admin rights — installs into your user folder
- **Required**: a model API key (OpenAI / Anthropic) — or a local Ollama model

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **Dyad** → Install
2. The installer downloads (CN gateways auto-fallback) with hash verification
3. Launch Dyad from the Start menu / Applications

## Manual install
- **Windows**: download `dyad-1.23.0.Setup.exe` from GitHub Releases and run it (per-user, no UAC; use the `/S` switch for silent deploys)
- **macOS**: download the zip for your chip (arm64 = Apple silicon, x64 = Intel), unzip it and move **dyad.app** into Applications

## Configure (make it actually work)
1. On first launch pick a model provider — OpenAI and Anthropic are built in, plus any local Ollama model
2. Paste your API key (create one at https://platform.openai.com/api-keys or https://console.anthropic.com/settings/keys)
3. **The key stays on this machine** (your user data folder) — neither AiBOX nor Dyad uploads it
4. Dyad may ask to sign in with a GitHub account for repository features — that step is optional

## Build your first app
1. Describe the app you want in plain language ("a to-do list that saves to a local file")
2. Dyad writes the code, shows you a live preview, and you can refine it by talking
3. Your app's source lands in `dyad-apps` — a real folder of real files you own and can edit, run or publish anywhere

## Verify success
Ask for a tiny app and check the preview renders. If you can see the code and the preview side by side, everything works.

## Troubleshooting
- **Model connection fails**: check the key is complete and your account has balance
- **Slow access from CN**: use a domestic model endpoint or a local Ollama model
- **App does not run**: the generated project needs Node.js 18+ installed locally
- **Want to keep the code**: everything is under `dyad-apps` — copy it out any time

## Uninstall
Windows: Start menu → Dyad → Uninstall. macOS: delete dyad.app from Applications.
Provider keys, chat history and every app Dyad generated for you live in the data folders (`%APPDATA%\dyad`, `~/Library/Application Support/dyad`, `~/dyad-apps`) — **deleting loses them; back up first**. AiBOX → Manage → Uninstall backs up automatically.
