import { DatabaseSync } from "node:sqlite";

const DB =
  "C:/Users/amazi/AppData/Roaming/Cursor/User/globalStorage/state.vscdb";

const db = new DatabaseSync(DB, { readOnly: true });
const rows = db
  .prepare(`SELECT key, value FROM ItemTable WHERE key LIKE 'mcpOAuth.secret.%'`)
  .all();

for (const row of rows) {
  const b64 = row.key.replace("mcpOAuth.secret.", "");
  let decoded = "";
  try {
    decoded = Buffer.from(b64, "base64").toString("utf8");
  } catch {
    decoded = "(decode fail)";
  }
  let shape = "non-json";
  try {
    const p = JSON.parse(String(row.value));
    shape = Object.keys(p).join(",");
  } catch {
    shape = `raw len ${String(row.value).length}`;
  }
  console.log(decoded, "|", shape);
}
