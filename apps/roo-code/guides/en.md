# Roo Code install & setup guide

One line: **Roo Code is an AI coding assistant that lives inside VS Code** (Apache 2.0, a fork that grew out of Cline), with dedicated Code / Architect / Ask / Debug modes and model freedom — OpenRouter, Anthropic, OpenAI, Google, or a local Ollama. Your API key stays on your machine.

> ⚠️ **Heads-up**: the Roo Code README and docs homepage announce that **the Roo Code extension was shut down on May 15th, 2026** and receives no further updates (the last release is 3.54.0). The extension still installs and runs locally against your own API key; if you want an actively maintained alternative, the project points to [Cline](https://cline.bot/) (where Roo came from) and the community fork [ZooCode](https://github.com/Zoo-Code-Org/Zoo-Code/).

## What you get

- An AI pair programmer in the Activity Bar: generate and refactor code, explain a codebase, run terminal commands, call MCP servers
- Five ways to work: **Code** (day-to-day edits), **Architect** (plans and specs), **Ask** (answers only), **Debug** (trace root causes), plus custom modes
- Model-agnostic: swap providers any time without changing tools; keys are stored locally by VS Code

## Before you start (3 minutes)

| Need | Notes |
|---|---|
| **VS Code 1.84.0 or newer** | Free from [code.visualstudio.com](https://code.visualstudio.com); VSCodium / Windsurf users install via Open VSX |
| A model source | A cloud API key (OpenRouter / Anthropic / OpenAI / Google…) or local Ollama (free, offline) |
| Disk & network | The extension is ~30MB; models are called over the network afterwards |
| Permissions | **Zero admin rights** — everything installs into your user profile |

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Roo Code** → **Install**
2. AiBOX downloads the extension package (CN-reachable channel, automatic failover) and verifies its hash
3. When it finishes, launch VS Code — the Roo Code icon is waiting in the Activity Bar

### Route B: manual install (official commands)

Option 1 — the Extensions view (simplest):

1. Press `Ctrl+Shift+X` (`Cmd+Shift+X` on macOS)
2. Search **Roo Code**, pick the one published by **RooVeterinaryInc**, click **Install**
3. Reload VS Code if prompted; the Roo Code icon appears in the Activity Bar

Option 2 — CLI or a manual VSIX (when the Marketplace is unreachable):

```bash
code --install-extension rooveterinaryinc.roo-cline
```

Or grab the `.vsix` from [Open VSX](https://open-vsx.org/extension/RooVeterinaryInc/roo-cline) and use **Extensions view → "…" → Install from VSIX…**

## Configuration & verification

### Connect your first model (~1 minute)

1. Click the Roo Code icon; the welcome screen asks you to **choose a model provider**
2. Paste your API key, continue, then **pick a model** (e.g. `claude-sonnet-4-5` or `anthropic/claude-sonnet-4`) and finish
3. Settings live in your VS Code user file (`~/AppData/Roaming/Code/User/settings.json`) — nothing is uploaded anywhere

### Add or switch providers

- The **provider dropdown** in the same screen supports 20+ options: OpenRouter, Anthropic, OpenAI, Google, DeepSeek, OpenAI-compatible endpoints, Ollama, LM Studio, and more
- Switching the provider **changes the model list** — re-select the model afterwards; forgetting this is the #1 "why doesn't my switch work" cause
- Free local route: run `ollama serve && ollama pull qwen2.5:7b`, choose the Ollama provider at `http://127.0.0.1:11434`, no key needed

### Model selection advice

| Situation | Pick | Why |
|---|---|---|
| Just want it to work | Claude Sonnet 4.5 (the official recommendation) | Most reliable tool-calling, works out of the box |
| One key, many models | OpenRouter: `anthropic/claude-sonnet-4` or `google/gemini-2.5-flash` | 100+ models pay-as-you-go; Flash is cheap and fast |
| Hard problems | GPT-5 or Claude Sonnet 4.5 | Stronger multi-step reasoning, higher price |
| Free & offline | Ollama: `qwen2.5:7b`, `llama3.2:3b` | Runs in 8GB RAM, less capable but costs nothing |

### What "success" looks like

1. Send "explain this project" in the panel → a **streaming reply within seconds** means the model link works
2. Ask for a small file edit → an **approval prompt** appears, and the file really changes after you approve
3. Switch modes (Code → Ask) → the answers clearly change style

## FAQ

- **Key rejected / 401 / invalid API key**: check you pasted the whole key, that it belongs to the **currently selected provider** (an OpenRouter key in Anthropic will never work), and that the account has credit. Local providers such as Ollama take no key
- **No Roo Code icon**: restart VS Code → confirm the extension is enabled in the Extensions view → open `View → Output` and select **Roo Code** for errors. VS Code must be ≥ 1.84.0; if the Marketplace is blocked, use Open VSX or the VSIX route
- **Switched provider but nothing changed**: you must **re-select the model** after changing the provider; check the Output panel for the actual error
- **How does it relate to Cline?**: Roo Code forked from Cline and leans into multi-mode teamwork; both speak the same providers and keys, and the Roo docs name Cline as the place to go now
- **Still updated?**: No — the project shut the extension down on May 15, 2026. Local use keeps working; for long-term maintenance consider Cline / ZooCode
- **Can I use it offline?**: Yes, if you point it at a local model (Ollama or LM Studio)

## Uninstall

```bash
code --uninstall-extension rooveterinaryinc.roo-cline
```

Or uninstall from the Extensions view. Back up `~/AppData/Roaming/Code/User/settings.json` first — that's where your provider configuration lives.

More: [official docs](https://roocodeinc.github.io/Roo-Code/) · [Marketplace](https://marketplace.visualstudio.com/items?itemName=RooVeterinaryInc.roo-cline) · [GitHub](https://github.com/RooCodeInc/Roo-Code#readme)
