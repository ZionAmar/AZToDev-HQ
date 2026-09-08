# AZToDev HQ

**Cloud-first:** rules and agents live in GitHub (`AZToDev-HQ`). AI runs on **Cursor Cloud**, not on ChemiCloud.

```
Founder (Telegram / Cursor chat)
    → Noa (00-ceo) — Cursor Cloud
    → DELEGATE → Ruth / Tamir / product specialists — Cursor Cloud
    → GitHub — code + PR
    → ChemiCloud — customer sites only (deploy = gate)
```

## Optional local relay (founder PC)

When the PC is on, a thin relay can forward Telegram + PIN:

```bat
HQ-ON.bat
```

Health: http://127.0.0.1:8788/health

Secrets load from local `.env` — never paste them in chat.

## Cloud (primary)

1. Connect GitHub to Cursor (Settings → GitHub).
2. HQ repo: `https://github.com/ZionAmar/AZToDev-HQ` (private).
3. Product work: Cloud Agents on private product repos → PR, not prod deploy.

## Gates (founder only)

Prod, spend, publish, new product, secrets, ChemiCloud HQ deploy.
