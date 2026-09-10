# Founder Q — האם שינויי ריפו רק דרך נדב, לא דרך גיטהאב?

**Date:** 2026-09-10T10:44Z  
**Founder:** ציון עמר  
**Type:** INFO (no action, no PIN)

## Question

«האם כל השינויים של הריפו את מצליחה לעשות רק דרך נדב? דרך הגיטה בעצמו אתם לא מצליחים?»

## Answer (for Telegram)

כן — **שינוי נראות (פרטי/ציבורי) עובר רק דרך החשבון האישי שלך בגיטהאב**, לא דרך הענן של החברה.

**חשוב להבהיר:** השינוי **כן קורה בגיטהאב** (הגדרות הפרויקט). לא נוגעים בקבצים במחשב.

**למה נדב?** נדב על המחשב שלך משתמש בחיבור האישי שלך לגיטהאב — אותו חיבור שאתה מחובר איתו בדפדפן.

**מה הענן יכול?** לקרוא ולבדוק מצב (פרטי/ציבורי). **לא** לשנות — גיטהאב חוסם את זה מהחיבור של Cursor (מוגבל למשרד החברה בלבד).

**אפשרות נוספת:** אתה יכול לשנות בעצמך ישירות ב-github.com → Settings → Change visibility — בלי נדב.

אין פעולה פתוחה עכשיו. אם תרצה לשנות משהו — כתוב מה ואעביר.

## Evidence (prior runs)

- Cloud PATCH on founder repos → 403/404 (App scoped to AZToDev-HQ only)
- `agents/00-ceo/outbox/2026-09-10_why-pc-for-github-visibility.md`
- `agents/00-ceo/outbox/2026-09-10_expo-app-public-visibility-test.md`

LEARNING:
- do: On "only through Nadav?" — yes for mutations; clarify change IS on GitHub settings; Cloud read-only; founder self-service option
- dont: Say changes happen on PC disk or imply Cloud can flip visibility on personal repos
- note: Founder INFO question after busy visibility day; no delegate needed
