# Ollama install guide (short)

> The full pictorial tutorial lives on the aibox.im /apps/ollama/ page
> (generated from this repo).
> Tagline: **"Installed until it works."**

## 1. Health check (automatic)
AiBOX checks your machine first (disk space, no admin rights needed).
Ollama is self-contained — no Node.js or Python required.

## 2. Route selection (automatic)
- **International network**: official GitHub Releases (direct).
- **Mainland China**: gh-proxy gateway channel, automatic fallback to direct.

## 3. Install (one click)
Download with SHA256 verification, then silent install
(Windows: Inno Setup to `%LOCALAPPDATA%\Programs\Ollama`; macOS: dmg copied to
`/Applications`). No administrator rights required.

## 4. Get a model (the only step you do)
Pull your first model, e.g. `ollama pull qwen2.5:7b` — small models run on
8GB RAM; free and fully offline.

## 5. Verify (automatic)
We run `ollama --version` and check the local service at
`http://127.0.0.1:11434` — "Installed. It really works."

---
Feedback: https://github.com/imAiBOX/aibox-registry/issues
