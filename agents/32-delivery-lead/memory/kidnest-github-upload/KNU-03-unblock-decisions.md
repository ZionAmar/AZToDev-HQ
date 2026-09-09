# KNU-03 — Unblock decisions (pre-approved by Keshet)

**Purpose:** If Nadav stalls on repo naming or `.gitignore`, use these decisions — **no founder round-trip** unless marked ESCALATE.

**Last monitor:** 2026-09-09 · Keshet

---

## Repo naming (FINAL)

| Question | Decision |
|----------|----------|
| Repo name | **`KidNest`** (PascalCase) |
| Owner | `ZionAmar` |
| Full URL | `https://github.com/ZionAmar/KidNest` |
| Visibility | **Private** |
| Default branch | **`main`** (not `master`) |
| Split into multiple repos? | **No** — monorepo v1 only |
| Alternative names (`kidnest`, `NesTube`, `Kidnest`)? | **No** — use `KidNest` only |
| Name already taken on GitHub? | **ESCALATE** to Noa → founder — do not pick `-2` suffix without approval |

Verified 2026-09-09: `ZionAmar/KidNest` does **not** exist yet.

---

## .gitignore (FINAL)

| Question | Decision |
|----------|----------|
| No `.gitignore` on disk | Create from KNU-01 template |
| `.gitignore` exists | **Merge** KNU-01 rules in — do not delete existing project rules |
| `.env` in repo root + per app | All `.env*` ignored except `.env.example` |
| `node_modules/` | Ignore everywhere (root + each app) |
| `dist-deploy/`, `build/`, `.expo/` | Ignore |
| `*.apk`, `*.aab` | Ignore |
| `brand/` with founder photos | Ignore if personal images; otherwise keep if already tracked |
| Accidentally staged `.env` | **Abort push** → fix gitignore → unstage → recommit |

Template: `agents/32-delivery-lead/memory/kidnest-github-upload/KNU-01-repo-plan.md` § .gitignore

---

## Git state edge cases

| Situation | Decision |
|-----------|----------|
| No `.git` folder | `git init -b main` → add remote → push |
| `.git` exists, no remote | Add `origin` → push |
| `.git` exists, wrong remote | `git remote set-url origin https://github.com/ZionAmar/KidNest.git` — keep history |
| `.git` exists, dirty working tree | Commit or stash first — report delta in KNU-04 |
| Remote repo has commits | **Do not force-push** — ESCALATE |
| `gh` not authenticated | Block — founder must `gh auth login` |

---

## Do NOT reopen

- **KNU-02** scan — closed. Execute-time delta only in KNU-04 evidence.

---

## Evidence path (KNU-04)

After successful push, save output to:

```
C:\Users\amazi\Desktop\Projects\in_production\kidnest\.emet\KNU-04-verify.txt
```

And drop summary to `agents/34-pc-ops/outbox/` when PC worker runs.
