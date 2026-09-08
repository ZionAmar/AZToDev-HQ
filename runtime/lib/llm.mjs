/**
 * Company brain caller.
 * Fast path: OpenAI (when key set) for chat.
 * Cursor Agent only when explicitly requested (heavy / no OpenAI).
 */
import { cursorLocalOptions, cursorModelId } from "./cursor-local.mjs";
import { MODEL_PRESETS } from "./models.mjs";

export function llmConfigured() {
  return Boolean(
    (process.env.CURSOR_API_KEY || "").trim() ||
      (process.env.ANTHROPIC_API_KEY || "").trim() ||
      (process.env.OPENAI_API_KEY || "").trim()
  );
}

export function fastLlmConfigured() {
  return Boolean((process.env.OPENAI_API_KEY || "").trim());
}

/**
 * @param {{ system: string, user: string, maxTokens?: number, prefer?: 'fast'|'smart'|'auto', model?: string }} opts
 */
export async function llmChat({
  system,
  user,
  maxTokens = 1200,
  prefer = "auto",
  model: modelOverride,
} = {}) {
  const anthropic = (process.env.ANTHROPIC_API_KEY || "").trim();
  const openai = (process.env.OPENAI_API_KEY || "").trim();
  const cursorKey = (process.env.CURSOR_API_KEY || "").trim();

  const wantFast = prefer === "fast" || prefer === "auto";

  // Prefer OpenAI for speed when available (founder chat / Nura)
  if (openai && (prefer === "fast" || prefer === "smart" || prefer === "auto")) {
    const model =
      modelOverride ||
      (prefer === "smart" ? MODEL_PRESETS.chatSmart : MODEL_PRESETS.chatFast);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${openai}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      throw new Error(`OpenAI ${res.status}: ${(await res.text()).slice(0, 400)}`);
    }
    const data = await res.json();
    return {
      provider: "openai",
      model,
      text: data.choices?.[0]?.message?.content || "",
    };
  }

  if (anthropic && !wantFast) {
    const model = modelOverride || process.env.EMET_LLM_MODEL || "claude-sonnet-4-20250514";
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": anthropic,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) {
      throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 400)}`);
    }
    const data = await res.json();
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return { provider: "anthropic", model, text };
  }

  if (cursorKey) {
    const { Agent } = await import("@cursor/sdk");
    const modelId = modelOverride || cursorModelId();
    const prompt = `${system}\n\n---\nUSER TASK\n${user}\n\nRespond with the answer only (no tool thrash unless required).`;
    const result = await Agent.prompt(prompt, {
      apiKey: cursorKey,
      model: { id: modelId },
      local: cursorLocalOptions({ settingSources: [] }),
    });
    const text =
      typeof result?.result === "string"
        ? result.result
        : JSON.stringify(result?.result ?? result, null, 2);
    return { provider: "cursor", model: modelId, text, status: result?.status };
  }

  return { provider: "none", model: null, text: "", missingKey: true };
}
