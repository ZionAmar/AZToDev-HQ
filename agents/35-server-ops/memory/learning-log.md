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
### 2026-09-09
- task: Re-run SSH read probe; fix stale «שרת חסר» in status; outbox + learning log
- do: Cloud SSH = `CHEMICLOUD_SSH_KEY` env first (never `.trim()` the PEM — keep trailing newline); verify with `node hq/probe.mjs`
- dont: assume `ops/secrets/` exists on Cloud Agent; dont cache a bad key file after trim
- note: probe OK port 1988; connections.json ssh.ok=true; fix in `ssh-chemicloud.mjs` branch cursor/chemicloud-ssh-probe-2020
