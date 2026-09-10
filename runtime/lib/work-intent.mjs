/**
 * HQ judges who may run. Cloud DELEGATE spray is not enough.
 */
import { journal } from "./paths.mjs";

export function isExplicitServerAsk(text) {
  const t = String(text || "");
  return /(?:^|[\s,])תמיר(?:\s|$)|(?:תבדוק|תבדקי|בדוק|בדקי) את (?:ה)?שרת|סטטוס (?:ה)?שרת|זיכרון בשרת|עומס (?:על )?השרת|swap|בדיקת (?:ה)?שרת|apache|vps\s+(?:סטטוס|בדיקה)|chemicloud.{0,20}(?:סטטוס|בדיקה|swap|ram)/i.test(
    t
  );
}

export function isExplicitMailAsk(text) {
  return /מייל|gmail|חשבונית|כביש\s*6|כרמל|pdf|inbox|חשבון/i.test(
    String(text || "")
  );
}

export function isExplicitNewsAsk(text) {
  return /חדשות|מבזק|news|(?:^|\s)ai(?:\s|$)|איי.?איי|בינה\s*מלאכותית|artificial intelligence/i.test(
    String(text || "")
  );
}

export function isExplicitHouseholdAsk(text) {
  return isExplicitMailAsk(text) || isExplicitNewsAsk(text);
}

/** Founder explicitly wants a fresh run — bypass queue dedupe. */
export function isForceRetryAsk(text) {
  const t = String(text || "").trim();
  return /^(?:שוב\s*(?:ו)?עכשיו|נס(?:י|ה)\s*שוב|תנס(?:י|ה)\s*שוב|עוד\s*פעם|retry|again)\s*[!.?]*$/i.test(
    t
  );
}

/** Pull the last founder action line from a Telegram thread snippet. */
export function lastFounderActionFromThread(thread) {
  const lines = String(thread || "").split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(/^founder:\s*(.+)$/i);
    if (!m) continue;
    const body = m[1].trim();
    if (!body || /^(?:אשר|קדימה|סטטוס|שיחה חדשה)$/i.test(body)) continue;
    if (isForceRetryAsk(body)) continue;
    return body;
  }
  return "";
}

export function isExplicitPcAsk(text) {
  const t = String(text || "");
  return /דיסק|תיקי[הה]|windows|שולחן העבודה|במחשב|C:\\|מקום פנוי|קבצים אצלי|גיטהב|github|העלה\s+ל|ריפו/i.test(
    t
  );
}

export function isExplicitKeshetAsk(text) {
  const t = String(text || "");
  return /קשת|keshet|תבנו|גיטהב|github|העלה\s+ל|ריפו|מוצר|אפליקצי/i.test(t);
}

/**
 * Drop unsolicited specialists (especially Tamir server scans).
 * founderText of the ORIGINAL ask must travel with the chain.
 */
export function filterJobsForFounderAsk(jobs, founderText = "") {
  const t = String(founderText || "").trim();
  const out = [];
  const seen = new Set();
  for (const j of jobs || []) {
    const id = String(j?.agentId || "").trim();
    const task = String(j?.task || "").trim();
    if (!id || !task) continue;
    if (seen.has(id)) {
      journal("delegate_dropped_duplicate", { agentId: id });
      continue;
    }
    if (id === "35-server-ops" && !isExplicitServerAsk(t)) {
      journal("delegate_dropped_unsolicited", { agentId: id, reason: "no_server_ask" });
      continue;
    }
    if (id === "33-household-ops" && t && !isExplicitHouseholdAsk(t) && !/רות/.test(t)) {
      journal("delegate_dropped_unsolicited", { agentId: id, reason: "no_household_ask" });
      continue;
    }
    if (
      id === "34-pc-ops" &&
      t &&
      !isExplicitPcAsk(t) &&
      !/נדב/.test(t)
    ) {
      journal("delegate_dropped_unsolicited", { agentId: id, reason: "no_pc_ask" });
      continue;
    }
    if (id === "00-ceo") continue;
    seen.add(id);
    out.push({ agentId: id, task });
  }
  return out;
}
