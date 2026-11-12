# llamafile install & setup guide

One line: **llamafile (from Mozilla, 26k+ stars) packs a large language model into a single executable** — download it, run it, and you have a complete local AI service with a terminal chat and a web UI (`http://localhost:8080`). Zero installation, zero configuration.

## What you get

- **A single-file runtime**: llama.cpp plus its runtime collapsed into one file — drop it into a user folder and go, nothing else to install
- Two ways to use it: ① run official pre-built `.llamafile` files (weights built in — download and chat), ② use the runner with any external GGUF model
- Built-in web chat (`localhost:8080`) plus an OpenAI-compatible API other tools can plug into
- GPU acceleration: Apple Metal (Apple Silicon), NVIDIA CUDA, AMD ROCm, Vulkan (per official docs)

## Before you start (2 minutes)

- **Windows 10+ (AMD64 only, CPU must have AVX — roughly Intel 2006+ / AMD 2003+)** or **macOS 12+** (GPU backend on macOS is ARM64-only)
- 2–8 GB free disk (pre-built models start at 1.77 GB) and 8 GB RAM minimum
- ⚠️ Windows caps single executables at 4 GB: for larger models use "runner + external GGUF" (documented by upstream)
- Not needed: administrator rights, Python, Node, a GPU (a GPU just makes it faster)

## Install

### Route A: install with AiBOX (recommended)

1. Open AiBOX → app directory → **llamafile** → **Install**
2. AiBOX downloads the official single-file runner from the release page (sha256-verified, CN traffic auto-uses the accelerated channel):
   Windows gets `%LOCALAPPDATA%\Programs\Llamafile\llamafile.exe`, macOS gets
   `/Applications/Llamafile/llamafile` with the execute bit set — **no admin rights at any point**

### Route B: manual install (official channels)

Run an official pre-built model straight away (macOS/Linux, official quickstart commands):

```bash
curl -LO https://huggingface.co/mozilla-ai/llamafile_0.10/resolve/main/Qwen3.5-0.8B-Q8_0.llamafile
chmod +x Qwen3.5-0.8B-Q8_0.llamafile
./Qwen3.5-0.8B-Q8_0.llamafile
```

On Windows, rename the download to add `.exe` before running (official README). If you only want the
runner, grab `llamafile-0.10.6` from [Releases](https://github.com/mozilla-ai/llamafile/releases).

## Configuration (pick a model)

1. **Zero effort**: run a pre-built `.llamafile` — weights are inside the file, running it opens the chat, no config
2. **Mix and match**: download any GGUF (gpt-oss, Qwen, Llama families…) and load it with the runner:

```bash
# macOS/Linux
/Applications/Llamafile/llamafile -m /path/to/model.gguf
# Windows
%LOCALAPPDATA%\Programs\Llamafile\llamafile.exe -m C:\path\to\model.gguf
```

3. Tools that speak the OpenAI API (Cherry Studio, Cline, …) can point at `http://localhost:8080/v1`
4. If the GPU doesn't kick in, check `~/.llamafile` (official docs: GPU libraries are looked up in
   "same directory → inside the bundle → `~/.llamafile` → `$HOME`")

## Verification: what "works" looks like

1. Running it opens a chat prompt in the terminal (and the browser at `http://localhost:8080` serves the web UI)
2. Send "hello" — **a real reply** means the model is actually running
3. Optional version check on the command line (output format pending real-machine confirmation):

```bash
llamafile --version   # expected to contain 0.10.6
```

## FAQ

- **Windows says the file is too large to run**: that's the 4 GB executable limit — use the runner with an external GGUF instead (see above)
- **Startup error mentioning AVX**: your CPU predates AVX (pre-2006 Intel / pre-2003 AMD); try another machine or another build
- **macOS says the file can't be opened / is damaged**: System Settings → Privacy & Security → Open Anyway (or right-click → Open)
- **Port 8080 is taken**: pass a different port, e.g. `llamafile -m model.gguf --port 8081`
- **Upgrading**: reinstall the newer version through AiBOX (the single file is overwritten in place), or replace it from Releases

## Uninstall

- Windows: delete `%LOCALAPPDATA%\Programs\Llamafile`; macOS: delete `/Applications/Llamafile`
- Optional cleanup: `~/.llamafile` (GPU library cache) and any `.llamafile` / `.gguf` models you downloaded
- ⚠️ Model files can be several GB — move them somewhere safe before deleting if you might reinstall

More: [official docs](https://docs.mozilla.ai/llamafile) · [quickstart](https://docs.mozilla.ai/llamafile/getting-started/quickstart) · [Releases](https://github.com/mozilla-ai/llamafile/releases)
