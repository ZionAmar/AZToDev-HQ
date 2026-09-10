# URGENT — AZToDev-HQ is public + repo-mixup correction (relay to ציון)

**From:** 32-delivery-lead (קשת) · **Date:** 2026-09-10T21:05Z · **Priority:** URGENT (security-adjacent)

## What ציון asked this turn
"יאללה אז תמשיכו בתהליך הפיתוח" (relayed by Noa). Live-verified current state before doing anything else — found a real problem that needs his eyes now, not just a "continue" signal.

## Say to ציון (Hebrew, plain)

1. **דחוף:** ריפו ה-HQ הפרטי שלנו (`AZToDev-HQ` — כל האסטרטגיה, ה-roster, ה-IP של ChemiCloud) **הפך לפאבליק בטעות** לפני כמה דקות (20:55Z), כנראה כתוצאה צידית מהפעולה על `aztodev-company-system`. **לא מצאתי סיסמאות/מפתחות ממשיים שדלפו** בהיסטוריית הגיט (נבדק) — אבל תוכן החברה הפנימי גלוי כרגע לכל מי שמחפש. מבקשת מנדב להחזיר לפרטי **מיד**. Cloud לא יכולה לתקן את זה בעצמה (אין הרשאת admin על שום ריפו אישי).
2. **תיקון לבלבול:** הריפו `aztodev-company-system` שנדב העלה **אינו** דף העוגה — הוא בפועל "מפת מערכת AZToDev" שדפנה בנתה עוד ב-9/9 (יוזמה נפרדת, בענף שלא מוזג ל-main). זה עדיין הריפו הנכון לבקשה שלך "תהפכו לפאבליק ותעשו דוקר" — רק שהוא לא קשור לעוגה. דף העוגה (RTL, מוכן ב-Cloud) עדיין מחכה לריפו משלו — לא נגעו בו.
3. **הפעלת תצוגה (Docker/Pages) נכשלה** — שורש בעיה אמיתי, לא תלונה כללית: GitHub Actions ניסה להפעיל Pages ונכשל כי Pages לא הופעל פעם אחת ב-Settings (טוגל שדורש הרשאת admin — רק לנדב). שלחתי לנדב הוראה מדויקת: להפעיל ב-Settings → Pages → Source: GitHub Actions, ואז להריץ שוב את ה-workflow.

## Evidence (live-verified this turn, not assumed)
- `gh api repos/ZionAmar/AZToDev-HQ` → `"private":false,"visibility":"public","updated_at":"2026-09-10T20:55:19Z"`
- `gh api repos/ZionAmar/aztodev-company-system` → public, README/commits confirm Dafna's map, not the cake page
- `gh api .../actions/runs/34526813041/jobs` → failed at step "Setup Pages"
- `git log --all --diff-filter=A` for `.env` → empty (no secret file ever committed)
- Linear: `EMET-166` opened with full write-up

## Files
- `agents/32-delivery-lead/outbox/2026-09-10_hq-public-exposure-and-repo-mixup-correction.md` (full deliverable)
- `agents/34-pc-ops/inbox/2026-09-10_pci-14-cake-recipe-repo-create.md` (corrected + urgent HQ ask appended)
- `ops/config/factory.json` (board corrected)

DELEGATE: 00-ceo | Relay the 3 points above to ציון now (URGENT type, not routine status) — HQ visibility revert is the top-priority ask. Do not let this wait behind a routine "continue development" reply.
