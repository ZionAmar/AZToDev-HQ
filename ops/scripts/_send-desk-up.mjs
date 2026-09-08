import { loadDotEnv } from "../../runtime/lib/load-env.mjs";
import { sendFounderTelegram } from "../../runtime/lib/telegram.mjs";

loadDotEnv();

const text = `הדלפק עלה ל-ChemiCloud.

איפה: תיקייה חדשה /home/aztodevc/aztodev-desk בלבד.
האתרים (NestTube, WorkClock וכו') לא נגעו — Passenger עדיין רץ.

מה חי: טלגרם. מאזין מ-127.0.0.1:8788. בלי Cursor מקומי על השרת.

מה עדיין חסר לשיחה מלאה עם נועה: ריפו מפקדה פרטי ב-GitHub (GITHUB_HQ_REPO). עד אז — «סטטוס» / «עזרה» / «שיחה חדשה».

המחשב שלך כבר לא צריך להריץ HQ בשביל הטלגרם.`;

await sendFounderTelegram(text, { silent: false });
console.log("sent");
