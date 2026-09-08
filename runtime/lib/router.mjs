import fs from "fs";
import path from "path";
import { ROOT } from "./paths.mjs";

const AGENTS_DIR = path.join(ROOT, "agents");

/** Keyword / mention router — free Hebrew/English → agent folder id */
const RULES = [
  { id: "00-ceo", keys: ["נועה","נעה","noa","נורה","nura"] },
  { id: "01-coo", keys: ["אורן","oren","אורן","eli"] },
  { id: "02-cfo", keys: ["גילה","gila","גילה","michal"] },
  { id: "03-cto", keys: ["שחר","shahar","אדם","adam"] },
  { id: "04-cpo", keys: ["ענבר","inbar","ענבר","maya"] },
  { id: "05-cmo", keys: ["אלון","alon","אלון","leo"] },
  { id: "06-chro", keys: ["רינה","rina","רינה","sara"] },
  { id: "07-product-manager", keys: ["עמית","amit","עמית","yonatan"] },
  { id: "08-product-designer-ux", keys: ["הגר","hagar","הגר","tamar"] },
  { id: "09-ui-designer", keys: ["בועז","boaz","בועז","ido"] },
  { id: "10-user-researcher", keys: ["קרן","keren","קרן","yael"] },
  { id: "11-tech-lead", keys: ["אילן","ilan","אילן","roi"] },
  { id: "12-software-architect", keys: ["יונה","yonah","יונה","daniel"] },
  { id: "13-backend-engineer", keys: ["רז","raz","רז","omar"] },
  { id: "14-frontend-engineer", keys: ["דפנה","dafna","דפנה","nina"] },
  { id: "15-mobile-engineer", keys: ["ארז","erez","אבי","avi"] },
  { id: "16-data-engineer", keys: ["שני","shani","שני","lina"] },
  { id: "17-ml-ai-engineer", keys: ["אסף","asaf","אסף","ezra"] },
  { id: "18-devops-platform", keys: ["פז","paz","פז","chris"] },
  { id: "19-security-engineer", keys: ["ליב","liv","ליב","dana"] },
  { id: "20-qa-sdet", keys: ["אורי","ori","אורי","helena"] },
  { id: "21-growth-lead", keys: ["מתן","matan","בן","ben"] },
  { id: "22-content-marketing", keys: ["יערה","yaara","יערה","roni"] },
  { id: "23-seo-specialist", keys: ["דרור","dror","גיל","gil"] },
  { id: "24-performance-marketing", keys: ["ליחי","lihi","ליחי","shira"] },
  { id: "25-community-social", keys: ["עופרי","ofri","טל","tal"] },
  { id: "26-sales", keys: ["גיא","guy","גיא","jordan"] },
  { id: "27-customer-success", keys: ["עדי","adi","עדי","hila"] },
  { id: "28-support", keys: ["חן","chen","נועם","noam"] },
  { id: "29-analytics-bi", keys: ["ניב","niv","אור","or"] },
  { id: "30-legal-compliance", keys: ["סמדר","smadar","סמדר","ava"] },
  { id: "31-finance-ops", keys: ["אלוןר","lior","תום","tom"] },
  { id: "32-delivery-lead", keys: ["קשת","keshet","קשת","kim"] },
  { id: "33-household-ops", keys: ["רות","ruth","בית","מיילים","חשבונות"] },
  { id: "34-pc-ops", keys: ["נדב","nadav","מחשב"] },
  { id: "35-server-ops", keys: ["תמיר","tamir","שרת","chemicloud"] },
];

const ALIASES = {
  ceo: "00-ceo",
  pm: "07-product-manager",
  "nura": "00-ceo",
  "נורה": "00-ceo",
  "noa": "00-ceo",
  "נועה": "00-ceo",
  "נעה": "00-ceo",
  "oren": "01-coo",
  "אורן": "01-coo",
  "eli": "01-coo",
  "אורן": "01-coo",
  "gila": "02-cfo",
  "גילה": "02-cfo",
  "michal": "02-cfo",
  "גילה": "02-cfo",
  "shahar": "03-cto",
  "שחר": "03-cto",
  "adam": "03-cto",
  "אדם": "03-cto",
  "inbar": "04-cpo",
  "ענבר": "04-cpo",
  "maya": "04-cpo",
  "ענבר": "04-cpo",
  "alon": "05-cmo",
  "אלון": "05-cmo",
  "leo": "05-cmo",
  "אלון": "05-cmo",
  "rina": "06-chro",
  "רינה": "06-chro",
  "sara": "06-chro",
  "רינה": "06-chro",
  "amit": "07-product-manager",
  "עמית": "07-product-manager",
  "yonatan": "07-product-manager",
  "עמית": "07-product-manager",
  "hagar": "08-product-designer-ux",
  "הגר": "08-product-designer-ux",
  "tamar": "08-product-designer-ux",
  "הגר": "08-product-designer-ux",
  "boaz": "09-ui-designer",
  "בועז": "09-ui-designer",
  "ido": "09-ui-designer",
  "בועז": "09-ui-designer",
  "keren": "10-user-researcher",
  "קרן": "10-user-researcher",
  "yael": "10-user-researcher",
  "קרן": "10-user-researcher",
  "ilan": "11-tech-lead",
  "אילן": "11-tech-lead",
  "roi": "11-tech-lead",
  "אילן": "11-tech-lead",
  "yonah": "12-software-architect",
  "יונה": "12-software-architect",
  "daniel": "12-software-architect",
  "יונה": "12-software-architect",
  "raz": "13-backend-engineer",
  "רז": "13-backend-engineer",
  "omar": "13-backend-engineer",
  "רז": "13-backend-engineer",
  "dafna": "14-frontend-engineer",
  "דפנה": "14-frontend-engineer",
  "nina": "14-frontend-engineer",
  "דפנה": "14-frontend-engineer",
  "erez": "15-mobile-engineer",
  "ארז": "15-mobile-engineer",
  "avi": "15-mobile-engineer",
  "אבי": "15-mobile-engineer",
  "shani": "16-data-engineer",
  "שני": "16-data-engineer",
  "lina": "16-data-engineer",
  "שני": "16-data-engineer",
  "asaf": "17-ml-ai-engineer",
  "אסף": "17-ml-ai-engineer",
  "ezra": "17-ml-ai-engineer",
  "אסף": "17-ml-ai-engineer",
  "paz": "18-devops-platform",
  "פז": "18-devops-platform",
  "chris": "18-devops-platform",
  "פז": "18-devops-platform",
  "liv": "19-security-engineer",
  "ליב": "19-security-engineer",
  "dana": "19-security-engineer",
  "ליב": "19-security-engineer",
  "ori": "20-qa-sdet",
  "אורי": "20-qa-sdet",
  "helena": "20-qa-sdet",
  "אורי": "20-qa-sdet",
  "matan": "21-growth-lead",
  "מתן": "21-growth-lead",
  "ben": "21-growth-lead",
  "בן": "21-growth-lead",
  "yaara": "22-content-marketing",
  "יערה": "22-content-marketing",
  "roni": "22-content-marketing",
  "יערה": "22-content-marketing",
  "dror": "23-seo-specialist",
  "דרור": "23-seo-specialist",
  "gil": "23-seo-specialist",
  "גיל": "23-seo-specialist",
  "lihi": "24-performance-marketing",
  "ליחי": "24-performance-marketing",
  "shira": "24-performance-marketing",
  "ליחי": "24-performance-marketing",
  "ofri": "25-community-social",
  "עופרי": "25-community-social",
  "tal": "25-community-social",
  "טל": "25-community-social",
  "guy": "26-sales",
  "גיא": "26-sales",
  "jordan": "26-sales",
  "גיא": "26-sales",
  "adi": "27-customer-success",
  "עדי": "27-customer-success",
  "hila": "27-customer-success",
  "עדי": "27-customer-success",
  "chen": "28-support",
  "חן": "28-support",
  "noam": "28-support",
  "נועם": "28-support",
  "niv": "29-analytics-bi",
  "ניב": "29-analytics-bi",
  "or": "29-analytics-bi",
  "אור": "29-analytics-bi",
  "smadar": "30-legal-compliance",
  "סמדר": "30-legal-compliance",
  "ava": "30-legal-compliance",
  "סמדר": "30-legal-compliance",
  "lior": "31-finance-ops",
  "אלוןר": "31-finance-ops",
  "tom": "31-finance-ops",
  "תום": "31-finance-ops",
  "keshet": "32-delivery-lead",
  "קשת": "32-delivery-lead",
  "kim": "32-delivery-lead",
  "ruth": "33-household-ops",
  "רות": "33-household-ops",
  "nadav": "34-pc-ops",
  "נדב": "34-pc-ops",
  "tamir": "35-server-ops",
  "תמיר": "35-server-ops",
  "קשת": "32-delivery-lead",
};

export function listAgentIds() {
  if (!fs.existsSync(AGENTS_DIR)) return [];
  return fs.readdirSync(AGENTS_DIR).filter((d) =>
    fs.existsSync(path.join(AGENTS_DIR, d, "SYSTEM_PROMPT.md"))
  );
}

export function readAgentName(id) {
  const p = path.join(AGENTS_DIR, id, "PERSONALITY.md");
  if (!fs.existsSync(p)) return id;
  const text = fs.readFileSync(p, "utf8");
  const m = text.match(/^# Personality — ([^(]+)/m);
  return m ? m[1].trim() : id;
}

/**
 * Route founder free-text to an agent.
 * Supports: @backend, @רז, @13-backend-engineer
 */
export function routeMessage(text) {
  const raw = String(text || "").trim();
  const lower = raw.toLowerCase();

  const mention = raw.match(/@([\w\u0590-\u05FF\-]+)/);
  if (mention) {
    const token = mention[1];
    const alias = ALIASES[token.toLowerCase()] || ALIASES[token];
    if (alias) return { agentId: alias, confidence: 0.95, reason: `mention @${token}` };
    const ids = listAgentIds();
    const hit = ids.find((id) => id === token || id.endsWith(token) || id.includes(token));
    if (hit) return { agentId: hit, confidence: 0.95, reason: `mention @${token}` };
  }

  let best = { id: "00-ceo", score: 0 };
  for (const rule of RULES) {
    let score = 0;
    for (const k of rule.keys) {
      if (lower.includes(k.toLowerCase()) || raw.includes(k)) score += 1;
    }
    if (score > best.score) best = { id: rule.id, score };
  }

  if (best.score === 0) {
    return {
      agentId: "00-ceo",
      confidence: 0.4,
      reason: "no clear match — CEO routes / decides",
    };
  }

  return {
    agentId: best.id,
    confidence: Math.min(0.55 + best.score * 0.15, 0.92),
    reason: `keyword score ${best.score}`,
  };
}
