# CowAgent install & setup guide

One line: **CowAgent (formerly chatgpt-on-wechat, 47k+ stars) is a popular open-source personal AI assistant** from the Chinese dev community: install the desktop client and you are running — a single web console for chatting, connecting channels (WeChat, Feishu, Telegram…), and installing skills, with whatever model you like.

## What you get

- A ready-to-run desktop client (runtime bundled — double-click, no Python required)
- One web console (`http://localhost:9899`) for chat, model setup, channels and skills
- Multi-channel service in parallel + Skill Hub marketplace + scheduled tasks / memory / knowledge base

## Before you start (2 minutes)

- **Windows 10/11 x64** or **macOS (Intel and Apple Silicon installers both published)**
- One model key (DeepSeek, Claude, OpenAI, Gemini, Qwen, GLM, Kimi…) — or the CowAgent aggregated key service
- Not needed: administrator rights (installs into your user profile), Docker, Python

> Advanced users who want the headless service mode (parked on a server, serving channels like WeChat) can use the manual route below — that one needs Python 3.7+.

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **CowAgent** → **Install**
2. AiBOX downloads the official installers (sha256-verified, accelerated automatically in CN): silent NSIS install to `%LOCALAPPDATA%\Programs\CowAgent` on Windows, dmg mount + copy on macOS — **no admin rights at any point**
3. Launch **CowAgent** from the Start menu / Launchpad

### Route B: manual install (official channels)

- **Desktop client**: download the installer for your OS from [cowagent.ai/download](https://cowagent.ai/download/) and run it
- **One-line service install** (Linux / macOS, lands in a `CowAgent` folder in your current directory):

```bash
bash <(curl -fsSL https://cdn.link-ai.tech/code/cow/run.sh)
```

Windows PowerShell service install:

```powershell
irm https://cdn.link-ai.tech/code/cow/run.ps1 | iex
```

Then open **http://localhost:9899** in your browser (service mode).

## Configuration (connect a model + channels)

1. Open the console → **Model settings**: pick a provider from the table (DeepSeek / Claude / OpenAI / Gemini / Qwen…) and save your key — **everything happens in the UI, no config file editing**
2. Prefer a single key for everything? Choose the CowAgent aggregated model service
3. Free local route: install [Ollama](https://ollama.com), then point the **Custom** entry at your local endpoint
4. **Channels**: follow the in-console wizard for Telegram / Discord / WeChat customer service; **skills**: install one from Skill Hub in a click

## Verification: what "success" looks like

1. The client opens normally and the console at `http://localhost:9899` is reachable
2. Send "hello" in the chat box → a **normal reply** means the model is connected
3. Service route: `cow status` shows running; `cow logs` has no errors
4. Stronger check: install a Skill Hub skill and see it listed by `/skill list` in the conversation

## FAQ

- **Windows says the publisher is unknown**: the official installer is signed; if blocked, use "More info → Run anyway", or install via the AiBOX route
- **Port 9899 already in use**: stop the old instance with `cow stop`, or change the port in the config
- **Domestic channels (WeChat etc.) won't connect**: usually network or an expired QR code — re-run the channel wizard in the console
- **Upgrading**: desktop → download and overwrite-install the new version; service → `cow update`
- **Formerly chatgpt-on-wechat**: the repo is now CowAgent; old links redirect automatically (`git remote set-url` updates your clone)

## Uninstall

- **Desktop client**: Windows Settings → Apps → CowAgent → Uninstall; macOS: move CowAgent.app to the Trash
- **Service**: `cow stop`, then delete the `CowAgent` folder
- ⚠️ Chat history, model keys and installed skills live in the app data folder (`%APPDATA%\CowAgent` / `~/Library/Application Support/CowAgent`); the uninstaller does **not** delete them — **back up first** if you clean them manually

More: [quick start](https://docs.cowagent.ai/guide/quick-start) · [CLI reference](https://docs.cowagent.ai/cli/index) · [Skill Hub](https://skills.cowagent.ai/)
