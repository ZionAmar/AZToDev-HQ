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
import { filterJobsForFounderAsk } from "../lib/work-intent.mjs";

assert.equal(
  inferRequiredDelegate("העלה את קידנסט מתיקיית פרויקט בשולחן העבודה לגיטהב כריפו פרטי")
    ?.agentId,
  "32-delivery-lead"
);
assert.equal(inferRequiredDelegate("תפתח תיקייה במחשב")?.agentId, "34-pc-ops");
assert.equal(inferRequiredDelegate("תבנו אפליקציה לניהול מלאי")?.agentId, "32-delivery-lead");
assert.ok(isMutatingCompanyAsk("תעלו את קידנסט לגיטהב כריפו פרטי"));
assert.ok(!isMutatingCompanyAsk("תבדקי מיילים"));
assert.equal(inferRequiredDelegate("תבדוק את השרת")?.agentId, "35-server-ops");
assert.equal(
  inferRequiredDelegate("העלה קידנסט לגיטהב מהמחשב והשרת של נסט")?.agentId,
  "32-delivery-lead"
);

const spray = filterJobsForFounderAsk(
  [
    { agentId: "32-delivery-lead", task: "plan" },
    { agentId: "35-server-ops", task: "scan server" },
    { agentId: "34-pc-ops", task: "push kidnest" },
  ],
  "העלה את קידנסט לגיטהב מתיקיית פרויקט"
);
assert.deepEqual(
  spray.map((j) => j.agentId),
  ["32-delivery-lead", "34-pc-ops"]
);
assert.equal(
  filterJobsForFounderAsk([{ agentId: "35-server-ops", task: "scan" }], "תבדוק מיילים").length,
  0
);

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
