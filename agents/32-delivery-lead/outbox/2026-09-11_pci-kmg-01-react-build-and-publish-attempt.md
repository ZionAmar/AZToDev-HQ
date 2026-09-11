# PCI-KMG-01 — Kids math quiz (React) for founder ציון — built for real, publish delegated

**Bet:** kept · **Linear:** [EMET-167](https://linear.app/my-company1460/issue/EMET-167/pci-kmg-01-kids-math-quiz-react-for-founder-ציון) (new issue, same product project — no clone)
**Founder ask (verbatim):** «צרו לי משחק מתמטיקה קטן לילדים בריאקט ועשו הכל ותנו לי קישור בסוף לאתר»

This is the 4th time "PCI-KMG-01" reached me. The first three were relay artifacts referencing a
packet that never existed — I re-verified and correctly held each time (see the three prior
outbox files this same date). **This turn is different: it arrived with the actual founder ask and
concrete build/delegate instructions attached, so I built it for real instead of writing a 4th
disproof.**

## 1) Keep — plan

Small React quiz, no backend, static-hostable. Reused the exact visual/UX design already sitting
in this HQ repo as a quality bar (`products/kids-math-quiz/index.html`, a static-HTML version) and
reimplemented it as real React components + hooks, per the founder's explicit "בריאקט". Ages
~6–10, addition/subtraction/multiplication, 10 questions, score + per-operation breakdown +
personalized Hebrew insight text, mobile-first (2-column grid collapsing to 1 column under 360px).

## 2) DELEGATE: 14-frontend-engineer — done this run

Built with React 19 + Vite 8. Verified before handoff:
- `npm install` — 0 vulnerabilities
- `npm run build` — succeeded (`dist/index.html` + hashed JS/CSS bundles)
- `npm run lint` (oxlint) — 0 issues
- Served `dist/` locally, curled `/` and the JS bundle — both `200`, correct RTL markup, correct
  relative asset paths (`base: './'` in `vite.config.js`, works from any subpath)

Handoff: `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` (built output at bundle root
— what to publish — plus full source under `bundle/source/` for future edits) and
`agents/14-frontend-engineer/outbox/2026-09-11_kids-math-quiz-react-built.md`.

## 3) DELEGATE: 34-pc-ops — GITHUB_STATIC_PUBLISH (sent, not yet done)

Live-verified this run **why Cloud cannot do this step itself**, not assumed from precedent:

```
$ gh repo create ZionAmar/kids-math-quiz --public ...
GraphQL: Resource not accessible by integration (createRepository)
```

Same root cause as PCI-11/PCI-14 (already logged): Cloud's GitHub App token is scoped to
`AZToDev-HQ` only and cannot create repos or push under the founder's personal account.

Sent `agents/34-pc-ops/inbox/2026-09-11_pci-kmg-01-github-static-publish-kids-math-quiz.md`:
`REPO:ZionAmar/kids-math-quiz SOURCE:agents/14-frontend-engineer/outbox/kids-math-quiz-bundle
VISIBILITY:public`, create-if-missing, push built root files (not `source/`), enable Pages
(main/root), verify `curl -I https://zionamar.github.io/kids-math-quiz/` → `200`. Noted explicitly:
PC may be off — the same desk auto-push path that landed `cake-recipe-demo` live on
2026-09-11T06:12Z without Nadav's PC can pick this up too; if that desk token is missing, the
packet says to report it loudly, not sit silently waiting for a PC heartbeat.

**Not yet done. `https://zionamar.github.io/kids-math-quiz/` does not exist yet** (repo not
created). No live link to give the founder this turn — per the founder's own rule in this task
("קישור בסוף" / link only when it actually works), the Hebrew note below does not claim one.

## 4) Founder Hebrew note — held (no live URL yet, said honestly)

## WIP=1 — flagged, not hidden

Delivery-lead catchphrase applies to myself here: **this is now a 3rd concurrent open bet.**
- `hq-exposure-and-company-system-pages` (EMET-166) — still blocked on Nadav (Pages toggle)
- `cake-recipe-demo` (EMET-165) — live, awaiting QA from 20-qa-sdet
- `kids-math-quiz` (EMET-167, this one) — built, awaiting `34-pc-ops` publish

I did not wait to fix that before starting this one, because Noa dispatched this task directly
with the founder's own verbatim ask attached and explicit "deliver end-to-end" instructions — not
a self-initiated WIP-idle guess. Flagging the true count honestly rather than pretending WIP=1
holds when it doesn't.

## Hebrew handoff (for Noa → ציון)

בניתי בפועל את המשחק שביקשת — לא רק תכנון. משחק מתמטיקה בעברית (RTL), לגילאי 6–10, חיבור/חיסור/כפל,
10 שאלות, ניקוד ותובנה אישית בסוף. נבנה ב-**React אמיתי** (לא HTML סטטי) עם Vite, נבדק ועובד (build
+ lint + הרצה מקומית — הכל תקין).

**עדיין אין לינק חי** — כדי לפרסם צריך ליצור ריפו חדש בגיטהאב האישי שלך ולהדליק GitHub Pages, וזה
דורש הרשאה שלענן (Cloud) שלי אין (בדקתי בפועל — `403`, לא ניחוש). שלחתי את המשימה ל-34-pc-ops (נדב) —
זה יכול לרוץ גם דרך הדסק בלי שהמחשב שלך דלוק (כמו שקרה עם דף העוגה). אני אעדכן אותך עם הלינק האמיתי
ברגע שהוא באמת עובד (בדקתי, לא מניח).

---

LEARNING:
- do: When a repeatedly-relayed task finally arrives with the real founder ask attached (not just
  a "does this packet exist" check), check for an existing quality-bar asset already in the repo
  (`products/kids-math-quiz/`) before designing from scratch — cut the whole design phase by
  porting proven UX into real components, then verify with an actual `npm run build` + serve +
  curl before calling it done.
- dont: Don't hand off a publish step to the desk/PC without first proving *from Cloud* why Cloud
  itself can't do it (`gh repo create` → real 403 this run, not a "per prior precedent" assumption)
  — repeating a stale reason as fact would be exactly the theater this role exists to block.
- note: 4th relay of PCI-KMG-01 was the first one with real content — built the React app for
  real this turn (source + built bundle + outbox evidence for 14-frontend-engineer), created
  Linear EMET-167 on the existing Keshet product project (no clone), delegated publish to
  34-pc-ops with the exact `GITHUB_STATIC_PUBLISH` contract, and held the founder link honestly
  since Pages isn't live yet. WIP is honestly 3 concurrent bets now, not 1 — flagged in
  `ops/config/factory.json.pendingWork.kids-math-quiz.wipNote`, not hidden.

HANDOFF:
- done: Kept the bet + Linear issue (EMET-167). Built the real React/Vite app end to end (source +
  production build), verified it (install/build/lint/serve+curl all green). Wrote 14-frontend-
  engineer outbox evidence. Live-tested Cloud's own GitHub write access and got a real 403 (not
  assumed). Delegated the exact publish contract to 34-pc-ops. Updated
  `ops/config/factory.json.pendingWork.kids-math-quiz` so the next reader has full context without
  redoing this investigation.
- next: `34-pc-ops` (נדב, or the desk auto-push bridge) creates `ZionAmar/kids-math-quiz`, pushes
  the built bundle root, enables Pages, verifies `200`, writes outbox evidence. Then `32-delivery-
  lead` (next turn) confirms the live URL and only then hands the real Hebrew link note to Noa for
  the founder. `20-qa-sdet` still separately owes a QA pass on `cake-recipe-demo` (unrelated bet,
  unchanged this turn).
- files: `agents/32-delivery-lead/outbox/2026-09-11_pci-kmg-01-react-build-and-publish-attempt.md`
  (this file), `agents/14-frontend-engineer/outbox/kids-math-quiz-bundle/` (built app + source),
  `agents/14-frontend-engineer/outbox/2026-09-11_kids-math-quiz-react-built.md`,
  `agents/34-pc-ops/inbox/2026-09-11_pci-kmg-01-github-static-publish-kids-math-quiz.md`,
  `ops/config/factory.json` (`pendingWork.kids-math-quiz` added), Linear `EMET-167` (new issue).

DELEGATE: 34-pc-ops | Run `GITHUB_STATIC_PUBLISH` per
`agents/34-pc-ops/inbox/2026-09-11_pci-kmg-01-github-static-publish-kids-math-quiz.md` —
`REPO:ZionAmar/kids-math-quiz SOURCE:agents/14-frontend-engineer/outbox/kids-math-quiz-bundle
VISIBILITY:public`. PC may be off — desk GitHub write path is fine, same as cake-recipe-demo. Write
outbox evidence (URL + curl 200) or a loud specific blocker either way.
