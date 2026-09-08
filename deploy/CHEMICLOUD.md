# ChemiCloud — customer sites only (no AZToDev HQ)

Host: `cvps1645.serverhostgroup.com`  
IP: `178.79.149.231`  
User: `aztodevc`  
Port: `1988`

**Decision (2026-09-08):** ChemiCloud runs **live customer sites only**.  
**No** AZToDev HQ, **no** Telegram relay, **no** Cursor, **no** Docker, **no** 33 agents.

| Allowed | Forbidden |
|---------|-----------|
| Customer site files under `/var/www` / `public_html` | `aztodev-desk` or any HQ runtime |
| Controlled prod deploy by **Pez** (`18-devops-platform`) after founder gate | AI agents, orchestration, daily jobs |
| SSH **read-only** diagnostics by **Tamir** (`35-server-ops`) from **Cursor Cloud** | Storing Gmail secrets or running HQ on the VPS |

Do not put SSH passwords, `.ppk`, or `.env` in git or chat.

```
ssh -p 1988 -i ops/secrets/aztodev-cpanel.nopass aztodevc@178.79.149.231
```

**Agent runtime:** Cursor Cloud + private GitHub (`AZToDev-HQ`).  
**Founder desk:** Cursor chat and/or thin PC relay (`hq/index.mjs`) — never ChemiCloud.

See: `ops/decisions/2026-09-08-hq-cloud-split.md`
