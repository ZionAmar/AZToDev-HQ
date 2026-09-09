/**
 * Cheap HQ loop on the thin desk — PIN nag + inbox wake.
 */
import { journal } from "./paths.mjs";
import { sendFounderTelegram } from "./telegram.mjs";
import { pinNagDue } from "./waiting-founder.mjs";
import { dispatchNextInbox } from "./inbox-dispatcher.mjs";
import { kickWorkQueue } from "./work-queue.mjs";

let ticking = false;

export async function tickCompanyHeartbeat() {
  if (ticking) return;
  ticking = true;
  try {
    const nag = pinNagDue();
    if (nag) {
      await sendFounderTelegram(nag, { silent: false }).catch(() => {});
      journal("pin_nag_sent", {});
    }
    kickWorkQueue();
    const inbox = dispatchNextInbox();
    if (inbox.started) {
      journal("heartbeat_inbox", { agentId: inbox.agentId });
    }
  } catch (err) {
    journal("heartbeat_error", { error: String(err?.message || err).slice(0, 240) });
  } finally {
    ticking = false;
  }
}
