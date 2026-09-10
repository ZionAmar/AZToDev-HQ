/**
 * node runtime/scripts/test-agent-links.mjs
 */
import assert from "assert";
import {
  cloudAgentUrl,
  isValidAgentUrl,
  sanitizeAgentLinks,
  stripFalseDuplicateClaims,
} from "../lib/agent-links.mjs";

assert.equal(
  cloudAgentUrl("bc-abc123"),
  "https://cursor.com/agents/bc-abc123"
);
assert.equal(cloudAgentUrl(""), "");
assert.equal(cloudAgentUrl("not-bc"), "");

assert.ok(isValidAgentUrl("https://cursor.com/agents/bc-abc123"));
assert.ok(!isValidAgentUrl("https://cursor.com/"));
assert.ok(!isValidAgentUrl("https://cursor.com/agents/"));

const cleaned = sanitizeAgentLinks(
  "רות: https://cursor.com/\nטוב: https://cursor.com/agents/bc-real123"
);
assert.ok(!cleaned.includes("cursor.com/\n"));
assert.ok(cleaned.includes("bc-real123"));

const noDup = stripFalseDuplicateClaims(
  "לא פתחתי ריצה כפולה — יש כבר תוצאה טרייה. כתוב «שוב עכשיו»."
);
assert.ok(!noDup.includes("כפולה"));
assert.ok(!noDup.includes("טרייה"));

console.log("ok agent-links");
