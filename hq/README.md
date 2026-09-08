# AZToDev HQ

**Telegram + Cursor Cloud on a private GitHub repo.**  
The 33 folders under `agents/` are a specialist library — not 33 local processes.

## What runs where

```
Founder (Telegram / Cursor chat)
    → Noa (00-ceo) — Cursor Cloud
    → DELEGATE → Ruth / Tamir / product specialists — Cursor Cloud
    → Code: private GitHub repos → PR
    → Tasks: Linear (EMET-65)
```

| Component | Runtime | Notes |
|-----------|---------|--------|
| Noa + specialists | **Cursor Cloud** | Rules in `AZToDev-HQ` on GitHub |
| Thin Telegram relay | **PC** (`hq/index.mjs`, port 8788) | Optional when PC is on |
| Nadav (PC ops) | **PC local** | Disk, git, `gh` — PC must be on |
| ChemiCloud | **Customer sites only** | No HQ, no agents — see `deploy/CHEMICLOUD.md` |

## Local relay (PC)

```bat
HQ-ON.bat
```

Health: http://127.0.0.1:8788/health

Keys load from local `.env`. Never paste them in chat.

## Cloud

1. Connect GitHub in Cursor Settings.
2. Set in `.env`: `GITHUB_HQ_REPO=https://github.com/ZionAmar/AZToDev-HQ`
3. Cloud agents read HQ rules from GitHub; product work → PR, never prod deploy without gate.

## Gates (founder only)

Prod, spend, publish, new product, secrets.
