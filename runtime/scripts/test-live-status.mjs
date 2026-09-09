/**
 * node runtime/scripts/test-live-status.mjs
 */
import assert from "assert";
import { triageSpecialistResult, formatNoaUpdate } from "../lib/noa-triage.mjs";
import { cloudAgentUrl } from "../lib/live-runs.mjs";
import { liveStatusHebrew } from "../lib/live-status.mjs";
import { unfinishedActiveWork } from "../lib/active-work-watch.mjs";

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
assert.equal(unfinishedActiveWork(), null);
console.log("ok live-status");
