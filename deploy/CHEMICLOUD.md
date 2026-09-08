# ChemiCloud — customer sites only

Host: `cvps1645.serverhostgroup.com`  
IP: `178.79.149.231`  
User: `aztodevc`  
Port: `1988`

**Decision (2026-09-08):** ChemiCloud runs **live customer websites only**.  
No AZToDev HQ, no Telegram desk, no Cursor, no Docker, no AI agents.

| Allowed | Not allowed |
|---------|-------------|
| Customer site deploy (gate: founder + Paz) | `aztodev-desk` / HQ relay |
| Read-only SSH diagnostics (Tamir, from Cursor Cloud) | 33 agents / orchestration on VPS |
| MySQL / Apache for live products | Secrets or `.env` in git or chat |

Do not put SSH passwords, `.ppk`, or `.env` in git or chat.

```
ssh -p 1988 -i ops/secrets/aztodev-cpanel.nopass aztodevc@178.79.149.231
```

**Kill:** `aztodev-desk` on ChemiCloud — if it exists, remove it. Desk = Cursor Cloud (+ optional thin relay on founder PC only).

Evidence: `ops/decisions/2026-09-08-hq-cloud-split.md`
