import fs from "fs";
import path from "path";
import { buildCursorPrompt } from "./prompt-builder.mjs";
import { artifactDirFor, listArtifacts } from "./chat-store.mjs";
import { journal, ROOT } from "./paths.mjs";
import { cursorLocalOptions, cursorModelId } from "./cursor-local.mjs";

function getApiKey() {
  return (process.env.CURSOR_API_KEY || "").trim();
}

/**
 * Run a Cursor local agent for an EMET company specialist.
 * Falls back to a queued prompt file if SDK/key unavailable.
 */
export async function runCursorForAgent({ agentId, founderText, messageId }) {
  const artifactDir = artifactDirFor(messageId);
  const prompt = buildCursorPrompt({
    agentId,
    founderText,
    artifactDir,
    messageId,
  });

  const promptPath = path.join(artifactDir, "PROMPT_FOR_CURSOR.md");
  fs.writeFileSync(promptPath, prompt, "utf8");

  const apiKey = getApiKey();
  if (!apiKey) {
    const note = `# Waiting for CURSOR_API_KEY

Set CURSOR_API_KEY then re-run, or open this prompt in Cursor Agent manually:

\`${promptPath}\`

המייסד ביקש בשפה חופשית — הפרומפט המלא מוכן כאן להרצה בסוכן Cursor.
`;
    fs.writeFileSync(path.join(artifactDir, "RESULT.md"), note, "utf8");
    journal("cursor_queued_no_key", { agentId, messageId });
    return {
      status: "queued_no_key",
      agentId,
      messageId,
      promptPath,
      resultText: note,
      artifacts: listArtifacts(messageId),
      needsApiKey: true,
    };
  }

  try {
    const sdk = await import("@cursor/sdk");
    const Agent = sdk.Agent;
    const modelId = cursorModelId();
    const agentCwd = path.join(ROOT, "agents", agentId);

    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: modelId },
      local: cursorLocalOptions({
        cwd: agentCwd,
        dirs: [ROOT],
      }),
    });

    const resultText =
      typeof result?.result === "string"
        ? result.result
        : JSON.stringify(result?.result ?? result, null, 2);

    if (!fs.existsSync(path.join(artifactDir, "RESULT.md"))) {
      fs.writeFileSync(
        path.join(artifactDir, "RESULT.md"),
        `# תוצאה מ־Cursor\n\nStatus: ${result?.status}\n\n${resultText}\n`,
        "utf8"
      );
    }

    journal("cursor_run_finished", {
      agentId,
      messageId,
      status: result?.status,
      runId: result?.id,
    });

    return {
      status: result?.status || "finished",
      agentId,
      messageId,
      promptPath,
      resultText,
      artifacts: listArtifacts(messageId),
      needsApiKey: false,
      runId: result?.id,
    };
  } catch (err) {
    const msg = String(err?.message || err);
    const fail = `# Cursor run failed\n\n${msg}\n\nPrompt saved at:\n${promptPath}\n`;
    fs.writeFileSync(path.join(artifactDir, "RESULT.md"), fail, "utf8");
    journal("cursor_run_error", { agentId, messageId, error: msg });
    return {
      status: "error",
      agentId,
      messageId,
      promptPath,
      resultText: fail,
      artifacts: listArtifacts(messageId),
      needsApiKey: false,
      error: msg,
    };
  }
}
