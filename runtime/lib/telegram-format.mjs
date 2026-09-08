/** Convert agent markdown-ish text to Telegram HTML (parse_mode HTML). */

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * **bold** / __bold__ → <b>; *italic* → <i>; `code` → <code>
 * Falls back to plain escaped text if parsing looks unsafe.
 */
export function formatTelegramHtml(text) {
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
