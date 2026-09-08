import path from "path";
import { OPS, readJson } from "./paths.mjs";
import { companyMode, isProductWorkEnabled, readFactory } from "./company-state.mjs";
import { nadavHeartbeatSnapshot } from "./nadav-queue.mjs";

export function matchPhoneCommand(raw) {
  const t = String(raw || "").trim();
  if (!t) return null;
  const lower = t.toLowerCase();
  if (
    t === "/help" ||
    t === "עזרה" ||
    t === "פקודות" ||
    t === "/commands" ||
    lower === "help"
  ) {
    return "help";
  }
  if (
    t === "/status" ||
    t === "status" ||
    t === "סטטוס" ||
    t === "החברה" ||
    /^(מה קורה|מה הסטטוס|מה המצב|איפה אנחנו|החברה מוכנה|מוכנה)\s*[?.!]*(?:\s|$)/i.test(
      t
    )
  ) {
    return "status";
  }
  return null;
}

export function helpHebrew() {
  const work = isProductWorkEnabled();
  const factory = readFactory();
  const ready = factory.productCompanyReady === true;
  return [
    "נועה · AZToDev",
    work
      ? "עבודת מוצר: דולקת. תכתוב מה לעשות."
      : ready
        ? "קשת מוכנה. אף אחד לא בונה עד שתכתוב «תבנו» + סיסמה."
        : "החברה מוכנה. מוצר ב-GitHub כבוי עד שתאשר. בית / מחשב / שרת-קריאה — פתוחים.",
    "",
    "מהנייד:",
    "• טקסט או הקלטה — מגיע אליי. הקלטה = תמלול + תשובה בכתב.",
    "• הוראה שמשנה משהו (מייל יוצא, קוד, PR) — קודם סיסמה, אחר כך ההוראה.",
    "• «סטטוס» — מי מחובר, מה מוכן",
    "• «עזרה» — ההודעה הזו",
    "• «שיחה חדשה» — מתחילים שיחה נקייה",
    "",
    "אני מנתבת, לא מבצעת: מיילים→רות · מחשב→נדב · שרת→תמיר · מוצר→קשת (ואז הצינור).",
    "",
    factory.linearProductIssue
      ? `לוח מוצר: Linear · ${factory.linearProductIssue}`
      : "לוח משימות בנייד: Linear · issue EMET-65",
  ].join("\n");
}

function mark(ok) {
  return ok ? "מחובר" : "חסר";
}

export function companyStatusHebrew() {
  const factory = readFactory();
  const conn = readJson(path.join(OPS, "runtime", "connections.json"), {});
  const c = conn.accounts || {};
  const nadav = nadavHeartbeatSnapshot();
  const lines = [
    "AZToDev — מצב החברה",
    `מצב: ${companyMode() === "standby" ? "הקמה / מוכנה" : companyMode()}`,
    "דלפק: נועה בטלגרם על ChemiCloud (תיקייה נפרדת, בלי Cursor)",
    `נדב (מחשב): ${nadav.online ? "דולק" : "כבוי / ממתין לפתיחת המחשב"}`,
    `עבודת מוצר (Cloud/PR): ${isProductWorkEnabled() ? "דולקת" : "כבויה (בכוונה)"}`,
    `חברת קשת: ${factory.productCompanyReady ? "מוכנה — ממתינה ל«תבנו»" : "לא חמושה"}`,
    "",
    "חשבונות:",
    `• Cursor: ${mark(c.cursor?.ok)}`,
    `• GitHub דרך Cursor: ${mark(c.github?.ok)}${
      c.github?.count != null ? ` (${c.github.count} ריפואים)` : ""
    }`,
    `• טלגרם: ${mark(c.telegram?.ok)}`,
    `• Linear: ${mark(c.linear?.ok)}`,
    `• OpenAI: ${mark(c.openai?.ok)}`,
    `• Gemini: ${mark(c.gemini?.ok)}`,
    `• Gmail שליחה: ${mark(c.gmail?.ok)}`,
    `• Gmail קריאה (IMAP): ${mark(c.gmailRead?.ok)}`,
    `• שרת SSH: ${mark(c.ssh?.ok)}`,
    `• פייסבוק פרסום: ${mark(c.facebookPublish?.ok)}`,
    `• יוטיוב העלאה: ${mark(c.youtubeUpload?.ok)}`,
    "",
    factory.linearProductIssue
      ? `לוח מוצר: ${factory.linearProductIssue}`
      : factory.linearHqIssue
      ? `לוח: ${factory.linearHqIssue}`
      : "לוח: Linear (צוות EMET)",
    "",
    "פקודות: סטטוס · עזרה · שיחה חדשה",
  ];
  return lines.join("\n");
}
