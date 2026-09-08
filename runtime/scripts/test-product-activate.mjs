/**
 * node runtime/scripts/test-product-activate.mjs
 * Does not flip factory.json — extract/strip only.
 */
import assert from "assert";
import {
  extractActivateProduct,
  stripActivateProduct,
} from "../lib/product-activate.mjs";
import {
  productCloudBlocked,
  usesHqOpsCloud,
  standbyDelegateAllowed,
} from "../lib/specialist-runtime.mjs";
import { isProductWorkEnabled, isProductCompanyReady } from "../lib/company-state.mjs";

const sample = `קשת מוכנה. מחכים לך.
ACTIVATE_PRODUCT: kids-quiz | inventory homework for kids
DELEGATE: 04-cpo | polish the bet
`;

const req = extractActivateProduct(sample);
assert.equal(req.slug, "kids-quiz");
assert.ok(req.bet.includes("inventory"));
assert.ok(!stripActivateProduct(sample).includes("ACTIVATE_PRODUCT"));
assert.ok(stripActivateProduct(sample).includes("קשת מוכנה"));

assert.equal(isProductWorkEnabled(), false);
assert.equal(isProductCompanyReady(), true);
assert.equal(usesHqOpsCloud("00-ceo"), true);
assert.equal(usesHqOpsCloud("32-delivery-lead"), true);
assert.equal(usesHqOpsCloud("13-backend-engineer"), false);
assert.equal(standbyDelegateAllowed("32-delivery-lead"), true);
assert.equal(productCloudBlocked("32-delivery-lead"), false);
assert.equal(productCloudBlocked("13-backend-engineer"), true);
assert.equal(productCloudBlocked("33-household-ops"), false);

console.log("ok product-activate + keshet standby");
