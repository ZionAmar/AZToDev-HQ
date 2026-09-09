/**
 * Classify a specialist finish so Noa routes: fix / tell ציון / next stage.
 */
export function triageSpecialistResult({
  agentId = "",
  name = "",
  text = "",
  ok = true,
} = {}) {
  const t = String(text || "");
  const label = name || agentId || "מומחה";

  if (
    /LOCKED: founder must send the action PIN/i.test(t) ||
    (/סיסמה|PIN/i.test(t) && /נעול|LOCKED|צריך סיסמה|action PIN/i.test(t))
  ) {
    return {
      kind: "waiting",
      waitingFor: "סיסמה בטלגרם",
      founderMustKnow: true,
      next: "אחרי הסיסמה ממשיכים את אותה משימה",
      summaryHe: `${label} מוכן להמשיך — חסר סיסמה.`,
    };
  }

  if (!ok || /0xC0000142|CURSOR_API_KEY|שגיאה חמורה|ECONNREFUSED/i.test(t)) {
    return {
      kind: "problem",
      waitingFor: "נועה מטפלת בתקלה",
      founderMustKnow: true,
      next: "נועה מתקנת או מבקשת ממך צעד ברור",
      summaryHe: `${label} נתקע. נועה רואה את זה ומטפלת — לא נזרק.`,
    };
  }

  if (/^DELEGATE:/im.test(t)) {
    return {
      kind: "next_stage",
      waitingFor: "",
      founderMustKnow: true,
      next: "עבר לשלב הבא בתור",
      summaryHe: `${label} סיים את השלב והעביר הלאה.`,
    };
  }

  return {
    kind: "done",
    waitingFor: "",
    founderMustKnow: true,
    next: "נועה בודקת אם יש שלב הבא או שזה נגמר",
    summaryHe: `${label} סיים.`,
  };
}

export function formatNoaUpdate({ name, triage, liveLine = "", preview = "" }) {
  const lines = [
    "נועה · עדכון זרימה",
    triage.summaryHe,
  ];
  if (triage.waitingFor) lines.push(`מחכה ל: ${triage.waitingFor}`);
  if (triage.next) lines.push(`הבא: ${triage.next}`);
  if (liveLine) lines.push(liveLine);
  const clip = String(preview || "").replace(/\s+/g, " ").trim().slice(0, 280);
  if (clip && triage.kind === "problem") lines.push("", clip);
  return lines.join("\n");
}
