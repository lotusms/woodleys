import {
  getSiteIntegrationsSync,
  loadSiteIntegrations,
} from "@/lib/site-integrations";

/** Server-only — merges Firestore dashboard settings with env fallback. */

export async function ensureShopifyIntegrationLoaded() {
  await loadSiteIntegrations();
}

export async function isShopifyIntegrationConfigured() {
  await loadSiteIntegrations();
  const { shopifyStoreDomain, shopifyStorefrontAccessToken } =
    getSiteIntegrationsSync();
  return Boolean(shopifyStoreDomain && shopifyStorefrontAccessToken);
}

export async function isShopifyIntegrationCatalogEnabled() {
  if (!(await isShopifyIntegrationConfigured())) return false;
  return getSiteIntegrationsSync().shopifyCatalogEnabled;
}

export async function getShopifyIntegrationDomain() {
  await loadSiteIntegrations();
  return getSiteIntegrationsSync().shopifyStoreDomain;
}

export async function getShopifyIntegrationStorefrontToken() {
  await loadSiteIntegrations();
  return getSiteIntegrationsSync().shopifyStorefrontAccessToken;
}

export async function getShopifyIntegrationCheckoutUrl(cartId) {
  const domain = (await getShopifyIntegrationDomain())
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  if (!domain) return null;
  if (cartId) return `https://${domain}/cart/c/${cartId}`;
  return `https://${domain}/cart`;
}
