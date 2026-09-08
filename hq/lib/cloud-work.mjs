/**
 * Launch a Cursor Cloud agent against a private GitHub repo.
 * Product specialists run HERE — not on the founder PC, not on ChemiCloud.
 */
import fs from "fs";
import path from "path";
import { journal, ROOT } from "../../runtime/lib/paths.mjs";
import { cursorModelId } from "../../runtime/lib/cursor-local.mjs";
import { isProductWorkEnabled, readFactory } from "../../runtime/lib/company-state.mjs";
import { readAgentName } from "../../runtime/lib/router.mjs";
import { cloudOpsAgent } from "../../runtime/lib/specialist-runtime.mjs";

export function cloudRepoUrl() {
  return (process.env.GITHUB_REPO || "").trim();
}

export function hqRepoUrl() {
  const fromEnv = (process.env.GITHUB_HQ_REPO || "").trim();
  if (fromEnv) return fromEnv;
  const factory = readFactory();
  return String(factory.repos?.hq?.github || "").trim();
}

export function resolveProductRepo(repoKeyOrUrl) {
  const raw = String(repoKeyOrUrl || "").trim();
  if (/^https?:\/\//i.test(raw) || raw.startsWith("git@")) return raw;
  if (cloudRepoUrl() && !raw) return cloudRepoUrl();
  const factory = readFactory();
  const repos = factory.repos || {};
  if (raw && repos[raw]?.github) return repos[raw].github;
  const lower = raw.toLowerCase();
  for (const [k, v] of Object.entries(repos)) {
    if (k.toLowerCase() === lower && v?.github) return v.github;
    if (String(v?.github || "").toLowerCase().includes(lower) && v.github) {
      return v.github;
    }
  }
  return cloudRepoUrl() || "";
}

export function resolveAgentRepo(agentId, repoKeyOrUrl = "") {
  if (cloudOpsAgent(agentId)) {
    const hq = hqRepoUrl();
    if (hq) return hq;
  }
  return resolveProductRepo(repoKeyOrUrl);
}

export function cloudConfigured() {
  return Boolean(
    (process.env.CURSOR_API_KEY || "").trim() &&
      (cloudRepoUrl() || Object.keys(readFactory().repos || {}).length)
  );
}

/** HQ company repo + Cursor key — required for Cloud Noa / Ruth / Tamir. */
export function cloudOpsConfigured() {
  return Boolean((process.env.CURSOR_API_KEY || "").trim() && hqRepoUrl());
}

export async function listCursorGithubRepos() {
  const apiKey = (process.env.CURSOR_API_KEY || "").trim();
  if (!apiKey) return { ok: false, error: "no_cursor_key", repos: [] };
  const sdk = await import("@cursor/sdk");
  const Cursor = sdk.Cursor;
  const repos = await Cursor.repositories.list({ apiKey });
  return { ok: true, repos: repos || [] };
}

function specialistPromptSlice(agentId) {
  if (!agentId) return "";
  const p = path.join(ROOT, "agents", agentId, "SYSTEM_PROMPT.md");
  try {
    return fs.readFileSync(p, "utf8").slice(0, 2500);
  } catch {
    return "";
  }
}

function cloudOpsSecretsBlock(agentId) {
  if (agentId === "33-household-ops") {
    return `
Secrets (Cursor Cloud env — never commit):
- GMAIL_USER + GMAIL_APP_PASS (aztodev)
- GMAIL_USER_AMZION + GMAIL_APP_PASS_AMZION
- GMAIL_USER_ZION + GMAIL_APP_PASS_ZION
Read ops/config/household.json for news channels. Write artifacts under ops/ with evidence paths.
`;
  }
  if (agentId === "35-server-ops") {
    return `
Secrets (Cursor Cloud env — never commit):
- CHEMICLOUD_SSH_KEY (private key) or CHEMICLOUD_SSH_KEY_PATH
- CHEMICLOUD_HOST, CHEMICLOUD_USER, CHEMICLOUD_PORT (see ops/config/factory.json)
Read-only SSH only. No restart, no deploy, no ChemiCloud HQ.
`;
  }
  if (agentId === "00-ceo") {
    return `
You run on Cursor Cloud. Telegram desk is a thin process on ChemiCloud (aztodev-desk only — no Cursor there).
To delegate specialist work, include one line per handoff (HQ relay executes it):
  DELEGATE: 33-household-ops | <task>
  DELEGATE: 34-pc-ops | <task>   (queued for founder PC; runs when the PC is on)
  DELEGATE: 35-server-ops | <task>
Product specialists: DELEGATE: <agentId> | <task> (requires productWorkEnabled + PIN).
Never invent job ids or artifact paths. Nadav (34) never runs on ChemiCloud.
Telegram replies: clear professional Hebrew. Answer first. Short paragraphs. No jargon in the visible text.
`;
  }
  return "";
}

/**
 * Cursor Cloud for ops agents (Noa, Ruth, Tamir) — no product gate, no PR by default.
 * @param {{ task: string, agentId?: string, agentLabel?: string, autoCreatePR?: boolean }} opts
 */
export async function runCloudOpsWork({
  task,
  agentId = "",
  agentLabel = "AZToDev ops",
  autoCreatePR = false,
}) {
  const apiKey = (process.env.CURSOR_API_KEY || "").trim();
  const url = resolveAgentRepo(agentId, "hq");
  if (!apiKey) return { ok: false, error: "no_cursor_key" };
  if (!url) {
    return {
      ok: false,
      error: "no_hq_repo",
      hint: "Set GITHUB_HQ_REPO in .env and push my_company to a private GitHub repo connected in Cursor.",
    };
  }

  const name = agentId ? readAgentName(agentId) : agentLabel;
  const role = specialistPromptSlice(agentId);
  const secrets = cloudOpsSecretsBlock(agentId);
  const sdk = await import("@cursor/sdk");
  const Agent = sdk.Agent;
  const prompt = `[AZToDev · ${name}${agentId ? ` · ${agentId}` : ""} · CLOUD OPS]
Founder: ציון עמר. Hebrew with founder. Code/PRs: Technical English.
Source of truth: _company/FACTORY.md + DELEGATION_POLICY.md + agents/${agentId || "?"}/.
You run on Cursor Cloud — not on the founder PC, not on ChemiCloud customer sites.
${secrets}
${role ? `Role snapshot:\n${role}\n` : ""}
Task:
${task}
`;

  const result = await Agent.prompt(prompt, {
    apiKey,
    model: { id: cursorModelId(agentId || undefined) },
    cloud: {
      repos: [
        {
          url,
          startingRef: (process.env.GITHUB_HQ_REF || process.env.GITHUB_REF || "main").trim(),
        },
      ],
      autoCreatePR,
      skipReviewerRequest: true,
    },
  });

  journal("cloud_ops_finished", {
    url,
    status: result?.status,
    agentLabel: name,
    specialistId: agentId || null,
    cloudAgentId: result?.agentId || null,
  });

  const text =
    typeof result?.result === "string"
      ? result.result
      : JSON.stringify(result?.result ?? result, null, 2);

  return {
    ok: result?.status !== "error",
    status: result?.status,
    text: String(text).slice(0, 8000),
    agentId: result?.agentId,
    repo: url,
    specialistId: agentId || null,
    cloudOps: true,
  };
}

/**
 * @param {{ task: string, agentId?: string, agentLabel?: string, repo?: string, autoCreatePR?: boolean }} opts
 */
export async function runCloudWork({
  task,
  agentId = "",
  agentLabel = "AZToDev specialist",
  repo = "",
  autoCreatePR = true,
}) {
  if (!isProductWorkEnabled()) {
    return { ok: false, error: "standby_no_product" };
  }
  const apiKey = (process.env.CURSOR_API_KEY || "").trim();
  const url = resolveProductRepo(repo);
  if (!apiKey) return { ok: false, error: "no_cursor_key" };
  if (!url) {
    return {
      ok: false,
      error: "no_github_repo",
      hint: "Set GITHUB_REPO or pass repo=work_clock|fitime|telemust",
    };
  }

  const name = agentId ? readAgentName(agentId) : agentLabel;
  const role = specialistPromptSlice(agentId);
  const sdk = await import("@cursor/sdk");
  const Agent = sdk.Agent;
  const prompt = `[AZToDev · ${name}${agentId ? ` · ${agentId}` : ""}]
Founder: ציון עמר. Hebrew with founder. Code/PRs: Technical English.
Source of truth: company FACTORY + PRODUCT_PIPELINE.
Default stack: MySQL + Node + React. PWA if it fits. Do not production-deploy. Do not commit secrets.
You run on Cursor Cloud — not on the founder PC, not on ChemiCloud.

${role ? `Role snapshot:\n${role}\n` : ""}
Task:
${task}
`;

  const result = await Agent.prompt(prompt, {
    apiKey,
    model: { id: cursorModelId(agentId || undefined) },
    cloud: {
      repos: [
        {
          url,
          startingRef: (process.env.GITHUB_REF || "main").trim(),
        },
      ],
      autoCreatePR,
      skipReviewerRequest: true,
    },
  });

  journal("cloud_work_finished", {
    url,
    status: result?.status,
    agentLabel: name,
    specialistId: agentId || null,
    cloudAgentId: result?.agentId || null,
  });

  const text =
    typeof result?.result === "string"
      ? result.result
      : JSON.stringify(result?.result ?? result, null, 2);

  return {
    ok: result?.status !== "error",
    status: result?.status,
    text: String(text).slice(0, 8000),
    agentId: result?.agentId,
    repo: url,
    specialistId: agentId || null,
  };
}
