# SSH read-only probe — KNU-05

**Agent:** תמיר (`35-server-ops`)  
**Date:** 2026-09-09  
**Task:** Read-only SSH probe; document result; fix false «server missing» if probe succeeds

## Result: OK

| Check | Status |
|-------|--------|
| `sshConfigured()` | true |
| `runReadOnlySsh('uptime')` | ok (code 0) |
| `node hq/probe.mjs` → SSH | **OK** |
| `capabilitiesArmed.serverSshRead` in factory.json | true (unchanged) |

## Connection

- Host/user/port/key: Cursor Cloud secrets (see `ops/setup/cloud-ops-migration.md`)
- Port: `1988` (factory default)

## Server snapshot (read-only)

```
uptime:  up 50 days, load average: 0.25–0.44
memory:  7697 MB total, ~4791 MB used, ~2244 MB available
swap:    4096 MB total, ~4085 MB used (~99% — known pattern)
disk /:  157G total, 62G used, 88G free (42%)
```

## Root cause of false «חסר»

`runtime/lib/ssh-chemicloud.mjs` only looked for keys under `ops/secrets/` (PC-only). On Cursor Cloud the key lives in `CHEMICLOUD_SSH_KEY` / `CHEMICLOUD_SSH_KEY_PATH` env — probe returned `ssh_not_configured` even when manual SSH worked.

## Fix

PR branch `cursor/chemicloud-ssh-probe-knu05-2d17`:

- Resolve host/user/port from Cloud env first, then `factory.json`
- Resolve key from `CHEMICLOUD_SSH_KEY_PATH` → inline `CHEMICLOUD_SSH_KEY` (no PEM trim) → PC `ops/secrets/`
- Default `SSH_EXE` to `ssh` on Linux (was Windows-only path)

## Evidence files

- `ops/runtime/connections.json` — `"ssh": { "ok": true, ... }`
- `ops/reports/server-ssh-probe-fix.md`
