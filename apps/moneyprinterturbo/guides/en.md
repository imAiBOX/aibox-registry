# MoneyPrinterTurbo install guide

## Before you start
- **OS**: Windows 10/11 x64 only (no macOS build yet)
- **Disk**: ~2GB (portable bundle ships its own runtime)
- **Permissions**: no admin rights; extracts into your user folder

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **MoneyPrinterTurbo** → Install
2. Downloads the 555MB portable archive (CN gateways auto-fallback), verifies the hash, extracts it
3. Launch from AiBOX or the extracted folder

## Manual install
1. Grab `MoneyPrinterTurbo-Portable-Windows-1.3.10.7z` from GitHub Releases
2. Extract with 7-Zip into `%LOCALAPPDATA%\MoneyPrinterTurbo`
3. Run `MoneyPrinterTurbo.exe`

## Configure & verify
1. First launch → Settings: add your LLM API key (script/subtitles) and TTS options
2. Enter a topic and hit generate — a draft video means it works

## Troubleshooting
- **Extraction fails**: install 7-Zip or retry from Explorer (no admin needed)
- **Slow generation**: bounded by your API speed, not this machine

## Uninstall
Delete the whole `%LOCALAPPDATA%\MoneyPrinterTurbo` folder (drafts live there — back up first); AiBOX → Manage → Uninstall.
