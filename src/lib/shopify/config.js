/**
 * Shopify Storefront API configuration.
 * When credentials are present, product/category pages can hydrate from Shopify.
 * Checkout always routes through Shopify — no competing checkout flows.
 */

export function isShopifyConfigured() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );
}

export function getShopifyStoreDomain() {
  return process.env.SHOPIFY_STORE_DOMAIN || "";
}

export function getShopifyStorefrontToken() {
  return process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
}

/** Single checkout entry point — Shopify cart/checkout URL or Storefront checkout. */
export function getShopifyCheckoutUrl(cartId) {
  const domain = getShopifyStoreDomain();
  if (!domain) return null;
  if (cartId) {
    return `https://${domain}/cart/c/${cartId}`;
  }
  return `https://${domain}/cart`;
}

export function getShopifyCollectionUrl(handle) {
  const domain = getShopifyStoreDomain();
  if (!domain || !handle) return null;
  return `https://${domain}/collections/${handle}`;
}
