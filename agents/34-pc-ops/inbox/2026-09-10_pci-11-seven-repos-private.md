# PCI-11 — הפיכת 7 ריפואים מציבורי לפרטי

**Board:** `ops/intake/pc-production-inventory-board.json` (PCI-11)
**סוג:** שינוי נראות בגיטהאב — דורש PIN (כבר התקבל מאת ציון, 2026-09-10)
**דחיפות:** P0 — ציון ביקש לנסות שוב; כל 7 עדיין ציבוריים (אומת מ-Cloud, 2026-09-10T07:55Z)

## למה דווקא נדב (PC)

Cloud Agent מחובר ל-GitHub App של Cursor עם הרשאה לריפו **אחד בלבד** (AZToDev-HQ).
ניסיון PATCH על `ZionAmar/expo-app` מ-Cloud → **403 Resource not accessible by integration**.
השינוי חייב להתבצע מחיבור אישי של חשבון ZionAmar — דפדפן או `gh` על המחשב של ציון.

## רשימת ריפואים (7)

| # | Repo | מצב נוכחי (Cloud, 07:55Z) |
|---|------|---------------------------|
| 1 | expo-app | PUBLIC |
| 2 | chrome-test | PUBLIC |
| 3 | todo | PUBLIC |
| 4 | ci-test | PUBLIC |
| 5 | ci-pipeline-test | PUBLIC |
| 6 | news | PUBLIC |
| 7 | coffee_and_cake_App_DB | PUBLIC |

## הוראות ביצוע

1. ודא ש-`gh auth status` מראה חשבון **ZionAmar** (לא Cursor App).
2. **ריפו אחד בכל פעם.** אחרי כל שינוי — אמת לפני שעוברים לבא:
   ```powershell
   gh api repos/ZionAmar/<REPO> --jq ".name + \" private=\" + (.private|tostring)"
   ```
   או: Settings → General → Danger Zone → Change visibility → Make private.
3. אם ריפו נכשל — רשום שגיאה מדויקת, המשך לשאר, אל תעצור את כל הריצה.
4. **אל תמחק, אל תארכב, אל תשנה שום דבר מלבד visibility.**

### פקודה מומלצת (אם gh מחובר כ-ZionAmar)

```powershell
gh api -X PATCH repos/ZionAmar/expo-app -f visibility=private
```

חזור על זה לכל ריפו ברשימה.

## פורמט תשובה (חובה)

כתוב `agents/34-pc-ops/outbox/2026-09-10_pci-11-seven-repos-private.md` עם:

- טבלה: שם ריפו | הצליח/נכשל | private=true/false אחרי | הערת שגיאה (אם יש)
- סיכום בעברית (3–5 משפטים) שנועה תעביר לציון בטלגרם
- `gh auth status` שורה אחת (איזה חשבון בשימוש)

**Playbook:** Evidence or it did not happen. בלי outbox — נועה לא יכולה לדווח לציון.

## תזכורת

- PIN כבר אושר — אין צורך לבקש שוב.
- PC heartbeat: ONLINE (2026-09-10T07:55Z).
- ניסיון קודם (2026-09-09/10) לא השאיר outbox — לכן ציון רואה "לא שינינו כלום".
