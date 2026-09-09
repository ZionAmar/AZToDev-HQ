/**
 * node runtime/scripts/test-company-loop.mjs
 */
import assert from "assert";
import {
  setWaitingFounder,
  takeWaitingFounder,
  peekWaitingFounder,
} from "../lib/waiting-founder.mjs";
import { inferRequiredDelegate } from "../lib/agent-memory.mjs";
import { isMutatingCompanyAsk } from "../../hq/lib/delegate-relay.mjs";

assert.equal(
  inferRequiredDelegate("העלה את קידנסט מתיקיית פרויקט בשולחן העבודה לגיטהב כריפו פרטי")
    ?.agentId,
  "32-delivery-lead"
);
assert.equal(inferRequiredDelegate("תפתח תיקייה במחשב")?.agentId, "34-pc-ops");
assert.equal(inferRequiredDelegate("תבנו אפליקציה לניהול מלאי")?.agentId, "32-delivery-lead");
assert.ok(isMutatingCompanyAsk("תעלו את קידנסט לגיטהב כריפו פרטי"));
assert.ok(!isMutatingCompanyAsk("תבדקי מיילים"));

takeWaitingFounder("confirm");
takeWaitingFounder("pin");
const item = setWaitingFounder({
  kind: "pin",
  task: "push kidnest",
  agentId: "34-pc-ops",
});
assert.equal(peekWaitingFounder("pin")?.id, item.id);
assert.equal(takeWaitingFounder("pin")?.agentId, "34-pc-ops");
assert.equal(peekWaitingFounder("pin"), null);

console.log("ok company-loop");
