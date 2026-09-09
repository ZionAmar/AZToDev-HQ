/**
 * Company-wide lessons from failures — injected into every live agent prompt.
 * This is how we actually improve between runs (not hope).
 */
import fs from "fs";
import path from "path";
import { OPS, nowIso, journal } from "./paths.mjs";

const PATH = path.join(OPS, "company-lessons.md");
const MAX_LESSONS = 40;

export function readCompanyLessons() {
  try {
    return fs.readFileSync(PATH, "utf8").trim();
  } catch {
    return "";
  }
}

export function companyLessonsPromptBlock() {
  const raw = readCompanyLessons();
  if (!raw) return "";
  const tail = raw.length > 2200 ? raw.slice(-2200) : raw;
  return `
=== COMPANY LESSONS (ops/company-lessons.md) — failures we already paid for ===
${tail}
Obey these. Do not repeat them.
`.trim();
}

/**
 * @param {{ kind: string, do?: string, dont?: string, note?: string }} lesson
 */
export function recordCompanyLesson(lesson) {
  const day = nowIso().slice(0, 10);
  const kind = String(lesson.kind || "general").slice(0, 40);
  const lines = [`### ${day} · ${kind}`];
  if (lesson.do) lines.push(`- do: ${String(lesson.do).slice(0, 260)}`);
  if (lesson.dont) lines.push(`- dont: ${String(lesson.dont).slice(0, 260)}`);
  if (lesson.note) lines.push(`- note: ${String(lesson.note).slice(0, 260)}`);
  if (lines.length < 2) return { ok: false };

  let cur = "";
  try {
    cur = fs.readFileSync(PATH, "utf8");
  } catch {
    cur = "# Company lessons\n\nFailures that must not repeat.\n\n";
  }
  cur = `${cur.trim()}\n${lines.join("\n")}\n`;
  const parts = cur.split(/\n(?=### )/);
  const head = parts[0];
  const rest = parts.slice(1).slice(-MAX_LESSONS);
  fs.mkdirSync(path.dirname(PATH), { recursive: true });
  fs.writeFileSync(PATH, `${head.trim()}\n\n${rest.join("\n").trim()}\n`, "utf8");
  journal("company_lesson", { kind });
  return { ok: true, path: PATH };
}
