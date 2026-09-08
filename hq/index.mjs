/**
 * AZToDev HQ — thin Telegram desk → נועה. Specialists on Cursor Cloud.
 *   node hq/index.mjs
 */
import "../runtime/lib/windows-hide.mjs";
import http from "http";
import { loadDotEnv } from "../runtime/lib/load-env.mjs";
import {
  telegramConfigured,
  pollFounderMessages,
  sendFounderTelegram,
} from "../runtime/lib/telegram.mjs";
import { enqueueFounderTelegram } from "../runtime/lib/telegram-queue.mjs";
import { readFactory, writeFactory } from "../runtime/lib/company-state.mjs";
import { helpHebrew } from "../runtime/lib/phone-commands.mjs";
import { probeConnections, readConnections } from "./lib/connections.mjs";
import { cloudOpsConfigured } from "./lib/cloud-work.mjs";

loadDotEnv();

const BIND = process.env.HQ_BIND || "127.0.0.1";
const PORT = Number(process.env.HQ_PORT || 8788);

function snapshot() {
  const factory = readFactory();
  const conn = readConnections();
  return {
    company: "AZToDev",
    mode: factory.mode || "standby",
    productWorkEnabled: factory.productWorkEnabled === true,
    productCompanyReady: factory.productCompanyReady === true,
    telegram: telegramConfigured(),
    cloudOps: cloudOpsConfigured(),
    connections: conn?.accounts || null,
    probedAt: conn?.at || null,
    port: PORT,
    bind: BIND,
    at: new Date().toISOString(),
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  if (url.pathname === "/health" || url.pathname === "/") {
    res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(snapshot(), null, 2));
    return;
  }
  res.writeHead(404).end("not found");
});

server.listen(PORT, BIND, async () => {
  console.log(`AZToDev HQ  http://${BIND}:${PORT}/health`);
  let probed = null;
  try {
    probed = await probeConnections();
    const a = probed.accounts || {};
    console.log(
      `TG=${Boolean(a.telegram?.ok)} Cursor=${Boolean(a.cursor?.ok)} GH=${a.github?.count ?? 0} Linear=${Boolean(a.linear?.ok)} Mail=${Boolean(a.gmail?.ok)} Gemini=${Boolean(a.gemini?.ok)}`
    );
  } catch (err) {
    console.log("probe:", String(err?.message || err).slice(0, 240));
  }

  if (telegramConfigured()) {
    const factory = readFactory();
    const last = Date.parse(factory.lastHqHelloAt || "") || 0;
    const fourHours = 4 * 60 * 60 * 1000;
    if (Date.now() - last > fourHours) {
      try {
        await sendFounderTelegram(helpHebrew(), { silent: false });
        writeFactory({ lastHqHelloAt: new Date().toISOString() });
      } catch {
        /* ignore */
      }
    }
  }
});

setInterval(() => {
  if (!telegramConfigured()) return;
  pollFounderMessages()
    .then((msgs) => {
      for (const m of msgs) enqueueFounderTelegram(m);
    })
    .catch(() => {});
}, 2000);
