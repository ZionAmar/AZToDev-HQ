import { sendGmail, founderEmail } from "../../runtime/lib/mail.mjs";

const to = founderEmail();
const subject = "סיכום פעילות AZToDev מאתמול (09/09/2026) — דוח מעוצב לציון";

const text = `שלום ציון,

להלן סיכום מעוצב ומפורט של כל הפעילות שהתרחשה אתמול בחברה שלנו (09/09/2026):

1. שחרור חסימות תשתית ו-KidNest ל-GitHub:
- סגירת העלאת KidNest ל-GitHub (ריפו פרטי ZionAmar/kidnest) וסגירת טיקטי הליניאר (EMET-150, EMET-153, EMET-154).
- שדרוג Parity+ במפעל: שילוב מודלים ייעודיים לכל תפקיד, אופטימיזציית לולאת הדיספאצ'ר ומנגנון מניעת קיפאון WIP=1.

2. סריקת פרויקטים ב-in_production ובדיקת הגיטהאב (PCI):
- פתיחת יוזמת סריקת הפרויקטים על המחשב (PCI-01..03) וחלוקת השלבים.
- איתור פרויקטי "תהילים" ו"תהורה" (PCI-04) והכנת טיקטים להעלאה (PCI-05/06).
- ביצוע סקירה מקיפה ומאומתת של כל 18 הריפואים ב-GitHub תחת ZionAmar: מיפוי מלא וסיווג (7 לשימור, 4 לבחינה/הכרעה, 7 מועמדים לארכוב/מחיקה) ללא שום מחיקה בפועל.
- יישוב פערי ההרשאות: הסבר מדוע ה-GitHub App של Cursor ראה 18 ריפואים והפניית PCI-10 לנדב.

3. טיקטי Linear ופתרון תקלות עומק במערכת:
- יצירה ישירה של טיקטי Linear חסרים (EMET-162, EMET-163, EMET-164) באמצעות ה-API.
- איתור ותיקון שורש לתקלת הודעות קוליות בציטוט (replyContext הפך ל-async עם תמלול Whisper מלא) על ענף ייעודי.
- תיקון באג התיאטרון של ערוץ הצ'אט המהיר (הזרמת DELEGATE אמיתי).

4. שיווק ומצגת ניהול מלאי (INV-02 / INV-04):
- שליחת מצגת ניהול המלאי v1 ומעקב תגובתך.
- פתיחת גרסה v2 (11 שקפים, ללא אזכור "איציק סיטונאות") עם זיהוי ותיקון מדויק של חיתוך סרגל הצד (Crop) בכל תמונות הניהול.

5. דסק הבית והמייל:
- קבלת העברה כספית ב-PayMe על סך 1,033.42 ₪.
- סריקת 3 חשבונות המייל (aztodev, amzion, zion) והפקת דוח יומי מסודר.

סטטוס נוכחי:
- המחשב של נדב: מחובר (ONLINE).
- ממתין להכרעתך: בחירת Keep/Review/Archive לריפואים ופין להעלאת תהילים/תהורה.

בברכה,
רות (33-household-ops) | AZToDev`;

const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <title>סיכום פעילות AZToDev מאתמול</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0f172a;
      color: #334155;
      margin: 0;
      padding: 24px 12px;
      direction: rtl;
    }
    .wrapper {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #091e3a 0%, #1e3a8a 50%, #2563eb 100%);
      color: #ffffff;
      padding: 36px 32px;
      text-align: right;
      position: relative;
    }
    .header-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #93c5fd;
      font-size: 13px;
      font-weight: 600;
      padding: 4px 14px;
      border-radius: 9999px;
      margin-bottom: 14px;
      letter-spacing: 0.5px;
    }
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      line-height: 1.3;
    }
    .header p {
      margin: 0;
      font-size: 15px;
      color: #bfdbfe;
      line-height: 1.5;
    }
    .content {
      padding: 32px;
    }
    .lead-box {
      background: #f8fafc;
      border-right: 4px solid #2563eb;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 28px;
      font-size: 15px;
      line-height: 1.6;
      color: #1e293b;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin: 28px 0 16px 0;
      display: flex;
      align-items: center;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
    }
    .section-title span.num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #2563eb;
      color: #fff;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      font-size: 13px;
      margin-left: 10px;
      font-weight: 700;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 20px;
      margin-bottom: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: #1e3a8a;
      margin: 0 0 10px 0;
    }
    .card ul {
      margin: 0;
      padding-right: 20px;
      color: #475569;
      font-size: 14.5px;
      line-height: 1.6;
    }
    .card li {
      margin-bottom: 8px;
    }
    .card li:last-child {
      margin-bottom: 0;
    }
    .tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      margin-right: 6px;
    }
    .tag-done { background: #dcfce7; color: #166534; }
    .tag-progress { background: #dbeafe; color: #1e40af; }
    .tag-wait { background: #fef3c7; color: #92400e; }
    .tag-info { background: #f3e8ff; color: #6b21a8; }
    .table-container {
      margin: 16px 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
      text-align: right;
    }
    th {
      background: #f1f5f9;
      color: #334155;
      padding: 10px 14px;
      font-weight: 700;
      border-bottom: 1px solid #e2e8f0;
    }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid #f1f5f9;
      color: #475569;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .status-summary {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 20px;
      margin-top: 32px;
    }
    .status-summary h3 {
      margin: 0 0 12px 0;
      color: #1e3a8a;
      font-size: 16px;
      font-weight: 700;
    }
    .status-summary ul {
      margin: 0;
      padding-right: 20px;
      color: #1e293b;
      font-size: 14.5px;
      line-height: 1.6;
    }
    .footer {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px 32px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-badge">AZToDev HQ · דוח פעילות יומי</div>
      <h1>סיכום כל מה שעשינו אתמול בחברה</h1>
      <p>יום רביעי, 09 בספטמבר 2026 · הופק על ידי רות (Household Ops)</p>
    </div>

    <div class="content">
      <div class="lead-box">
        <strong>שלום ציון,</strong><br>
        אתמול היה יום עמוס ומשמעותי בחברה: סגרנו תהליכי גיבוי והעלאה, מיפינו לעומק את כל הריפוזיטוריות בגיטהאב, איתרנו ופתרנו תקלות תשתית שגרמו לתחושת בלבול ואיטיות, ותיקנו את בריף מצגת המלאי לפי המשוב המדויק שלך. הנה הפירוט המלא והמעוצב:
      </div>

      <!-- Section 1 -->
      <div class="section-title">
        <span class="num">1</span>
        תשתיות, גיבויים והעלאת קוד ל-GitHub
      </div>
      <div class="card">
        <div class="card-title">KidNest & שדרוג Parity+ במפעל</div>
        <ul>
          <li><span class="tag tag-done">הושלם</span> <strong>סגירת העלאת KidNest:</strong> הקוד מתיקיית in_production הועלה במלואו לריפו פרטי בגיטהאב (<code>ZionAmar/kidnest</code>) עם סגירת טיקטי הליניאר הרלוונטיים (EMET-150, EMET-153, EMET-154).</li>
          <li><span class="tag tag-done">הושלם</span> <strong>שדרוג Parity+ למפעל:</strong> עודכנו מודלים מתקדמים לפי תפקידי הסוכנים, מנגנון שמירת שיחות, ונפתרה בעיית "קיפאון תורים" שהשאירה משימות פקוקות על WIP=1.</li>
        </ul>
      </div>

      <!-- Section 2 -->
      <div class="section-title">
        <span class="num">2</span>
        פרויקטי מחשב (in_production) וסריקת GitHub מלאה
      </div>
      <div class="card">
        <div class="card-title">סריקת ה-PC ומיפוי 18 הריפואים (PCI-01..09)</div>
        <ul>
          <li><span class="tag tag-progress">בתהליך</span> <strong>סריקת in_production (PCI-01..03):</strong> פתיחת יוזמת הסריקה לאיתור כל הפרויקטים על שולחן העבודה של המחשב האישי שאינם מגובים בענן.</li>
          <li><span class="tag tag-wait">ממתין ל-PIN</span> <strong>פרויקטי "תהילים" ו"תהורה" (PCI-04..06):</strong> נפתחה משימת איתור התיקיות אצל נדב (PCI-04), והוכנו משימות יצירת הריפואים הפרטיים והעלאתם ברגע שיינתן ה-PIN שלך.</li>
          <li><span class="tag tag-done">הושלם</span> <strong>סריקה וסיווג של כל 18 הריפואים ב-GitHub (קשת):</strong> בוצעה בדיקה חיה ומאומתת מול API של גיטהאב. הופק דוח מלא בעברית הכולל סיווג ללא ביצוע שום מחיקה:
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>סיווג</th>
                    <th>כמות</th>
                    <th>פירוט פרויקטים</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>לשמור (Keep)</strong></td>
                    <td>7</td>
                    <td>AZToDev-HQ, FiTime, costumes_store, mytrip_flutter_app, my_tasks_app, SmartIrrigation, FinalProjectNodeJS</td>
                  </tr>
                  <tr>
                    <td><strong>לבחינה והחלטה (Review)</strong></td>
                    <td>4</td>
                    <td>ZionAmar-workclock-expo-app, Arduino-game, news, coffee_and_cake_App_DB</td>
                  </tr>
                  <tr>
                    <td><strong>מועמדים לארכוב/מחיקה</strong></td>
                    <td>7</td>
                    <td>expo-app, chrome-test, todo, ci-test, ci-pipeline-test, E.2.E-Project, NewsAPI</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
          <li><span class="tag tag-info">שקיפות</span> <strong>יישוב פער הספירה (18 מול 49):</strong> אותר כי ה-GitHub App של Cursor בסשן הענן מורשה רק לריפו AZToDev-HQ + ריפואים ציבוריים (סה"כ 18). הבדיקה החשבונאית המלאה (PCI-10) הועברה לנדב ישירות מחשבונך.</li>
        </ul>
      </div>

      <!-- Section 3 -->
      <div class="section-title">
        <span class="num">3</span>
        פתרון תקלות עומק ושיפור אמינות המערכת
      </div>
      <div class="card">
        <div class="card-title">תיקוני קוד ותשתיות דיספאצ'ר</div>
        <ul>
          <li><span class="tag tag-done">תוקן</span> <strong>תיקון באג תמלול הודעות קוליות בציטוט:</strong> כאשר השבת "תעשי את זה" להודעה קולית קודמת, המערכת העבירה placeholder ריק. נועה הפכה את <code>replyContext</code> ל-async עם תמלול Whisper מלא, כך שמעתה הבקשה הקולית המקורית מתומללת במלואה.</li>
          <li><span class="tag tag-done">תוקן</span> <strong>ביטול תיאטרון בצ'אט המהיר:</strong> תוקן הערוץ המהיר כך שהבטחות בטלגרם יוציאו תמיד פקודת <code>DELEGATE</code> אמיתית ולא יישארו ללא ביצוע.</li>
          <li><span class="tag tag-done">הושלם</span> <strong>פתיחת טיקטי Linear (קשת):</strong> נוצרו ישירות מול Linear API שלושת הטיקטים החסרים (EMET-162, EMET-163, EMET-164) עבור פרויקטי תהילים ותהורה.</li>
        </ul>
      </div>

      <!-- Section 4 -->
      <div class="section-title">
        <span class="num">4</span>
        שיווק ומצגת ניהול מלאי (Rakza)
      </div>
      <div class="card">
        <div class="card-title">גרסאות המצגת (INV-02 ו-INV-04)</div>
        <ul>
          <li><span class="tag tag-done">הושלם</span> <strong>שליחת גרסה ראשונה (INV-02):</strong> נשלחה אליך המצגת הראשונה (14 שקפים) עם סקריפט מלווה.</li>
          <li><span class="tag tag-progress">מוכן לבנייה</span> <strong>גרסה v2 מדויקת (INV-04):</strong> בעקבות המשוב שלך ("לא אהבתי, בלי השם איציק"), קשת בנה בריף חדש של 11 שקפים ממוקדים (דשבורד, הזמנה, מוצר, מחסן, צוות, סוכן, ליקוט, נהג).</li>
          <li><span class="tag tag-done">דיוק קריטי</span> <strong>חיתוך סרגל הצד (Crop):</strong> בבדיקת פיקסלים מעמיקה התגלה כי השם "איציק סיטונאות" צרוב בתפריט הצד של 10 מתוך 11 התמונות. הוגדר חיתוך מדויק (<code>0..1217px</code>) שמסיר כליל את הסרגל כדי להבטיח מצגת נקייה לחלוטין.</li>
        </ul>
      </div>

      <!-- Section 5 -->
      <div class="section-title">
        <span class="num">5</span>
        כספים, חשבונות ומבזקי בית (רות)
      </div>
      <div class="card">
        <div class="card-title">תנועות כספיות וסריקת תיבות מייל</div>
        <ul>
          <li><span class="tag tag-done">הכנסה</span> <strong>PayMe:</strong> התקבלה הודעה על העברה כספית בסך <strong>1,033.42 ₪</strong> לביצוע.</li>
          <li><span class="tag tag-done">סריקה</span> <strong>סריקת 3 תיבות Gmail:</strong> סריקה מלאה של חשבונות aztodev, amzion ו-zion (הודעות Cursor על השקת Grok bot marketplace, אישורי הזמנות AliExpress, ועדכוני חג/קהילה).</li>
        </ul>
      </div>

      <!-- Status Summary Box -->
      <div class="status-summary">
        <h3>תמונת מצב לרגע זה ומה מחכה לך:</h3>
        <ul>
          <li><strong>המחשב של נדב (A_Z):</strong> מחובר ותקין (Heartbeat ONLINE).</li>
          <li><strong>מחכה להחלטתך:</strong> אישור סיווג הריפואים בגיטהאב (Keep/Review/Archive).</li>
          <li><strong>מחכה ל-PIN:</strong> מתן קוד פעולה בטלגרם עבור יצירת והעלאת ריפואי "תהילים" ו"תהורה" (PCI-05/06).</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <strong>AZToDev · בונים אמת. משיטים ערך. מרחיבים מינוף.</strong><br>
      נשלח על ידי רות (33-household-ops) לבקשת נועה עבור ציון עמר · עדות ביצוע מלאה שמורה במערכת.
    </div>
  </div>
</body>
</html>`;

console.log("Sending email to:", to);
const res = await sendGmail({
  account: "aztodev",
  to,
  subject,
  text,
  html,
});

console.log("Result:", JSON.stringify(res, null, 2));
