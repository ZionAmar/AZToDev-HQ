/**
 * node runtime/scripts/test-beat-tom-rituals.mjs
 */
import assert from "assert";
import {
  jerusalemParts,
  buildMorningRitual,
  buildEveningRitual,
} from "../lib/company-rituals.mjs";
import { tickCompanyPresence } from "../lib/company-presence.mjs";

const jp = jerusalemParts();
assert.equal(typeof jp.hour, "number");
assert.match(jp.date, /^\d{4}-\d{2}-\d{2}$/);
assert.match(buildMorningRitual(), /נועה · בוקר טוב/);
assert.match(buildEveningRitual(), /נועה · סוף יום/);
const presence = await tickCompanyPresence();
assert.equal(typeof presence.sent, "boolean");
console.log("ok beat-tom-rituals", { hour: jp.hour, presence: presence.reason || "sent" });
