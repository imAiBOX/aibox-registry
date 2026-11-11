# Chatbox install guide (short)

> The full pictorial tutorial lives on the aibox.im /apps/chatbox/ page
> (generated from this repo).
> Tagline: **"Installed until it works."**

## 1. Health check (automatic)
AiBOX checks your machine first. Chatbox is self-contained —
no Node.js required. (Windows currently ships an x64 installer.)

## 2. Route selection (automatic)
Chatbox downloads from the official CDN (download.chatboxai.app) in every
region — the same source the vendor ships to all users.

## 3. Install (one click)
Download with SHA256 verification, then silent install
(Windows: NSIS to `%LOCALAPPDATA%\Programs\Chatbox`;
macOS: Apple Silicon / Intel dmg copied to `/Applications`). No admin rights.

## 4. Add your key (the only step you do)
Pick a provider: OpenRouter (recommended) / Anthropic / OpenAI / Google.
Paste the key in Chatbox settings — your chats stay on your own machine.

## 5. Verify (automatic)
We check the installed version — "Installed. It really works."

---
Feedback: https://github.com/imAiBOX/aibox-registry/issues
