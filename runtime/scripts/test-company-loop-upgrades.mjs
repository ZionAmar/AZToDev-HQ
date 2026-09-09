/**
 * node runtime/scripts/test-company-loop-upgrades.mjs
 */
import assert from "assert";
import { cursorModelSelection, cursorModelForAgent } from "../lib/models.mjs";
import { finishQueuedPcByNadavId } from "../lib/background-delegate.mjs";
import { dispatchOutboxDelegates } from "../lib/outbox-dispatcher.mjs";

assert.equal(cursorModelForAgent("33-household-ops"), "gemini-3.8-flash");
assert.equal(cursorModelSelection("00-ceo").id, "claude-sonnet-5");
assert.equal(typeof finishQueuedPcByNadavId, "function");
assert.equal(typeof dispatchOutboxDelegates, "function");
const out = dispatchOutboxDelegates();
assert.equal(typeof out.relayed, "number");
console.log("ok company-loop-upgrades", {
  noa: cursorModelForAgent("00-ceo"),
  nadav: cursorModelForAgent("34-pc-ops"),
  outboxRelayed: out.relayed,
});
