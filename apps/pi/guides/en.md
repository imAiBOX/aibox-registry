# Pi install guide

## Before you start
- **OS**: Windows 10/11 (x64/ARM64) or macOS 12+ (Apple silicon / Intel)
- **Disk**: ~200MB (bundles 48-62MB)
- **Permissions**: no admin rights — installs into your user folder
- **Required**: a model API key (OpenRouter / Anthropic / local Ollama)
- **No Node needed**: platform bundles are self-contained

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **Pi** → Install
2. The bundle downloads (CN gateways auto-fallback), is hash-verified and extracted
3. Open a terminal (PowerShell / Terminal)

## Manual install
- **Windows**: download `pi-windows-x64.zip` from GitHub Releases, unzip and keep `pi.exe` anywhere
- **macOS**: download the `pi-darwin-*.tar.gz` for your chip; the executable is `pi/pi`

## Configure (make it actually work)
1. `cd` into a project folder and run `pi`
2. On first run, pick a model (OpenRouter recommended: one key for everything; `/model` switches anytime)
3. **The key stays on this machine** (`~/.pi/`) — neither AiBOX nor Pi uploads it

## Verify success
Run `pi` in a project folder and ask it to "write a hello world and run it". If it edits files, executes commands and reports back, you're done.

## Troubleshooting
- **'pi' is not recognized**: use the full path (Windows: `%LOCALAPPDATA%\Programs\Pi\pi.exe`)
- **Model connection fails**: check the key is complete and your account has balance
- **Upgrade**: run `pi update` (or reinstall the new version from AiBOX)

## Uninstall
Windows: delete `%LOCALAPPDATA%\Programs\Pi`. macOS: delete `/Applications/Pi`.
Sessions and model config live in `~/.pi/` — **deleting loses them; back up first**. AiBOX → Manage → Uninstall backs up automatically.
