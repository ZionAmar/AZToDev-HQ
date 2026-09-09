# PCI-07/07b/08 — סקירת כל הריפואים ב-GitHub תחת ZionAmar (פרטי+ציבורי)

**מאת:** קשת (`32-delivery-lead`) · **לוח:** `ops/intake/pc-production-inventory-board.json` (P4) · **תאריך:** 2026-09-09
**עבור:** 00-ceo (נועה) → ציון · **Linear:** פרויקט "PC — סריקת in_production" (אותו פרויקט, לא לוח/פרויקט חדש)

**Linear (אותו פרויקט, Done):**
- [EMET-158](https://linear.app/my-company1460/issue/EMET-158/pci-07b-אישור-תוכנית-צוות-קשת-מבצע-לבד-בלי-צוות) — PCI-07b
- [EMET-159](https://linear.app/my-company1460/issue/EMET-159/pci-07-מיפוי-מלא-18-ריפואים-מאומתים-תחת-zionamar-יישוב-חלקי-פער-1849) — PCI-07
- [EMET-160](https://linear.app/my-company1460/issue/EMET-160/pci-08-סיווג-keepdeferkill-לכל-ריפו-נימוק-שורה-אחת) — PCI-08
- [EMET-161](https://linear.app/my-company1460/issue/EMET-161/pci-07c-נדב-לפתוח-githubcomzionamar-אישית-ולאשר-קיום-kidnestwork) — PCI-07c (Todo, DELEGATE לנדב)

---

## PCI-07b — תוכנית צוות (למה בלי צוות)

זו עבודת ניתוח מטא-דאטה: `gh repo list` + `gh api repos/...` + שיפוט רלוונטיות לפי שם/תיאור/תאריך push. אין כאן קוד, אין PR, אין ארכיטקטורה. **בצעתי לבד** — לא נדרש `11-tech-lead` / `12-software-architect` / `20-qa-sdet` ואף אחד אחר מהרוסטר. אם ציון ירצה בפועל לארכב/למחוק/לשנות נראות ריפו — זו מוטציה שדורשת PIN + אישור שלו לכל ריפו בנפרד (לא build work, לא פותח שער `productWorkEnabled`).

## איך נספרו הריפואים (יישוב הפער 18 מול 49)

| מקור | שיטה | תוצאה |
|---|---|---|
| `gh repo list ZionAmar` (טוקן Cursor GitHub App, הריצה הזו) | live, 2026-09-09 | **18** ריפואים (17 ציבורי + 1 פרטי) |
| `gh api users/ZionAmar` שדה `public_repos` | live, 2026-09-09 | **17** ציבוריים — תואם בדיוק את ה-17 שראיתי, כלומר ה-App **לא מפספס אף ריפו ציבורי** |
| `ops/config/factory.json.cursorGithubRepoCount` | לא מאומת, לא מלווה שיטה | 49 — **עדיין לא מיושב** |
| בדיקת נקודתית: `gh api repos/ZionAmar/kidnest`, `.../Work_clock`, `.../TelemustAddUsers` | live, 2026-09-09 | **404 בשלושתם** — לא נראה שהם קיימים בכלל תחת השם הזה, לא רק "מוסתרים מה-App" |

**מסקנה:** ה-17 ציבוריים הם מספר סופי ומאומת (`public_repos`=17 מגיע מ-GitHub עצמו, לא מה-App המוגבל). הפער האמיתי הוא רק בצד **הפרטי**: ראינו ריפו פרטי אחד (`AZToDev-HQ`), אבל `factory.json` מצפה גם ל-`kidnest`, `Work_clock`, `TelemustAddUsers` (וגם מתייג את `FiTime` כפרטי — בפועל הוא **ציבורי**, ראו טבלה למטה). 49 מול 18 לא מוסבר על ידי הרשאות App בלבד — פער כזה גדול דורש בדיקה מהחשבון האישי המלא.

**DELEGATE: 34-pc-ops | לפתוח github.com/ZionAmar?tab=repositories מחובר אישית (לא Cursor App), לצלם/להעתיק את הרשימה המלאה כולל ריפואים פרטיים, ולאשר בפרט אם `kidnest` / `Work_clock` / `TelemustAddUsers` קיימים בפועל. אל תדווחו לציון מספר סופי (49 או אחר) עד שהרשימה הזו חוזרת.**

עד אז: הטבלה למטה מכסה את **18 הריפואים המאומתים** בלבד. זה לא "כל הריפואים תחת ZionAmar" במלואם — זה כל מה שגלוי כרגע דרך ערוץ אחד מאומת (App), פלוס אישור עצמאי של הספירה הציבורית.

---

## PCI-07 — מיפוי מלא (18 ריפואים מאומתים)

| # | שם | נראות | שפה | גודל | Push אחרון | תיאור |
|---|-----|--------|-----|------|-----------|--------|
| 1 | AZToDev-HQ | Private | JavaScript | 9.6MB | 2026-09-09 | HQ פרטי — דלפק Cloud לנועה/רות/תמיר |
| 2 | FiTime | Public | JavaScript | 10.6MB | 2026-09-08 | הזמנות סטודיו Pilates + רשימת המתנה חכמה, פרויקט גמר |
| 3 | ZionAmar-workclock-expo-app | Public | JavaScript | 0.3MB | 2026-07-15 | אין תיאור |
| 4 | expo-app | Public | JavaScript | 1.9MB | 2026-06-26 | אין תיאור |
| 5 | chrome-test | Public | JavaScript | 0.1MB | 2026-02-22 | אין תיאור |
| 6 | todo | Public | JavaScript | 0.1MB | 2026-01-09 | אין תיאור |
| 7 | ci-test | Public | JavaScript | 0.04MB | 2025-12-02 | אין תיאור |
| 8 | ci-pipeline-test | Public | JavaScript | 0.04MB | 2025-12-02 | אין תיאור |
| 9 | costumes_store | Public | JavaScript | 1.1MB | 2025-07-25 | חנות תחפושות — פרויקט גמר, React |
| 10 | mytrip_flutter_app | Public | Dart | 1.1MB | 2025-07-25 | מתכנן טיולים — פרויקט גמר, Flutter |
| 11 | my_tasks_app | Public | EJS | 0.04MB | 2025-07-24 | ניהול משימות רב-משתמשי — פרויקט גמר Node.js SSR |
| 12 | SmartIrrigation | Public | JavaScript | 0.02MB | 2025-03-09 | השקיה חכמה מבוססת חיישנים — פרויקט גמר IoT |
| 13 | FinalProjectNodeJS | Public | (לא מזוהה) | 0.07MB | 2025-02-27 | מעקב לחץ דם לכמה משתמשים |
| 14 | Arduino-game | Public | C++ | 0.02MB | 2024-08-09 | "תחרות הלוחץ הזריז" — משחק Arduino |
| 15 | news | Public | JavaScript | 0.9MB | 2024-02-20 | אפליקציית מבזקי חדשות בלייב |
| 16 | coffee_and_cake_App_DB | Public | JavaScript | 0.03MB | 2023-12-23 | תיעוד קניית קפה ומאפה |
| 17 | E.2.E-Project | Public | JavaScript | 1.0MB | 2023-08-29 | **Fork** — משחק ברווז (HTML/CSS/JS/ino) |
| 18 | NewsAPI | Public | Python | **973MB** | 2023-02-16 | **Fork** — News API בלי API key |

---

## PCI-08 / דוח לציון — טבלת Keep / Defer / Kill

| ריפו | המלצה | סיבה בשורה אחת |
|------|--------|-----------------|
| **AZToDev-HQ** | **Keep** | זה ה-HQ החי שמריץ את כל התפעול הזה עכשיו — פרטי, פעיל היום |
| **FiTime** | **Keep** | פרויקט גמר אמיתי (הזמנות + waitlist), push מאתמול — הכי פעיל מכל הריפואים, ותיוג "פרטי" ב-factory.json שגוי (בפועל ציבורי) |
| **costumes_store** | **Keep** | פרויקט גמר React מלא עם תיאור ברור — ערך תיק עבודות, בלי עלות להשאיר |
| **mytrip_flutter_app** | **Keep** | פרויקט גמר Flutter — סטאק שונה מהשאר, מרחיב את התיק |
| **my_tasks_app** | **Keep** | פרויקט גמר קורס Node SSR — קטן אבל שלם ומתועד |
| **SmartIrrigation** | **Keep** | פרויקט גמר IoT ייחודי — נישה שונה, שווה השארה גלויה |
| **Arduino-game** | **Keep** | פרויקט הובי/חומרה קטן, תיאור עברי ברור — עלות אפס להשאיר, מוסיף גיוון |
| **ZionAmar-workclock-expo-app** | **Defer** | בלי תיאור, שם דומה ל"Work_clock" הפרטי שמופיע ב-factory.json ולא נמצא בכלל — צריך את ציון להגיד אם זה אותו פרויקט או שרידי ניסוי |
| **FinalProjectNodeJS** | **Defer** | תוכן אמיתי (מעקב לחץ דם) אבל שם גנרי חופף לפרויקטי-גמר אחרים — כדאי החלטת ציון על שינוי שם/מיזוג לפני שקובעים |
| **news** | **Defer** | אפליקציה אמיתית בעברית אבל קפואה כ-2.5 שנים (2024-02) — ציון צריך לומר אם עוד רלוונטי מול ערוצי החדשות הפעילים היום |
| **expo-app** | **Kill** | שם גנרי, אין תיאור, נראה כמו סקאפולד/תרגול — מועמד לארכוב |
| **chrome-test** | **Kill** | השם עצמו אומר "test" — ריפו זריקה |
| **todo** | **Kill** | שם גנרי "todo" בלי תיאור — נראה תרגול/טוטוריאל |
| **ci-test** | **Kill** | שם מפורש "test", 43KB — ריפו בדיקה זמני |
| **ci-pipeline-test** | **Kill** | כפילות כמעט מלאה של ci-test מאותו יום — שני ריפואי בדיקה במקום אחד |
| **coffee_and_cake_App_DB** | **Kill** | ~2.75 שנים קפוא, היקף זעיר, ערך תיק-עבודות נמוך מאוד |
| **E.2.E-Project** | **Kill** | Fork קפוא 3+ שנים בלי שינוי מזוהה — מועמד ארכוב קלאסי |
| **NewsAPI** | **Kill** | Fork קפוא 3.5 שנים **וגם 973MB** — הכי כבד מכל הריפואים בלי סיבה נראית לעין; שווה בדיקה למה הוא כזה גדול לפני ארכוב |

**סיכום מהיר:** Keep 7 · Defer 3 · Kill 7 (מתוך 18 המאומתים). שום דבר לא נגעתי בפועל — נראות/ארכוב/מחיקה מחכים לאישור מפורש + PIN לכל ריפו.

---

## מה עוד פתוח (לא נסגר כאן)

- **הפער 49/18 בפרטיים** — DELEGATE ל-34-pc-ops (למעלה) עדיין פתוח.
- **kidnest / Work_clock / TelemustAddUsers** — 404 בבדיקה ישירה. תואם את מה שכבר נרשם ב-learning-log (`kidnest repo not on GitHub`) — כנראה מעולם לא הועלו בפועל, לא רק חסומים להרשאה.
- אחרי אישור ציון על ההמלצות: ארכוב/מחיקה בפועל = מוטציה, PIN לכל ריפו בנפרד, לא באצווה.

LEARNING:
- do: אמת ספירת ריפואים דרך שני ערוצים עצמאיים (gh repo list + users/{login}.public_repos) לפני שמדווחים מספר; בדוק ריפו ספציפי ב-404 ישיר כשיש חוסר ודאות אם הוא "מוסתר" או "לא קיים"
- dont: לדווח מספר ריפואים סופי (18/49) בלי להבחין בין "כל מה שה-App רואה" ל"כל מה שקיים בפועל בחשבון האישי"
- note: PCI-07/07b/08 הושלמו לבד (בלי צוות) — 18 ריפואים מאומתים, Keep7/Defer3/Kill7; DELEGATE 34-pc-ops פתוח ליישוב 49; kidnest/Work_clock/TelemustAddUsers מאומתים כ-404 ישיר
