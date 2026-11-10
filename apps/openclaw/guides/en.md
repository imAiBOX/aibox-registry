# OpenClaw install guide (short)

> The full pictorial tutorial lives on the aibox.im /apps/openclaw/ page
> is generated from this repo).
> Tagline: **"Installed until it works."**

## 1. Health check (automatic)
AiBOX checks your machine first: Node version policy — recommended ≥26.12.1,
supported ≥24.22.1 (<25); **22/23/25 are unsupported** (we install a newer copy
next to yours and never touch your existing one).

## 2. Route selection (automatic)
- **International network**: official Windows Hub installer (direct GitHub).
- **Mainland China**: npm prefix route (Node + OpenClaw via npmmirror, avoids
  large GitHub assets end-to-end).

## 3. Install (one click)
Automatic download with SHA256 verification and silent install — no
administrator rights required.

## 4. Add your key (the only step you do)
Pick one of six paths: OpenRouter (recommended) / Anthropic / OpenAI / Google /
Claude subscription (OAuth) / local Ollama.
Paste the key → it is merged into `~/.config/openclaw/openclaw.json5` (the
original file is backed up first).

## 5. Verify (automatic)
We send one real test request; a valid reply means you're done —
"Installed. It really works."

---
Feedback: https://github.com/imAiBOX/aibox-registry/issues
