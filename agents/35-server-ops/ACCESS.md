# Access — 35-server-ops

Secrets stay out of git. You call company tools; never print keys in chat or commits.

## Where credentials live

| Runtime | SSH key | Host / user / port |
|---------|---------|-------------------|
| **Cursor Cloud** (תמיר) | `CHEMICLOUD_SSH_KEY` (PEM) or `CHEMICLOUD_SSH_KEY_PATH` | `CHEMICLOUD_HOST`, `CHEMICLOUD_USER`, `CHEMICLOUD_PORT` — fallback: `ops/config/factory.json` |
| **PC HQ** (local probe) | `ops/secrets/aztodev-cpanel.nopass` (or `.ppk` converted) | `factory.json` |

Founder Telegram = נועה only.

## Why status showed «חסר» (SSH)

`hq/lib/connections.mjs` probes SSH via `runtime/lib/ssh-chemicloud.mjs` (`uptime`, 20s timeout).

Before the Cloud env fix, the module only looked for a **file** under `ops/secrets/` and defaulted to **Windows** `ssh.exe`. On Cursor Cloud:

- `ops/secrets/` is intentionally absent (not in git)
- `CHEMICLOUD_SSH_KEY` was set in Cloud secrets but **ignored**
- Result: `sshConfigured()` → false → probe `ssh_not_configured` → Telegram status «שרת SSH: חסר»

**Fix (2026-09-09):** `ssh-chemicloud.mjs` reads Cloud env secrets first, uses Linux `ssh` on non-Windows, then falls back to `ops/secrets/` for PC.

## Verify probe (read-only)

From repo root on a machine with secrets:

```bash
node -e "import { sshConfigured, runReadOnlySsh } from './runtime/lib/ssh-chemicloud.mjs'; console.log('configured', sshConfigured()); console.log(await runReadOnlySsh('uptime'));"
node hq/probe.mjs
```

Expect `ssh.ok: true` and uptime in stdout. `ops/runtime/connections.json` is written by the probe.

## Allowed commands

See `PERMISSIONS.md` / `emet_server_status` — diagnosis only. No restart, no apache, no writes on VPS.
