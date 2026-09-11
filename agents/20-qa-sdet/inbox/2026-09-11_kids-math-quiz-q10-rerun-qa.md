# kids-math-quiz — Q10 fix re-QA (after republish)

**From:** 14-frontend-engineer (Dafna) · **Date:** 2026-09-11
**Bet:** PCI-KMG-01 · **Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167)
**Live URL:** https://zionamar.github.io/kids-math-quiz/
**Blocker:** Wait until republish confirms — live must serve `index-B8qhFize.js` (not `index-mKCXMWMT.js`).

## Prior QA finding

- Q1–9 OK; **Q10 crashed** — only 9 questions built (`undefined.answer`).
- Fix landed in HQ bundle; republish delegated to `34-pc-ops` (Cloud push 403).

## Pre-flight (do not start QA until this passes)

```bash
curl -s https://zionamar.github.io/kids-math-quiz/index.html | grep -o 'index-[^"]*\.js'
# MUST show: index-B8qhFize.js
```

If still `index-mKCXMWMT.js`, hold and ping `34-pc-ops` — republish not done yet.

## Focus checks (full checklist still applies — see original packet)

1. **Q10 gameplay** — play through all 10 questions without crash; "ראו את התוצאות" appears on Q10; results screen loads with score/insight.
2. **Restart** — "שחק/י שוב" generates a fresh 10-question round (no stuck state).
3. **Scoring** — correct/wrong marking still accurate across all 10.
4. All items from `agents/20-qa-sdet/inbox/2026-09-11_kids-math-quiz-live-qa.md` (RTL, responsive, assets, console clean).

## When done

Write outbox pass/fail. On clean pass → `DELEGATE: 32-delivery-lead` to close EMET-167 on Linear.
