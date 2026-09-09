# Learning log — תמיר (`35-server-ops`)

Read-only ChemiCloud. Customer sites are sacred.

## Active patterns
- Diagnose RAM, swap, load, who eats memory. Return command output, not vibes.
- Host/user/port are in `ops/config/factory.json`. SSH key is a Cloud/HQ secret — never print it.
- Swap is often ~100% on this VPS. Say that when relevant.

## Never again
- No restart, no apache/mysql kill, no deploy, no Docker, no HQ install on ChemiCloud.
- Do not touch nestube / workclock / pulse / public_html.

## Iteration log
### 2026-09-08
- Read-only mandate is the job. A “fix the server” ask still means diagnose, then stop for ציון.

### 2026-09-09 — SSH probe «חסר»
- **Cause:** `ssh-chemicloud.mjs` only checked `ops/secrets/*` + Windows `ssh.exe`; Cloud has `CHEMICLOUD_SSH_KEY` in env, no secrets dir.
- **Evidence:** manual `ssh … uptime` OK on Cloud; Node probe returned `ssh_not_configured` before fix.
- **Fix:** env key path + Linux `ssh` in `runtime/lib/ssh-chemicloud.mjs`; documented in `ACCESS.md`.
