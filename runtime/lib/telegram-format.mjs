/** Convert agent markdown-ish text to Telegram HTML (parse_mode HTML). */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Phone-readable Hebrew: paragraphs, bullets, no internal plumbing.
 */
export function polishTelegramHebrew(text) {
  let t = String(text ?? "");
  t = t.replace(/^DELEGATE:\s.+$/gim, "");
  t = t.replace(/^```[\w-]*\s*/gm, "").replace(/```$/gm, "");
  t = t.replace(/^#{1,4}\s+/gm, "");
  t = t.replace(/^[-*]\s+/gm, "• ");
  t = t.replace(/^▸\s+/gm, "• ");
  t = t.replace(/\b(?:emet_[a-z0-9_]+|job-[a-z0-9-]+)\b/gi, "");
  t = t.replace(/\(\s*\)/g, "");
  t = t.replace(/[ \t]+\n/g, "\n");
  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.replace(/[ \t]{2,}/g, " ");
  t = t.replace(/ +\./g, ".");
  return t.trim();
}

export function formatTelegramHtml(text) {
  /** **bold** / `code` → Telegram HTML */
  let t = String(text ?? "");
  if (!t.trim()) return "";

  const bold = [];
  const italic = [];
  const code = [];

  t = t.replace(/\*\*([^*\n]+)\*\*/g, (_, inner) => {
    const k = `\x00B${bold.length}\x00`;
    bold.push(inner);
    return k;
  });
  t = t.replace(/__([^_\n]+)__/g, (_, inner) => {
    const k = `\x00B${bold.length}\x00`;
    bold.push(inner);
    return k;
  });
  t = t.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, (_, inner) => {
    const k = `\x00I${italic.length}\x00`;
    italic.push(inner);
    return k;
  });
  t = t.replace(/`([^`\n]+)`/g, (_, inner) => {
    const k = `\x00C${code.length}\x00`;
    code.push(inner);
    return k;
  });

  t = escapeHtml(t);

  bold.forEach((inner, i) => {
    t = t.replace(`\x00B${i}\x00`, `<b>${escapeHtml(inner)}</b>`);
  });
  italic.forEach((inner, i) => {
    t = t.replace(`\x00I${i}\x00`, `<i>${escapeHtml(inner)}</i>`);
  });
  code.forEach((inner, i) => {
    t = t.replace(`\x00C${i}\x00`, `<code>${escapeHtml(inner)}</code>`);
  });

  return t.slice(0, 3500);
}

/** Strip markdown markers when HTML send fails. */
export function stripTelegramMarkdown(text) {
  return String(text ?? "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "$1");
}
