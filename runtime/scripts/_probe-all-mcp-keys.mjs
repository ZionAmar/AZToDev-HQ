import { DatabaseSync } from "node:sqlite";
import { join } from "node:path";

const dbPath = join(
  process.env.APPDATA,
  "Cursor/User/globalStorage/state.vscdb"
);

const db = new DatabaseSync(dbPath, { readOnly: true });
const rows = db
  .prepare(
    `SELECT key, length(value) as len
     FROM ItemTable
     WHERE lower(key) LIKE '%mcp%'
     ORDER BY len DESC
     LIMIT 200`
  )
  .all();

console.log(JSON.stringify(rows, null, 2));
