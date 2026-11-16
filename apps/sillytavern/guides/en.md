# SillyTavern install & setup guide

One line: **SillyTavern is a roleplay-focused AI chat frontend that runs on your own computer** — you use it in a browser, connect practically any LLM (cloud API or a local model), and every character card, preset and chat stays on your machine.

## What you get

- A local web chatroom at `127.0.0.1:8000`: character cards, group chats, lorebooks, memory tools
- Model freedom: OpenAI, Claude, Google, OpenRouter, DeepSeek, free crowd-sourced AI Horde, KoboldCpp, Ollama, and more
- An extension ecosystem — translation, image gen, voice, TTS, expressions, retrieval — installable from a panel

## Before you start (5 minutes)

| Need | Notes |
|---|---|
| **Windows 10/11 or macOS 12+** | Linux works too; **no admin rights**, everything lives in your home folder |
| **Node.js 18+** | LTS from [nodejs.org](https://nodejs.org); check with `node --version` |
| **Git** | Required for extensions and updates ([git-scm.com](https://git-scm.com/download/win) on Windows) |
| A model source | A cloud API key, or local Ollama / KoboldCpp. **Zero-cost trial**: AI Horde with key `0000000000` |

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **SillyTavern** → **Install**
2. AiBOX clones the official source into `~/SillyTavern` (hash-verified, CN traffic auto-routes through a proxy channel) and runs `start.sh` to fetch dependencies
3. When it finishes, open `http://127.0.0.1:8000` in your browser

### Route B: manual install (official commands)

```bash
git clone --depth 1 -b 1.19.0 https://github.com/SillyTavern/SillyTavern.git ~/SillyTavern
cd ~/SillyTavern && ./start.sh        # Windows: double-click Start.bat, or run in Git Bash
```

`start.sh` always runs `npm install` (idempotent) before starting the server — **download cut off halfway? Just rerun the same command** and it picks up where it left off.

### Versions & updating (release vs staging)

- Upstream keeps two branches: **`release` (recommended, cut roughly monthly, stable)** and `staging` (multiple daily updates, can break any moment — enthusiasts only)
- AiBOX pins a `release` tag (e.g. 1.19.0). To **upgrade**: run `git fetch && git checkout 1.x.y` (or `git pull`) inside `~/SillyTavern`, then `./start.sh` — dependencies refresh automatically
- Want the newest features: `git checkout staging && ./start.sh`; roll back the same way with `git checkout release`

## Configuration & verification

### Connect a model (which API type to pick)

Top bar → **API Connections** → pick the **type** in the first dropdown, then the **source**:

| Type | Use it when | Typical sources |
|---|---|---|
| **Chat Completion** | Cloud conversational APIs (easiest) | OpenAI, Claude, Google, OpenRouter, DeepSeek |
| **Text Completion** | Local / continuation-style models — needs an Instruct template | Ollama, KoboldCpp, TabbyAPI, llama.cpp |
| **AI Horde** | Completely free volunteer compute, variable wait times | key `0000000000` works out of the box |
| Others | Niche needs | NovelAI, Mancer, Pollinations, … |

- Click **Connect** — the status must read **Valid** before you chat
- For Text Completion, set the model's **Instruct template** on the **Advanced Formatting** page (usually stated on the model's download page)
- Settings live in `~/SillyTavern/data/default-user/` — copy that folder to migrate

### Importing character cards

1. Top bar → **Character Management → Import**: drop a PNG character card, paste a card URL, or pick from the built-in list
2. Web-hosted imports must point at a domain listed in `config.yaml` under `whitelistImportDomains` (a guard against pulling arbitrary remote content)
3. Select the character, send a message — an in-persona reply means the import worked

### Presets & sampling, briefly

- **User Settings → AI Response Formation**: the preset dropdown (Classic, Alpaca, …) decides how the prompt is assembled; beginners should stay on the default
- **Temperature, Top P, repetition penalty** are the three knobs worth touching: reply too stiff → raise temperature (0.9–1.1); rambling nonsense → lower it (0.6–0.8)
- After switching models, load a preset recommended for that model and double-check the Instruct template under Advanced Formatting

### What "success" looks like

1. `http://127.0.0.1:8000` opens (trust the URL printed in the terminal)
2. API Connections shows **Valid**
3. Pick any built-in character, send one line, get an in-persona reply within seconds

## FAQ

- **`npm could not be found`**: install Node.js 18+ and **open a fresh terminal** before rerunning `./start.sh`
- **Port already in use**: `./start.sh --port 8001` (arguments are passed straight through to the server; `--listen` exposes it on your LAN, `--browserLaunchEnabled false` skips auto-opening the browser)
- **Install failed halfway**: rerun `./start.sh` to resume — finished `node_modules` work is not redone
- **Extensions won't install**: git is **required**; use Extensions → Download Extensions & Assets → Load Asset List → Download
- **API won't connect**: verify the key and account credit; for local models make sure the server is running (`ollama serve`) and the port matches
- **Access from phone / LAN**: start with `--listen` **and** configure a whitelist (`./start.sh --listen --whitelist`) — never expose it to the open internet unprotected

## Uninstall

```bash
rm -rf ~/SillyTavern                                  # program + character cards + chats live here — back up data/ first
rm -rf ~/AppData/Roaming/SillyTavern                  # Windows global-mode leftovers
rm -rf ~/Library/Application\ Support/SillyTavern     # macOS global-mode leftovers
```

AiBOX's **Manage → Uninstall** does this for you. Export your characters and chats before deleting.

More: [official docs](https://docs.sillytavern.app/) · [quick start](https://docs.sillytavern.app/usage/quick-start/) · [GitHub](https://github.com/SillyTavern/SillyTavern)
