/**
 * Send GitHub repository mapping deliverable to founder email.
 * Styled in Hebrew, RTL, neat and readable layout.
 */
import { loadDotEnv } from "../../runtime/lib/load-env.mjs";
import { sendFounderEmail, founderEmail } from "../../runtime/lib/mail.mjs";

loadDotEnv();

const to = founderEmail();
const subject = "AZToDev — תוצאות מיפוי הריפוזיטוריות שלך ב-GitHub (סיווג לפעולה)";

const text = `שלום ציון,

לבקשתך, איתרתי את תוצאות מיפוי הריפוזיטוריות המלא שבוצע אתמול (09/09/2026) בחשבון ה-GitHub שלך (ZionAmar).
להלן הפירוט המלא, מסודר וממוין לפי המלצות לפעולה.

==================================================
תקציר ספירה וממצאים
==================================================
• סה"כ ריפוזיטוריות שזוהו ואומתו: 18 ריפואים (1 פרטי, 17 ציבוריים).
• מומלצים לשימור (Keep): 7 פרויקטים (פרויקטי גמר שלמים וריפו החברה החי).
• לבחינה והכרעתך (Review): 4 פרויקטים (פרויקטי תחביב ובדיקת כפילות).
• מועמדים למחיקה / ארכוב (Delete-candidate): 7 פרויקטים (בדיקות טכניות, שלדים ריקים ו-Forks).

הערה לגבי הרשאות הטוקן:
ב-factory.json הוזכרו בעבר 3 ריפואים פרטיים נוספים (kidnest, Work_clock, TelemustAddUsers).
טוקן ה-GitHub של הענן הוגדר עם הרשאה לריפו הפרטי AZToDev-HQ בלבד, ולכן ריפואים פרטיים נוספים אינם גלויים בסריקת ענן זו. ספירה מלאה דרך הדפדפן בחשבון הועברה כמשימה לנדב (PCI-10).

==================================================
טבלה מלאה — 18 הריפוזיטוריות
==================================================
1. AZToDev-HQ | פרטי | המשרד הראשי של החברה — דסק הענן וכל הקוד התפעולי | Keep | ריפו פעיל וחי
2. FiTime | ציבורי | מערכת הזמנות לסטודיו פילאטיס עם רשימת המתנה חכמה | Keep | פרויקט גמר שלם, מוצר אמיתי
3. ZionAmar-workclock-expo-app | ציבורי | אפליקציית Expo לשעון עבודה | Review | לבדוק חפיפה מול Work_clock הפרטי
4. expo-app | ציבורי | שלד ראשוני לאפליקציית Expo ללא תוכן | Delete-candidate | שלד גנרי ריק
5. chrome-test | ציבורי | בדיקת תוסף כרום | Delete-candidate | בדיקה טכנית קצרה
6. todo | ציבורי | אפליקציית משימות פשוטה | Delete-candidate | תרגיל/סקראץ' גנרי
7. ci-test | ציבורי | בדיקת תהליך CI | Delete-candidate | בדיקה טכנית
8. ci-pipeline-test | ציבורי | בדיקת תהליך Pipeline | Delete-candidate | בדיקה טכנית (כפיל ל-ci-test)
9. costumes_store | ציבורי | חנות תחפושות אונליין (React) | Keep | פרויקט גמר שלם
10. mytrip_flutter_app | ציבורי | אפליקציית תכנון טיולים (Flutter) | Keep | פרויקט גמר שלם
11. my_tasks_app | ציבורי | מנהל משימות מרובה משתמשים (Node.js SSR) | Keep | פרויקט גמר שלם
12. SmartIrrigation | ציבורי | מערכת השקיה חכמה מבוססת IoT | Keep | פרויקט גמר שלם וייחודי
13. FinalProjectNodeJS | ציבורי | אפליקציית מעקב לחץ דם מרובת משתמשים | Keep | פרויקט גמר שלם
14. Arduino-game | ציבורי | משחק תגובה "תחרות הלוחץ הזריז" ב-Arduino | Review | תחביב נחמד, להכרעתך
15. news | ציבורי | אפליקציה להצגת מבזקי חדשות בלייב | Review | לבדוק אם יש קוד שימושי למבזקי ה-HQ
16. coffee_and_cake_App_DB | ציבורי | מעקב רכישת קפה ומאפה | Review | תחביב קטן, לבדוק רלוונטיות
17. E.2.E-Project | ציבורי (Fork) | משחק Duck Game (תרגיל קורס) | Delete-candidate | Fork של תרגיל לימודי
18. NewsAPI | ציבורי (Fork) | עטיפת News API | Delete-candidate | Fork של ספריית עזר

==================================================
הצעדים הבאים להחלטתך
==================================================
• שום ריפו לא יימחק או יאורכב ללא אישורך המפורש וללא קוד PIN.
• אם החלוקה מקובלת עליך, נוכל להכין פקודות ארכוב/מחיקה ל-7 המועמדים.
• עבור 4 הפרויקטים שבבדיקה (Review) — נשמח לקבל את הנחייתך האם לשמור או למחוק.

בברכה,
רות (33-household-ops)
AZToDev`;

const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f1f5f9;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    direction: rtl;
    text-align: right;
  }
  .container {
    max-width: 760px;
    margin: 24px auto;
    background: #ffffff;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    direction: rtl;
    text-align: right;
  }
  .header {
    border-bottom: 2px solid #0284c7;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .header h1 {
    margin: 0 0 6px 0;
    color: #0f172a;
    font-size: 24px;
    font-weight: 700;
  }
  .header .meta {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }
  .intro {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 24px;
    color: #334155;
  }
  .stats-grid {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .stat-card {
    flex: 1;
    min-width: 140px;
    padding: 14px 16px;
    border-radius: 8px;
    text-align: center;
    border: 1px solid transparent;
  }
  .stat-total { background-color: #f8fafc; border-color: #cbd5e1; }
  .stat-keep { background-color: #f0fdf4; border-color: #86efac; color: #166534; }
  .stat-review { background-color: #fffbeb; border-color: #fde68a; color: #92400e; }
  .stat-delete { background-color: #fef2f2; border-color: #fecaca; color: #991b1b; }
  .stat-number { font-size: 26px; font-weight: bold; margin-bottom: 4px; display: block; }
  .stat-label { font-size: 13px; font-weight: 600; }
  
  .section-title {
    font-size: 19px;
    font-weight: 700;
    color: #0f172a;
    margin: 28px 0 14px 0;
    border-right: 4px solid #0284c7;
    padding-right: 10px;
  }
  .table-wrapper {
    overflow-x: auto;
    margin-bottom: 28px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    direction: rtl;
    text-align: right;
  }
  th {
    background-color: #f8fafc;
    color: #475569;
    font-weight: 600;
    padding: 12px 10px;
    border-bottom: 2px solid #e2e8f0;
    text-align: right;
  }
  td {
    padding: 12px 10px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
    text-align: right;
  }
  tr:hover {
    background-color: #f8fafc;
  }
  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
  }
  .badge-keep {
    background-color: #dcfce7;
    color: #15803d;
  }
  .badge-review {
    background-color: #fef3c7;
    color: #b45309;
  }
  .badge-delete {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  .visibility-tag {
    font-size: 12px;
    color: #64748b;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .repo-name {
    font-weight: 600;
    color: #0369a1;
  }
  .box-note {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    padding: 16px;
    margin: 20px 0;
    font-size: 14px;
    line-height: 1.6;
    color: #1e40af;
  }
  .box-warning {
    background-color: #fefce8;
    border: 1px solid #fef08a;
    border-radius: 8px;
    padding: 16px;
    margin: 20px 0;
    font-size: 14px;
    line-height: 1.6;
    color: #854d0e;
  }
  .footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
    margin-top: 32px;
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
  }
  .footer strong {
    color: #1e293b;
  }
</style>
</head>
<body dir="rtl" style="direction: rtl; text-align: right;">
  <div class="container" dir="rtl" style="direction: rtl; text-align: right;">
    <div class="header">
      <h1>מיפוי כל הריפוזיטוריות שלך ב-GitHub</h1>
      <p class="meta">דוח סיווג והמלצות פעולה | נשלח על ידי רות (33-household-ops) | AZToDev | תאריך: 10/09/2026</p>
    </div>

    <div class="intro">
      שלום ציון,<br>
      לבקשתך, איתרתי את תוצאות מיפוי הריפוזיטוריות המלא שבוצע אתמול (09/09/2026) בחשבון ה-GitHub שלך (<strong>ZionAmar</strong>).<br>
      להלן הפירוט המלא, מסודר, נעים לקריאה ומיושר לימין, כולל המלצות ברורות מה לשמור, מה לבחון ומה למחוק/לארכב.
    </div>

    <div class="stats-grid">
      <div class="stat-card stat-total">
        <span class="stat-number">18</span>
        <span class="stat-label">סה"כ ריפואים מאומתים</span>
      </div>
      <div class="stat-card stat-keep">
        <span class="stat-number">7</span>
        <span class="stat-label">לשמור (Keep)</span>
      </div>
      <div class="stat-card stat-review">
        <span class="stat-number">4</span>
        <span class="stat-label">לבחינה שלך (Review)</span>
      </div>
      <div class="stat-card stat-delete">
        <span class="stat-number">7</span>
        <span class="stat-label">מועמדים למחיקה</span>
      </div>
    </div>

    <div class="box-note">
      <strong>ℹ️ הערת שקיפות לגבי הרשאות ה-Token:</strong><br>
      הסריקה בענן בוצעה באמצעות ה-GitHub App של Cursor Cloud, המורשה ישירות ל-18 ריפוזיטוריות אלו. שלושה ריפואים פרטיים המוזכרים ברישומי החברה (<code>kidnest</code>, <code>Work_clock</code>, <code>TelemustAddUsers</code>) לא הופיעו בסריקה עקב הרשאות טוקן הענן (המורשה רק ל-<code>AZToDev-HQ</code> מבין הפרטיים). משימת בדיקת החשבון המלאה ישירות מהדפדפן במחשב האישי (PCI-10) הועברה לנדב.
    </div>

    <div class="section-title">טבלה מלאה — כל 18 הריפוזיטוריות והמלצות הפעולה</div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th style="width: 5%;">#</th>
            <th style="width: 25%;">שם הריפו</th>
            <th style="width: 14%;">נראות</th>
            <th style="width: 28%;">מה הפרויקט עושה</th>
            <th style="width: 13%;">המלצה</th>
            <th style="width: 15%;">נימוק קצר</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td><span class="repo-name">AZToDev-HQ</span></td>
            <td><span class="visibility-tag">פרטי</span></td>
            <td>המשרד הראשי של החברה — דסק הענן, כל הקוד והתיעוד התפעולי</td>
            <td><span class="badge badge-keep">Keep</span></td>
            <td>ריפו פעיל וחי, מעודכן יומיומית</td>
          </tr>
          <tr>
            <td>2</td>
            <td><span class="repo-name">FiTime</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>מערכת הזמנות חכמה לסטודיו פילאטיס עם רשימת המתנה חכמה</td>
            <td><span class="badge badge-keep">Keep</span></td>
            <td>פרויקט גמר שלם, עדכני ומוצר אמיתי</td>
          </tr>
          <tr>
            <td>3</td>
            <td><span class="repo-name">ZionAmar-workclock-expo-app</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>אפליקציית Expo לשעון עבודה (Work clock)</td>
            <td><span class="badge badge-review">Review</span></td>
            <td>לבדוק חפיפה מול Work_clock הפרטי לפני הכרעה</td>
          </tr>
          <tr>
            <td>4</td>
            <td><span class="repo-name">expo-app</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>שלד בסיסי לאפליקציית Expo ללא תוכן מהותי</td>
            <td><span class="badge badge-delete">Delete</span></td>
            <td>שלד גנרי ראשוני, ללא ערך</td>
          </tr>
          <tr>
            <td>5</td>
            <td><span class="repo-name">chrome-test</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>בדיקת תוסף כרום (Chrome Extension)</td>
            <td><span class="badge badge-delete">Delete</span></td>
            <td>ריפו בדיקה טכני קצר, אינו מוצר</td>
          </tr>
          <tr>
            <td>6</td>
            <td><span class="repo-name">todo</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>אפליקציית משימות פשוטה</td>
            <td><span class="badge badge-delete">Delete</span></td>
            <td>תרגיל/סקראץ' גנרי</td>
          </tr>
          <tr>
            <td>7</td>
            <td><span class="repo-name">ci-test</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>בדיקת תהליכי אינטגרציה רציפה (CI)</td>
            <td><span class="badge badge-delete">Delete</span></td>
            <td>ריפו בדיקה טכני</td>
          </tr>
          <tr>
            <td>8</td>
            <td><span class="repo-name">ci-pipeline-test</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>בדיקת Pipeline</td>
            <td><span class="badge badge-delete">Delete</span></td>
            <td>ריפו בדיקה טכני, כפילות מלאה ל-ci-test</td>
          </tr>
          <tr>
            <td>9</td>
            <td><span class="repo-name">costumes_store</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>חנות תחפושות מקוונת (React), צד לקוח מלא</td>
            <td><span class="badge badge-keep">Keep</span></td>
            <td>פרויקט גמר שלם עם קוד עובד</td>
          </tr>
          <tr>
            <td>10</td>
            <td><span class="repo-name">mytrip_flutter_app</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>אפליקציית תכנון טיולים (Flutter)</td>
            <td><span class="badge badge-keep">Keep</span></td>
            <td>פרויקט גמר שלם ואיכותי</td>
          </tr>
          <tr>
            <td>11</td>
            <td><span class="repo-name">my_tasks_app</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>ניהול משימות מרובה משתמשים (Node.js SSR)</td>
            <td><span class="badge badge-keep">Keep</span></td>
            <td>פרויקט גמר שלם ומתפקד</td>
          </tr>
          <tr>
            <td>12</td>
            <td><span class="repo-name">SmartIrrigation</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>מערכת השקיה חכמה מבוססת IoT ובקרים</td>
            <td><span class="badge badge-keep">Keep</span></td>
            <td>פרויקט גמר שלם, נושא ייחודי וטכנולוגי</td>
          </tr>
          <tr>
            <td>13</td>
            <td><span class="repo-name">FinalProjectNodeJS</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>אפליקציית מעקב לחץ דם מרובת משתמשים</td>
            <td><span class="badge badge-keep">Keep</span></td>
            <td>פרויקט גמר שלם ואמיתי</td>
          </tr>
          <tr>
            <td>14</td>
            <td><span class="repo-name">Arduino-game</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>משחק תגובה מהירה "תחרות הלוחץ הזריז" ב-Arduino</td>
            <td><span class="badge badge-review">Review</span></td>
            <td>פרויקט תחביב חומרה נחמד, להכרעתך</td>
          </tr>
          <tr>
            <td>15</td>
            <td><span class="repo-name">news</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>אפליקציית ווב להצגת מבזקי חדשות בלייב</td>
            <td><span class="badge badge-review">Review</span></td>
            <td>נושא משיק לעבודת המבזקים ב-HQ, כדאי לבדוק קוד שימושי</td>
          </tr>
          <tr>
            <td>16</td>
            <td><span class="repo-name">coffee_and_cake_App_DB</span></td>
            <td><span class="visibility-tag">ציבורי</span></td>
            <td>אפליקציית מעקב רכישת קפה ומאפה</td>
            <td><span class="badge badge-review">Review</span></td>
            <td>פרויקט תחביב קטן עם בסיס נתונים, לבדיקת רלוונטיות</td>
          </tr>
          <tr>
            <td>17</td>
            <td><span class="repo-name">E.2.E-Project</span></td>
            <td><span class="visibility-tag">ציבורי (Fork)</span></td>
            <td>"Running Man Duck Game" — עותק של תרגיל קורס</td>
            <td><span class="badge badge-delete">Delete</span></td>
            <td>Fork של תרגיל לימודי, ללא ערך עצמאי</td>
          </tr>
          <tr>
            <td>18</td>
            <td><span class="repo-name">NewsAPI</span></td>
            <td><span class="visibility-tag">ציבורי (Fork)</span></td>
            <td>עטיפת ספרייה ל-News API</td>
            <td><span class="badge badge-delete">Delete</span></td>
            <td>Fork של כלי עזר ישן, ללא ערך מוצרי</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section-title">פירוט הקבוצות והמלצות להחלטתך</div>
    
    <div style="margin-bottom: 16px;">
      <h3 style="color: #15803d; margin: 0 0 6px 0; font-size: 16px;">🟢 1. פרויקטים לשימור (7 פרויקטים):</h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5;">
        <strong>AZToDev-HQ</strong> (ליבת הפעילות של החברה), ו-6 פרויקטי גמר מלאים: <strong>FiTime</strong>, <strong>costumes_store</strong>, <strong>mytrip_flutter_app</strong>, <strong>my_tasks_app</strong>, <strong>SmartIrrigation</strong>, <strong>FinalProjectNodeJS</strong>. כולם פרויקטים שלמים המדגימים יכולות פיתוח מלאות במגוון טכנולוגיות (React, Flutter, Node.js, IoT).
      </p>
    </div>

    <div style="margin-bottom: 16px;">
      <h3 style="color: #b45309; margin: 0 0 6px 0; font-size: 16px;">🟡 2. פרויקטים לבחינה והכרעה (4 פרויקטים):</h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5;">
        • <strong>ZionAmar-workclock-expo-app</strong>: לוודא שאינו גרסה ישנה/כפולה של Work_clock הפרטי.<br>
        • <strong>news</strong>: לבדוק אם יש בו לוגיקת API שימושית למערכת החדשות והמבזקים שלנו לפני מחיקה.<br>
        • <strong>Arduino-game</strong> ו-<strong>coffee_and_cake_App_DB</strong>: פרויקטי תחביב אישיים — להחלטתך האם יש להם ערך סנטימנטלי/שימושי עבורך או שתרצה לפנות מקום.
      </p>
    </div>

    <div style="margin-bottom: 16px;">
      <h3 style="color: #b91c1c; margin: 0 0 6px 0; font-size: 16px;">🔴 3. מועמדים למחיקה או ארכוב (7 פרויקטים):</h3>
      <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5;">
        <strong>expo-app</strong>, <strong>chrome-test</strong>, <strong>todo</strong>, <strong>ci-test</strong>, <strong>ci-pipeline-test</strong>, <strong>E.2.E-Project</strong>, <strong>NewsAPI</strong>.<br>
        פרויקטים אלו הם סקראצ'ים, בדיקות תשתית קצרות או Forks של תרגילים ללא קוד מקורי. מומלץ למחוק או לארכב אותם כדי לשמור על פרופיל GitHub נקי ומקצועי.
      </p>
    </div>

    <div class="box-warning">
      <strong>🔒 בטיחות מעל הכל:</strong><br>
      שום ריפוזיטורי לא נמחק ולא ימחק ללא אישורך המפורש וללא קוד PIN. המטרה היא לעשות לך סדר ובהירות. כשנוח לך, תוכל להשיב לנועה מה תרצה למחוק ומה להשאיר.
    </div>

    <div class="footer">
      בברכה,<br>
      <strong>רות (33-household-ops)</strong><br>
      ניהול משק בית, מייל ותקשורת | AZToDev
    </div>
  </div>
</body>
</html>`;

console.log("Sending email to founder:", to);
const result = await sendFounderEmail({
  subject,
  text,
  html,
  from: `"AZToDev / רות" <${process.env.GMAIL_USER?.trim()}>`,
});

console.log("Send result:", JSON.stringify(result, null, 2));
if (!result.ok) {
  process.exit(1);
}
