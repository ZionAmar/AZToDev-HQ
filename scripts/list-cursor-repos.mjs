import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { listCursorGithubRepos } from "../hq/lib/cloud-work.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = path.join(ROOT, ".env");
if (fs.existsSync(p)) {
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
}

const listed = await listCursorGithubRepos();
if (!listed.ok) {
  console.log("FAIL", listed.error);
  process.exit(1);
}
const repos = listed.repos || [];
console.log("count", repos.length);
for (const r of repos.slice(0, 20)) {
  if (typeof r === "string") console.log(r);
  else console.log(r.fullName || r.name || r.url || JSON.stringify(r).slice(0, 120));
}
