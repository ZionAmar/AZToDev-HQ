# Work packet — 2026-09-09

## Task
Scan the KidNest project folder on the founder PC and produce an upload inventory.

## Path
`C:\Users\amazi\Desktop\Projects\in_production\kidnest`

## Output
Write to: `agents/34-pc-ops/outbox/kidnest-folder-inventory.md`

Include:
- Top-level folders and approximate sizes
- Obvious exclusions (node_modules, .env, build artifacts, large binaries)
- Recommended .gitignore entries
- Estimated total size if uploaded as-is vs cleaned

## Board
Update task `KU-03` in `ops/intake/kidnest-github-upload-board.json` when done.

## On completion
- Append to `agents/34-pc-ops/memory/action-log.jsonl`
- LEARNING block in run output
