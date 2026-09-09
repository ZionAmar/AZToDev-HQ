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
- task: KNU-05 — read-only SSH probe; fix false «server missing»; document result
- do: Cloud SSH = CHEMICLOUD_SSH_KEY env first; verify with `node hq/probe.mjs` before blaming VPS
- dont: assume `ops/secrets/` exists on Cloud Agent — PC-only by design
- note: probe OK port 1988; false «חסר» fixed in ssh-chemicloud.mjs; PR cursor/chemicloud-ssh-probe-knu05-2d17
