import {
  getShopifyStoreDomain,
  getShopifyStorefrontToken,
  isShopifyConfigured,
} from "./config";

const API_VERSION = "2026-04";

/**
 * @param {string} query
 * @param {Record<string, unknown>} [variables]
 */
export async function shopifyStorefrontQuery(query, variables = {}) {
  if (!isShopifyConfigured()) {
    return { data: null, errors: [{ message: "Shopify is not configured" }] };
  }

  const domain = getShopifyStoreDomain().replace(/^https?:\/\//, "").replace(/\/$/, "");
  const token = getShopifyStorefrontToken();

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return {
      data: null,
      errors: [{ message: `Shopify HTTP ${res.status}` }],
    };
  }

  const payload = await res.json();
  return payload;
}
