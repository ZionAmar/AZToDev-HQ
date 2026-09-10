import { nadavHeartbeatSnapshot } from "./nadav-queue.mjs";
import { waitingFounderPromptBlock } from "./waiting-founder.mjs";
import { liveStatusPromptBlock } from "./live-status.mjs";

/** Injected into Cloud prompts — HQ knows PC state; never ask ציון. */
export function runtimeFactsBlock() {
  const pc = nadavHeartbeatSnapshot();
  const wait = waitingFounderPromptBlock();
  const live = liveStatusPromptBlock();
  const pcLine = pc.online
    ? `PC HEARTBEAT: Nadav ONLINE (${pc.hostname || "pc"} · ${pc.at || "now"}). Do NOT ask ציון if the computer is on. Delegate 34-pc-ops immediately.`
    : `PC HEARTBEAT: Nadav OFFLINE. Do NOT ask ציון if the computer is on. Queue 34-pc-ops — it runs when Windows is on. Tell him the job is queued, not that you are waiting for an answer.`;
  return [
    pcLine,
    wait,
    live,
    "NOA TRIAGE: HQ already classifies specialist Telegram (problem / waiting PIN / next stage). Do not dump raw specialist logs. If ציון asks status, answer with now / waiting-for / next / Cloud links.",
    "NEVER say «יש תוצאה טרייה» or «ריצה כפולה» unless LIVE FLOW shows that specialist RUNNING with a Cloud link. Silent delegate drop = not started — say plainly «לא התחיל» and DELEGATE.",
  ]
    .filter(Boolean)
    .join("\n");
}

