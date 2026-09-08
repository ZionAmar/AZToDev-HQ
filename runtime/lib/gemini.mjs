export function geminiConfigured() {
  return Boolean((process.env.GEMINI_API_KEY || "").trim());
}

/**
 * Lightweight ping. Does not send founder content.
 * @returns {{ ok: boolean, error?: string }}
 */
export async function pingGemini() {
  const key = (process.env.GEMINI_API_KEY || "").trim();
  if (!key) return { ok: false, error: "no_key" };
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 12000);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.ok) {
      return { ok: false, error: `http_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err?.message || err).slice(0, 120) };
  } finally {
    clearTimeout(t);
  }
}
