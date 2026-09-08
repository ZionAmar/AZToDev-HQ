/**
 * Session summary voice — 2026-09-07 afternoon
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

const SCRIPT = `ציון, נעה. סיכום היום בקול.

חלק אחד — מי אתה ואיפה.
הכרנו פנים אל פנים. אתה בטבריה, משם אתה מנהל. הטלפון שלך שמרתי. אני נקודת הקשר שלך בטלגרם.

חלק שתיים — מה היה שבור.
שאלת סטטוס — וקיבלת ארכיון. KidNest audit שכבר נסגר, landing שכבר killed. state.json היה מיושן. זה באג, לא אתה.

חלק שלוש — מה תיקנו.
קים סגר OPS-HYGIENE. ניקינו waiting ישן, עדכנו תאריך, סגרנו initiatives מתים, sync ל-checkpoint. הכל מתועד ב-ops/meetings/2026-09-07_ops-hygiene-fix.md.

חלק ארבע — מצגת Rakza, איפה עומדים.
זה ה-WIP האמיתי עכשיו. יונתן סיים INV-01: עבר על כל המסכים, עשרים ושבע screenshots, קטalog ב-screen-catalog.md. מודולים: admin, סוכנים, מחסן, נהגים, super-admin.

חלק חמש — מה הבא.
רוני בונה PowerPoint שיווקי, שבע דקות עברית, עם script. אחר כך מסירה למייל שלך. Linear — כשאפשר.

חלק שש — פרוטוקול מעכשיו.
כל משימה: תפקיד ברור, Linear, artifact על הדיסק, עדכון שלב שלב בטלגרם. בלי theater.

משפט אחד: הבאג נסגר, Rakza באמצע — PPT הבא בתור.
אם מסכים — כתוב «תמשיכי Rakza».`;

const audio = await synthesizeSpeech(SCRIPT, { voice: "nova" });
if (!audio?.path) {
  console.error(JSON.stringify({ ok: false, error: "TTS failed" }));
  process.exit(1);
}

const sent = await sendFounderTelegramVoice(audio.path, {
  caption: "נעה — סיכום היום (6 חלקים)",
  silent: false,
});

console.log(JSON.stringify({ ok: true, path: audio.path, sent }));
