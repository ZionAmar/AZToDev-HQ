import { DatabaseSync } from "node:sqlite";

const dbPath =
  "C:/Users/amazi/AppData/Roaming/Cursor/User/globalStorage/state.vscdb";

try {
  const db = new DatabaseSync(dbPath, { readOnly: true });
  const rows = db
    .prepare(
      `SELECT key, length(value) as len FROM ItemTable
       WHERE key LIKE '%mcp%' OR key LIKE '%linear%' OR key LIKE '%oauth%' OR key LIKE '%Mcp%'
       LIMIT 100`
    )
    .all();
  console.log(JSON.stringify(rows, null, 2));
} catch (e) {
  console.error("err", e.message);
}
