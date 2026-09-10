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
- Ran PCI-17b cake-recipe-demo unified push script. Empirical verification confirmed Cursor Cloud GitHub App token is scoped exclusively to `AZToDev-HQ` (`repository_selection: selected`, 1 repo) and fails with HTTP 403 on creating user repos under `ZionAmar`. Populated `ops/exports/cake-recipe-demo/` with all 7 files and built `ops/scripts/pci-17b-unified-push.mjs` for Nadav (`34-pc-ops`) to execute seamlessly when PC/Windows is online.
- do: Build reusable unified push scripts that fall back gracefully between local Git Credential Manager and Cloud diagnostic mode, reporting exact structured JSON.
- dont: Assume Cloud GitHub App token can create personal user repositories outside its scoped repo selection (`total_count: 1`).
- note: Ran PCI-17b unified push check; confirmed Cloud App 403 on personal repo create; prepared turnkey script and export directory for Nadav PC execution.

### 2026-09-08
- Read-only mandate is the job. A “fix the server” ask still means diagnose, then stop for ציון.
