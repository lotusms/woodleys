import { getShopifyCheckoutUrl } from "@/lib/shopify/config";

/** @typedef {'local' | 'shopify' | 'mock'} CartLineSource */

/**
 * @param {{ source?: CartLineSource, shopifyVariantId?: string | null }} line
 */
export function isShopifyCartLine(line) {
  if (line?.source === "shopify") return true;
  return Boolean(line?.shopifyVariantId);
}

/**
 * @param {Array<{ source?: CartLineSource, shopifyVariantId?: string | null }>} lines
 */
export function cartRequiresShopifyCheckout(lines = []) {
  return lines.some(isShopifyCartLine);
}

/**
 * @param {Array<{ source?: CartLineSource, shopifyVariantId?: string | null }>} lines
 */
export function cartIsLocalOnly(lines = []) {
  if (!lines.length) return false;
  return lines.every((line) => !isShopifyCartLine(line));
}

/**
 * @param {string | null | undefined} variantId
 */
function shopifyVariantNumericId(variantId) {
  if (!variantId) return null;
  const raw = String(variantId);
  const gidMatch = raw.match(/ProductVariant\/(\d+)/i);
  if (gidMatch) return gidMatch[1];
  if (/^\d+$/.test(raw)) return raw;
  return null;
}

/**
 * Build a Shopify cart URL when the cart contains Shopify line items.
 * @param {Array<{ quantity?: number, shopifyVariantId?: string | null, variantId?: string | null }>} lines
 * @param {{ domain?: string | null }} [options] — optional store domain (dashboard / server); falls back to env.
 */
export function getShopifyCheckoutUrlForCart(lines = [], { domain } = {}) {
  const shopifyLines = lines.filter(isShopifyCartLine);
  const segments = shopifyLines
    .map((line) => {
      const numericId = shopifyVariantNumericId(
        line.shopifyVariantId ?? line.variantId,
      );
      if (!numericId) return null;
      const qty = Math.max(1, Math.floor(Number(line.quantity) || 1));
      return `${numericId}:${qty}`;
    })
    .filter(Boolean);

  const normalizedDomain = domain
    ? String(domain).replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";
  const baseFromDomain = normalizedDomain
    ? `https://${normalizedDomain}/cart`
    : getShopifyCheckoutUrl();

  if (segments.length > 0) {
    if (!baseFromDomain) return null;
    const root = baseFromDomain.replace(/\/cart\/?$/, "");
    return `${root}/cart/${segments.join(",")}`;
  }

  return baseFromDomain || getShopifyCheckoutUrl();
}
