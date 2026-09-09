# KidNest — venture brief (GitHub migration bet)

> **Stage:** plan only · **Owner:** ענבר (04-cpo) → קשת tracks · **WIP=1**  
> **Status:** Keep (founder audit complete 2026-09-07) · execution blocked until PIN  
> **Artifact folder:** `ops/pipeline/kidnest/`

---

## One-line bet

**Migrate KidNest (NesTube) from founder PC-only to private GitHub `ZionAmar/KidNest` — preserve monorepo, scrub secrets, enable Cloud Agents without touching prod.**

---

## Problem

KidNest runs in production (`https://nestube.aztodev.com`) but source of truth lives only on the founder PC (`C:\Users\amazi\Desktop\Projects\in_production\kidnest`). Cloud specialists cannot open PRs, QA cannot trace regressions to commits, and WIP=1 product work has no repo home.

## Users

| User | Need |
|------|------|
| ציון (founder) | One private repo, no prod breakage, no secrets leaked |
| Cloud engineers | Clone + PR workflow on Cursor Cloud |
| נדב (PC ops) | Scripted handoff from local disk to GitHub |

## Unique value (why now)

- Production audit **PASS** (2026-09-07): landing, admin, `/app`, `/tv`, player API — live and documented in `ops/intake/kidnest-audit-board.json`.
- Known P0 to fix later (not migration blockers): `GET /home → 500 pinChannelSql`; next/prev advance partial in headless.
- Factory is **armed** (`productCompanyReady: true`); migration unblocks the first real product PR when `productWorkEnabled` + PIN open.

## Scope — v1 migration (this bet)

| In | Out |
|----|-----|
| Private repo `ZionAmar/KidNest` | Prod deploy / ChemiCloud changes |
| Monorepo as-is (server + web + mobile workspaces) | Splitting into multiple repos |
| Secrets scrub + `.gitignore` hardening | Rewriting architecture |
| `factory.json` registration (`kidnest` key) | New features or refactors |
| Initial push from PC via נדב | Docker on founder PC |

## Competitors / alternatives

| Option | Verdict |
|--------|---------|
| Keep PC-only | **Kill** — blocks Cloud pipeline |
| ChemiCloud git | **Kill** — customer sites only, not HQ |
| Public GitHub | **Kill** — children's product + prod credentials history |
| Private GitHub (chosen) | **Keep** |

## Phases (Linear)

| ID | Phase | Owner | Gate |
|----|-------|-------|------|
| KNG-01 | Repo plan — structure, secrets checklist, `.gitignore`, `factory.json` draft | קשת | — |
| KNG-02 | PC prep — path verify, git auth, hygiene scan | נדב | PC on |
| KNG-03 | Founder gate — approve migration plan | ציון | `waiting-founder` |
| KNG-04 | Create repo + initial push | קשת + נדב | **PIN** |

Full pipeline (spec → DB → API → UI → QA) **after** repo exists — see KSH-01..12 on Linear when build activates.

## Repo plan (draft)

```
ZionAmar/KidNest/          # private
├── server/                  # Node API (ChemiCloud prod today)
├── client/                  # React admin + /app + /tv web
├── mobile/                  # Expo apps (mobile, tv, tv-home)
├── packages/                # shared workspace packages (if present)
├── docs/                    # deploy runbooks (scrub env examples)
├── .gitignore               # node_modules, dist, .env*, *.pem, uploads/
└── README.md                # install/run matrix (no secrets)
```

**factory.json** target entry:

```json
"kidnest": {
  "github": "https://github.com/ZionAmar/KidNest",
  "private": true,
  "notes": "NesTube — filtered YouTube for kids. Prod: nestube.aztodev.com"
}
```

## Secrets scrub checklist (pre-push)

- [ ] No `.env`, `.env.production`, `.env.local` in tree
- [ ] No JWT secrets, DB passwords, SMTP creds, Google/YouTube API keys in code or docs
- [ ] Replace live values in examples with `__REDACTED__`
- [ ] Verify `git log` / history if repo was ever initialized locally with secrets → `git filter-repo` if needed
- [ ] ChemiCloud `.env` stays on server only

## Valuation / effort (rough)

| Item | Estimate |
|------|----------|
| Plan + Linear | ~half day (done in plan mode) |
| PC prep + push | ~1 session (נדב, PC on) |
| First Cloud PR (post-migration) | separate bet |

Not a new product — **infra unlock** for existing revenue-adjacent asset.

## Recommendation

**Keep** — migrate to private GitHub before any feature work. WIP=1; no parallel bets.

## Next pipeline owners (after migration)

1. **ענבר** — finalize venture (this doc) → **ציון** gate  
2. **יונה** — spec refresh from prod reality  
3. **קרן** — customer review  
4. Engineers on bench until `ACTIVATE_PRODUCT: kidnest | …` + PIN

---

*Updated: 2026-09-09 · קשת · plan-only*
