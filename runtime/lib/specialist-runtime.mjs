/** Where each specialist runs. Product + ops (except PC) = Cursor Cloud. Nadav = local HQ tools. */

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
]);

export function specialistUsesCloud(agentId) {
  return !LOCAL_TOOL_AGENTS.has(String(agentId || "").trim());
}

export function cloudOpsAgent(agentId) {
  return CLOUD_OPS_AGENTS.has(String(agentId || "").trim());
}

export function standbyDelegateAllowed(agentId) {
  return STANDBY_DELEGATE_OK.has(String(agentId || "").trim()) || cloudOpsAgent(agentId);
}
