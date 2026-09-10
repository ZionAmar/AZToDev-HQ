/**
 * node runtime/scripts/test-live-status.mjs
 */
import assert from "assert";
import { triageSpecialistResult, formatNoaUpdate } from "../lib/noa-triage.mjs";
import {
  cloudAgentUrl,
  isValidCloudSessionUrl,
  specialistSessionLine,
} from "../lib/live-runs.mjs";
import { liveStatusHebrew } from "../lib/live-status.mjs";
import { unfinishedActiveWork } from "../lib/active-work-watch.mjs";

assert.equal(cloudAgentUrl("bc-abc"), "https://cursor.com/agents/bc-abc");
assert.equal(cloudAgentUrl(""), "");
assert.equal(isValidCloudSessionUrl("https://cursor.com/agents/bc-abc"), true);
assert.equal(isValidCloudSessionUrl("https://cursor.com/"), false);
assert.match(
  specialistSessionLine("רות", "bc-da1b1d36-44f2-5fbc-b37c-f13a27ea7170"),
  /cursor\.com\/agents\/bc-da1b1d36/
);
assert.match(
  formatNoaUpdate({
    name: "רות",
    triage: triageSpecialistResult({ name: "רות", text: "ok" }),
    cloudAgentId: "bc-test123",
  }),
  /רות: https:\/\/cursor\.com\/agents\/bc-test123/
);
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
