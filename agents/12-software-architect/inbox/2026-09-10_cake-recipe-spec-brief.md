# Brief — cake-recipe-demo (הוגה) spec

**From:** 32-delivery-lead (קשת) · **To:** 12-software-architect (יונה) · **Date:** 2026-09-10
**Linear:** [EMET-165](https://linear.app/my-company1460/issue/EMET-165/activated-cake-recipe-demo-הוגה-keshet-planning-done-handoff-to) (activated) · [EMET-115](https://linear.app/my-company1460/issue/EMET-115/ksh-03-יונה-architect-spec-screens-use-cases-erd-tree) (your stage, moved to Todo)
**Gate status:** `productWorkEnabled=true` for this bet (founder תבנו+PIN already received — see `ops/config/factory.json.productWorkEnabledNote`). You are cleared to spec/build.

## הבקשה המקורית (verbatim, Noa → Keshet → you)

> "עצרו לי דף אינטרנט, שיש בו מתכון להכנת הוגה עם תמונות וטקסט מיושר לעברית, יפה, מעוצב יפה, תמציאו, תביאו איזה הוגה מהאינטרנט איזה משהו, תעלו אותו לגיטאב, תפעילו אותו, תעשו לו דוקר, תעשו לו כל מה שצריך, תנו לי לינק שבסוף אני נכנס ואני רואה"

## מה כבר סוכם עם ציון (אל תסתור, כבר נמסר לו בטלגרם)

- זה דמו קל — **בלי** DB, בלי backend, בלי מובייל, אלא אם תמצא סיבה אמיתית (אם כן — סמן ל-Keshet לפני שממשיכים).
- צוות בנייה: אתה (ארכיטקטורה/מבנה) → בועז (עיצוב) + דפנה (frontend) → פז (Docker + לינק) → אורי (QA).
- נדב **לא** נדרש — התוכן נולד ב-Cloud, לא על הדיסק האישי.

## הצעת קשת למתכון (לאישור/שינוי שלך, לא נעולה)

**עוגת שוקולד קלאסית** ("עוגת שוקולד עשירה") — מתכון עממי, מותאם/מנוסח מחדש מהאינטרנט (לא העתקה מדויקת, בגלל זכויות יוצרים), עברית, `dir="rtl"`.

## דרישות עמוד

- עמוד סטטי אחד, HTML/CSS (+JS קליל אם צריך) — רמת עיצוב כמו `products/kids-math-quiz/index.html` (קיים בריפו הזה — תקן איכות אמיתי, לא תיאורטי).
- Hero image, רשימת מרכיבים, שלבים ממוספרים עם תמונות (אמיתיות/stock חינמי — לא ליצור תמונות מזויפות), RTL תקין בכל האלמנטים, מובייל-פרנדלי.

## תוכנית ריפו/הרצה (סקיצת קשת — אשר/שנה)

- ריפו GitHub **פרטי חדש** (למשל `ZionAmar/cake-recipe-demo`), נוצר ונדחף **ישירות מ-Cursor Cloud**.
- `Dockerfile` (nginx:alpine מגיש קבצים סטטיים) + `docker-compose.yml`.
- לינק חי: **GitHub Pages** על הריפו החדש — לא ChemiCloud, לא שער prod_deploy.

## הפלט שלך (per `_company/PRODUCT_PIPELINE.md`, מוקטן לדמו בלי DB)

- `ops/pipeline/cake-recipe-demo/02-spec.md` — אפיון קצר
- `ops/pipeline/cake-recipe-demo/03-screens.md` — מסך אחד, מטרה, שדות/מצבים (מינימלי)
- DELEGATE לבועז + דפנה כשמוכן; Keshet ממשיכה לעקוב ב-WIP=1.

## אל תשכח

- כתוב outbox אמיתי + LEARNING block בסוף, כמו כל סוכן ב-HQ הזה.
- אם אתה חושב שכן צריך DB/backend/מובייל — עצור ותסמן ל-Keshet לפני שממשיכה, אל תוסיף scope בשקט.
