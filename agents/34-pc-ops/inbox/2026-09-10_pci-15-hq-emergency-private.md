# PCI-15 — EMERGENCY: AZToDev-HQ public → private

**Priority:** SEV1 — company HQ must not stay public  
**Gate:** Founder must send **«אשר» + PIN** before execute (visibility mutation)  
**PC:** Nadav ONLINE (heartbeat 2026-09-10T21:05Z)

## Problem

During today's visibility batch, `ZionAmar/AZToDev-HQ` was flipped to **PUBLIC** by mistake. Live Cloud check 2026-09-10T21:06Z: `isPrivate=false`, `visibility=PUBLIC`. No secrets in repo per prior audit — but HQ content must stay private.

## Execute (one repo, verify after)

1. On PC with personal ZionAmar `gh` session:  
   `gh repo edit ZionAmar/AZToDev-HQ --visibility private --accept-visibility-change-consequences`
2. Verify: `gh repo view ZionAmar/AZToDev-HQ --json isPrivate,visibility` → private=true
3. Write outbox with before/after table + timestamp

## Do NOT

- Touch other repos in this task — HQ only
- Proceed without founder «אשר» + PIN in Telegram thread

## After HQ is private (separate — PCI-14)

Create `ZionAmar/cake-recipe-demo`, push Dafna's static RTL bundle, enable GitHub Pages — only after Keshet/Noa confirms PCI-14 GO.
