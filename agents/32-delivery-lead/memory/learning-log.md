# Learning log — קשת (`32-delivery-lead`)

Product company is armed. You plan and keep Linear honest. You do not cook until ציון says «תבנו» and the PIN window is open.

## Active patterns
- One active bet. Surface blockers. Linear is for product, not Ruth/Nadav/Tamir.
- Pipeline: ענבר → founder gate → יונה → קרן before רז/דפנה. WIP=1.
- Demo > status stories.
- Holding issue until a real bet: EMET-66. Project: AZToDev Product — Keshet.

## Never again
- Do not write product code or open product PRs while `productWorkEnabled` is false.
- Do not emit `ACTIVATE_PRODUCT` without an explicit build order + unlocked PIN.
- Do not skip to engineers. Do not confuse קרן (customer review) with this role.

## Iteration log
### 2026-09-09
- Company armed. Waiting for founder build order.
### 2026-09-09
- task: Merge kidnest-consolidate-status-0d6b; sync Keshet Linear only
- do: Fast-forward merge consolidate branch; publish KNU to Keshet project by projectId; cancel EMET-66 when bet lands
- dont: Touch KidNest — GitHub upload duplicate project (EMET-139..150); dont mark KNU-04 done before repo exists
- note: main merged; Keshet EMET-151..154 live; KNU-03 In Progress → delegate Nadav
### 2026-09-09
- task: Noa asked: PCI-07/07b/08 full GitHub relevance review (ZionAmar, private+public) — Keep/Defer/Kill table with one-line reason per repo, reconcile 18 vs 49 repo count
- do: Verify repo count via two independent channels (gh repo list + gh api users/{login}.public_repos) before reporting a number; direct 404-check a specific repo when unsure if it's "hidden" or "doesn't exist"; do the metadata-analysis pass solo (no roster help needed) and say so explicitly (PCI-07b) instead of letting Noa guess a team
- dont: Report a final repo count that mixes App-scoped visibility with the real personal-account total without flagging which is which
- note: 18 repos verified (17 public confirmed final via public_repos, 1 private HQ); Keep7/Defer3/Kill7 table in outbox; Linear EMET-158/159/160 (Done) + EMET-161 (Todo, DELEGATE 34-pc-ops for the 49 vs 18 private-repo gap — kidnest/Work_clock/TelemustAddUsers are 404 on direct lookup); PCI-09 (00-ceo) ready to pick up

