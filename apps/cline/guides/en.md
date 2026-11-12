# Cline install & setup guide

One line: **Cline (70k+ stars on GitHub) is an open-source coding agent for VS Code** — it edits files, runs commands and browses the web for you, but asks for your approval at every step: more control than one-click generation, less typing than doing it all yourself.

## What you get

- An always-visible AI pair programmer in the sidebar: **Plan** (design first) and **Act** (execute) modes
- Reads your project, edits multiple files, runs terminal commands, watches lint errors — every change arrives as a reviewable diff with a checkpoint you can roll back
- Bring your own model: Cline's cloud models, a ClinePass subscription, or your own Anthropic / OpenAI / OpenRouter / local Ollama key

## Before you start (2 minutes)

- **Visual Studio Code 1.101 or newer** (hard requirement from the official VSIX; install VS Code first if you don't have it — that's the manual-route prerequisite)
- One model source: Cline cloud / ClinePass / your own key (any one of them)
- macOS, if you want the CLI route: run `Shell Command: Install 'code' command in PATH` from VS Code's Command Palette once
- Not needed: administrator rights, Docker, Node.js (the extension runs inside VS Code's bundled runtime)

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Cline** → **Install**
2. AiBOX downloads the official release VSIX (sha256-verified, CN traffic auto-uses the accelerated channel) and installs it through VS Code's own `code --install-extension` — the same channel the Marketplace uses, **zero admin rights**
3. The Cline icon appearing in the sidebar means it's installed

### Route B: manual install (official channels)

- **Marketplace**: VS Code → Extensions (`Ctrl/Cmd + Shift + X`) → search **Cline** → Install
  ([direct page](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev))
- **CLI**: `code --install-extension saoudrizwan.claude-dev`
- VSCodium / Windsurf install from Open VSX — same flow (official docs)
- Also available: a native desktop app ([cline.bot/desktop](https://cline.bot/desktop)) and a terminal CLI (`npm i -g cline`)

## Configuration (pick a model source)

1. Click the Cline icon in the sidebar → **API Configuration**
2. Choose one:
   - **Cline Provider**: official cloud models, pay-as-you-go — sign in and go
   - **ClinePass**: flat monthly subscription
   - **Your own key**: Anthropic / OpenAI / OpenRouter (paste the key), or Ollama for free local models
3. Put project-specific rules in a `.clinerules` file at your repo root (coding standards, build commands) — Cline picks it up automatically

## Verification: what "works" looks like

1. The Cline panel opens and the model list loads in API Configuration
2. Open any small project and type "add unit tests for this function" → a **Plan** appears → you approve → edits start flowing
3. Every change shows as a diff; nothing lands until you Accept; the checkpoint control rolls back instantly
4. Optional terminal check:

```bash
code --list-extensions --show-versions | grep saoudrizwan
# should print something like saoudrizwan.claude-dev@x.y.z
```

## FAQ

- **`code` is not recognized**: macOS — run the `Shell Command: Install 'code' command in PATH` command from
  VS Code's Command Palette, then reopen your terminal; Windows — reinstall VS Code with "Add to PATH" checked
- **Where do my keys live**: inside VS Code's credential store (SecretStorage, OS-level encryption) — never in a plaintext config file
- **Errors / quota**: check the usage and error toasts inside the Cline panel; switching model or key usually fixes it
- **Updates**: click Update in the Extensions panel, or reinstall the newer VSIX through AiBOX (`--force` overwrites)
- **Keep it on a leash**: stay in Plan mode, or tighten the Auto-approve checkboxes while in Act mode

## Uninstall

- Extensions panel → Cline → **Uninstall** (or `code --uninstall-extension saoudrizwan.claude-dev`)
- Leftovers: `~/.vscode/extensions/saoudrizwan.claude-dev-*` (VSCodium: `~/.vscode-oss/extensions`) —
  delete only that subdirectory, **never the whole extensions folder**
- ⚠️ Task history, checkpoints and extension settings go with it, and stored keys are released — back up first if you need them

More: [installing docs](https://docs.cline.bot/getting-started/installing-cline) · [Cline docs](https://docs.cline.bot) · [cline rules](https://docs.cline.bot/customization/cline-rules)
