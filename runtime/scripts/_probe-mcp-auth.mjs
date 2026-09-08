import { DatabaseSync } from "node:sqlite";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const paths = [
  "C:/Users/amazi/AppData/Roaming/Cursor/User/globalStorage/state.vscdb",
];

// workspace storage
const wsRoot = "C:/Users/amazi/AppData/Roaming/Cursor/User/workspaceStorage";
if (existsSync(wsRoot)) {
  for (const dir of readdirSync(wsRoot)) {
    paths.push(join(wsRoot, dir, "state.vscdb"));
  }
}

for (const dbPath of paths) {
  if (!existsSync(dbPath)) continue;
  try {
    const db = new DatabaseSync(dbPath, { readOnly: true });
    const rows = db
      .prepare(
        `SELECT key, length(value) as len FROM ItemTable
         WHERE lower(key) LIKE '%mcp%'
            OR lower(key) LIKE '%linear%'
         LIMIT 200`
      )
      .all();
    if (rows.length) {
      console.log("DB:", dbPath);
      console.log(JSON.stringify(rows, null, 2));
    }
  } catch (e) {
    /* skip */
  }
}

// mcp-auth dirs
for (const base of [
  "C:/Users/amazi/.mcp-auth",
  "C:/Users/amazi/AppData/Roaming/Cursor/User/globalStorage/cursor.mcp",
]) {
  if (!existsSync(base)) continue;
  console.log("DIR:", base, readdirSync(base));
}
