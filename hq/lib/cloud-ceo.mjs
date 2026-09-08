/**
 * Cloud Noa — brain on Cursor Cloud; Telegram transport stays on PC.
 */
import { runCloudOpsWork, cloudOpsConfigured } from "./cloud-work.mjs";
import { executeDelegateRelay } from "./delegate-relay.mjs";
import { recentTelegramThread } from "../../runtime/lib/agent-sessions.mjs";
import { journal } from "../../runtime/lib/paths.mjs";

/**
 * @param {string} prompt — founder turn (may include standby block)
 * @returns {{ ok: boolean, text?: string, error?: string, fallback?: boolean, cloudAgentId?: string }}
 */
export async function chatWithCloudCeo(prompt) {
  if (!cloudOpsConfigured()) {
    return {
      ok: false,
      error: "no_hq_repo",
      fallback: true,
      hint: "Set GITHUB_HQ_REPO in .env — private GitHub mirror of my_company.",
    };
  }

  const thread = recentTelegramThread(8);
  const fullTask = thread
    ? `[Telegram thread — last messages]\n${thread}\n\n---\n\n${prompt}`
    : prompt;

  const out = await runCloudOpsWork({
    agentId: "00-ceo",
    task: fullTask,
    agentLabel: "נועה",
  });

  if (!out.ok) {
    journal("cloud_ceo_error", { error: out.error, status: out.status });
    return out;
  }

  const relay = await executeDelegateRelay(out.text, {
    background: true,
    fromAgentId: "00-ceo",
  });

  let text = relay.cleanedText || out.text || "";
  if (relay.delegateResults.length) {
    text = `${text}\n\n${relay.delegateResults.join("\n")}`.trim();
  }

  journal("cloud_ceo_ok", {
    cloudAgentId: out.agentId,
    delegates: relay.delegateResults.length,
  });

  return {
    ok: true,
    text,
    cloudAgentId: out.agentId,
    repo: out.repo,
  };
}

export { cloudOpsConfigured };
