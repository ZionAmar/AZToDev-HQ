# KidNest GitHub upload — repo plan (KNU-01)

> **Initiative:** `kidnest-github-upload` · **Board:** `ops/intake/kidnest-github-upload-board.json`  
> **PC path:** `C:\Users\amazi\Desktop\Projects\in_production\kidnest`  
> **Target:** private `ZionAmar/KidNest` · **Mode:** plan-only until PIN on KNU-03/KNU-04

## Decision

**Monorepo v1** — single repo, five apps under one root. Do not split until a second product bet requires it.

## Proposed tree

```
KidNest/
├── README.md                 # product overview + local dev entry
├── .gitignore                # node_modules, .env, dist, .expo, uploads
├── .env.example              # documented vars per app (no values)
├── package.json              # optional workspace root (npm/pnpm workspaces)
├── api/                      # Fastify backend (port 3000)
├── admin/                    # React admin (Vite)
├── mobile/                   # Expo / React Native
├── tv/                       # TV app shell
├── tv-home/                  # TV home rails
└── docs/
    └── dev-setup.md          # from KN-002 audit artifact if present
```

## .gitignore (minimum)

```
node_modules/
.env
.env.*
!.env.example
dist/
build/
.expo/
*.log
uploads/
.DS_Store
Thumbs.db
```

## Secrets policy

- Never commit `.env`, APK signing keys, DB passwords, YouTube API keys.
- Use `.env.example` with placeholder names only.
- ChemiCloud prod credentials stay on server — not in repo.

## Branch strategy

- `main` — protected; initial push from PC after KNU-03.
- Feature work later: `cursor/<slug>-00aa` (Cloud Agents).

## Next steps (board)

| Task | Owner | Gate |
|------|-------|------|
| KNU-02 PC scan | Nadav (`34-pc-ops`) | after this plan |
| KNU-03 create repo | Paz (`18-devops-platform`) | **PIN** |
| KNU-04 push | Paz (`18-devops-platform`) | **PIN** |

## Evidence

This file satisfies KNU-01 DoD. Update board task → `done` after Keshet confirms.
