/**
 * Generate Noa voice summary and send to founder Telegram.
 * Usage: node ops/scripts/send-noa-voice-summary.mjs
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

const SCRIPT = `ציון, נעה. בקול.

יש לך חברת סוכנים על המחשב. אני בטלגרם. שלושים ושלושה תפקידים. KidNest, Linear, שערים.

מה לא עבד? הבטחנו — לא עשינו. Linear היה ריק. KidNest חיכה. זה theater, לא חברה.

תום אבן? Claude Code עם Opus בטרמינל. תוכן, marketing, פשוט. הוא לא בונה SaaS עם QA כמו KidNest. Inspiration — לא replacement.

אתה על Cursor, runtime, Telegram. נכון ל-SaaS. מורכב יותר, חזק יותר ל-product.

KidNest: חמש מתוך עשרים וחמש. Production חי. עשרים ושבעה ערוצים תויגו. דוח — עדיין לא.

מה צריך? dispatch אמיתי. שתיים-שלוש משימות במקביל. artifact או שקט — לא «עובדים».

Hybrid: EMET ל-product. Claude Code ל-content — אם תרצה.

What's the bet? KidNest מסודר, דוח אליך. כתוב «תמשיכי» — ואני דוחפת.`;

const audio = await synthesizeSpeech(SCRIPT, { voice: "nova" });
if (!audio?.path) {
  console.error(JSON.stringify({ ok: false, error: "TTS failed" }));
  process.exit(1);
}

const sent = await sendFounderTelegramVoice(audio.path, {
  caption: "נעה — מסקנות בקול",
  silent: false,
});

console.log(JSON.stringify({ ok: true, path: audio.path, sent }));
