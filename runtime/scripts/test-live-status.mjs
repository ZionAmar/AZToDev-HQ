/**
 * node runtime/scripts/test-live-status.mjs
 */
import assert from "assert";
import { triageSpecialistResult, formatNoaUpdate } from "../lib/noa-triage.mjs";
import { cloudAgentUrl } from "../lib/live-runs.mjs";
import { liveStatusHebrew } from "../lib/live-status.mjs";
import { unfinishedActiveWork } from "../lib/active-work-watch.mjs";
import { readFactory } from "../lib/company-state.mjs";

assert.equal(cloudAgentUrl("bc-abc"), "https://cursor.com/agents/bc-abc");
assert.equal(cloudAgentUrl(""), "");
assert.equal(
  triageSpecialistResult({ name: "קשת", text: "DELEGATE: 34-pc-ops | push" }).kind,
  "next_stage"
);
assert.equal(
  triageSpecialistResult({
    name: "נדב",
    text: "LOCKED: founder must send the action PIN",
  }).kind,
  "waiting"
);
assert.equal(
  triageSpecialistResult({ name: "תמיר", text: "0xC0000142", ok: false }).kind,
  "problem"
);
assert.match(
  formatNoaUpdate({
    name: "קשת",
    triage: triageSpecialistResult({ name: "קשת", text: "ok" }),
  }),
  /נועה · עדכון זרימה/
);
const live = liveStatusHebrew();
assert.match(live, /סטטוס חי/);
assert.match(live, /עכשיו:/);
assert.match(live, /מחכה ל:/);
assert.match(live, /הבא:/);
// This test used to hard-assert "no open work" — that assumption silently went
// stale the moment a real bet opened (exactly the "tasks don't close" symptom
// the founder flagged 2026-09-09). Assert the function's real contract instead:
// it must mirror the live, git-tracked factory.activeWork truthfully, not a
// fixed snapshot from whenever this test was written.
{
  const factory = readFactory();
  const w = factory.activeWork;
  const isOpen = Boolean((w?.slug || w?.bet) && w.gate !== "done" && w.status !== "done");
  const open = unfinishedActiveWork();
  if (isOpen) {
    assert.ok(open, "unfinishedActiveWork() must report the real open activeWork, not null");
    assert.equal(open.slug, w.slug);
  } else {
    assert.equal(open, null);
  }
}
assert.equal(
  (await import("../lib/models.mjs")).cursorModelForAgent("00-ceo"),
  "claude-sonnet-5"
);
assert.equal(
  (await import("../lib/models.mjs")).cursorModelForAgent("34-pc-ops"),
  "composer-2.5"
);
assert.equal(
  (await import("../lib/models.mjs")).cursorModelForAgent("12-software-architect"),
  "claude-opus-5"
);
console.log("ok live-status");
