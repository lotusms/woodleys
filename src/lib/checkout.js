/** Flat shipping per item when the order is below the free-shipping threshold. */
export const SHIPPING_PER_ITEM_USD = 15;
/** Orders at or above this subtotal ship free. */
export const FREE_SHIPPING_THRESHOLD_USD = 500;

const PRICES_INCLUDE_SHIPPING_DEFAULT =
  process.env.NEXT_PUBLIC_PRICES_INCLUDE_SHIPPING === "true";

export function shippingIncludedForLines(lines = []) {
  if (PRICES_INCLUDE_SHIPPING_DEFAULT) return true;
  if (!Array.isArray(lines) || lines.length === 0) return false;
  return lines.every((line) => Boolean(line.shippingIncluded));
}

/**
 * Total quantity across cart lines (units, not line rows).
 * @param {Array<{ quantity?: number }>} lines
 */
export function cartItemCount(lines = []) {
  if (!Array.isArray(lines)) return 0;
  return lines.reduce((sum, line) => {
    const qty = Number(line?.quantity);
    return sum + (Number.isFinite(qty) && qty > 0 ? Math.floor(qty) : 0);
  }, 0);
}

/**
 * Free shipping at/above $500 subtotal; otherwise $15 × item quantity.
 * @param {number} subtotalUsd
 * @param {Array<{ quantity?: number, shippingIncluded?: boolean }>} [lines]
 */
export function shippingForSubtotal(subtotalUsd, lines = []) {
  if (shippingIncludedForLines(lines)) return 0;
  const subtotal = Number(subtotalUsd);
  if (Number.isFinite(subtotal) && subtotal >= FREE_SHIPPING_THRESHOLD_USD) {
    return 0;
  }
  return cartItemCount(lines) * SHIPPING_PER_ITEM_USD;
}

export function orderTotal(subtotalUsd, lines = []) {
  return subtotalUsd + shippingForSubtotal(subtotalUsd, lines);
}

/** Short policy line for cart / checkout summaries. */
export function shippingPolicyNote(subtotalUsd) {
  const subtotal = Number(subtotalUsd) || 0;
  if (subtotal >= FREE_SHIPPING_THRESHOLD_USD) {
    return "Free shipping on orders over $500.";
  }
  const remaining = FREE_SHIPPING_THRESHOLD_USD - subtotal;
  return `$15 flat-rate shipping per item. Add ${remaining.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })} more for free shipping.`;
}

export const ORDER_STORAGE_KEY = "shamrock-last-order-v1";

/** One-shot status after checkout for thank-you page (email send result). */
export const ORDER_EMAIL_STATUS_KEY = "shamrock-order-email-status-v1";
