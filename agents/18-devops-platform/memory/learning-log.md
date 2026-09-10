# Learning log — 18-devops-platform (Paz)

### 2026-09-10 · dafna-company-system-docker-pages
- do: Stage Dockerfile + Pages workflow under `ops/staging/<repo>/` in HQ when Cloud GitHub App cannot see the product repo; delegate push to 34-pc-ops with exact copy list
- dont: Claim push/commit to a repo when `gh repo view` returns 404 from Cloud — same class as PCI-14 kidnest visibility
- note: Prepared nginx Dockerfile + pages.yml for aztodev-company-system; PC push queued as PCI-15

### 2026-09-10 · cake-recipe-demo-docker-pages-stage
- do: Mirror `ops/staging/<repo>/` pattern for every product repo Cloud cannot push; bundle COPY list must match frontend artifact filenames (`styles.css` not just `index.html`)
- dont: Skip honest Docker blocker report when sandbox has no `docker` binary — document Nadav/QA smoke commands instead of "should work"
- note: Staged cake-recipe-demo Dockerfile + pages.yml; repo still 404; PCI-17 queues one-shot PC push (bundle + devops together)
