/**
 * Cheap HQ loop on the thin desk — PIN nag, git pull, inbox wake, daily brief.
 */
import { journal, RUNTIME_DIR, readJson } from "./paths.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { pinNagDue } from "./waiting-founder.mjs";
import { dispatchNextInbox } from "./inbox-dispatcher.mjs";
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
    kickWorkQueue();
    const inbox = dispatchNextInbox();
    if (inbox.started) {
      journal("heartbeat_inbox", { agentId: inbox.agentId });
    }
    if (briefDue()) {
      const { sendFounderBrief } = await import("./founder-brief.mjs");
      await sendFounderBrief({ force: false, telegram: true, email: false }).catch(
        () => {}
      );
    }
  } catch (err) {
    journal("heartbeat_error", { error: String(err?.message || err).slice(0, 240) });
  } finally {
    ticking = false;
  }
}
