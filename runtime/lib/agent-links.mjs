/**
 * Founder-facing Cursor Cloud agent URLs — only real bc- session links.
 */
export function cloudAgentUrl(id) {
  const s = String(id || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (!/^bc-/i.test(s)) return "";
  return `https://cursor.com/agents/${s}`;
}

export function isValidAgentUrl(url) {
  const u = String(url || "").trim();
  if (!u) return false;
  return /^https:\/\/cursor\.com\/agents\/bc-[a-z0-9-]+$/i.test(u);
}

/** Drop homepage / bare cursor.com links; keep only bc- session URLs. */
export function sanitizeAgentLinks(text) {
  let t = String(text || "");
  t = t.replace(/https?:\/\/cursor\.com\/agents\/bc-[a-z0-9-]+/gi, (m) =>
    isValidAgentUrl(m) ? m : ""
  );
  t = t.replace(/https?:\/\/cursor\.com\/?(?![a-z])/gi, "");
  t = t.replace(/(?:^|\n)\s*(?:רות|נדב|תמיר|קשת)\s*:\s*https?:\/\/cursor\.com\/?\s*(?:\n|$)/gi, "\n");
  return t.replace(/\n{3,}/g, "\n\n").trim();
}

/** Remove false duplicate-run boilerplate (LLM must not use without live WIP proof). */
export function stripFalseDuplicateClaims(text) {
  let t = String(text || "");
  t = t.replace(/לא פתחתי ריצה כפולה[^\n]*/gi, "");
  t = t.replace(/יש כבר תוצאה טרייה[^\n]*/gi, "");
  t = t.replace(/כתוב «שוב עכשיו»[^\n]*/gi, "");
  t = t.replace(/כתוב «מה התוצאות»[^\n]*/gi, "");
  return t.replace(/\n{3,}/g, "\n\n").trim();
}
