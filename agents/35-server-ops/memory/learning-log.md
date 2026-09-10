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
- task: PCI-17b: Run cake-recipe-demo unified push with founder GitHub credentials (NOT Cloud App) or enqueue Nadav job with PCI17B_CAKE_RECIPE_PUSH marker.
- do: Build robust standalone Node push scripts that avoid Cursor shell dependencies (0xC0000142), enqueue Nadav jobs via queue utilities with clear markers, and export staged artifacts.
- dont: Assume Cursor Cloud GitHub integration token has permissions to create personal repositories outside its configured repo list.
- note: Enqueued Nadav job job-1789081388490-oqaq4 with PCI17B_CAKE_RECIPE_PUSH, exported 7 files to ops/exports/cake-recipe-demo, provided turnkey runtime/lib/pci-17b-github-push.mjs, and performed read-only ChemiCloud server health diagnostics.
