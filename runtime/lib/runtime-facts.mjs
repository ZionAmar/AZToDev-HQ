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
    "SPECIALIST LINKS: When a specialist (Ruth/Nadav/Keshet/Tamir) finishes or runs, the founder-facing link MUST be the real session URL https://cursor.com/agents/bc-… from background-jobs or live-runs — never bare https://cursor.com/. If no bc- id exists yet, omit the link; do not invent one.",
  ]
    .filter(Boolean)
    .join("\n");
}

