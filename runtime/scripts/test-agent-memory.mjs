/**
 * node runtime/scripts/test-agent-memory.mjs
 */
import assert from "assert";
import {
  parseLearningBlock,
  stripLearningBlock,
  stripFakeSpecialistClaims,
  inferRequiredDelegate,
  founderFacingText,
  memoryPromptBlock,
} from "../lib/agent-memory.mjs";

const sample = `שלום, אני בודקת.
DELEGATE: 33-household-ops | find Carmel invoice

LEARNING:
- do: search all three Gmail accounts
- dont: invent subjects
- note: routed to Ruth
`;

const parsed = parseLearningBlock(sample);
assert.equal(parsed.do.includes("Gmail"), true);
assert.equal(parsed.dont.includes("invent"), true);
assert.ok(!stripLearningBlock(sample).includes("LEARNING:"));
assert.ok(stripLearningBlock(sample).includes("DELEGATE:"));

assert.ok(!stripFakeSpecialistClaims("רות בדקה את המייל ומצאה הכל").includes("רות"));
assert.ok(!stripFakeSpecialistClaims("הפעלתי את נדב על הדיסק").includes("הפעלתי"));

assert.equal(
  inferRequiredDelegate("תמצאי חשבונית כרמל האחרונה")?.agentId,
  "33-household-ops"
);
assert.equal(
  inferRequiredDelegate("מה הסטטוס של swap בשרת")?.agentId,
  "35-server-ops"
);
assert.equal(
  inferRequiredDelegate("מה יש בדיסק במחשב")?.agentId,
  "34-pc-ops"
);
assert.equal(inferRequiredDelegate("מה את חושבת על הרעיון?"), null);
assert.equal(
  inferRequiredDelegate("תבנו אפליקציה לניהול מלאי")?.agentId,
  "32-delivery-lead"
);
assert.equal(
  inferRequiredDelegate("תפתח תיקייה במחשב")?.agentId,
  "34-pc-ops"
);
assert.equal(
  inferRequiredDelegate("לפתח מוצר חדש ללקוחות")?.agentId,
  "32-delivery-lead"
);

const facing = founderFacingText(sample);
assert.ok(!facing.includes("LEARNING"));
assert.ok(facing.includes("שלום"));

const block = memoryPromptBlock("33-household-ops");
assert.ok(block.includes("SHARED BRAIN"));
assert.ok(block.includes("רות") || block.includes("learning-log"));

console.log("ok agent-memory");
