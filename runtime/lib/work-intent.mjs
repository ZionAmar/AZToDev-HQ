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
  return /חדשות|האיי-?אי|ai news|בינה מלאכותית|hamivzakk|המבזק|tech news/i.test(
    String(text || "")
  );
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
    if (
      id === "33-household-ops" &&
      t &&
      !isExplicitMailAsk(t) &&
      !isExplicitNewsAsk(t) &&
      !/רות/.test(t)
    ) {
      journal("delegate_dropped_unsolicited", { agentId: id, reason: "no_mail_or_news_ask" });
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
