import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(
  "C:/Users/amazi/AppData/Roaming/Cursor/User/workspaceStorage/c7674e0b04430157b1fb169da7845b3f/state.vscdb",
  { readOnly: true }
);
const row = db
  .prepare(
    `SELECT value FROM ItemTable WHERE key='workbench.customize.primitiveSourceSnapshot.mcps.v3'`
  )
  .get();
console.log(String(row?.value || ""));
