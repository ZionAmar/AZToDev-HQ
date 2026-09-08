import { DatabaseSync } from "node:sqlite";

const DB =
  "C:/Users/amazi/AppData/Roaming/Cursor/User/globalStorage/state.vscdb";

const db = new DatabaseSync(DB, { readOnly: true });
const rows = db
  .prepare(`SELECT key, value FROM ItemTable WHERE key LIKE 'mcpOAuth.secret.%'`)
  .all();

for (const row of rows) {
  const b64 = row.key.replace("mcpOAuth.secret.", "");
  const decoded = Buffer.from(b64, "base64").toString("utf8");
  if (!decoded.includes("linear")) continue;
  console.log("KEY:", decoded);
  try {
    const p = JSON.parse(String(row.value));
    console.log("TOP:", Object.keys(p), "type=", p.type);
    if (p.data && typeof p.data === "object") {
      console.log("DATA keys:", Object.keys(p.data));
    } else if (typeof p.data === "string") {
      console.log("DATA string len:", p.data.length);
      try {
        const inner = JSON.parse(p.data);
        console.log("INNER keys:", Object.keys(inner));
      } catch {
        console.log("DATA not json");
      }
    }
  } catch (e) {
    console.log("parse err", e.message);
  }
}
