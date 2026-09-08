/**
 * Notify founder that gated Hebrew task pipeline is armed.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
function loadEnv() {
  const p = path.join(ROOT, ".env");
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnv();

const { sendFounderTelegram } = await import("../lib/telegram.mjs");
const { sendFounderEmail } = await import("../lib/mail.mjs");
const { synthesizeSpeech, ttsConfigured } = await import("../lib/telegram-tts.mjs");
const { sendFounderTelegramVoice } = await import("../lib/telegram.mjs");
const { boardStatusHebrew, pickNextTask, readPipeline } = await import("../lib/task-board.mjs");

const next = pickNextTask();
const pipe = readPipeline();
const board = boardStatusHebrew();

const text = `הגדרתי את צינור המשימות כמו שביקשת:

1) כל המשימות בעברית + סטטוס מתעדכן
2) אחרי כל משימה — דוח כתוב + דוח קולי בטלגרם + מייל מסודר
3) ממשיכים אוטומטית רק אחרי שתאשר («כן» / «המשך» / «אשר»)
4) אפשר לצפות מרחוק ב־Linear (סונכרן) ובלוח המקומי

המשימה הבאה בתור:
${next ? `${next.id} — ${next.titleHe || next.title}` : "אין"}

APPROVE: כתוב «כן» ואתחיל אותה עכשיו.`;

await sendFounderTelegram(text, { silent: false });

if (ttsConfigured()) {
  const audio = await synthesizeSpeech(
    `ציון, הגדרתי משימות בעברית עם סטטוס. אחרי כל משימה תקבלי דוח קולי ומייל, ואמשיך רק אחרי שתאשר. הבאה: ${next?.titleHe || next?.title || "אין"}. כתוב כן כדי שאתחיל.`
  );
  if (audio?.path) {
    await sendFounderTelegramVoice(audio.path, {
      caption: "צינור משימות · ממתין לאישור",
      silent: false,
    });
  }
}

await sendFounderEmail({
  subject: "EMET · צינור משימות בעברית מוכן — ממתין לאישורך להתחיל",
  text: `${text}\n\n${board}`,
  html: `<div dir="rtl" style="font-family:Segoe UI,Arial,sans-serif;line-height:1.55;max-width:720px">
  <h2>צינור משימות EMET</h2>
  <p>משימות בעברית · סטטוס מתעדכן · דוח קולי + מייל אחרי כל משימה · המשך רק אחרי אישורך.</p>
  <p><strong>הבאה:</strong> ${next ? `${next.id} — ${next.titleHe || next.title}` : "אין"}</p>
  <p style="background:#f6f3ee;padding:12px;border-radius:8px"><strong>APPROVE</strong> — השב בטלגרם «כן»</p>
  <pre style="white-space:pre-wrap;background:#fafafa;padding:12px;font-size:13px">${board.replace(/</g,"&lt;")}</pre>
</div>`,
});

console.log("notified", { next: next?.id, waiting: pipe.waitingFounder });
