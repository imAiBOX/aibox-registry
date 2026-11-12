# GPT4All install & setup guide

One line: **GPT4All (nomic-ai, 3.10.0) is a fully offline desktop chat app for open models** —
no API calls, no GPU required: download a model in the app and chat; turn local folders into a
private, cited knowledge base (LocalDocs).

## What you get

- 100% local chat: models run on your machine (llama.cpp backend), nothing leaves your computer
- In-app model library from HuggingFace (GGUF, 3–13B sweet spot for consumer hardware)
- LocalDocs: index a folder, ask questions, get answers with a **Sources** list (on-device Nomic embeddings)
- Optional OpenAI-compatible local API on `http://localhost:4891/v1` for other apps
- Optional: connect a cloud provider key from the Models page (does not download a model)

## Before you start (3 minutes)

| Need | Notes |
|---|---|
| **Windows x64** | Intel Core i3 2nd Gen / AMD Bulldozer or better (official requirement) |
| **Windows ARM** | Qualcomm Snapdragon / Microsoft SQ1 / SQ2 |
| **macOS** | Monterey 12.6 or newer (best on Apple Silicon) |
| RAM / disk | Small models need ~4 GB RAM (Phi-3 Mini 2.18 GB, Mini Orca 1.98 GB); Llama 3 8B q4_0 = 4.66 GB file / 8 GB RAM; keep 5+ GB free disk |
| Linux | Official `.run` installer and community Flathub build exist — AiBOX currently ships Windows/macOS only |

Not needed: a GPU (Vulkan acceleration is optional), administrator rights (per-user install),
Python, Node.js or Docker.

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **GPT4All** → **Install**
2. AiBOX downloads the official installer (sha256-verified, accelerated automatically in CN) and
   runs its Qt Installer Framework silent mode (`--silent`):
   Windows installs per-user into `%USERPROFILE%\gpt4all` (zero elevation), binary at
   `%USERPROFILE%\gpt4all\bin\chat.exe`; macOS installs into `/Applications` (`GPT4All.app`)

### Route B: manual install (official channels)

- **Windows**: download the x64 (or ARM) installer from [gpt4all.io](https://gpt4all.io) or the
  [GitHub Releases](https://github.com/nomic-ai/gpt4all/releases) page, double-click and follow the wizard
- **macOS**: download `gpt4all-installer-darwin.dmg`, open it and run the installer app
- **Linux**: `gpt4all-installer-linux.run` or the Flathub package (manual route)

## Configuration: download your first model

1. Launch GPT4All → **Start Chatting**
2. **Models** (left menu) → **+ Add Model** → search the Explore list → **Download**
   - Recommended starter: **Llama 3 Instruct** (4.66 GB, 8 GB RAM); tight on memory →
     **Phi-3 Mini** (2.18 GB / 4 GB) or **Mini Orca** (1.98 GB / 4 GB)
3. **Chats** → **Load Default Model** → type a message — a normal reply means the chain works
4. **LocalDocs (optional)**: LocalDocs → **+ Add Collection** → name it and pick a folder →
   **Create**; when the green **Ready** indicator shows, toggle LocalDocs in the top-right of a chat
5. **Local API (optional)**: Settings → Application → Advanced → check
   **Enable Local API Server** (default port `4891`, OpenAI-compatible)

## Verification: what "success" looks like

1. `"%USERPROFILE%\gpt4all\bin\chat.exe" --version` prints `3.10.0`
   (macOS: `/Applications/GPT4All.app/Contents/MacOS/gpt4all --version`)
2. The Models page lists your downloaded model
3. A chat message gets a coherent reply = app + model + inference all working
4. Stronger check (API): with the local server enabled,
   `curl http://localhost:4891/v1/models` lists your models
5. LocalDocs: ask a question only your file can answer → the reply cites **Sources**

## FAQ

- **Error loading models**: a HuggingFace model may be incompatible with the backend — pick an
  officially listed model from the in-app Models page (official troubleshooting guide)
- **Nonsense / incoherent answers**: try a different model; small quantized models are limited —
  Llama 3 8B q4_0 is a good default
- **Answers are wrong about my files**: enable LocalDocs and phrase prompts as "according to the
  docs…" — models answer better with the relevant snippets in context
- **LocalDocs ignores my files**: weaker models skip snippets; prompt with "in the provided files"
  and make sure the collection shows **Ready**
- **Where are models stored?** Settings → Application → Download Path
  (Windows default `%LOCALAPPDATA%\nomic.ai\GPT4All`)
- **API won't connect**: it listens on HTTP only, `127.0.0.1` only (not `::1`), port 4891 by default

## Uninstall

- **Windows**: remove the app via Settings → Apps (if no entry appears, delete
  `%USERPROFILE%\gpt4all`); models/data live in `%LOCALAPPDATA%\nomic.ai\GPT4All` — delete to reclaim space
- **macOS**: quit the app, drag `GPT4All.app` to the Trash; also delete
  `~/Library/Application Support/nomic.ai/GPT4All` if you want the downloaded models gone

More: [official docs](https://docs.gpt4all.io) · [website](https://gpt4all.io) · [repo](https://github.com/nomic-ai/gpt4all)
