# Server SSH probe fix — 2026-09-09

**Agent:** תמיר (`35-server-ops`)  
**Task:** Fix false «שרת SSH: חסר» in company status when Cloud secrets are armed.

## Root cause

`runtime/lib/ssh-chemicloud.mjs` resolved the SSH key only from PC-local paths:

- `ops/secrets/aztodev-cpanel.nopass`
- `ops/secrets/aztodev-cpanel`

On **Cursor Cloud**, those files do not exist by design. Secrets live in environment variables (`CHEMICLOUD_SSH_KEY`, `CHEMICLOUD_HOST`, `CHEMICLOUD_USER`, `CHEMICLOUD_PORT`).

Result:

- `sshConfigured()` returned `false` on Cloud even with valid secrets
- `node hq/probe.mjs` wrote `accounts.ssh.ok: false`
- Telegram «סטטוס» showed **שרת SSH: חסר** while `capabilitiesArmed.serverSshRead` was already `true` in `ops/config/factory.json`

## Fix

Updated `runtime/lib/ssh-chemicloud.mjs`:

1. **Key resolution order:** `CHEMICLOUD_SSH_KEY_PATH` → `CHEMICLOUD_SSH_KEY` (materialized to `/tmp`) → `ops/secrets/` (PC fallback)
2. **Host/user/port:** env vars first, then `factory.json` (`chemiCloudHost` / `chemiCloudIp`, `chemiCloudUser`, `chemiCloudPort`)
3. **PEM handling:** preserve trailing newline; support escaped `\n` in env PEM
4. **SSH binary:** use system `ssh` on Linux Cloud; keep Windows OpenSSH path on PC

## Probe evidence (2026-09-09T09:52Z)

```
$ node -e "import('./runtime/lib/ssh-chemicloud.mjs').then(m => console.log('configured:', m.sshConfigured()))"
configured: true

$ node hq/probe.mjs
OK  SSH
```

SSH uptime sample (read-only):

```
10:52:31 up 50 days, 11:54,  0 users,  load average: 1.02, 0.94, 0.59
```

Target: port **1988** (from `CHEMICLOUD_PORT` / `factory.json`).

## factory.json

`capabilitiesArmed.serverSshRead` remains **`true`** — no change required; the armed flag was correct, the probe path was wrong.

## Verification checklist

- [x] `sshConfigured()` → `true` on Cloud with env secrets
- [x] `runReadOnlySsh('uptime')` → `ok: true`
- [x] `node hq/probe.mjs` → `accounts.ssh.ok: true`
- [x] Status line «שרת SSH» will show **מחובר** after next probe on desk/Cloud

## Not changed

- No VPS mutations (read-only mandate)
- No changes to customer sites
- `ops/runtime/connections.json` is runtime output (gitignored)
