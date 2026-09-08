/**
 * Execute DELEGATE: lines from Cloud Noa — local Nadav or Cloud Ruth/Tamir.
 */
import { journal } from "../../runtime/lib/paths.mjs";
import { readAgentName } from "../../runtime/lib/router.mjs";
import {
  specialistUsesCloud,
  cloudOpsAgent,
} from "../../runtime/lib/specialist-runtime.mjs";
import { chatWithAgent } from "../../runtime/lib/agent-sessions.mjs";
import { runCloudOpsWork, runCloudWork } from "./cloud-work.mjs";
import { startBackgroundDelegate } from "../../runtime/lib/background-delegate.mjs";
import { isProductWorkEnabled } from "../../runtime/lib/company-state.mjs";

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
export async function executeDelegateRelay(text, { background = true, fromAgentId = "00-ceo" } = {}) {
  const { cleanedText, jobs } = extractDelegateLines(text);
  const delegateResults = [];

  for (const { agentId, task } of jobs) {
    if (!agentId || !task) continue;
    const name = readAgentName(agentId);

    if (background) {
      const job = startBackgroundDelegate({
        fromAgentId,
        agentId,
        task,
        notifyFounder: fromAgentId === "00-ceo",
      });
      delegateResults.push(`▸ ${name}: ברקע (${job.jobId})`);
      journal("delegate_relay_background", { agentId, jobId: job.jobId });
      continue;
    }

    try {
      let out;
      if (specialistUsesCloud(agentId)) {
        if (cloudOpsAgent(agentId) || !isProductWorkEnabled()) {
          out = await runCloudOpsWork({ task, agentId, agentLabel: name });
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
