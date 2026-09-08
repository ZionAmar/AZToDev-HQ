/** Where each specialist runs. Product + ops (except PC) = Cursor Cloud. Nadav = local HQ tools. */
import { isProductWorkEnabled } from "./company-state.mjs";

/** Must stay on founder PC — filesystem + OS access. */
export const LOCAL_TOOL_AGENTS = new Set(["34-pc-ops"]);

/** Cursor Cloud even in standby — work when PC is off (secrets in Cloud env). */
export const CLOUD_OPS_AGENTS = new Set([
  "00-ceo",
  "33-household-ops",
  "35-server-ops",
]);

/** Allowed while productWorkEnabled is false (no product PRs). */
export const STANDBY_DELEGATE_OK = new Set([
  "33-household-ops",
  "34-pc-ops",
  "35-server-ops",
  "32-delivery-lead",
]);

/** ChemiCloud thin desk: never spawn local Cursor (Nadav included). */
export function hqCloudOnly() {
  const v = String(process.env.HQ_CLOUD_ONLY || "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function localPcOpsBlockedReason(agentId) {
  if (!LOCAL_TOOL_AGENTS.has(String(agentId || "").trim())) return "";
  if (!hqCloudOnly()) return "";
  return (
    "נדב לא רץ על ChemiCloud. המשימה נכנסת לתור — העובד על המחשב יריץ אותה אחרי כניסה ל-Windows."
  );
}

export function specialistUsesCloud(agentId) {
  return !LOCAL_TOOL_AGENTS.has(String(agentId || "").trim());
}

export function cloudOpsAgent(agentId) {
  return CLOUD_OPS_AGENTS.has(String(agentId || "").trim());
}

/** HQ repo Cloud (no product PR): ops + Keshet while productWorkEnabled is false. */
export function usesHqOpsCloud(agentId) {
  const id = String(agentId || "").trim();
  if (cloudOpsAgent(id)) return true;
  if (id === "32-delivery-lead" && !isProductWorkEnabled()) return true;
  return false;
}

export function standbyDelegateAllowed(agentId) {
  return STANDBY_DELEGATE_OK.has(String(agentId || "").trim()) || cloudOpsAgent(agentId);
}

/** Engineers / CPO / etc. — blocked until productWorkEnabled. Keshet planning is not. */
export function productCloudBlocked(agentId) {
  const id = String(agentId || "").trim();
  if (!id) return false;
  if (isProductWorkEnabled()) return false;
  if (usesHqOpsCloud(id)) return false;
  return specialistUsesCloud(id);
}
