# Work packet — 2026-09-09 (KNU-02 ONLY)

## STOP — do not repeat setup

Stake and folder location are **already confirmed**. Do **not** send another "location confirmed" message.
Execute the scan below and write the output file. That is the only deliverable.

## Task (KNU-02)

Scan the KidNest project folder on the founder PC.

**Path:** `C:\Users\amazi\Desktop\Projects\in_production\kidnest`

## Output (required)

Write to: `agents/34-pc-ops/outbox/kidnest-folder-inventory.md`

Include:
- Top-level folders and approximate sizes
- Whether `.git` exists, remotes, branch
- Obvious exclusions (node_modules, .env, build artifacts, large binaries)
- Recommended .gitignore additions beyond the plan
- Estimated total size: as-is vs cleaned for upload
- Blockers for push (if any)

## Board

When done, update task `KNU-02` in `ops/intake/kidnest-github-upload-board.json`:
- status → `done`
- artifact → path above
- completedAt → ISO timestamp

## On completion

- Append one line to `agents/34-pc-ops/memory/action-log.jsonl`
- Notify via outbox — no duplicate stake confirmations

## Linear

Issue EMET-144 — mark done when inventory file exists.
