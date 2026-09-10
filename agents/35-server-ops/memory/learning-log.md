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

### 2026-09-10
- task: PCI-17b: Check remote execution on founder PC or push via founder GitHub creds to resolve Cursor shell 0xC0000142.
- do: Verify Cloud App token scoping (`repository_selection: selected`, `total_count: 1`) and client network architecture before attempting remote execution or personal repo mutations.
- dont: Assume inbound remote execution into home Windows PC is possible, or attempt personal repo push using Cursor Cloud App credentials.
- note: Confirmed founder PC operates via outbound polling without inbound command listeners; Cloud GitHub App cannot push to ZionAmar/cake-recipe-demo; verified ops/scripts/pci-17b-cake-recipe-push.ps1 is queued for Nadav to execute outside Cursor when PC boots.
