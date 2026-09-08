/**
 * Execute DELEGATE: lines from Cloud Noa — local Nadav or Cloud Ruth/Tamir.
 */
import { journal } from "../../runtime/lib/paths.mjs";
import { readAgentName } from "../../runtime/lib/router.mjs";
import { usesHqOpsCloud, specialistUsesCloud, productCloudBlocked } from "../../runtime/lib/specialist-runtime.mjs";
import { chatWithAgent } from "../../runtime/lib/agent-sessions.mjs";
import { runCloudOpsWork, runCloudWork } from "./cloud-work.mjs";
import { startBackgroundDelegate } from "../../runtime/lib/background-delegate.mjs";
import { inferRequiredDelegate } from "../../runtime/lib/agent-memory.mjs";

const DELEGATE_LINE = /^DELEGATE:\s*([^\s|]+)\s*\|\s*(.+)$/i;

export function extractDelegateLines(text) {
  const lines = String(text || "").split("\n");
  const kept = [];
  const jobs = [];
  for (const line of lines) {
    const m = line.trim().match(DELEGATE_LINE);
    if (!m) {
      kept.push(line);
      continue;
    }
    jobs.push({ agentId: m[1].trim(), task: m[2].trim() });
  }
  return { cleanedText: kept.join("\n").trim(), jobs };
}

/**
 * Run delegate handoffs embedded in Cloud CEO reply.
 * Default: background so Telegram stays responsive.
 */
export async function executeDelegateRelay(
  text,
  { background = true, fromAgentId = "00-ceo", founderText = "" } = {}
) {
  const extracted = extractDelegateLines(text);
  let { cleanedText, jobs } = extracted;
  if (!jobs.length && founderText) {
    const forced = inferRequiredDelegate(founderText);
    if (forced) {
      jobs = [forced];
      journal("delegate_forced", { agentId: forced.agentId, reason: "founder_specialist_ask" });
    }
  }
  const delegateResults = [];

  for (const { agentId, task } of jobs) {
    if (!agentId || !task) continue;
    const name = readAgentName(agentId);

    if (productCloudBlocked(agentId)) {
      journal("delegate_blocked_standby", { agentId, task: task.slice(0, 200) });
      continue;
    }

    if (background) {
      const job = startBackgroundDelegate({
        fromAgentId,
        agentId,
        task,
        notifyFounder: fromAgentId === "00-ceo",
      });
      delegateResults.push(name);
      journal("delegate_relay_background", { agentId, jobId: job.jobId });
      continue;
    }

    try {
      let out;
      if (specialistUsesCloud(agentId)) {
        if (usesHqOpsCloud(agentId)) {
          out = await runCloudOpsWork({
            task,
            agentId,
            agentLabel: name,
            fromAgentId,
          });
        } else {
          out = await runCloudWork({ task, agentId, agentLabel: name });
        }
        out = { text: out.text, ok: out.ok };
      } else {
        out = await chatWithAgent(agentId, task, {
          asDelegation: true,
          fromAgentId,
        });
      }
      delegateResults.push(
        `▸ ${name}:\n${String(out.text || "").slice(0, 1200)}`
      );
    } catch (err) {
      delegateResults.push(`▸ ${name}: שגיאה — ${String(err?.message || err).slice(0, 200)}`);
    }
  }

  return { cleanedText, delegateResults };
}
