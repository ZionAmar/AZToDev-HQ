import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!(k in process.env)) process.env[k] = v;
  }
}

const photoArg = process.argv[2];
const caption = process.argv[3] || "";
const photo = photoArg
  ? path.resolve(photoArg)
  : path.join(ROOT, "agents", "00-ceo", "noa-portrait.png");

const { sendFounderTelegramPhoto } = await import("../lib/telegram.mjs");
const out = await sendFounderTelegramPhoto(photo, { caption, silent: true });
console.log(JSON.stringify(out, null, 2));
