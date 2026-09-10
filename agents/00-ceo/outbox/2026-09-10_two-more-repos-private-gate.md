# Founder ask — 2 more GitHub repos → private (gate)

**At:** 2026-09-10T08:16Z  
**Founder:** «גם את final project nodejs וגם את workclock expo app תהפכו לפרטיים»

## Understood

| Friendly name | GitHub repo | Live visibility (Cloud) |
|---------------|-------------|-------------------------|
| Final Project NodeJS | `ZionAmar/FinalProjectNodeJS` | PUBLIC |
| Workclock Expo App | `ZionAmar/ZionAmar-workclock-expo-app` | PUBLIC |

## Method

Same as PCI-11 (7-repo flip): Cloud cannot mutate (403 — GitHub App scoped to AZToDev-HQ). Nadav on PC with personal ZionAmar login runs `gh repo edit --visibility private`, one repo at a time, verify after each.

## Gate

Mutating account change → founder must send **«אשר» + PIN** in Telegram before delegate runs.

## Artifacts prepared (pre-PIN)

- Board task PCI-12 added to `ops/intake/pc-production-inventory-board.json`
- Inbox packet: `agents/34-pc-ops/inbox/2026-09-10_pci-12-two-repos-private.md`

## Founder Telegram reply (sent this turn)

Confirmed 2 repos, both still public, method via Nadav after PIN. Asked for «אשר» + PIN.

## Pending

- Founder approval + PIN → DELEGATE: 34-pc-ops | PCI-12 execute visibility private for FinalProjectNodeJS + ZionAmar-workclock-expo-app; outbox with per-repo table

LEARNING:
- do: Treat each new repo-visibility batch as its own PCI task + inbox packet; gate on fresh PIN even when prior batch (PCI-11) used same method
- dont: DELEGate Nadav before founder sends אשר+PIN for this specific ask
- note: Founder asked for 2 more repos private; live both PUBLIC; PCI-12 queued blocked on PIN
