# Outbox — Shana Tova founder ask (2026-09-11 ~12:30Z)

## Founder ask
«מה עם האתר של השנה טובה שביקשתי»

## Live verification (this run)
- `https://zionamar.github.io/shana-tova/` → **404** (not built)
- `https://zionamar.github.io/kids-math-quiz/` → **200**, serves `index-ZmMTvbPf.js` (Q10 fix live)
- Prerequisite EMET-167: **closed** per 20-qa-sdet + 32-delivery-lead (thread evidence)

## Decision
**Keep** — same shape as cake-recipe-demo. Prerequisite met. Founder asking directly again after math closed.

Gate: no explicit «יאללה»/«תבנו» + PIN for *this* bet in ledger yet. Ask once; delegate Keshet to open bet + plan in parallel so build starts the moment PIN lands.

## Telegram reply (founder-facing)

**[תשובה לטלגרם — לציון]**

לא — **עדיין לא בנינו את דף «שנה טובה». אין קישור חי.**

**מה כן:**
• הבקשה **רשומה אצלי** — עמוד אחד, תמונות מתגלגלות, ברכה חמה בעברית, למטה רק **EaseToDev**.
• **משחק המתמטיקה סגור** — שאלה 10 עובדת, מסך סיום תקין:
https://zionamar.github.io/kids-math-quiz/

**מה חסר:**
• דף הברכה **עדיין לא קיים** — בדקתי עכשיו, אין אתר.

**מה עכשיו:**
מפעילים את **קשת** לבנות ולפרסם — כמו דף העוגה. כדי להתחיל בפועל, שלח **«יאללה» + PIN** בטלגרם.

---

## Routing
DELEGATE: 32-delivery-lead | Open Shana Tova one-pager bet (EMET-167 closed). Linear ticket + cake-style pipeline: 14-frontend-engineer build RTL carousel page → 18-devops-platform desk GitHub Pages publish → 20-qa-sdet live QA → live URL to founder. Intake: ops/intake/ideas/IDEA-2026-09-11-shana-tova-greeting-page.md. Hold engineer mutations until founder PIN for this bet unless PIN window already open.

## HANDOFF
- done: Live-verified Shana Tova 404 + math quiz fixed bundle; honest founder reply; kickoff delegated
- next: Keshet opens bet, engineers build after PIN
- files: ops/intake/ideas/IDEA-2026-09-11-shana-tova-greeting-page.md, agents/00-ceo/outbox/2026-09-11_shana-tova-founder-ask-kickoff.md

## LEARNING
- do: When math prerequisite closes and founder re-asks Shana Tova — curl 404 first, confirm EMET-167 done, delegate Keshet + ask PIN once
- dont: Say «בתור» without naming that nothing is built yet and math is now unblocked
- note: Founder Shana Tova ask 12:30Z; live 404; quiz serves index-ZmMTvbPf.js; EMET-167 closed in thread
