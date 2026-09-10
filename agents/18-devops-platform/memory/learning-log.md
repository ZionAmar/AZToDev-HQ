# Learning log — 18-devops-platform (Paz)

### 2026-09-10 · pci-17b-unified-push-cloud-blocked
- do: Assemble `ops/exports/cake-recipe-demo/` (7 files) + `pci-17b-unified-push.mjs` on HQ branch; PC runs same script with founder `gh` token
- dont: Expect Cloud GitHub App to create/push `ZionAmar/cake-recipe-demo` — 403 Resource not accessible by integration
- note: PCI-17b export bundle ready; push blocked; delegated to 34-pc-ops (PC offline)

### 2026-09-10 · dafna-company-system-docker-pages
- do: Stage Dockerfile + Pages workflow under `ops/staging/<repo>/` in HQ when Cloud GitHub App cannot see the product repo; delegate push to 34-pc-ops with exact copy list
- dont: Claim push/commit to a repo when `gh repo view` returns 404 from Cloud — same class as PCI-14 kidnest visibility
- note: Prepared nginx Dockerfile + pages.yml for aztodev-company-system; PC push queued as PCI-15

### 2026-09-10 · cake-recipe-demo-docker-pages-stage
- do: Mirror `ops/staging/<repo>/` pattern for every product repo Cloud cannot push; bundle COPY list must match frontend artifact filenames (`styles.css` not just `index.html`)
- dont: Skip honest Docker blocker report when sandbox has no `docker` binary — document Nadav/QA smoke commands instead of "should work"
- note: Staged cake-recipe-demo Dockerfile + pages.yml; repo still 404; PCI-17 queues one-shot PC push (bundle + devops together)

### 2026-09-10 · pci-16-cake-recipe-verbatim
- do: When PC shell is broken, embed FULL raw file contents in outbox so 34-pc-ops can Write locally without git fetch
- dont: Tell Nadav to pull HQ branches when his shell returns 0xC0000142 — give copy-paste payloads instead
- note: PCI-16 cake-recipe DevOps files extracted from cursor/cake-recipe-docker-pages-stage-18eb into verbatim outbox for PC ops

### 2026-09-10 · pci-16-helper-bundle-and-api-check
- do: Read-verify repo state before PATCH; report stale checklist rows when live API differs (HQ already private)
- dont: Claim Cloud can flip personal-repo visibility or enable Pages — integration token is AZToDev-HQ scoped only (403)
- note: Bundle confirmed on rtl-58ef + docker-pages-stage-18eb; item 1 (HQ private) already satisfied; items 2–3 (Pages toggle, cake-recipe-demo repo) remain blocked on PC
