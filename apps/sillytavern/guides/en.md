# SillyTavern install guide

## Before you start
- **OS**: Windows 10/11 or macOS 12+
- **Prerequisite**: Git + Node.js 18+ (free, user-level installs)
- **Permissions**: no admin rights; everything lands in your user folder

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **SillyTavern** → Install
2. AiBOX clones the source into `~/SillyTavern` (hash-verified) and installs deps on first start
3. Open the local URL in your browser

## Manual install
```bash
git clone --depth 1 -b 1.19.0 https://github.com/SillyTavern/SillyTavern.git ~/SillyTavern
cd ~/SillyTavern && ./start.sh
```
On Windows run the same inside Git Bash.

## Configure & verify
1. Open `http://127.0.0.1:8000` (default) from the terminal output
2. Top-right: pick a backend (OpenAI-compatible API / Claude / Kobold…) and paste the key
3. Send one roleplay message — a real reply means it works

## Troubleshooting
- **start.sh says Node missing**: install Node.js 18+, open a new terminal
- **Port in use**: `./start.sh --port 8001`

## Uninstall
Delete `~/SillyTavern` and `%APPDATA%/SillyTavern` (or `~/Library/Application Support/SillyTavern`); AiBOX → Manage → Uninstall does it for you.
