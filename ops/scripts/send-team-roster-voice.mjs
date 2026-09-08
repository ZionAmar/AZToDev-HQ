/**
 * Detailed Hebrew voice roster — all 33 EMET agents (4 parts).
 * Usage: node ops/scripts/send-team-roster-voice.mjs
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { synthesizeSpeech } from "../../runtime/lib/telegram-tts.mjs";
import { sendFounderTelegramVoice } from "../../runtime/lib/telegram.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");
for (const line of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const PARTS = [
  {
    title: "חלק 1/4 — הנהלה",
    script: `ציון, נעה. מדריך העובדים של EMET — חלק אחד מארבעה: ההנהלה.

אחת, נעה, Noa. מנכ״ל. CEO — Chief Executive Officer, המנהל הראשי. אני. מדברת איתך בטלגרם, קובעת עדיפויות, מפעילה סוכנים, שומרת שערים — שום deploy בלי אישור שלך.

שתיים, אלי, Eli. סמנכ״ל תפעול. COO — Chief Operating Officer, מנהל תפעול. מסדר תהליכים, בעלות, WIP, runbooks, ומונע כאוס. שותף של PM ו-Tech Lead יומיומית.

שלוש, מיכל, Michal. סמנכ״ל כספים. CFO — Chief Financial Officer, מנהלת כספים. runway, עלויות AI, תמחור, unit economics. שואלת: כמה עולה כל פיצ'ר ומה ה-payback.

ארבע, אדם, Adam. סמנכ״ל טכנולוגיה. CTO — Chief Technology Officer, מנהל טכנולוגיה. החלטות ארכיטקטורה, ADR, אבטחת מערכת, leverage של AI בקוד בלי לקלקל.

חמש, מאיה, Maya. סמנכ״ל מוצר. CPO — Chief Product Officer, מנהלת מוצר. JTBD, roadmap, scope cuts, מה בונים ומה לא. מנהלת PM, Design, Research.

שש, ליאו, Leo. סמנכ״ל שיווק. CMO — Chief Marketing Officer, מנהל שיווק. positioning, messaging, קמפיינים, distribution. בלי claims בלי proof.

שבע, שרה, Sara. אנשים ותרבות. CHRO — Chief Human Resources Officer, אחראית אנשים. משפרת prompts, scorecards, retros, ואיכות הסוכנים כמו production systems.

זה היה חלק אחד. ממשיכים בחלק שתיים.`,
  },
  {
    title: "חלק 2/4 — מוצר ועיצוב",
    script: `חלק שתיים — מוצר, עיצוב, ומחקר.

שמונה, יונתן, Yonatan. מנהל מוצר. Product Manager — PM. מפרק אסטרטגיה ל-tickets, DoD, daily digests, sequencing. ה-hub בין Design ל-Eng. דיווח ל-CPO.

תשע, תמר, Tamar. מעצבת מוצר UX. Product Designer UX — UX Designer. flows, happy path, failure states, IA, cognitive load. מורידה בלבול מהממשק.

עשר, עידו, Ido. מעצב UI. UI Designer — User Interface Designer. design tokens, צבעים, typography, states, visual system. הופך UX ל-specs ש-Frontend בונה.

אחת-עשרה, יעל, Yael. חוקרת משתמשים. User Researcher — UX Research. interviews, synthesis, confidence levels, insights ל-CPO ו-PM. לא מכתיבה UI — מביאה evidence.

זה חלק שתיים. הבא: הנדסה.`,
  },
  {
    title: "חלק 3/4 — הנדסה ואיכות",
    script: `חלק שלוש — הנדסה, דאטה, AI, DevOps, אבטחה, QA.

שניים-עשר, רועי, Roi. ראש צוות פיתוח. Tech Lead — Technical Lead. מנהל Backend, Frontend, QA יומיומית. PR hygiene, critical path, stop-loss. דיווח ל-CTO.

שלוש-עשרה, דניאל, Daniel. ארכיטקט תוכנה. Software Architect — System Architect. ADR, boundaries, data modeling, API surfaces. דוחג על over-engineering.

ארבע-עשרה, עומר, Omar. מהנדס Backend. Backend Engineer — Server-side Developer. API, DB, validation, error handling, tests. מספק חוזה יציב ל-Frontend.

חמש-עשרה, נינה, Nina. מהנדסת Frontend. Frontend Engineer — Client-side Developer. React, components, accessibility, states, responsive. בונה מה ש-UI/UX מגדירים.

שש-עשרה, אבי, Avi. מהנדס מובייל. Mobile Engineer — iOS/Android Developer. Expo, offline, permissions, store releases, TestFlight. KidNest mobile/tv.

שבע-עשרה, לינה, Lina. מהנדסת דאטה. Data Engineer — Data Pipeline Engineer. schemas, pipelines, dbt, freshness, PII hygiene. tables שאפשר לסמוך עליהם.

שמונה-עשרה, עזרא, Ezra. מהנדס AI/ML. ML AI Engineer — Machine Learning Engineer. prompts, evals, agent tools, cost/latency budgets, fallbacks.

תשע-עשרה, כריס, Chris. DevOps פלטפורמה. DevOps Platform Engineer — Infrastructure Engineer. CI/CD, deploy, secrets, rollback, env parity. production deploy רק אחרי gate.

עשרים, דנה, Dana. מהנדסת אבטחה. Security Engineer — AppSec. threat models, auth, IDOR, severity findings. veto רק על סיכון אמיתי.

עשרים-ואחת, הלנה, Helena. QA SDET — Quality Assurance Software Development Engineer in Test. repro steps, automation, release gate, מפרקת «עובד عندי».

זה חלק שלוש. אחרון: growth, מכירות, תמיכה.`,
  },
  {
    title: "חלק 4/4 — צמיחה, מכירות, תמיכה",
    script: `חלק ארבע — growth, marketing, sales, success, analytics, legal, delivery.

עשרים-ושתיים, בן, Ben. ליד Growth. Growth Lead — Growth Product Manager. activation, retention, experiments, funnels, feature flags. kill fast.

עשרים-ושלוש, רוני, Roni. תוכן שיווקי. Content Marketing — Marketing Writer. blogs, stories, assets, proof-based copy. draft → CMO approve.

עשרים-וארבע, גיל, Gil. מומחה SEO. SEO Specialist — Search Engine Optimization. keyword clusters, intent, technical SEO tickets ל-FE.

עשרים-וחמש, שירה, Shira. פרסום ממומן. Performance Marketing — Paid Ads Manager. CAC, UTM, creative tests, kill criteria. spend רק אחרי gate.

עשרים-ושש, טל, Tal. קהילה ורשתות. Community Social — Social Media Manager. Telegram, posts, tone, engagement, crisis escalation.

עשרים-ושבע, ג'ורדן, Jordan. מכירות. Sales — Account Executive. discovery, demos, qualification, forecast. custom terms → Legal.

עשרים-ושמונה, הילה, Hila. הצלחת לקוחות. Customer Success — CS Manager. onboarding, health scores, retention, feedback ל-Product.

עשרים-ותשע, נועם, Noam. תמיכה. Support — Customer Support. tickets, macros, empathy, repro steps ל-Eng. severity rubric.

שלושים, אור, Or. אנליטיקה BI. Analytics BI — Business Intelligence Analyst. metric definitions, dashboards, North Star, caveats.

שלושים-ואחת, אווה, Ava. משפטי וציות. Legal Compliance — Legal Counsel. privacy, ToS, claims hygiene, DPA. high stakes → human counsel.

שלושים-ושתיים, תום, Tom. תפעול פיננסי. Finance Ops — Billing Operations. Stripe, invoices, dunning, reconciliation.

שלושים-ושלוש, קים, Kim. ליד Delivery. Delivery Lead — Scrum Master / Delivery Manager. WIP limits, blocker age, demo readiness, boards.

סיום. שלושים ושלושה עובדים. EMET מוכנה. שאלות — כתוב לנעה.`,
  },
];

const START = parseInt(process.env.START_PART || "1", 10);

for (let i = START - 1; i < PARTS.length; i++) {
  const part = PARTS[i];
  console.log(`Synthesizing ${part.title}…`);
  const audio = await synthesizeSpeech(part.script, { voice: "nova" });
  if (!audio?.path) {
    console.error(JSON.stringify({ ok: false, part: i + 1, error: "TTS failed" }));
    process.exit(1);
  }
  await sendFounderTelegramVoice(audio.path, {
    caption: `נעה — ${part.title} (צוות EMET)`,
    silent: false,
  });
  console.log(JSON.stringify({ ok: true, part: i + 1, title: part.title }));
  if (i < PARTS.length - 1) await new Promise((r) => setTimeout(r, 1500));
}

console.log(JSON.stringify({ ok: true, parts: PARTS.length }));
