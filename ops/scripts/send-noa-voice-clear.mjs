/**
 * Clear Hebrew voice summary for founder.
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

const SCRIPT = `ציון, נעה. גרסה ברורה.

חלק אחת — מה יש לך.
יש לך חברת AI על המחשב. שלושים ושלושה סוכנים. אני בטלגרם. Linear למשימות בטלפון. KidNest — הפרויקט שביקשת לבדוק.

חלק שתיים — מה לא עבד.
אמרנו «עובדים», «שולחים לינקים» — בלי לעשות. Linear היה ריק. KidNest חיכה. הבעיה: דיבור בלי ביצוע. Theater.

חלק שלוש — תום אבן.
הוא מלמד צוות AI. Claude Code בטרמינל. טוב לתוכן ו-marketing. פחות ל-SaaS עם production. השראה — לא תחליף.

חלק ארבע — EMET, השיטה שלך.
Cursor לקוד. Telegram אליי. Linear בטלפון. שערים — לא deploy בלי אישור. טוב ל-KidNest ומוצרים אמיתיים.

חלק חמש — KidNest עכשיו.
עשרים וחמש משימות. חמש הושלמו. Production חי — האתר עובד. עשרים ושבעה ערוצים קיבלו קטגוריה. דוח אליך — עדיין לא.

חלק שש — מה הלאה.
אני מפעילה שנייה-שלושה סוכנים. כל משימה עם תוצאה. עדכון כשנגמר. דוח KidNest בסוף.

משפט אחד: EMET נכונה ל-SaaS. תום לתוכן. תקן dispatch — ותקבל מה שרצית.
כתוב «תמשיכי KidNest» — ואני ממשיכה.`;

const audio = await synthesizeSpeech(SCRIPT, { voice: "nova" });
if (!audio?.path) {
  console.error(JSON.stringify({ ok: false, error: "TTS failed" }));
  process.exit(1);
}

await sendFounderTelegramVoice(audio.path, {
  caption: "נעה — הסבר ברור (6 חלקים)",
  silent: false,
});

console.log(JSON.stringify({ ok: true, path: audio.path }));
