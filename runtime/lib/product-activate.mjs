/**
 * Flip productWorkEnabled only when the founder PIN window is open
 * and Keshet/Noa emit ACTIVATE_PRODUCT: slug | bet
 */
import { journal } from "./paths.mjs";
import { isActionUnlocked } from "./action-pin.mjs";
import { isProductWorkEnabled, writeFactory } from "./company-state.mjs";

export const ACTIVATE_LINE = /^ACTIVATE_PRODUCT:\s*([^\s|]+)\s*\|\s*(.+)$/im;

export function extractActivateProduct(text) {
  const m = String(text || "").match(ACTIVATE_LINE);
  if (!m) return null;
  return { slug: m[1].trim(), bet: m[2].trim() };
}

export function stripActivateProduct(text) {
  return String(text || "")
    .replace(ACTIVATE_LINE, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * @returns {{ activated: boolean, message: string, cleaned: string }}
 */
export function applyActivateProduct(text) {
  const cleaned = stripActivateProduct(text);
  const req = extractActivateProduct(text);
  if (!req) return { activated: false, message: "", cleaned: String(text || "") };

  if (isProductWorkEnabled()) {
    return {
      activated: false,
      message: "עבודת מוצר כבר דולקת.",
      cleaned,
    };
  }
  if (!isActionUnlocked()) {
    journal("product_activate_blocked_pin", { slug: req.slug });
    return {
      activated: false,
      message:
        "קשת מוכנה. כדי להתחיל לבנות צריך סיסמה ואז משפט מפורש «תבנו». בלי זה אין PR.",
      cleaned,
    };
  }

  writeFactory({
    productWorkEnabled: true,
    mode: "build",
    activeWork: {
      slug: req.slug,
      bet: req.bet,
      armedAt: new Date().toISOString(),
    },
  });
  journal("product_work_enabled", { slug: req.slug, bet: req.bet.slice(0, 200) });
  return {
    activated: true,
    message: `עבודת מוצר דולקת · ${req.slug} · ${req.bet.slice(0, 120)}`,
    cleaned,
  };
}
