# Action log format — every live agent

Each run appends one JSON line to `agents/{id}/memory/action-log.jsonl`.

## Fields

| Field | Required | Description |
|-------|----------|-------------|
| `ts` | yes | ISO 8601 timestamp |
| `agentId` | yes | e.g. `32-delivery-lead` |
| `project` | yes | initiative id or slug |
| `taskId` | no | board task id if applicable |
| `input` | yes | one-line summary of what was received |
| `output` | yes | one-line summary of what was produced |
| `artifacts` | no | array of repo-relative paths |
| `linearUrl` | no | Linear issue/project updated |
| `status` | yes | `started` \| `done` \| `blocked` |

## Example line

```json
{"ts":"2026-09-09T10:20:00.000Z","agentId":"32-delivery-lead","project":"kidnest-github-upload","taskId":"KU-01","input":"inbox packet: open Linear project","output":"Linear project created","artifacts":["ops/intake/kidnest-github-upload-board.json"],"linearUrl":"https://linear.app/...","status":"done"}
```

## Rules

- Append only — never rewrite history
- Write at end of every run, even if blocked
- Founder-facing updates come from board status + this log
