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

### 2026-09-09 (later)
- task: PCI-07/08/09 (full GitHub relevance review) sat in inbox since 15:34Z with the founder escalating twice about "no answer from Keshet" — two prior visible Telegram turns claimed contact was made but never emitted a real DELEGATE, so nothing ran against this packet.
- do: When an inbox packet is this well-specified (read-only, metadata-only, no PR/product code), just execute it directly with the tools already available (`gh repo list` — no PIN needed) instead of waiting for another round-trip. Answer the PCI-07b team-plan question honestly: solo execution from `gh` metadata needs no other roster agent.
- dont: Let a founder escalation about "why hasn't Keshet answered" go through a third empty-promise cycle — if the work is answerable with tools on hand, answer it in this same turn with a real outbox artifact, not another "will check."
- note: Wrote `agents/32-delivery-lead/outbox/2026-09-09_pci-07-08-github-relevance-review.md` — 18-repo inventory + Keep/Review/Archive-candidate classification + honest 18-vs-49 count reconciliation (partially resolved, PCI-10 opened to 34-pc-ops for the rest). No mutation performed on any repo.

LEARNING:
- do: If a queued inbox packet only needs read-only tools this session already has, execute it now and write the outbox artifact in the same turn rather than promising to "check with" the owner.
- dont: Leave a well-specified, non-blocked inbox packet untouched through repeated founder escalations about silence.
- note: Closed PCI-07/07b/08 for real this turn with a dated outbox file; PCI-09 (founder report) handed to 00-ceo; PCI-10 (real repo-count reconciliation) opened to 34-pc-ops as a non-blocking follow-up.

