/** Only push unsolicited Telegram when founder must act / major gate. */
export function shouldPushUnsolicited(text) {
  const t = String(text || "");
  if (!t.trim()) return false;
  if (/founderPush\s*:\s*null/i.test(t)) return false;
  if (
    /לא להפריע|nothing to bother|אין צורך להפריע|no founder ask|must be asked:\s*no/i.test(
      t
    )
  ) {
    return false;
  }
  return /waiting_founder|APPROVE|CHOOSE|EMERGENCY|SEV1|חייב לשאול|שער מייסד|must be asked:\s*yes|founderPush\s*:/i.test(
    t
  );
}

export function extractFounderPush(text) {
  const t = String(text || "");
  const m = t.match(/founderPush\s*:\s*([\s\S]*?)(?:\n\s*[-*]|\n\n|$)/i);
  if (m) {
    const body = m[1].trim();
    if (!body || /^null$/i.test(body)) return null;
    return body.slice(0, 1500);
  }
  if (!shouldPushUnsolicited(t)) return null;
  return t.slice(0, 1200);
}
