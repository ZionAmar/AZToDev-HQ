# Server SSH probe fix — KNU-05

**Date:** 2026-09-09  
**Specialist:** תמיר (`35-server-ops`)

## Problem

Telegram `/status` showed `שרת SSH: חסר` while ChemiCloud SSH credentials were configured in Cursor Cloud secrets. `hq/probe.mjs` and `sshConfigured()` returned false on Cloud because `ssh-chemicloud.mjs` only checked `ops/secrets/` on disk.

## Fix

Updated `runtime/lib/ssh-chemicloud.mjs`:

1. **Cloud env first** — `CHEMICLOUD_HOST`, `CHEMICLOUD_USER`, `CHEMICLOUD_PORT`, `CHEMICLOUD_SSH_KEY`, `CHEMICLOUD_SSH_KEY_PATH`
2. **Inline PEM** — write temp key file without trimming (trailing newline required)
3. **PC fallback** — `ops/secrets/aztodev-cpanel*` unchanged
4. **Linux SSH** — default executable `ssh` when not on Windows

## Verification

```text
$ node hq/probe.mjs
OK  SSH

$ node -e "import { runReadOnlySsh } from './runtime/lib/ssh-chemicloud.mjs'; console.log(await runReadOnlySsh('uptime'))"
{ ok: true, command: 'uptime', code: 0, stdout: '... up 50 days ...' }
```

`ops/config/factory.json` → `capabilitiesArmed.serverSshRead` remains `true` (already armed; probe now matches).

## No server mutations

Read-only only. No restart, deploy, or file writes on ChemiCloud VPS.
