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
- task: Noa asked you: Verify ChemiCloud SSH read-only probe; diagnose why status shows חסר; document fix so connections probe passes
- do: Cloud SSH = CHEMICLOUD_SSH_KEY env first; verify with runReadOnlySsh('uptime') before blaming the VPS
- dont: assume ops/secrets/ exists on Cloud — that path is PC-only by design
- note: probe showed חסר because ssh-chemicloud ignored Cloud env; manual SSH worked; fix in PR cursor/chemicloud-ssh-probe-a1e4
### 2026-09-09 (re-probe)
- task: Re-run SSH read-only health probe; update capabilitiesArmed.serverSshRead; log result
- do: Fix ssh-chemicloud.mjs for CHEMICLOUD_SSH_KEY / CHEMICLOUD_HOST env; then node hq/probe.mjs → SSH OK
- dont: rely on ops/secrets/ on Cloud Agent — env secrets are the source
- note: probe 2026-09-09T09:27:20Z SSH ok (uptime, load ~0.4); serverSshRead=true confirmed in factory.json
