/**
 * Cheap HQ loop on the thin desk — rituals, presence, PIN/stall, inbox/outbox.
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
import { tickCompanyRituals } from "./company-rituals.mjs";
import { tickCompanyPresence } from "./company-presence.mjs";
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

    try {
      await tickCompanyRituals();
    } catch (err) {
      journal("ritual_error", { error: String(err?.message || err).slice(0, 160) });
    }

    if (ticks % 2 === 0) {
      try {
        await tickCompanyPresence();
      } catch {
        /* presence best-effort */
      }
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
    // Legacy 20h brief — rituals cover morning/evening; keep as fallback if quiet day
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
