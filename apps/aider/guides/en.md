# Aider install & setup guide

One line: **Aider (50k+ stars on GitHub) is an AI pair programmer that lives in your terminal** — you describe the change, it edits the files in your git repo and commits as it goes; every major cloud model (or a free local one) works.

## What you get

- A conversational `aider >` prompt inside your repo: name files, ask for changes, they land as edits (auto-committed)
- Works with a long list of LLMs — OpenAI, Anthropic, Google, OpenRouter, DeepSeek, Ollama, and more (official "Connecting to LLMs" docs)
- Repo map + lint + test awareness: aider keeps the big picture of your codebase while editing
- Config where you expect it: `~/.aider.conf.yml` (home) or a `.aider.conf.yml` at your repo root

## Before you start (2 minutes)

- **Python 3.10 – 3.12** (hard requirement: PyPI `requires_python >=3.10,<3.13`, measured) — check with `python --version` / `python3 --version`
- A git repo to work in (aider is built around git; it can run outside one, but auto-commit needs git)
- One model source: an API key (OPENAI_API_KEY / ANTHROPIC_API_KEY / …) or a local Ollama server
- Not needed: administrator rights (install is `pip install --user`, fully inside your profile), Docker, Node.js
- Cost: aider itself is free and open source (Apache-2.0, PyPI package `aider-chat`) — you only pay your model provider (or nothing, with Ollama)

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **Aider** → **Install**
2. AiBOX downloads the official `aider-chat` wheel from PyPI (sha256-verified; CN traffic auto-uses the TUNA mirror) and runs `pip install --user` — **zero admin rights**
3. Verification command below printing your version means it's installed

### Route B: manual install (official channels)

- **pip**: `python -m pip install aider-chat` (macOS: `python3 -m pip ...`)
- **Official streamlined installer** (README): `python -m pip install aider-install` then `aider-install` — sets up an isolated environment with its own Python/uv, zero config
- CN slow network: prefix either command with `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`

## Configuration

1. Open a terminal **inside your git repo** and run `aider` — the `aider >` prompt appears
2. Keys: export them in your shell, e.g. `export OPENAI_API_KEY=...` / `export ANTHROPIC_API_KEY=...` (aider reads standard env vars — official docs); or use `--model ollama/...` for free local models
3. Defaults: put options in `~/.aider.conf.yml` (searched in git root, cwd or home — official config docs), for example:

```yaml
model: anthropic/claude-sonnet-4-5
auto-commits: true
dark-theme: true
```

4. History/logs live **inside the project**: `.aider.input.history`, `.aider.chat.history.md` — back them up with the repo, not with the app

## Verification: what "works" looks like

1. `aider --version` prints `aider 0.86.x`
2. Inside a repo, `aider factorial.py` loads the file and shows the model summary
3. Ask "add a docstring" → the file changes on disk and gets committed (auto-commit)
4. `/help` inside the prompt lists the in-chat commands
5. No API key at hand? `aider --model ollama/<name>` runs the whole loop against a free local model

## FAQ

- **`aider: command not found`**: the `--user` scripts directory may not be on PATH — run `python -m pip show aider-chat` to confirm the install, then either add the user Scripts dir to PATH or launch with `python -m aider`
- **`python` opens the Microsoft Store (Windows)**: install Python 3.10–3.12 from python.org (per-user, no admin) and tick "Add to PATH"
- **Version errors / unsupported Python**: aider needs 3.10–3.12; create a venv with one of those and pip-install inside it
- **CN dependency downloads are slow**: `PIP_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple`
- **Model warnings**: aider tells you when a model is untested or weak for edit formats — switch with `--model` or in the config file
- **Auto-commit worries**: aider commits each change with a generated message; turn it off with `auto-commits: false` in `~/.aider.conf.yml`
- **Upgrade**: `python -m pip install --upgrade --user aider-chat`

## Uninstall

- `python -m pip uninstall -y aider-chat` (macOS: `python3 -m pip ...`); delete `~/.aider.conf.yml` if you created it
- Project files `.aider.input.history` / `.aider.chat.history.md` stay in your repositories — remove them yourself if unwanted
- ⚠️ If you pasted API keys into `~/.aider.conf.yml`, export them before deleting — back up first

More: [installation](https://aider.chat/docs/install.html) · [usage](https://aider.chat/docs/usage.html) · [config](https://aider.chat/docs/config.html) · [LLM setup](https://aider.chat/docs/llms)
