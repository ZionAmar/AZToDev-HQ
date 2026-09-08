/**
 * Merge ops/training/learning-library.json into each agent TRAINING.md
 * Usage: node runtime/scripts/sync-agent-learning-library.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const LIB = join(ROOT, "ops/training/learning-library.json");
const MARKER = "## מקורות למידה מומלצים (רשת)";

const lib = JSON.parse(readFileSync(LIB, "utf8"));

function formatSection(resources) {
  const lines = [
    MARKER,
    "",
    "> נבחרו מקורות עם ביקורות גבוהות / instructors מוכרים. מקור: `ops/training/learning-library.json`",
    "",
    "| # | מקור | סוג | דירוג/הערה | למה ללמוד |",
    "|---|------|-----|------------|-----------|",
  ];
  resources.forEach((r, i) => {
    lines.push(
      `| ${i + 1} | [${r.title}](${r.url}) | ${r.type} | ${r.rating} | ${r.why} |`,
    );
  });
  lines.push("");
  lines.push("### איך להשתמש");
  lines.push("- לפני משימה מורכבת — עבור על 1–2 מקורות רלוונטיים");
  lines.push("- אחרי טעות — חפש פרק/מאמר מתאים ברשימה");
  lines.push("- CHRO מעדכנת רבעונית לפי ביקורות חדשות");
  lines.push("");
  return lines.join("\n");
}

let updated = 0;
for (const [agentId, data] of Object.entries(lib.agents)) {
  const path = join(ROOT, "agents", agentId, "TRAINING.md");
  if (!existsSync(path)) {
    console.warn(`skip missing ${agentId}`);
    continue;
  }
  let content = readFileSync(path, "utf8");
  const section = formatSection(data.resources);
  if (content.includes(MARKER)) {
    content = content.replace(
      new RegExp(`${MARKER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*$`),
      section.trim(),
    );
  } else {
    content = `${content.trim()}\n\n${section}`;
  }
  writeFileSync(path, content.trim() + "\n", "utf8");
  updated++;
}

console.log(JSON.stringify({ ok: true, updated, agents: updated }));
