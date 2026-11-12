# Hermes Agent install & setup guide

One line: **Hermes Agent (Nous Research, 262k+ stars) is an open-source personal agent** you chat with right in your terminal — and it can take over Telegram / Discord / Slack / WhatsApp and other channels. One command installs everything into your user directory, no administrator rights required.

## What you get

- A terminal TUI chat plus a messaging gateway (start with a single `hermes`)
- Full agent toolbox: skills, subagents, scheduled tasks, session compaction, workspace isolation
- A bundled toolchain (Python 3.14, Node, npm, pnpm, ripgrep, FFmpeg) — your system stays untouched

## Before you start (2 minutes)

- **Windows**: native PowerShell on Windows 10/11 — **no WSL needed**; installs to `%LOCALAPPDATA%\hermes`
- **macOS**: a single curl command; installs to `~/.hermes`
- One model key (OpenAI / Anthropic / OpenRouter…), or just use a **Nous Portal** subscription (one subscription covers models + web search + image gen + speech)
- Not needed: administrator rights, Docker, pre-installed Python/Node (the installer brings its own)

> ⚠️ **Antivirus note** (official): Windows Defender / Bitdefender may quarantine `hermes\bin\uv.exe` — it is Astral's `uv` Python package manager, a well-known false positive. Follow the vendor guidance and whitelist the **bin folder** (whitelist the folder, not the file hash — Hermes updates uv between versions).

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Hermes Agent** → **Install**
2. AiBOX downloads the official installer script with hash verification (`install.ps1` / `install.sh`) and executes it exactly the way the official one-liners do: `Invoke-Expression` on Windows, piped to `bash` on macOS
3. When it finishes, reopen your terminal and type `hermes`

### Route B: manual install (official commands)

Windows (PowerShell):

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

macOS / Linux / WSL2:

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

Then `source ~/.bashrc` (or `~/.zshrc`) and you are set.

## Configuration (pick a model, connect a key)

The setup wizard is the fastest path:

```bash
hermes setup            # configure everything at once: model, tools, channels
hermes setup --portal   # or use Nous Portal: one OAuth login covers models + tool gateway
```

- Manual way: `hermes model` to choose provider and model (OpenRouter / OpenAI / Anthropic / Nous…), `hermes tools` to toggle tools
- Settings persist to `~/.hermes/config.yaml` (`%LOCALAPPDATA%\hermes\config.yaml` on Windows) — keys never leave your machine
- Migrating from another agent: `hermes setup` auto-detects `~/.openclaw`, `~/.claude`, etc. and offers a previewed import

## Verification: what "success" looks like

1. `hermes --version` prints a version (e.g. `0.23.1`)
2. Run `hermes` in the terminal and ask anything — a **normal reply** means the model is wired
3. For messenger channels: `hermes gateway setup` → `hermes gateway start`, then message your Telegram bot and get a reply
4. `hermes doctor` reports no problems = healthy environment

## FAQ

- **`hermes` command not found after install**: open a new terminal (the installer updated PATH); on PowerShell also check that `$env:LOCALAPPDATA\hermes\bin` is on PATH
- **uv.exe quarantined by antivirus**: false positive — whitelist the `bin` folder as described above
- **Upgrading**: just run `hermes update` (official self-updater)
- **Switching models**: anytime with `hermes model` — no lock-in

## Uninstall

```bash
hermes uninstall        # official uninstall command
# If anything remains, delete manually:
#   macOS/Linux: rm -rf ~/.hermes
#   Windows:     remove %LOCALAPPDATA%\hermes
```

⚠️ Uninstalling removes the keys in `config.yaml`, your chat sessions and installed skills — **back up `~/.hermes` first**.

More: [official docs](https://hermes-agent.nousresearch.com/docs/) · [quickstart](https://hermes-agent.nousresearch.com/docs/getting-started/quickstart)
