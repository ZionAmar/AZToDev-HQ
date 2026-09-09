# SSH read probe — ChemiCloud

**Agent:** תמיר (`35-server-ops`)  
**When:** 2026-09-09T09:49Z (UTC)  
**Target:** ChemiCloud VPS (`factory.json` → `chemiCloudHost` / port 1988, read-only)

## Probe result

| Check | Result |
|-------|--------|
| `sshConfigured()` | true |
| `runReadOnlySsh('uptime')` | OK |
| `hq/probe.mjs` → SSH | OK |
| `ops/runtime/connections.json` → `accounts.ssh.ok` | true |
| `ops/config/factory.json` → `capabilitiesArmed.serverSshRead` | true (already armed) |

**Root cause of stale «שרת SSH: חסר»:** `runtime/lib/ssh-chemicloud.mjs` ignored Cloud env secrets (`CHEMICLOUD_SSH_KEY`) and only looked for `ops/secrets/` (PC-only). `.trim()` on the PEM key also broke libcrypto (trailing newline required).

**Fix:** PR branch `cursor/chemicloud-ssh-probe-2020` — env key/path first, factory+env host/user/port, Linux `ssh` default, no trim on PEM body.

## Server snapshot (read-only)

```
uptime:  10:49:44 up 50 days, 11:51, load average: 1.60, 0.71, 0.45

free -m:
  Mem:  7697 total, 4729 used, 324 free, 2290 available
  Swap: 4096 total, 4096 used, 0 free  ← swap full

df -h /:
  /dev/sda  157G  62G  88G  42%

Top RAM (ps aux --sort=-%mem | head -5):
  mysqld          ~30% (~2.3 GB)
  tg_news_launcher ~4.4%
  workclock Passenger ~2.5%
  pulsechannel node ~2.3%
  spamd/cpanel perl ~2.2%
```

No mutations performed. Customer sites untouched.

## Evidence paths

- `ops/runtime/connections.json` (written by probe)
- `runtime/lib/ssh-chemicloud.mjs` (fix)
- This file
