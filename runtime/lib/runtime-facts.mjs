import { nadavHeartbeatSnapshot } from "./nadav-queue.mjs";
import { waitingFounderPromptBlock } from "./waiting-founder.mjs";

/** Injected into Cloud prompts — HQ knows PC state; never ask ציון. */
export function runtimeFactsBlock() {
  const pc = nadavHeartbeatSnapshot();
  const wait = waitingFounderPromptBlock();
  const pcLine = pc.online
    ? `PC HEARTBEAT: Nadav ONLINE (${pc.hostname || "pc"} · ${pc.at || "now"}). Do NOT ask ציון if the computer is on. Delegate 34-pc-ops immediately.`
    : `PC HEARTBEAT: Nadav OFFLINE. Do NOT ask ציון if the computer is on. Queue 34-pc-ops — it runs when Windows is on. Tell him the job is queued, not that you are waiting for an answer.`;
  return [pcLine, wait].filter(Boolean).join("\n");
}
