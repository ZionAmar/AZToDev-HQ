import { probeConnections } from "./lib/connections.mjs";

const snap = await probeConnections();
const a = snap.accounts || {};
const row = (name, x) =>
  `${x?.ok ? "OK " : "NO "} ${name}${x?.count != null ? ` (${x.count})` : ""}${
    x?.bot ? ` @${x.bot}` : ""
  }${x?.error ? ` — ${x.error}` : ""}`;

console.log("AZToDev connections");
console.log(row("Cursor", a.cursor));
console.log(row("GitHub", a.github));
console.log(row("Telegram", a.telegram));
console.log(row("Linear", a.linear));
console.log(row("Gmail send", a.gmail));
console.log(row("Gmail IMAP", a.gmailRead));
console.log(row("OpenAI", a.openai));
console.log(row("Gemini", a.gemini));
console.log(row("SSH", a.ssh));
console.log(row("Facebook publish", a.facebookPublish));
console.log(row("YouTube upload", a.youtubeUpload));
console.log("wrote ops/runtime/connections.json");
