# KidNest → Private GitHub — Migration Plan (plan-only)

**Author:** Keshet (`32-delivery-lead`)  
**Date:** 2026-09-09  
**Status:** Planning — no repo create/push until founder PIN + `productWorkEnabled`  
**Source PC path:** `C:\Users\amazi\Desktop\Projects\in_production\kidnest`  
**Production:** https://nestube.aztodev.com  
**Target repo:** `https://github.com/ZionAmar/KidNest` (private, to be created)

---

## One-line bet

Move KidNest monorepo from founder PC to private GitHub so Cloud agents can work on it with evidence (PR), without ChemiCloud or local CMD theater.

---

## Decision: preserve monorepo (v1)

Do **not** split into multiple repos in v1. KidNest is a working monorepo with cross-app imports (mobile ↔ tv-home ↔ tv). Splitting adds migration risk with no immediate leverage.

| App | Stack | Notes |
|-----|-------|-------|
| `api/` | Node + Fastify | Backend, MySQL, JWT, YouTube feeds |
| `admin/` | React | Parent dashboard |
| `mobile/` | Expo / RN | Child app — **not** in root workspaces |
| `tv/` | Expo / RN | TV app — standalone install |
| `tv-home/` | Expo / RN | TV home shell — cross-app imports to `tv/` |

Root `package.json` uses npm workspaces for `api` + `admin` only. `mobile`, `tv`, `tv-home` require separate `npm install` (documented in KN-002 audit).

---

## Target repo structure

```
KidNest/                          # repo root (= current monorepo root)
├── README.md                     # project overview + quick start pointer
├── .gitignore                    # unified — see policy below
├── .env.example                  # all env keys, no values
├── package.json                  # workspaces: api, admin
├── package-lock.json
│
├── api/                          # Fastify backend
│   ├── src/
│   ├── migrations/
│   ├── seeds/
│   └── .env.example
│
├── admin/                        # React admin (parent UI)
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── .env.example
│
├── mobile/                       # Expo — standalone node_modules
│   ├── app/
│   └── .env.example
│
├── tv/                           # Expo TV — standalone
│   └── .env.example
│
├── tv-home/                      # Expo TV home — imports from tv/
│   └── .env.example
│
├── docs/                         # deploy runbooks (from audit KN-019/KN-024)
│   ├── DEPLOY-CHEMICLOUD.md
│   ├── local-dev.md              # distilled from KN-002 dev-setup
│   └── STATUS.md                 # prod health snapshot
│
├── scripts/                      # pack:deploy, db helpers (if present locally)
└── dist-deploy/                  # gitignored — build output only
```

**Do not commit:** `node_modules/`, `.env`, `dist-deploy/`, Expo `.expo/`, Android/iOS build artifacts, XAMPP data, Redis dumps, APK/IPA binaries (link from releases or ChemiCloud instead).

---

## `.gitignore` policy (minimum)

```gitignore
# secrets & local env
.env
.env.*
!.env.example

# dependencies & builds
node_modules/
dist/
dist-deploy/
build/
.expo/
.expo-shared/

# OS / IDE
.DS_Store
Thumbs.db
.idea/
.vscode/
*.log

# mobile native (regenerated)
mobile/android/
mobile/ios/
tv/android/
tv/ios/
tv-home/android/
tv-home/ios/

# uploads / runtime data
uploads/
tmp/
*.sql.gz
```

Audit locally before first push: `git grep -iE '(password|secret|api_key|lin_api|jwt|smtp)' -- ':!*.example' ':!docs/*'`.

---

## Secrets scrub checklist (Nadav — KNG-02)

| Check | Action |
|-------|--------|
| Root `.env` | Never commit; copy keys to `.env.example` with empty values |
| `api/.env`, `admin/.env`, app `.env` | Same |
| Hardcoded credentials in source | Search + replace with env vars |
| YouTube / Google OAuth JSON | Keep on server/PC only; document var names in `.env.example` |
| JWT secret, SMTP pass | Rotate if ever committed to local git history |
| `CHEMICLOUD.md` / deploy docs | Redact host/user if pasted inline |
| Git history | If secrets were ever committed locally, run `git filter-repo` **before** push or start fresh repo with clean tree |

**Gate:** KNG-03 (create repo) and KNG-04 (push) require founder PIN.

---

## `factory.json` registration (after repo exists)

Add under `repos`:

```json
"kidnest": {
  "github": "https://github.com/ZionAmar/KidNest",
  "private": true,
  "notes": "NesTube / KidNest monorepo — api + admin + mobile + tv + tv-home. Cloud agents after productWorkEnabled."
}
```

Set `activeWork` / WIP slot only when founder orders build and PIN unlocks product work.

---

## Linear phases (published)

| ID | Phase | Owner | Gate | Linear |
|----|-------|-------|------|--------|
| KNG-01 | Repo structure plan | `32-delivery-lead` | None — this doc | [EMET-129](https://linear.app/my-company1460/issue/EMET-129) |
| KNG-02 | PC prep — inventory + secrets scrub | `34-pc-ops` (Nadav) | PC on | [EMET-130](https://linear.app/my-company1460/issue/EMET-130) |
| KNG-03 | Create private GitHub repo | `32-delivery-lead` + founder | PIN | [EMET-131](https://linear.app/my-company1460/issue/EMET-131) |
| KNG-04 | Initial push + verify clean tree | `34-pc-ops` + `32-delivery-lead` | PIN | [EMET-132](https://linear.app/my-company1460/issue/EMET-132) |

**Project:** [KidNest — GitHub Migration](https://linear.app/my-company1460/project/kidnest-github-migration-c64b279d4f80)  
**Replaces:** generic holding issue [EMET-66](https://linear.app/my-company1460/issue/EMET-66) (canceled).

---

## Risks

| Risk | Mitigation |
|------|------------|
| Secrets in history | Scrub checklist + grep before push; consider orphan branch |
| Large binary/APK in tree | `.gitignore` + move to release assets |
| Expo apps break without separate install | Document in README; CI later (post-migration) |
| WIP collision | WIP=1 — KidNest GitHub is the active bet until done or deferred |

---

## Out of scope (this initiative)

- ChemiCloud deploy changes (פז / DevOps gate)
- Splitting monorepo
- Enabling GitHub Actions CI (follow-up after first push)
- Product feature work

---

## Evidence

- This file: `agents/32-delivery-lead/memory/2026-09-09_kidnest-github-migration-plan.md`
- Board: `ops/intake/kidnest-github-board.json`
- Manifest: `ops/linear-kidnest-github-issues.json`
- Venture stub: `ops/pipeline/kidnest/01-venture.md`
