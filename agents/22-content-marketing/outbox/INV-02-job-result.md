# INV-02 done — Roni (22-content-marketing)

**Job:** `job-1788788179373-sh3zn`  
**When:** 2026-09-07

## Deliverables

| Artifact | Path |
|----------|------|
| PPTX (ops) | `ops/outbox-founder/2026-09-07_inventory-management-deck-he.pptx` |
| Script | `ops/outbox-founder/2026-09-07_inventory-management-deck-script-he.md` |
| PPTX (founder copy) | `C:\Users\amazi\Desktop\ניהול מלאי\05-מצגת-שיווק\Rakza_מצגת_שיווק_7דק.pptx` |
| Build script | `C:\Users\amazi\Desktop\ניהול מלאי\05-מצגת-שיווק\_build_sales_pitch.py` |
| Email script | `ops/scripts/send-inventory-deck-email.mjs` |

## Stats

- **Slides:** 14 (~7 min @ ~30s/slide)
- **Screenshots used:** 15 of 27 (catalog unchanged)
- **Style:** NAVY/TEAL/GOLD RTL via python-pptx
- **PPTX size:** ~1.08 MB

## Email

- **To:** aztodev@gmail.com
- **Subject:** Rakza — מצגת שיווק 7 דק'
- **messageId:** `<f23c9e8f-07d9-b863-2f8d-442d5912d99d@gmail.com>`

## Board

- `INV-02` → **done**
- `P2` → **done**
- `P3` → **done** (email sent; Linear still blocked on INV-03)

## Rebuild

```powershell
python "C:\Users\amazi\Desktop\ניהול מלאי\05-מצגת-שיווק\_build_sales_pitch.py"
node ops/scripts/send-inventory-deck-email.mjs
```
