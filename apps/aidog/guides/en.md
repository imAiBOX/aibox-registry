# AiDog install & setup guide

One line: **AiDog (aidog.im) is a personal AI companion that runs entirely on your own machine** — it talks to you over Telegram, Feishu, DingTalk and other channels, ships with a skill system, natural-language cron jobs and a self-evolving memory; your credentials never leave your computer and there is no cloud account.

## What you get

- A resident local assistant: loopback web console (127.0.0.1:19167) plus messenger channels
- Skills with a deterministic router, subagents, natural-language scheduling (`/cron`), memory evolution (`/learn`, `/reflect`)
- Completely free, no telemetry (optional anonymous usage counting is off by default) — you only bring a model endpoint

## Before you start (5 minutes)

| Need | Notes |
|---|---|
| **Windows** | Requires **WSL2** (e.g. Ubuntu). The AiDog runtime officially lives inside WSL; the native Windows shell is attach-only |
| **macOS** | Upstream marks it "expected-but-untested" — installable as an experiment, issues are possible (experimental support) |
| Python 3.10+ | Usually preinstalled in WSL/Ubuntu: check with `python3 --version` |
| tmux | **Needs administrator rights**: run `sudo apt-get install tmux` inside WSL yourself — AiBOX never escalates privileges for you |
| Model endpoint | Any OpenAI-compatible endpoint (there is also a zero-config local gateway for trying out) |
| Telegram etc. | Optional: a bot token if you want messenger channels |

> ⚠️ **Windows trap**: the repository must be cloned onto WSL's own filesystem (e.g. `~/aidog`), **never** onto a mounted `C:\` drive — 9p/CIFS mounts reject `chmod` and break tmux; copying a Windows-side clone in also breaks the `.sh` scripts with CRLF line endings.

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **AiDog** → **Install**
2. AiBOX downloads the hash-verified official source archive (accelerated automatically in CN), unpacks it to `~/aidog` inside WSL and runs the official one-command installer `deploy/install.sh` (provision + boot + verify; safe to re-run)
3. When the installer reports, continue with configuration below

### Route B: manual install (official commands)

WSL / Linux (same on macOS):

```bash
# Install tmux first (requires admin, do it manually)
sudo apt-get install tmux          # Ubuntu/WSL; on macOS use brew install tmux

git clone https://github.com/AiDog-im/AiDog.git aidog && cd aidog
bash deploy/install.sh             # one command: provision + boot + verify
aidog setup                        # guided wizard: fills only the missing slots
```

## Configuration (make it talk)

`aidog setup` only prompts for slots that are still empty (hidden input, values are never echoed):

1. `WEB_TOKEN`: a console write token — any long random string you invent
2. Model endpoint: in the console **Settings** or the wizard, set an OpenAI-compatible `base_url` + model (default is the local gateway `http://127.0.0.1:3460/v1`, model `mimo-v2.6-flash`; fill `MODEL_API_KEY` only if your provider needs a key)
3. Telegram (optional): a token from @BotFather + your numeric user id (allowlist — strangers are rejected)

## Verification: what "success" looks like

1. `aidog setup --check` exits **0** (fully ready) or **2** (only credentials pending) — never 1
2. Open **http://127.0.0.1:19167**, send a message in the chat card — a **streamed reply** means the model chain is live
3. Message your bot `/help` from an allowlisted Telegram account and get a reply
4. `python3 ~/aidog/deploy/aidog_doctor.py`: zero FAILs

## FAQ

- **`tmux not found`**: install tmux manually (admin required, see above), then re-run `bash deploy/install.sh`
- **`port 19167 is used`**: boot on another port: `AIDOG_WEB_PORT=19200 bash deploy/boot_services.sh start`
- **Stays PENDING / model endpoint unreachable**: the brain isn't reachable yet. Make sure `mycore.base_url` in `web/settings.json` responds; exit code 2 with nothing configured is an honest "not configured yet", not a crash
- **Telegram messages not arriving**: often blocked egress — the runtime routes bot traffic through a local proxy (`HTTPS_PROXY`); set it in the shell that starts the tmux sessions
- **`aidog update apply` refuses with a dirty tree**: by design — commit local changes before upgrading

## Uninstall

```bash
bash ~/aidog/deploy/boot_services.sh stop   # stop the runtime first
rm -rf ~/aidog                              # machine-local state lives beside the code — back up secrets.env and data/ first
rm -f ~/.local/bin/aidog                    # remove the CLI wrapper
```

More: [official installation docs](https://github.com/AiDog-im/AiDog/blob/main/docs/installation.md) · [aidog.im](https://aidog.im)
