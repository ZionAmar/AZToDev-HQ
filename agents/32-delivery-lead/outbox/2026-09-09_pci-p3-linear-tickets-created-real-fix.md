# PCI-P3 Linear tickets (PCI-04/05/06) — actually created this turn, not another "blocked" note

**Refers to:** Noa's direct challenge this turn — "אבל ביקשתי ממך כמה פעמים לעשות משהו מסויים ולא עשית באמת"
(you were asked several times to do a specific thing and never actually did it).

## What that "specific thing" was

`agents/32-delivery-lead/inbox/2026-09-09_pci-p3-linear-update-tehillim-tehora.md` — add real Linear
tickets for PCI-04/05/06 to the existing `pc-production-inventory` project, no new project. Every prior
turn on this board (`2026-09-09_pci-p3-linear-tickets-blocked-no-tool.md`, and the LEARNING blocks in
`memory/learning-log.md` at +9/+10/+11/+13) answered the same way: "no Linear write tool this Cloud
session" (checked only via `GetDynamicTools` → `cursor-subscriptions` only has
`subscribe_linear_issue`/`subscribe_linear_comment`), then `DELEGATE: 00-ceo` and stopped. Noa is right —
that ran five+ turns without the actual ticket ever landing.

## The real bug: I never checked for a raw API key, only the MCP tool list

This turn: `env | grep -i linear` → `LINEAR_API_KEY` **is injected into this Cloud session**
(`ops/config/factory.json` → `CLOUD_AGENT_INJECTED_SECRET_NAMES` includes it). No MCP write tool
existing doesn't mean no way to write — Linear's GraphQL API takes that key directly. Verified live:

- `POST https://api.linear.app/graphql` with `{ viewer { id name email } }` → real response (`zion`).
- Looked up `EMET-155` (an existing PCI-01 ticket) to get the real `teamId` (`EMET`,
  `fced5adc-3d17-442d-9c75-3c3989049895`) and `projectId` (`pc-production-inventory`,
  `b62835dd-2283-4a6a-a0cb-98f58c33a215`) — same project, no clone.
- Ran `issueCreate` three times, one per task, `stateId` = `Todo` (team's `unstarted` state), same
  team + project as PCI-01/02/03:

| Task | Linear issue | URL |
|---|---|---|
| PCI-04 (locate תהילים/תהורה, read-only) | **EMET-162** | https://linear.app/my-company1460/issue/EMET-162 |
| PCI-05 (private repo + push — תהילים) | **EMET-163** | https://linear.app/my-company1460/issue/EMET-163 |
| PCI-06 (private repo + push — תהורה) | **EMET-164** | https://linear.app/my-company1460/issue/EMET-164 |

Re-fetched all three by id after creation to confirm they're real (not invented numbers): correct
titles, correct project (`PC — סריקת in_production`), state `Todo`. No fake links.

## Board updated

`ops/intake/pc-production-inventory-board.json` — PCI-04/05/06 now carry real `linearIssue`/`linearUrl`
(were `null`). Nothing else on the board changed: PCI-04 still `queued` (Nadav, PC offline), PCI-05/06
still `blocked` on PCI-04 + `founder_pin` — only the ticket-bookkeeping gap is closed, not the actual
locate/create-repo work, which still needs Nadav online and ציון's PIN.

## Answer for Noa → ציון (short Hebrew, for Telegram)

צדקת — זה רץ חמישה תורות בלי שבאמת נעשה. הבעיה שלי הייתה שבדקתי רק אם יש לי כלי MCP לליניאר ולא בדקתי אם
יש לי מפתח API ישיר. יש (`LINEAR_API_KEY` מוזרק לריצה). פתחתי עכשיו בפועל את שלושת הטיקטים החסרים
(EMET-162/163/164) על הפרויקט הקיים, בדקתי חזרה שהם אמיתיים, ועדכנתי את הלוח. שום דבר אחר לא השתנה —
PCI-04 עדיין מחכה לנדב (מחשב כבוי), PCI-05/06 עדיין חסומים על PCI-04 + פין שלך.

LEARNING:
- do: When a write task is repeatedly reported "blocked, no tool," check for a raw injected API-key
  secret (`env | grep -i <service>`) before accepting the MCP tool list as the only path — this
  company's `factory.json` lists real injected secrets (`LINEAR_API_KEY` among them) that six prior
  turns never checked.
- dont: Repeat the same "no tool, DELEGATE: 00-ceo" note across multiple turns as if re-stating a
  blocker were equivalent to resolving it — a genuinely-open item needs a fresh capability check each
  time it resurfaces, not just a restatement.
- note: Created EMET-162/163/164 for real via direct Linear GraphQL API call (verified live, re-fetched
  after creation), updated `ops/intake/pc-production-inventory-board.json` with real linearIssue/linearUrl
  for PCI-04/05/06. This closes the one item that had genuinely never been done across six turns; every
  other open item (Nadav offline, founder PIN, founder Keep/Review/Archive decision) is unchanged and
  correctly still open.
