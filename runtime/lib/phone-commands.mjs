import path from "path";
import { OPS, readJson } from "./paths.mjs";
import { isProductWorkEnabled, readFactory } from "./company-state.mjs";
import { nadavHeartbeatSnapshot } from "./nadav-queue.mjs";
import { liveStatusHebrew } from "./live-status.mjs";

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
    "• «סטטוס» — מי רץ עכשיו, למה מחכים, קישור לאייג'נט, השלב הבא",
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

function accountsHebrew() {
  const factory = readFactory();
  const conn = readJson(path.join(OPS, "runtime", "connections.json"), {});
  const c = conn.accounts || {};
  const nadav = nadavHeartbeatSnapshot();
  return [
    `נדב: ${nadav.online ? "דולק" : "כבוי"} · מוצר: ${
      isProductWorkEnabled() ? "דולק" : "כבוי"
    } · קשת: ${factory.productCompanyReady ? "חמושה" : "לא"}`,
    `חיבורים: Cursor ${mark(c.cursor?.ok)} · GitHub ${mark(c.github?.ok)} · טלגרם ${mark(
      c.telegram?.ok
    )} · Linear ${mark(c.linear?.ok)}`,
  ].join("\n");
}

export function companyStatusHebrew() {
  return [liveStatusHebrew(), "", accountsHebrew()].join("\n");
}
