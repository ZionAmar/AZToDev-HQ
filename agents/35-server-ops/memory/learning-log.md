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
### 2026-09-10
- Lane boundary & credential check: PCI-17b personal GitHub repo push requires founder credentials (not Cloud App). 35-server-ops stays in lane, packages files in `ops/exports/cake-recipe-demo/` and `ops/scripts/pci-17b-unified-push.mjs`, verifies execution failure under Cloud App token, and hands off to Nadav (`34-pc-ops`) on Windows PC.

### 2026-09-08
- Read-only mandate is the job. A “fix the server” ask still means diagnose, then stop for ציון.
