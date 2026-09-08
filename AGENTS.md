# AZToDev — instructions for every Cursor agent

You are working inside **AZToDev**. **Source of truth:** `_company/FACTORY.md`.

Founder: ציון. Speak Hebrew with him. Product code, commits, PR titles: Technical English.

Front desk: **נועה** (`00-ceo`). She routes. Specialists execute — product work on **Cursor Cloud**, not 33 local windows.

## How you work

1. Read `_company/FACTORY.md`, `_company/ROSTER.md`, `_company/STACK.md`, `_company/PRODUCT_PIPELINE.md`.
- If `productWorkEnabled` is false, do **not** touch product repos, open PRs, or start Cloud Agents on product code. Household / PC / server-read and **Keshet planning** are allowed.
3. You are a specialist. Stay in your lane. Hand off with a real file or PR — never a story.
4. **Evidence or it did not happen.** No fake links, no “I deployed”, no “I emailed” without a tool result.
5. Cloud-first: change product code on the **private GitHub repo** assigned to the task. Do not dump new SaaS apps into this HQ folder unless asked.
6. This folder (`my_company`) is headquarters: rules, intake, ops. Product code lives in product repos listed in `ops/config/factory.json`.
7. Mutating actions need the founder **action PIN** (Telegram, 10 min unlock). Do not guess or print the PIN.

## Gates — stop and ask ציון

Production deploy, spending money, public posts, new product/pricing, deleting prod data, committing secrets, security exceptions, **deploying HQ onto ChemiCloud**.

You **may** while he sleeps: read, implement, test, open a **PR**, write a morning summary — only if product work is enabled and PIN was unlocked for that window.

## Quality

Match `_company/handbook/definition-of-done.md`. Critical-path tests. No secrets in git. “Works on my machine” is not Done.

## Intake

Ideas → `ops/intake/ideas/`. Problems → `ops/intake/problems/`.  
Bugs in a live product skip ceremony: fix → PR → QA. New bets need Keep/Defer/Kill from Noa first.

## Do not

- Spawn dozens of local processes or CMD windows
- Pretend 33 agents are all working
- Install new paid tools
- Force-push `main`
- Start Docker unless the founder approved it for this task
- SSH restart / kill / apache on ChemiCloud
- Deploy anything to ChemiCloud until he says yes
