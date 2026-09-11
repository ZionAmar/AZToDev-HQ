# Shana Tova page — intake + queue (founder ask)

**Date:** 2026-09-11T09:10Z  
**Founder:** ציון עמר  
**Ask:** After kids-math-quiz fix ships — build a Shana Tova one-pager (auto carousel, Hebrew blessing, EaseToDev footer only).

## Live runtime (verified this turn)

| Who | Status | Cloud link |
|-----|--------|------------|
| 20-qa-sdet (Uri) | RUNNING — re-run live QA on kids-math-quiz after republish | https://cursor.com/agents/bc-57d3a539-086f-416f-a660-8cb092d9dcc9 |

`curl -sI https://zionamar.github.io/kids-math-quiz/` → **200** (last-modified 2026-09-11T08:20:39Z — republished bundle live).

## Noa decision

**Keep** — static RTL one-pager, same delivery pattern as cake-recipe-demo.

## Queued (WIP=1)

Shana Tova bet enters queue **after** EMET-167 QA pass. Intake: `ops/intake/ideas/IDEA-2026-09-11-shana-tova-greeting-page.md`.

## Founder gates still needed before build

- Explicit «יאללה» / «תבנו» on this new bet (founder gave spec + sequencing, not yet a build GO)
- Action PIN (new product scope beyond prior cake/math unlock)

## Plan communicated (Hebrew)

1. **עכשיו:** אורי סוגרת QA על המשחק (שאלה 10 + מסך סיום).
2. **אחרי QA:** קשת פותחת טיקט Linear אחד → דפנה בונה דף ברכה → פרסום לינק חי (בלי מחשב).
3. **תוכן:** גלריה מתגלגלת, ברכת שנה טובה (בריאות, הצלחה), חתימת EaseToDev בלבד.

## Telegram reply

See polished Hebrew block in this run (not repeated here).

LEARNING:
- do: On «after X do Y» product asks — Keep intake + queue in pendingWork while WIP=1 finishes; name live QA owner + Cloud link
- dont: Start Keshet build same turn while 20-qa-sdet still holds WIP on the prerequisite bet
- note: Founder Shana Tova page queued after math QA; intake IDEA-2026-09-11-shana-tova written

HANDOFF:
- done: Intake Keep + pendingWork queue + founder Hebrew reply drafted
- next: After EMET-167 QA pass — Keshet opens Linear bet, founder PIN, frontend → devops publish
- files: ops/intake/ideas/IDEA-2026-09-11-shana-tova-greeting-page.md, ops/config/factory.json (pendingWork.shana-tova-greeting)

DELEGATE: 32-delivery-lead | When EMET-167 QA passes and founder sends «יאללה»+PIN: kick off Shana Tova one-page bet per IDEA-2026-09-11-shana-tova-greeting-page.md — Linear single project, 14-frontend-engineer build, 18-devops-platform Pages publish, 20-qa-sdet live QA
