# Roo Code install guide

## Before you start
- **OS**: Windows 10/11 or macOS 12+
- **Prerequisite**: Visual Studio Code installed (free: https://code.visualstudio.com)
- **Permissions**: no admin rights needed at any point

## Install with AiBOX (recommended)
1. Open AiBOX → catalog → **Roo Code** → Install
2. AiBOX downloads the extension (auto channel fallback inside China) and verifies its hash
3. Open VSCode — the Roo Code icon appears in the sidebar

## Manual install
```bash
code --install-extension rooveterinaryinc.roo-cline
```
or search "Roo Code" in the VSCode extensions panel.

## Configure & verify
1. Click the Roo Code icon in the VSCode sidebar
2. Pick a provider (OpenRouter / Anthropic / OpenAI …) and paste your API key
3. Send one message — a real model reply means it works

## Troubleshooting
- **Icon missing**: make sure the same user account installed VSCode; restart it
- **Where is the key**: inside Roo Code settings; it stays on your machine

## Uninstall
VSCode extensions panel → Roo Code → Uninstall; or AiBOX → Manage → Uninstall.
