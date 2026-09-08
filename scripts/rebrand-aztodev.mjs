/**
 * AZTODEV rebrand: names, avatars, identity strings in live company files.
 * Skip historical ops/bus, meetings, reports.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const people = JSON.parse(
  fs.readFileSync(path.join(ROOT, "ops/config/people.json"), "utf8")
).people;

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name === "node_modules" || name === ".git") continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function initials(en) {
  return en.slice(0, 2).toUpperCase();
}

function avatarSvg(p) {
  const bg = `hsl(${p.hue} 42% 18%)`;
  const fg = `hsl(${p.hue} 70% 72%)`;
  const ring = `hsl(${p.hue} 55% 48%)`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${p.en}">
  <rect width="128" height="128" rx="64" fill="${bg}"/>
  <circle cx="64" cy="64" r="58" fill="none" stroke="${ring}" stroke-width="4"/>
  <text x="64" y="76" text-anchor="middle" font-family="Georgia, serif" font-size="42" font-weight="700" fill="${fg}">${initials(p.en)}</text>
</svg>
`;
}

function replaceIn(text, from, to) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}

const FACTORY_BLOCK = `---
AZTODEV FACTORY (mandatory)
Company: **AZTODEV**. Source of truth: \`_company/FACTORY.md\` + \`_company/ROSTER.md\` + \`_company/STACK.md\`.
Cloud-first private GitHub. WIP=1. Evidence (file/PR) or it did not happen.
Founder ציון: Hebrew. Code/PRs: Technical English.
You may open PRs while he sleeps. You may not prod-deploy, spend, publish, or commit secrets without his explicit yes.
---
`;

for (const p of people) {
  const dir = path.join(ROOT, "agents", p.id);
  if (!fs.existsSync(dir)) continue;

  fs.writeFileSync(path.join(dir, "avatar.svg"), avatarSvg(p), "utf8");

  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".md")) continue;
    const fp = path.join(dir, file);
    let t = fs.readFileSync(fp, "utf8");
    t = replaceIn(t, `# Personality — ${p.oldEn} (${p.oldHe})`, `# Personality — ${p.en} (${p.he})`);
    t = replaceIn(t, `Name: ${p.oldEn} (${p.oldHe})`, `Name: ${p.en} (${p.he})`);
    t = replaceIn(t, p.oldEn, p.en);
    t = replaceIn(t, p.oldHe, p.he);
    fs.writeFileSync(fp, t, "utf8");
  }

  const sp = path.join(dir, "SYSTEM_PROMPT.md");
  if (fs.existsSync(sp)) {
    let t = fs.readFileSync(sp, "utf8");
    t = replaceIn(t, "You work inside **EMET (אמת)**.", "You work inside **AZTODEV**.");
    t = replaceIn(t, "at EMET", "at AZTODEV");
    t = replaceIn(t, "in EMET", "in AZTODEV");
    if (!t.includes("AZTODEV FACTORY")) {
      const mottoEnd = t.indexOf("---\n---\nFOUNDER PROTOCOL");
      if (mottoEnd !== -1) {
        t = t.slice(0, mottoEnd + 4) + "\n" + FACTORY_BLOCK + t.slice(mottoEnd + 4);
      } else {
        t = FACTORY_BLOCK + t;
      }
    }
    fs.writeFileSync(sp, t, "utf8");
  }
}

const teamLines = [
  "# Team Directory — AZTODEV",
  "",
  "| ID | Name | Hebrew | Role |",
  "|----|------|--------|------|",
  ...people.map(
    (p) =>
      `| \`${p.id}\` | **${p.en}** | ${p.he} | ${p.role}${p.core ? " · **core**" : " · bench"} |`
  ),
  "",
  "Avatars: `agents/{id}/avatar.svg` (and `portrait.png` when present).",
  "Live rules: [`FACTORY.md`](./FACTORY.md) · [`ROSTER.md`](./ROSTER.md).",
];
fs.writeFileSync(path.join(ROOT, "_company/TEAM_DIRECTORY.md"), teamLines.join("\n") + "\n", "utf8");

const aliasLines = people
  .map((p) => {
    const a = [
      `  ${JSON.stringify(p.en.toLowerCase())}: ${JSON.stringify(p.id)},`,
      `  ${JSON.stringify(p.he)}: ${JSON.stringify(p.id)},`,
    ];
    if (p.oldEn) a.push(`  ${JSON.stringify(p.oldEn.toLowerCase())}: ${JSON.stringify(p.id)},`);
    if (p.oldHe) a.push(`  ${JSON.stringify(p.oldHe)}: ${JSON.stringify(p.id)},`);
    return a.join("\n");
  })
  .join("\n");

const keyLines = people
  .map((p) => {
    const keys = [p.he, p.en.toLowerCase(), p.oldHe, p.oldEn?.toLowerCase()].filter(Boolean);
    return `  { id: ${JSON.stringify(p.id)}, keys: ${JSON.stringify(keys)} },`;
  })
  .join("\n");

const routerPath = path.join(ROOT, "runtime/lib/router.mjs");
let router = fs.readFileSync(routerPath, "utf8");
router = router.replace(
  /const RULES = \[[\s\S]*?\];/,
  `const RULES = [\n${keyLines}\n];`
);
router = router.replace(
  /const ALIASES = \{[\s\S]*?\};/,
  `const ALIASES = {\n  ceo: "00-ceo",\n  pm: "07-product-manager",\n${aliasLines}\n};`
);
fs.writeFileSync(routerPath, router, "utf8");

const liveRoots = [
  path.join(ROOT, "_company"),
  path.join(ROOT, "_shared"),
  path.join(ROOT, "dashboard"),
  path.join(ROOT, "runtime"),
  path.join(ROOT, "ops", "config"),
  path.join(ROOT, "ops", "intake", "templates"),
];
const liveFiles = [
  path.join(ROOT, "AGENTS.md"),
  path.join(ROOT, "README.md"),
  path.join(ROOT, "package.json"),
  path.join(ROOT, "ops", "state.json"),
];
for (const r of liveRoots) liveFiles.push(...walk(r));

const uniqueFirst = people.filter((p) =>
  !["Adam", "Ben", "Tom", "Or", "Tal", "Gil", "Avi", "Noam", "Chen", "Adi", "Guy"].includes(p.oldEn)
);

for (const fp of liveFiles) {
  if (fp.includes(`${path.sep}ops${path.sep}bus`)) continue;
  if (fp.endsWith("TOM_EVEN_PARITY.md")) continue;
  if (!/\.(md|mjs|js|html|css|json|bat)$/i.test(fp)) continue;
  let t = fs.readFileSync(fp, "utf8");
  const orig = t;
  if (!fp.endsWith("people.json")) {
    t = replaceIn(t, "EMET (אמת)", "AZTODEV");
    t = replaceIn(t, "**EMET**", "**AZTODEV**");
    t = replaceIn(t, "You work inside **EMET", "You work inside **AZTODEV");
    t = replaceIn(t, "at EMET", "at AZTODEV");
    t = replaceIn(t, "in EMET", "in AZTODEV");
    t = replaceIn(t, "EMET Command", "AZTODEV Command");
    t = replaceIn(t, "EMET Dashboard", "AZTODEV Dashboard");
    t = replaceIn(t, "סטטוס EMET", "סטטוס AZTODEV");
    t = replaceIn(t, "Turning EMET", "Turning AZTODEV");
    t = replaceIn(t, "EMET ON", "AZTODEV ON");
    t = replaceIn(t, "EMET OFF", "AZTODEV OFF");
    t = replaceIn(t, "EMET keeps", "AZTODEV keeps");
    t = replaceIn(t, "\"company\": \"EMET\"", "\"company\": \"AZTODEV\"");
    t = replaceIn(t, "name\": \"emet-company\"", "name\": \"aztodev-company\"");
    t = replaceIn(t, "List EMET agent", "List AZTODEV agent");
    t = replaceIn(t, "live EMET company", "live AZTODEV company");
    t = replaceIn(t, "Consolidate this EMET", "Consolidate this AZTODEV");
    t = replaceIn(t, "לוח ${board.project || \"EMET\"}", "לוח ${board.project || \"AZTODEV\"}");
    t = replaceIn(t, "היי, אני נעה.", "היי, אני נורה.");
    t = replaceIn(t, "היי, אני נורה.", "היי, אני נורה.");
    t = replaceIn(t, "Noa (CEO)", "Nura (CEO)");
    t = replaceIn(t, "Noa (00-ceo)", "Nura (00-ceo)");
    t = replaceIn(t, "**Noa (00-ceo)**", "**Nura (00-ceo)**");
    t = replaceIn(t, "via **Noa", "via **Nura");
    t = replaceIn(t, "you are Noa", "you are Nura");
    t = replaceIn(t, "Telegram via **Noa", "Telegram via **Nura");
    t = replaceIn(t, "asked by Noa", "asked by Nura");
    t = replaceIn(t, "Noa's Cursor", "Nura's Cursor");
    t = replaceIn(t, "Noa task", "Nura task");
    t = replaceIn(t, "\"Noa\"", "\"Nura\"");
    t = replaceIn(t, "Noa retry", "Nura retry");
    t = replaceIn(t, "so Noa can", "so Nura can");
    t = replaceIn(t, "Only Noa gets", "Only Nura gets");
    t = replaceIn(t, "Telegram → Noa", "Telegram → Nura");
    t = replaceIn(t, "## Noa", "## Nura");
    t = replaceIn(t, "from Noa first", "from Nura first");
    t = replaceIn(t, "בלחכות לנעה", "בלחכות לנורה");
    t = replaceIn(t, "בלי לחכות לנעה", "בלי לחכות לנורה");
    for (const p of uniqueFirst) {
      t = replaceIn(t, p.oldHe, p.he);
      if (p.oldEn && p.oldEn.length > 2) t = replaceIn(t, p.oldEn, p.en);
    }
  }
  if (t !== orig) fs.writeFileSync(fp, t, "utf8");
}

const statePath = path.join(ROOT, "ops/state.json");
if (fs.existsSync(statePath)) {
  const state = JSON.parse(fs.readFileSync(statePath, "utf8"));
  state.company = "AZTODEV";
  const byId = Object.fromEntries(people.map((p) => [p.id, p]));
  if (Array.isArray(state.agentsNow)) {
    state.agentsNow = state.agentsNow.map((a) => {
      const n = byId[a.id];
      return n ? { ...a, name: n.en } : a;
    });
  }
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + "\n", "utf8");
}

console.log(`Rebranded ${people.length} people + avatars.`);
