/**
 * Founder PC (Nadav / 34-pc-ops) is only reachable when HQ runs locally — not on ChemiCloud desk-only.
 * No queue: when unavailable, tell the founder to turn the PC on and retry.
 */

export const PC_UNAVAILABLE_HE =
  "המחשב כבוי (או שהדלפק רץ בלי גישה אליו). נדב לא זמין — הדלק את המחשב ונסה שוב.";

function isHqCloudOnlyDesk() {
  const v = String(process.env.HQ_CLOUD_ONLY || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/** True when Nadav can run emet_pc_status / local filesystem tools on the founder PC. */
export function isFounderPcAvailable() {
  if (isHqCloudOnlyDesk()) return false;

  const forced = String(process.env.FOUNDER_PC_AVAILABLE || "").trim().toLowerCase();
  if (forced === "0" || forced === "false" || forced === "off") return false;
  if (forced === "1" || forced === "true" || forced === "on") return true;

  return true;
}

export function pcUnavailableForAgent(agentId) {
  return String(agentId || "").trim() === "34-pc-ops" && !isFounderPcAvailable();
}
