# PCI-07/08/09 — GitHub relevance review (real run, not a placeholder)

**Runs:** `agents/32-delivery-lead/inbox/2026-09-09_pci-07-09-github-relevance-review.md` + `2026-09-09_pci-07-09-confirm-your-team-plan.md`
**Owner:** 32-delivery-lead (קשת)
**Executed:** 2026-09-09T18:00Z, this Cloud session, using `gh repo list ZionAmar` (read-only, no mutations)
**Board:** `ops/intake/pc-production-inventory-board.json`, phase P4 — same bet, no new Linear project.

## PCI-07b — team plan (answering the addendum)

No other roster agent needed. The full inventory + classification below was produced solely from `gh repo list ZionAmar --json name,visibility,pushedAt,description,isFork,primaryLanguage,diskUsage` plus each repo's own description/name signal — this does not require `11-tech-lead`, `12-software-architect`, or `20-qa-sdet` input. If the founder later wants a deeper look inside any specific repo's code (not just metadata), that would need a named roster agent per repo and is out of scope here.

No step below opens a PR or touches product code, so this does not cross the `תבנו`/PIN gate.

## Repo count reconciliation (18 vs 49) — partially resolved, not fully closed

- **18 repos** is confirmed **three times now** (13:38Z, 15:33Z, and this run at 18:00Z) via `gh repo list ZionAmar` under the Cursor GitHub App token this Cloud session uses. This is a **real, repeatable, live count** — not a snapshot artifact.
- That token **cannot see** `kidnest`, `Work_clock`, or `TelemustAddUsers` — three private repos `ops/config/factory.json` claims exist. Either those repos don't actually exist under `ZionAmar` yet, or they exist but this Cloud session's GitHub App installation was never granted access to them (most likely, since `kidnest`'s own upload was separately found to not exist live — see `priorWork.liveVerification` in `factory.json`).
- **49 has no known source in this session.** It does not match any `gh` call this Cloud session can make. It should be treated as unverified until someone logged in as the actual `ZionAmar` GitHub account (not the scoped Cloud App) confirms a real total — e.g. via the GitHub website repositories tab, or Nadav's PC session running `gh repo list ZionAmar --limit 200` while authenticated as the real account.
- **This report only covers the 18 repos visible to this session.** It is not a claim that ZionAmar has exactly 18 repos total.

**Recommendation:** keep this open as a small follow-up — `34-pc-ops` (Nadav, PC online now) checks the real GitHub repositories page logged in as the actual account and reports back the true total + whether `kidnest` / `Work_clock` / `TelemustAddUsers` are really there. Read-only, no PIN needed.

## PCI-07 — Full inventory (18 repos, live `gh` data)

| # | Repo | Visibility | Fork? | Language | Last push | Description |
|---|------|-----------|-------|----------|-----------|--------------|
| 1 | AZToDev-HQ | Private | No | JavaScript | 2026-09-09 | AZToDev headquarters — private. Cloud desk for Noa, Ruth, Tamir. |
| 2 | FiTime | Public | No | JavaScript | 2026-09-08 | Smart booking system for Pilates studios with an intelligent waitlist — final project, practical software engineering. |
| 3 | ZionAmar-workclock-expo-app | Public | No | JavaScript | 2026-07-15 | (no description) |
| 4 | expo-app | Public | No | JavaScript | 2026-06-26 | (no description) |
| 5 | chrome-test | Public | No | JavaScript | 2026-02-22 | (no description) |
| 6 | todo | Public | No | JavaScript | 2026-01-09 | (no description) |
| 7 | ci-test | Public | No | JavaScript | 2025-12-02 | (no description) |
| 8 | ci-pipeline-test | Public | No | JavaScript | 2025-12-02 | (no description) |
| 9 | costumes_store | Public | No | JavaScript | 2025-07-25 | Client-side online costume store, final project (React). |
| 10 | mytrip_flutter_app | Public | No | Dart | 2025-07-25 | Trip planner app, final project (Flutter). |
| 11 | my_tasks_app | Public | No | EJS | 2025-07-24 | Multi-user task manager, final project (Node.js SSR). |
| 12 | SmartIrrigation | Public | No | JavaScript | 2025-03-09 | IoT smart irrigation system, final project (IoT + Node.js). |
| 13 | FinalProjectNodeJS | Public | No | — | 2025-02-27 | Blood-pressure tracking web app, multi-user. |
| 14 | Arduino-game | Public | No | C++ | 2024-08-09 | תחרות הלוחץ הזריז (Arduino reaction-time game). |
| 15 | news | Public | No | JavaScript | 2024-02-20 | אפליקציה להצגת מבזקי חדשות בלייב (live news ticker app). |
| 16 | coffee_and_cake_App_DB | Public | No | JavaScript | 2023-12-23 | אפליקציית תיעוד קניית קפה ומאפה (coffee/pastry purchase tracker). |
| 17 | E.2.E-Project | Public | **Yes (fork)** | JavaScript | 2023-08-29 | Running Man Duck Game (HTML/CSS/JS/ino) — course exercise fork. |
| 18 | NewsAPI | Public | **Yes (fork)** | Python | 2023-02-16 | News API wrapper, no API key needed — utility fork. |

## PCI-08 — Relevance classification

**Keep — active/relevant**
- **AZToDev-HQ** — this is the live company repo, pushed today. Obviously keep.

**Keep — portfolio/learning value** (final-project quality, worth staying visible even though not "live" products)
- **FiTime** — most complete/recent final project, has a real product story (Pilates booking + waitlist).
- **costumes_store** — final React project, clear description.
- **mytrip_flutter_app** — final Flutter project, clear description.
- **my_tasks_app** — final Node.js SSR project, clear description.
- **SmartIrrigation** — final IoT project, clear description.
- **FinalProjectNodeJS** — real multi-user web app, clear description.

**Review — needs ציון's own call** (real content, but unclear ongoing relevance or possible overlap with named private projects)
- **ZionAmar-workclock-expo-app** — no description, but the name strongly suggests overlap with the private `Work_clock` repo already tracked in `ops/config/factory.json`. Worth confirming whether this public repo is an old/duplicate version before deciding.
- **Arduino-game**, **news**, **coffee_and_cake_App_DB** — small hobby apps with real (Hebrew) descriptions, not obviously final-project-grade but not obviously dead either. `news` in particular has a similar theme to the household news-briefing work already live in this HQ — worth a quick look before writing it off.

**Candidate to archive/delete** (no description, generic scaffold/test naming, or a fork with no visible independent value)
- **expo-app** — generic name, empty description, looks like a scaffold duplicate of the workclock expo app.
- **chrome-test**, **ci-test**, **ci-pipeline-test**, **todo** — names read as scratch/CI test repos, empty descriptions, small size.
- **E.2.E-Project** (fork) — course exercise fork, no independent commits visible from metadata alone.
- **NewsAPI** (fork) — utility wrapper fork, no independent product value visible from metadata alone.

**Hard constraint respected:** nothing above was archived, deleted, made private/public, or transferred. This is a recommendation only, for ציון to Keep/Review/Archive per repo.

## Handoff to 00-ceo (PCI-09)

Ready for the founder-facing summary: 6 clear Keep (portfolio) + 1 Keep (HQ) + 4 Review + 6 Archive-candidates, out of 18 repos visible to this Cloud session. Repo-count reconciliation (18 vs 49) still needs Nadav's real-account check before a final total goes to ציון as fact.
