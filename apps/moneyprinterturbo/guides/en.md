# MoneyPrinterTurbo install & setup guide

One line: **MoneyPrinterTurbo turns a single topic into a finished short video** — AI writes the script, grabs stock footage, narrates it, burns in subtitles and renders the final cut. The Windows portable build is double-click to run.

## What you get

- Full pipeline from one sentence: script → footage → voice-over → subtitles → edited final video
- Four ways to drive it: the WebUI, an API server, a CLI, or an AI agent call
- Free building blocks: Pexels / Pixabay stock footage, plus Edge TTS narration that needs no key at all

## Before you start (3 minutes)

| Need | Notes |
|---|---|
| **Windows 10/11 x64** | The portable bundle ships its own runtime — **no Python install needed** (macOS goes the source route, Python 3.11+) |
| **7-Zip** | The bundle is a `.7z`; grab the free build from [7-zip.org](https://www.7-zip.org/) (extracting needs **no** admin rights) |
| Disk | ~2GB (555MB download plus the extracted runtime and caches) |
| API key | At least one LLM key for script writing; footage and narration can stay free |
| Permissions | **Zero admin** — it unpacks into a user folder |

> ⚠️ **Path rule (stated by the project)**: the install path must contain **no Chinese characters, spaces or special characters**. If your Windows user name is non-ASCII (which poisons `C:\Users\<name>\...`), unpack to a plain-ASCII folder such as `D:\Apps\MoneyPrinterTurbo`.

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **MoneyPrinterTurbo** → **Install**
2. It downloads the 555MB official portable build (CN traffic switches gateway automatically), verifies the hash and **extracts into `%LOCALAPPDATA%\MoneyPrinterTurbo`**
3. Launch from AiBOX or the extracted folder — if your user name contains non-ASCII characters, move it to a plain-ASCII path as noted above

### Route B: manual install (official portable build)

1. Open the [Releases page](https://github.com/harry0703/MoneyPrinterTurbo/releases/latest) and download `MoneyPrinterTurbo-Portable-Windows-1.3.10.7z` from the **Assets** section
   (**Don't** grab GitHub's auto-generated `Source code (zip/tar.gz)` — that's just the source tree, with no launcher in it)
2. Right-click the `.7z` → 7-Zip → **Extract Here**, or extract to a plain-ASCII folder (e.g. `D:\Apps\MoneyPrinterTurbo`)
3. Run `MoneyPrinterTurbo.exe`; if the archive instead contains `start.bat`, double-click `update.bat` first to pull the latest code, then `start.bat`

## First-time configuration, step by step

Fill the settings page in this order and you'll avoid most dead ends:

1. **LLM (script writing)**: `llm_provider` defaults to **moonshot (Kimi)**; OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Alibaba Tongyi, iFlytek Spark, local Ollama and any OpenAI-compatible gateway also work — pick one and paste its key
2. **Video footage source**: defaults to `pexels`; get a free key at [Pexels API](https://www.pexels.com/api/) or [Pixabay](https://www.pixabay.com/api/docs/) (multiple keys rotate). You can also upload your own clips, or switch to paid AI text-to-video sources
3. **Voice-over (TTS)**: start with **Edge TTS** — **free, no key required**; audition voices and pick one. Upgrade later to Azure / SiliconFlow / ElevenLabs if you want richer voices (platform key needed)
4. **Subtitles**: default `edge` uses the TTS timestamps — fast, no GPU, no downloads. Switch to `whisper` (local `faster-whisper`, first use pulls a 1.6–3GB model) for tighter timing
5. **Aspect ratio**: `9:16` vertical (TikTok/Shorts/Reels), `16:9` landscape, or `1:1` square

## Generation flow, stage by stage

1. Type a **topic** on the home screen (one line is enough — or paste your own script)
2. Hit **Generate** and watch the staged progress: **script → footage download/processing → narration → subtitles → final render**
3. Open any stage while it runs: edit the script and rerun, audition the whole narration track
4. Preview and **download the finished video** from task history; batch mode renders several videos in one go

**Headless / automation** (source deployments):

```shell
python cli.py --video-subject "How AI changes everyday life"
python cli.py --help    # full parameter list
```

There's also an API server: `python main.py`, with docs at `http://127.0.0.1:8080/docs`.

## Verification: what "success" looks like

1. The launcher opens the WebUI automatically (blank page? open the URL shown in the terminal — default `http://127.0.0.1:8501` — in Chrome or Edge)
2. Settings show the LLM key filled in and the footage key validated
3. Run one topic with default settings and get a **playable video** within minutes

## Cost notes

- **Free stack**: Pexels/Pixabay footage + Edge TTS narration + `edge` subtitles → you only pay LLM tokens (a 60-second script usually costs fractions of a cent)
- **Skip paid add-ons at first**: AI text-to-video footage sources (Seedance, LoomLoom, …) bill per generation — new users should stay on free stock footage
- **Whisper subtitles** run locally for free; you only download the model once (grab it manually into `models\whisper-large-v3` if the download stalls)

## FAQ

- **Extraction fails / `.7z` won't open**: install 7-Zip first; extraction needs no admin, but the **destination must be free of Chinese characters and spaces**
- **`RuntimeError: No ffmpeg exe could be found`**: ffmpeg is normally downloaded automatically; if that fails, grab it from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) and point `ffmpeg_path` in `config.toml` at it
- **Whisper model won't download**: fetch `whisper-large-v3` manually from Hugging Face and unpack it to `.\MoneyPrinterTurbo\models\whisper-large-v3`
- **Blank page after launch**: open the URL printed in the terminal with Chrome or Edge
- **Generation is slow**: the bottleneck is usually the cloud LLM/footage API; for local transcription or heavy batch work, a GPU with 4GB+ VRAM helps

## Uninstall

```powershell
# Exit the app first, then delete the folder (drafts, config and task history all live there — back it up!)
Remove-Item -Recurse "$env:LOCALAPPDATA\MoneyPrinterTurbo"
```

AiBOX's **Manage → Uninstall** does it for you.

More: [GitHub README](https://github.com/harry0703/MoneyPrinterTurbo#readme) · [Releases](https://github.com/harry0703/MoneyPrinterTurbo/releases)
