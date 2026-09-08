/**
 * Probe paid/connected accounts. Never logs secrets.
 */
import fs from "fs";
import path from "path";
import { LinearClient } from "@linear/sdk";
import nodemailer from "nodemailer";
import { OPS, ROOT, nowIso, writeJson, journal } from "../../runtime/lib/paths.mjs";
import { loadDotEnv } from "../../runtime/lib/load-env.mjs";
import { telegramConfigured } from "../../runtime/lib/telegram.mjs";
import { linearConfigured } from "../../runtime/lib/linear-tasks.mjs";
import { emailConfigured } from "../../runtime/lib/mail.mjs";
import { geminiConfigured, pingGemini } from "../../runtime/lib/gemini.mjs";
import { listCursorGithubRepos } from "./cloud-work.mjs";
import { peekGmailInbox } from "../../runtime/lib/gmail-read.mjs";
import { runReadOnlySsh } from "../../runtime/lib/ssh-chemicloud.mjs";
import { socialStatus } from "../../runtime/lib/social.mjs";

const OUT = path.join(OPS, "runtime", "connections.json");

function has(k) {
  return Boolean((process.env[k] || "").trim());
}

async function withTimeout(promise, ms, label) {
  let t;
  try {
    return await Promise.race([
      promise,
      new Promise((_, rej) => {
        t = setTimeout(() => rej(new Error(`${label}_timeout`)), ms);
      }),
    ]);
  } finally {
    clearTimeout(t);
  }
}

async function pingTelegram() {
  if (!telegramConfigured()) return { ok: false, error: "no_token" };
  const token = process.env.TELEGRAM_BOT_TOKEN.trim();
  const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
  const data = await res.json();
  if (!data.ok) return { ok: false, error: "getMe_failed" };
  return { ok: true, bot: data.result?.username || "bot" };
}

async function pingLinear() {
  if (!linearConfigured()) return { ok: false, error: "no_key" };
  const client = new LinearClient({ apiKey: process.env.LINEAR_API_KEY.trim() });
  const teams = await client.teams();
  const n = teams.nodes?.length || 0;
  return { ok: n > 0, teams: n };
}

async function pingGmail() {
  if (!emailConfigured()) return { ok: false, error: "no_creds" };
  const user = process.env.GMAIL_USER.trim();
  const pass = process.env.GMAIL_APP_PASS.trim().replace(/\s+/g, "");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  await transporter.verify();
  return { ok: true };
}

async function pingOpenAI() {
  const key = (process.env.OPENAI_API_KEY || "").trim();
  if (!key) return { ok: false, error: "no_key" };
  const res = await fetch("https://api.openai.com/v1/models", {
    headers: { authorization: `Bearer ${key}` },
  });
  if (!res.ok) return { ok: false, error: `http_${res.status}` };
  return { ok: true };
}

async function pingCursorGithub() {
  if (!has("CURSOR_API_KEY")) return { cursor: { ok: false }, github: { ok: false } };
  try {
    const listed = await listCursorGithubRepos();
    const repos = listed.repos || [];
    const count = repos.length;
    return {
      cursor: { ok: Boolean(listed.ok) },
      github: { ok: listed.ok && count > 0, count },
    };
  } catch (err) {
    return {
      cursor: { ok: false, error: String(err?.message || err).slice(0, 80) },
      github: { ok: false },
    };
  }
}

function settle(label, result) {
  if (result.status === "fulfilled") return result.value;
  return { ok: false, error: String(result.reason?.message || result.reason || "fail").slice(0, 80) };
}

export async function probeConnections() {
  loadDotEnv();
  const cg = await pingCursorGithub();
  const [tg, lin, mail, oai, gem, imap, ssh] = await Promise.allSettled([
    withTimeout(pingTelegram(), 10000, "telegram"),
    withTimeout(pingLinear(), 12000, "linear"),
    withTimeout(pingGmail(), 12000, "gmail"),
    withTimeout(pingOpenAI(), 12000, "openai"),
    withTimeout(pingGemini(), 12000, "gemini"),
    withTimeout(peekGmailInbox({ limit: 1 }), 15000, "gmailRead"),
    withTimeout(runReadOnlySsh("uptime"), 20000, "ssh"),
  ]);

  const social = socialStatus();
  const accounts = {
    cursor: cg.cursor,
    github: cg.github,
    telegram: settle("telegram", tg),
    linear: settle("linear", lin),
    gmail: settle("gmail", mail),
    gmailRead: settle("gmailRead", imap),
    openai: settle("openai", oai),
    gemini: geminiConfigured()
      ? settle("gemini", gem)
      : { ok: false, error: "no_key" },
    ssh: settle("ssh", ssh),
    facebookPublish: { ok: social.facebook.publish },
    youtubeUpload: { ok: social.youtube.upload },
  };

  const snapshot = {
    company: "AZToDev",
    at: nowIso(),
    productWorkEnabled: false,
    envFile: fs.existsSync(path.join(ROOT, ".env")),
    accounts,
  };

  writeJson(OUT, snapshot);
  journal("connections_probed", {
    cursor: accounts.cursor?.ok,
    github: accounts.github?.ok,
    telegram: accounts.telegram?.ok,
    linear: accounts.linear?.ok,
    gmail: accounts.gmail?.ok,
    openai: accounts.openai?.ok,
    gemini: accounts.gemini?.ok,
  });
  return snapshot;
}

export function readConnections() {
  try {
    return JSON.parse(fs.readFileSync(OUT, "utf8"));
  } catch {
    return null;
  }
}
