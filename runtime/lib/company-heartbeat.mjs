/**
 * Cheap HQ loop on the thin desk — PIN nag, git pull, inbox/outbox wake, daily brief.
 */
import { journal, RUNTIME_DIR, readJson } from "./paths.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { pinNagDue } from "./waiting-founder.mjs";
import { dispatchNextInbox } from "./inbox-dispatcher.mjs";
import { dispatchOutboxDelegates } from "./outbox-dispatcher.mjs";
import { kickWorkQueue } from "./work-queue.mjs";
import { liveStatusHebrew } from "./live-status.mjs";
import { syncHqMirror } from "./hq-mirror-sync.mjs";
import { activeWorkStallNag } from "./active-work-watch.mjs";
import path from "path";

function briefDue() {
  const st = readJson(path.join(RUNTIME_DIR, "founder-brief.json"), {});
  const last = Date.parse(st.lastSentAt || "") || 0;
  return Date.now() - last > 20 * 60 * 60 * 1000;
}

/** Jerusalem evening window ~20:00–21:00 — one brief if due. */
function jerusalemEveningWindow(now = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jerusalem",
      hour: "2-digit",
      hour12: false,
    }).formatToParts(now);
    const hour = Number(parts.find((p) => p.type === "hour")?.value || -1);
    return hour === 20;
  } catch {
    return false;
  }
}

let ticking = false;
let ticks = 0;

export async function tickCompanyHeartbeat() {
  if (ticking) return;
  ticking = true;
  ticks += 1;
  try {
    if (ticks % 4 === 0) {
      syncHqMirror();
    }
    const stall = activeWorkStallNag();
    if (stall) {
      await sendFounderTelegram(stall, { silent: false }).catch(() => {});
      journal("active_work_stall_nag", {});
    }
    const nag = pinNagDue();
    if (nag) {
      await sendFounderTelegram(`${nag}\n\n${liveStatusHebrew()}`, { silent: false }).catch(
        () => {}
      );
      journal("pin_nag_sent", {});
    }
    try {
      const outbox = dispatchOutboxDelegates();
      if (outbox.relayed) journal("heartbeat_outbox", { n: outbox.relayed });
    } catch {
      /* outbox scan best-effort */
    }
    kickWorkQueue();
    const inbox = dispatchNextInbox();
    if (inbox.started) {
      journal("heartbeat_inbox", { agentId: inbox.agentId });
    }
    if (briefDue() || jerusalemEveningWindow()) {
      const { sendFounderBrief } = await import("./founder-brief.mjs");
      // sendFounderBrief no-ops when not due unless we only call when briefDue —
      // evening window still respects founderBriefDue inside sendFounderBrief.
      if (briefDue()) {
        await sendFounderBrief({ force: false, telegram: true, email: false }).catch(
          () => {}
        );
      }
    }
  } catch (err) {
    journal("heartbeat_error", { error: String(err?.message || err).slice(0, 240) });
  } finally {
    ticking = false;
  }
}
