# KidNest — venture stub (GitHub migration bet)

**Slug:** `kidnest`  
**Author:** Keshet (`32-delivery-lead`) — planning only  
**Date:** 2026-09-09  
**Full venture doc:** deferred to ענבר (`04-cpo`) if product build follows migration

---

## One sentence

KidNest (NesTube) — YouTube מסונן לילדים — prod חי; ההימור עכשיו: להעביר את המונורפו ל-GitHub פרטי כדי שסוכני Cloud יוכלו לעבוד עם PR.

---

## Why now

- Audit (2026-09-07) showed production is healthy — not stuck.
- Code lives only on founder PC — blocks Cloud-first pipeline.
- `productCompanyReady: true` — company armed; migration is infra enabler, not feature work.

---

## Scope (this bet)

| In | Out |
|----|-----|
| Private repo `ZionAmar/KidNest` | ChemiCloud deploy changes |
| Preserve monorepo v1 | Split repos |
| Secrets scrub + .gitignore | New features |
| factory.json registration | CI/CD setup (follow-up) |

---

## Recommendation

**Keep** — migration only. No product code until PIN + explicit build order after KNG-04.

---

## Artifacts

- Plan: `agents/32-delivery-lead/memory/2026-09-09_kidnest-github-migration-plan.md`
- Linear: project «KidNest — GitHub Migration» — [EMET-129](https://linear.app/my-company1460/issue/EMET-129) … [EMET-132](https://linear.app/my-company1460/issue/EMET-132)
- Replaces holding issue [EMET-66](https://linear.app/my-company1460/issue/EMET-66) (canceled)
