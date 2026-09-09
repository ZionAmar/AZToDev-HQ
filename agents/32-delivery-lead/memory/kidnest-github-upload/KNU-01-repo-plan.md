# KNU-01 — KidNest GitHub repo plan

**Initiative:** IDEA-kidnest-github-upload  
**Owner:** Keshet (`32-delivery-lead`)  
**Status:** Done (plan-only)

---

## Target

| Field | Value |
|-------|-------|
| GitHub owner | `ZionAmar` |
| Repo name | `KidNest` |
| Visibility | **Private** |
| Default branch | `main` |
| URL | `https://github.com/ZionAmar/KidNest` |

**Decision:** Single monorepo v1. Do **not** split `api`, `admin`, `mobile`, `tv`, `tv-home` into separate repos.

---

## Source (PC)

```
C:\Users\amazi\Desktop\Projects\in_production\kidnest
```

Production reference: `https://nestube.aztodev.com` (ChemiCloud — out of scope for this upload).

---

## Monorepo layout (expected)

```
kidnest/
├── package.json          # root scripts (dev:api, dev:admin, pack:deploy, …)
├── api/                  # Node/Express API
├── admin/                # React admin (parents)
├── mobile/               # Expo — child app
├── tv/                   # Expo — NesTV
├── tv-home/              # Expo — TV home shell
├── docs/                 # if present
└── README.md
```

**Install note (from KN-002 audit):** `npm install` at root **plus** separate `npm install` in `mobile/`, `tv/`, `tv-home/` — not full npm workspaces for those three.

---

## .gitignore (minimum — Nadav merges with existing)

```gitignore
# dependencies
node_modules/
.pnp/
.pnp.js

# env & secrets — NEVER commit
.env
.env.*
!.env.example
*.pem
*.key
*.nopass

# build outputs
dist/
dist-deploy/
build/
.expo/
.expo-shared/
web-build/
*.apk
*.aab
*.ipa

# logs & OS
*.log
npm-debug.log*
.DS_Store
Thumbs.db

# IDE (optional — keep if team uses)
.idea/
.vscode/
*.swp

# local DB dumps
*.sql.gz
dump/
```

If `.gitignore` already exists on disk, **merge** — do not delete project-specific rules.

---

## Must NOT enter git

| Pattern | Why |
|---------|-----|
| `.env`, `.env.local`, `.env.production` | JWT, DB passwords, API keys |
| `node_modules/` | size + reproducible via lockfiles |
| `dist-deploy/`, production APKs | build artifacts |
| ChemiCloud SSH keys, `.pem` | security |
| `brand/` founder photos if any | privacy |

**Pre-push gate:** run `git ls-files | findstr /i "\.env node_modules \.pem \.key"` — must return empty.

---

## Recommended first commit message

```
chore: initial KidNest monorepo import

Private import from local PC. No secrets. ChemiCloud deploy unchanged.
```

---

## Post-upload (out of scope for KNU-03)

- Add repo to `ops/config/factory.json` → `repos.kidnest`
- Register in Cursor GitHub App (founder action)
- Cloud agents use repo only after `productWorkEnabled` + PIN

---

## References

- Audit board: `ops/intake/kidnest-audit-board.json`
- Dev setup notes: `ops/reports/tasks/2026-09-07_KN-002.md`
- Upload board: `ops/intake/kidnest-github-upload-board.json`
