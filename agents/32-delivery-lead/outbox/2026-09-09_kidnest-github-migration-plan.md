# KidNest → GitHub migration plan (planning only)

**Owner:** Keshet (`32-delivery-lead`)  
**Status:** PLAN — no repo, no push, no product PR until founder PIN + `productWorkEnabled`  
**Source path (PC):** `C:\Users\amazi\Desktop\Projects\in_production\kidnest`  
**Production (unchanged):** https://nestube.aztodev.com  
**Evidence base:** KidNest audit (NS-01…08, KN-001…025), `ops/intake/kidnest-audit-board.json`

---

## 1. Recommendation — private repo name & slug

| Field | Value | Rationale |
|-------|-------|-----------|
| **GitHub repo name** | `KidNest` | Matches local folder, audit docs, founder vocabulary. Brand line: NesTube/NestTube stays in README only. |
| **Full URL** | `https://github.com/ZionAmar/KidNest` | Same owner as HQ + existing products (`Work_clock`, `FiTime`). |
| **Visibility** | **Private** | Non-negotiable — JWT, YouTube keys, prod topology. |
| **`factory.json` key** | `kidnest` | Lowercase snake-free key, consistent with `work_clock`, `fitime`, `telemust`. |
| **Pipeline slug** | `kidnest` | `ops/pipeline/kidnest/` when (if) a new bet folder is opened — **not before Keep + PIN**. |
| **Cloud env** | `GITHUB_REPO=https://github.com/ZionAmar/KidNest` | Set in Cursor Cloud secrets at activation; never in git. |

**Do not use:** `NestTube` as repo name (conflicts with prod hostname `nestube`), `kidnest-hq`, or a public repo “for demos”.

**Founder CHOOSE (optional):** Confirm `KidNest` vs `NestTube` display name on GitHub — default stays `KidNest`.

---

## 2. Top-level structure (preserve monorepo)

Audit confirmed a **5-app monorepo**. Migrate **as-is**; do not split repos in v1.

```
KidNest/                          # repo root
├── README.md                     # install matrix (from KN-002), links to docs/
├── STATUS.md                     # prod health snapshot (KN-023 — create/update at migration)
├── LICENSE                       # private / proprietary (founder CHOOSE)
├── package.json                  # root scripts: dev:*, pack:deploy, migrate, seed
├── package-lock.json             # commit lockfile
├── .gitignore                    # §4 below
├── .env.example                  # root template — placeholders only
├── api/                          # Fastify + MySQL (backend)
│   ├── .env.example
│   ├── migrations/
│   └── ...
├── admin/                        # Parent admin (React)
│   ├── .env.example
│   └── ...
├── mobile/                       # Expo — **standalone** npm install (not in workspaces)
│   ├── .env.example
│   └── ...
├── tv/                           # Expo TV app
│   ├── .env.example
│   └── ...
├── tv-home/                      # Expo TV home / shared UI
│   ├── .env.example
│   └── ...
├── docs/
│   ├── DEPLOY-CHEMICLOUD.md      # single canonical deploy doc (resolve KN-019 conflict)
│   ├── RUNBOOK.md                # local → pack → ChemiCloud → EAS (KN-024)
│   ├── DEV-SETUP.md              # lift KN-002 content here
│   └── ARCHITECTURE.md           # apps, ports, routing (/app, /tv, /api)
├── scripts/                      # pack, migrate helpers (if present on disk)
└── .github/
    └── PULL_REQUEST_TEMPLATE.md  # optional — small reversible PRs
```

### Explicit exclusions (never in git)

| Path / artifact | Reason |
|-----------------|--------|
| `dist-deploy/` | `pack:deploy` output — rebuild on CI/PC |
| `node_modules/` | all levels |
| `.env`, `.env.local`, `.env.production` | secrets |
| `ops/secrets/`, `*.pem`, `*.ppk`, `*.keystore` | keys |
| `android/app/debug.keystore` (if real) | signing |
| `.expo/`, `ios/Pods/`, `*.apk`, `*.aab` | build artifacts |
| XAMPP / MySQL data dirs | local DB files |
| Large media / dump SQL with PII | use seed scripts only |

### Workspace rule (from KN-002)

- Root `npm install` + **separate** `npm install` in `mobile/`, `tv/`, `tv-home/`.
- Document in `docs/DEV-SETUP.md` — Cloud agents will fail if they assume npm workspaces everywhere.

### HQ boundary

- **Do not** copy `ops/` from AZToDev-HQ into the product repo.
- Product repo gets `docs/` only. HQ keeps audit artifacts under `ops/meetings/kidnest-audit/` (mirror summaries if needed).

---

## 3. Secrets scrub checklist (gate before first push)

**Owner at execution:** `19-security-engineer` (ליב) — issue KN-022.  
**PIN gate:** `secrets` + `new_product` (repo creation counts as product infrastructure).

### 3.1 Search patterns (run on PC before commit)

```bash
# Run from repo root on founder PC (נדב) — read-only scan first
rg -i "(password|secret|api[_-]?key|private[_-]?key|jwt|Bearer |mysql://|smtp|oauth|client[_-]?secret)" \
  --glob '!node_modules' --glob '!.git' --glob '!dist-deploy'
rg "\.env" --files-with-matches
rg -i "(sk-|AIza|ya29\.|ghp_|gho_|xoxb-)" --glob '!node_modules'
find . -name "*.env*" -o -name "*.pem" -o -name "*.ppk" -o -name "*.keystore" 2>/dev/null
git log --all --full-history -- "*.env" 2>/dev/null   # if prior local git exists
```

### 3.2 Known secret classes (KidNest-specific)

| Class | Typical locations | Action |
|-------|-------------------|--------|
| JWT / session | `api/.env`, templates | → `.env.example` with `JWT_SECRET=changeme` |
| MySQL | `api/.env`, deploy docs | → placeholder; prod creds in ChemiCloud only |
| YouTube Data API | `api/.env` | → `YOUTUBE_API_KEY=` empty in example |
| Google OAuth | `api/.env`, admin UI config | → client id ok **only if** public OAuth client; rotate if leaked |
| SMTP | `api/.env` | → strip; document var names |
| Redis | `api/.env`, docker-compose | → document optional; ChemiCloud runs inline (KN-017) |
| CORS / CSP | api config | → no internal IPs or prod secrets in comments |
| EAS / Expo | `mobile/app.json`, `eas.json`, secrets | → EAS secrets in Expo dashboard, not git |
| APK signing | `android/`, `credentials.json` | → **never commit** |
| Hardcoded test creds | admin/mobile source | → remove or gate behind `NODE_ENV=development` |
| `.env.production` on disk | anywhere | → delete from tree before first commit |

### 3.3 Post-scrub verification

- [ ] `git status` shows zero `.env` files staged  
- [ ] `rg` secret scan clean on tracked files  
- [ ] `.env.example` exists per app with **all** var names, zero real values  
- [ ] ליב sign-off comment on security issue (KN-022 or successor)  
- [ ] **Fresh clone test:** `git clone` → `npm install` → apps boot with `.env` from examples only (local XAMPP)

### 3.4 If history already contains secrets

- Prefer **new repo, orphan first commit** (no history import) over filter-branch unless founder explicitly wants history.
- Rotate every exposed credential before prod continues — treat as incident.

---

## 4. `.gitignore` policy

Single root `.gitignore`. Per-app additions only if tooling requires.

```gitignore
# Dependencies
node_modules/

# Environment & secrets
.env
.env.*
!.env.example

# Build & pack
dist-deploy/
dist/
build/
.next/
out/

# Expo / React Native
.expo/
.expo-shared/
web-build/
*.jks
*.keystore
*.p8
*.p12
*.mobileprovision
*.orig.*
android/app/build/
ios/Pods/
ios/build/

# Logs & OS
logs/
*.log
npm-debug.log*
.DS_Store
Thumbs.db

# IDE (optional — team preference)
.idea/
.vscode/settings.json

# Test / coverage
coverage/
.nyc_output/

# Local DB dumps
*.sql
!api/migrations/**/*.sql

# APK / binary releases (host on prod or releases, not git)
*.apk
*.aab
*.ipa

# Redis / Docker local data
dump.rdb
docker-data/
```

**Policy notes:**

- Commit **SQL migrations** under `api/migrations/`; ignore ad-hoc dumps.
- Ignore `*.sql` at root; allow only structured migration paths.
- If `package-lock.json` exists, **commit it** (reproducible Cloud installs).

---

## 5. `factory.json` registration (HQ — not applied until PIN)

Add under `repos` in `ops/config/factory.json`:

```json
"kidnest": {
  "github": "https://github.com/ZionAmar/KidNest",
  "private": true,
  "productionUrl": "https://nestube.aztodev.com",
  "localPath": "C:\\Users\\amazi\\Desktop\\Projects\\in_production\\kidnest",
  "stack": ["mysql", "node-fastify", "react", "expo"],
  "apps": ["api", "admin", "mobile", "tv", "tv-home"],
  "notes": "NesTube — filtered YouTube for kids. Monorepo. Cloud agents use GITHUB_REPO or key kidnest."
}
```

### Post-registration checklist

- [ ] Cursor GitHub App includes `ZionAmar/KidNest` (Settings → GitHub)  
- [ ] `resolveProductRepo("kidnest")` resolves in `hq/lib/cloud-work.mjs`  
- [ ] `cursorGithubRepoCount` updated after connect  
- [ ] Linear: eng follow-ups stay on audit board until **EMET-66** bet activates pipeline project  
- [ ] `ops/pipeline/kidnest/` — **defer** until Keep + venture/spec stages

---

## 6. Execution phases (after PIN — not now)

| Phase | Who | PIN | Deliverable |
|-------|-----|-----|-------------|
| **0 Pre-flight** | נדב (`34-pc-ops`) | read PC | Disk inventory, size, existing `.git?`, blockers |
| **1 Scrub** | ליב (`19-security-engineer`) | secrets | KN-022 sign-off, scrub report |
| **2 Create repo** | ציון / פז | new_product | Empty private `KidNest` on GitHub |
| **3 Initial push** | נדב + ליב | secrets | Orphan commit, no secrets |
| **4 HQ wiring** | קשת | — | `factory.json` PR on AZToDev-HQ |
| **5 Clone smoke** | רז or דפנה (Cloud) | productWorkEnabled | Fresh clone dev:api + dev:admin smoke (KN-010) |
| **6 Prod** | פז | prod_deploy | **Out of scope** — ChemiCloud stays as-is until explicit go-live gate |

**WIP note:** Current `state.json` WIP = inventory-deck. KidNest migration execution waits its turn (WIP=1) unless founder reprioritizes.

---

## 7. Linear (planning tickets — create when asked)

Do **not** auto-seed until founder confirms priority. Proposed issues on project **פיתוח מוצר — EMET** (or ops hygiene):

| Title | Owner | Blocked by |
|-------|-------|------------|
| `[KSH-XX · נדב] KidNest — PC disk inventory pre-migration` | 34-pc-ops | PIN |
| `[KSH-XX · ליב] KidNest — secrets scrub + KN-022 closeout` | 19-security-engineer | inventory |
| `[KSH-XX · פז] KidNest — create private GitHub repo` | 18-devops-platform | scrub sign-off |
| `[KSH-XX · קשת] KidNest — factory.json + Cursor App registration` | 32-delivery-lead | repo exists |
| `[KSH-XX · רז] KidNest — fresh-clone smoke (api+admin)` | 13-backend-engineer | factory.json merged |

Holding issue **EMET-66** stays until real bet: `ACTIVATE_PRODUCT: kidnest | NesTube prod healthy — Cloud-first dev on private GitHub`.

---

## 8. Risks & mitigations

| Risk | Age? | Mitigation |
|------|------|------------|
| Secrets in templates (KN-022) | Known | Orphan first commit; rotate all exposed keys |
| Expo apps fail on Cloud clone (KN-011) | Known | Document separate install; smoke before declaring Done |
| Deploy doc conflict (KN-019) | Known | Single `docs/DEPLOY-CHEMICLOUD.md` in product repo |
| WIP collision with Rakza | Active | Queue execution; planning is safe now |
| Prod regression during migration | — | **No ChemiCloud deploy** as part of GitHub migration |

---

## 9. Definition of Done (migration — future)

- [ ] Private `ZionAmar/KidNest` exists, scrubbed, no secrets in git  
- [ ] `factory.json` merged on HQ  
- [ ] Cursor GitHub App connected  
- [ ] Fresh Cloud clone: `dev:api` + `dev:admin` smoke pass (local `.env` from examples)  
- [ ] `docs/DEV-SETUP.md` + `docs/RUNBOOK.md` in product repo  
- [ ] Production unchanged and healthy (`/api/health`)  
- [ ] **Not required for migration Done:** EMET pipeline stages, prod redeploy, EAS rebuild

---

*Limit WIP. Demo > status fiction. This document is planning evidence only — no repo was created or pushed.*
