# Linear — founder unblock (2 min)

**Problem:** OAuth connected in Cursor, but PM agent session has no Linear MCP tools loaded. `LINEAR_API_KEY` is commented out in `.env`. Issues were never published.

## Option A — API key (fastest, works from scripts)

1. Open **Linear** (app or web) → **Settings** → **Account** → **Security & access**
2. **Personal API keys** → **Create key**
   - Name: `EMET runtime`
   - Permissions: **Write** (or Admin if Write unavailable)
3. Copy key (`lin_api_...`)
4. Edit `my_company/.env` — uncomment and set:
   ```
   LINEAR_API_KEY=lin_api_YOUR_KEY_HERE
   ```
5. From company root run:
   ```
   node runtime/scripts/linear-publish.mjs
   ```
6. Open `ops/linear-issues.json` — all issue URLs listed there + appended to `ops/linear-setup.md`

## Option B — Cursor MCP only (no API key)

1. Cursor → **Settings** → **MCP** → **Linear** → ensure **Connected** (green)
2. If not connected: click Connect → login with same Linear account as phone app
3. **Re-open** PM agent chat (this session) — MCP tools must appear
4. Ask Yonatan to re-run publish

## Phone visibility (after publish)

1. Install **Linear** app (iOS/Android)
2. Login — **same account** as Cursor OAuth / API key
3. Filter: label `waiting-founder` → see CHOOSE gate
4. Team: **EMET**

## What gets published

All tasks in `ops/board.json`:
- **waiting_founder:** CHOOSE A|B|C (landing wedge)
- **today:** defer marks, gate docs, Linear publish, EOD digest
- **blocked:** conditional seeds (HOLD)
- **backlog:** bet template, constraints doc

## Scripts

| Script | Purpose |
|--------|---------|
| `runtime/scripts/linear-publish.mjs` | Publish board → Linear (needs API key) |
| `runtime/scripts/linear-setup-run.mjs` | One-shot via Cursor SDK + MCP (slow; use if MCP works) |

## Status (2026-09-07)

- Board cleaned: `ops/board.json`
- Publish script ready: `runtime/scripts/linear-publish.mjs`
- **Blocked on:** `LINEAR_API_KEY` in `.env` OR Linear MCP in agent session
- **No live URLs yet** until one of the above is done
