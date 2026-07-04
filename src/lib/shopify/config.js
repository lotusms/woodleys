/**
 * Shopify Storefront API configuration from environment variables.
 * Client-safe — used by cart checkout URL building when env is set at deploy time.
 */

export function isShopifyConfigured() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );
}

/** When false (default), collection/PDP reads use Firestore/mock — not Storefront API. */
export function isShopifyCatalogEnabled() {
  return isShopifyConfigured() && process.env.SHOPIFY_CATALOG_ENABLED === "true";
}

export function getShopifyStoreDomain() {
  return process.env.SHOPIFY_STORE_DOMAIN || "";
}

export function getShopifyStorefrontToken() {
  return process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
}

/** Single checkout entry point — Shopify cart/checkout URL. */
export function getShopifyCheckoutUrl(cartId) {
  const domain = getShopifyStoreDomain().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!domain) return null;
  if (cartId) {
    return `https://${domain}/cart/c/${cartId}`;
  }
  return `https://${domain}/cart`;
}

export function getShopifyCollectionUrl(handle) {
  const domain = getShopifyStoreDomain().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (!domain || !handle) return null;
  return `https://${domain}/collections/${handle}`;
}
