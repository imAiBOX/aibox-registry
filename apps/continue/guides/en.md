# Continue install & setup guide

One line: **Continue (36k+ stars on GitHub) is an open-source AI coding assistant for VS Code and JetBrains** — it lives in your sidebar, chats about your code, edits files and auto-completes; every bit of configuration is a YAML file on your own machine.

## What you get

- Chat, autocomplete and multi-file editing in the sidebar (`Ctrl/Cmd + L`)
- Local-first configuration: `~/.continue/config.yaml` — committable, works offline with local models
- Free and open source (Apache-2.0); a matching CLI (`@continuedev/cli` on npm) covers terminal use with the same local-config philosophy
- Bring your own model: Anthropic / OpenAI / OpenRouter keys, or free local models through Ollama

## Before you start (2 minutes)

- **Visual Studio Code 1.70 or newer** (hard requirement from the official VSIX `engines` field, measured from the shipped extension; JetBrains is supported too)
- One model source: your own API key, or a local Ollama server (any one of them)
- macOS, if you use the CLI install route: run VS Code's `Shell Command: Install 'code' command in PATH` once
- Not needed: administrator rights, Docker, Node.js (the extension runs inside VS Code's own runtime)
- Heads-up: the upstream repository is read-only and the team shipped a final 2.0.0 release line (official README) — the extension itself keeps working normally

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Continue** → **Install**
2. AiBOX downloads the platform VSIX from Open VSX (sha256-verified) and installs it through VS Code's own `code --install-extension` — the same channel the Marketplace uses, **zero admin rights**
3. The Continue icon appearing in the sidebar means it's installed

### Route B: manual install (official channels)

- **Marketplace**: VS Code → Extensions (`Ctrl/Cmd + Shift + X`) → search **Continue** → Install
  ([direct page](https://marketplace.visualstudio.com/items?itemName=Continue.continue))
- **CLI**: `code --install-extension Continue.continue`
- Open VSX-compatible editors (VSCodium / Windsurf / Cursor): install **Continue** from Open VSX — same flow
- JetBrains: install the plugin from JetBrains Marketplace (the official README now recommends the Continue CLI alongside it)
- **Terminal too**: `npm install -g @continuedev/cli` — the official Continue CLI package on npm

## Configuration

1. Open the Continue sidebar (`Ctrl/Cmd + L`) → click the config selector above the chat input → gear icon → **Local Config**
2. On first use Continue generates `~/.continue/config.yaml` (`%USERPROFILE%\.continue\config.yaml` on Windows) with sensible defaults
3. Pick a model under `models:` in the YAML (Anthropic / OpenAI / Ollama / …) or via the model dropdown; Continue's own best practice is to reference keys through environment variables (e.g. `os.environ/ANTHROPIC_API_KEY`) instead of pasting them into the file
4. Save — Continue reloads the config automatically, no restart needed
5. Add project rules (style, build commands) in a `.continue/config.yaml` inside your repo, or keep everything global — your choice

## Verification: what "works" looks like

1. The Continue panel opens and the model dropdown lists your configured model
2. Open a small project and ask "explain this file" → an answer streams back
3. Ask for an edit → a diff shows up in the editor → you apply it
4. Optional terminal check:

```bash
code --list-extensions --show-versions | rg Continue
# should print something like Continue.continue@x.y.z
```

## FAQ

- **`code` is not recognized**: macOS — run `Shell Command: Install 'code' command in PATH` from VS Code's Command Palette, then reopen the terminal; Windows — reinstall VS Code with "Add to PATH" checked
- **Config not loading**: verify the file path matches your OS and the YAML syntax is valid (Continue highlights errors inline)
- **Where do keys live**: in environment variables — config.yaml then stays committable and secret-free (official best practice)
- **Updates**: the Marketplace updates it, or re-install the newer VSIX through AiBOX (`--force` overwrites)
- **Offline**: with a local Ollama model Continue runs without internet (official guide)
- **VS Code or JetBrains?** Both are supported; if you live in the terminal, the official README suggests the CLI instead of the JetBrains plugin
- **Nothing phones home by default**: the final 2.0.0 line removed anonymous telemetry (official README)

## Uninstall

- Extensions panel → Continue → **Uninstall** (or `code --uninstall-extension Continue.continue`)
- Leftovers: `~/.vscode/extensions/Continue.continue-*` (VSCodium: `~/.vscode-oss/extensions`) — delete only that subdirectory, **never the whole extensions folder**
- ⚠️ Your local config (`~/.continue/config.yaml`) is separate — export it first if you want to keep your rules and model choices

More: [install docs](https://docs.continue.dev/ide-extensions/install) · [config guide](https://docs.continue.dev/guides/understanding-configs) · [Continue docs](https://docs.continue.dev)
