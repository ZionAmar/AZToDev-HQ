/**
 * node runtime/scripts/send-founder-brief.mjs
 */
import { loadDotEnv } from "../lib/load-env.mjs";
loadDotEnv();
const { sendFounderBrief } = await import("../lib/founder-brief.mjs");
const out = await sendFounderBrief({ force: true, telegram: true, email: true });
console.log(
  JSON.stringify(
    {
      ok: out.ok,
      reportPath: out.reportPath,
      telegram: out.telegram?.ok !== false,
      email: out.email,
    },
    null,
    2
  )
);
