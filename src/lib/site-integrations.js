import {
  getFirebaseAdminDb,
  hasFirebaseAdminCredentials,
  isFirebaseAdminAuthError,
} from "@/lib/firebase-admin-server";
import { SECRET_MASK } from "@/lib/site-integrations-constants";

export { SECRET_MASK } from "@/lib/site-integrations-constants";

export const SITE_SETTINGS_COLLECTION = "siteSettings";
export const SITE_INTEGRATIONS_DOC_ID = "integrations";

const CACHE_TTL_MS = 30_000;
/** @type {{ data: ReturnType<typeof mergeIntegrations> | null; loadedAt: number }} */
const cache = { data: null, loadedAt: 0 };

/**
 * @typedef {{
 *   shopifyStoreDomain: string;
 *   shopifyStorefrontAccessToken: string;
 *   shopifyClientId: string;
 *   shopifyClientSecret: string;
 *   shopifyCatalogEnabled: boolean;
 *   updatedAt?: string;
 *   updatedBy?: string;
 * }} SiteIntegrations
 */

function envDefaults() {
  return {
    shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN?.trim() || "",
    shopifyStorefrontAccessToken:
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim() || "",
    shopifyClientId: process.env.SHOPIFY_CLIENT_ID?.trim() || "",
    shopifyClientSecret: process.env.SHOPIFY_CLIENT_SECRET?.trim() || "",
    shopifyCatalogEnabled: process.env.SHOPIFY_CATALOG_ENABLED === "true",
  };
}

/**
 * @param {Record<string, unknown> | null | undefined} stored
 * @param {ReturnType<typeof envDefaults>} env
 * @returns {SiteIntegrations}
 */
function mergeIntegrations(stored, env) {
  const pick = (key) => {
    const fromStore = stored?.[key];
    if (typeof fromStore === "string" && fromStore.trim()) return fromStore.trim();
    if (typeof fromStore === "boolean") return fromStore;
    return env[key];
  };

  return {
    shopifyStoreDomain: pick("shopifyStoreDomain"),
    shopifyStorefrontAccessToken: pick("shopifyStorefrontAccessToken"),
    shopifyClientId: pick("shopifyClientId"),
    shopifyClientSecret: pick("shopifyClientSecret"),
    shopifyCatalogEnabled: Boolean(
      stored?.shopifyCatalogEnabled ?? env.shopifyCatalogEnabled,
    ),
    updatedAt:
      typeof stored?.updatedAt === "string" ? stored.updatedAt : undefined,
    updatedBy:
      typeof stored?.updatedBy === "string" ? stored.updatedBy : undefined,
  };
}

/**
 * Merge admin form payload onto stored integrations (preserves masked secrets).
 *
 * @param {SiteIntegrations} current
 * @param {Record<string, unknown>} body
 */
export function buildIntegrationsDraft(current, body) {
  const pickSecret = (key) => {
    const incoming = body[key];
    if (incoming === SECRET_MASK || incoming === "") return current[key];
    if (typeof incoming === "string") return incoming.trim();
    return current[key];
  };

  return {
    shopifyStoreDomain:
      typeof body.shopifyStoreDomain === "string"
        ? body.shopifyStoreDomain.trim()
        : current.shopifyStoreDomain,
    shopifyStorefrontAccessToken: pickSecret("shopifyStorefrontAccessToken"),
    shopifyClientId: pickSecret("shopifyClientId"),
    shopifyClientSecret: pickSecret("shopifyClientSecret"),
    shopifyCatalogEnabled:
      typeof body.shopifyCatalogEnabled === "boolean"
        ? body.shopifyCatalogEnabled
        : current.shopifyCatalogEnabled,
  };
}

export function invalidateSiteIntegrationsCache() {
  cache.data = null;
  cache.loadedAt = 0;
}

/**
 * Load merged integrations (Firestore overrides env). Cached briefly on the server.
 *
 * @returns {Promise<SiteIntegrations>}
 */
export async function loadSiteIntegrations() {
  const now = Date.now();
  if (cache.data && now - cache.loadedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const env = envDefaults();
  let stored = null;

  if (hasFirebaseAdminCredentials()) {
    try {
      const db = getFirebaseAdminDb();
      const snap = await db
        .collection(SITE_SETTINGS_COLLECTION)
        .doc(SITE_INTEGRATIONS_DOC_ID)
        .get();
      stored = snap.exists ? snap.data() : null;
    } catch (e) {
      if (isFirebaseAdminAuthError(e)) {
        console.warn(
          "[site-integrations] Firestore unavailable — using env defaults. Regenerate FIREBASE_SERVICE_ACCOUNT_JSON if credentials expired.",
        );
      } else {
        console.error("[site-integrations] load:", e);
      }
    }
  }

  cache.data = mergeIntegrations(stored, env);
  cache.loadedAt = now;
  return cache.data;
}

/** @returns {SiteIntegrations} */
export function getSiteIntegrationsSync() {
  if (cache.data) return cache.data;
  return mergeIntegrations(null, envDefaults());
}

/**
 * @param {Partial<SiteIntegrations>} patch
 * @param {string} [updatedBy]
 */
export async function saveSiteIntegrations(patch, updatedBy) {
  const db = getFirebaseAdminDb();
  const ref = db.collection(SITE_SETTINGS_COLLECTION).doc(SITE_INTEGRATIONS_DOC_ID);
  const existingSnap = await ref.get();
  const existing = existingSnap.exists ? existingSnap.data() : {};
  const now = new Date().toISOString();

  /** @type {Record<string, unknown>} */
  const next = { ...existing, updatedAt: now };

  if (updatedBy) next.updatedBy = updatedBy;

  const stringFields = [
    "shopifyStoreDomain",
    "shopifyStorefrontAccessToken",
    "shopifyClientId",
    "shopifyClientSecret",
  ];

  for (const key of stringFields) {
    if (!(key in patch)) continue;
    const value = patch[key];
    if (value === SECRET_MASK) continue;
    next[key] = typeof value === "string" ? value.trim() : "";
  }

  if ("shopifyCatalogEnabled" in patch) {
    next.shopifyCatalogEnabled = Boolean(patch.shopifyCatalogEnabled);
  }

  await ref.set(next, { merge: true });
  invalidateSiteIntegrationsCache();
  return loadSiteIntegrations();
}

/**
 * Admin API shape — secrets masked, flags for which secrets exist.
 *
 * @param {SiteIntegrations} integrations
 */
export function toAdminSettingsResponse(integrations) {
  const env = envDefaults();

  return {
    shopifyStoreDomain: integrations.shopifyStoreDomain,
    shopifyCatalogEnabled: integrations.shopifyCatalogEnabled,
    updatedAt: integrations.updatedAt ?? null,
    updatedBy: integrations.updatedBy ?? null,
    secrets: {
      shopifyStorefrontAccessToken: integrations.shopifyStorefrontAccessToken
        ? SECRET_MASK
        : "",
      shopifyClientId: integrations.shopifyClientId ? SECRET_MASK : "",
      shopifyClientSecret: integrations.shopifyClientSecret ? SECRET_MASK : "",
    },
    secretsSet: {
      shopifyStorefrontAccessToken: Boolean(integrations.shopifyStorefrontAccessToken),
      shopifyClientId: Boolean(integrations.shopifyClientId),
      shopifyClientSecret: Boolean(integrations.shopifyClientSecret),
    },
    envFallback: {
      shopifyStoreDomain: Boolean(env.shopifyStoreDomain),
      shopifyStorefrontAccessToken: Boolean(env.shopifyStorefrontAccessToken),
    },
    status: {
      shopifyConfigured: Boolean(
        integrations.shopifyStoreDomain && integrations.shopifyStorefrontAccessToken,
      ),
    },
  };
}

/** @param {SiteIntegrations} integrations */
export function toPublicSettingsResponse(integrations) {
  return {
    shopifyConfigured: Boolean(
      integrations.shopifyStoreDomain && integrations.shopifyStorefrontAccessToken,
    ),
    shopifyCatalogEnabled:
      integrations.shopifyCatalogEnabled &&
      Boolean(
        integrations.shopifyStoreDomain && integrations.shopifyStorefrontAccessToken,
      ),
    shopifyStoreDomain: integrations.shopifyStoreDomain || null,
  };
}

/**
 * @param {SiteIntegrations} integrations
 */
export async function testShopifyConnection(integrations) {
  const domain = integrations.shopifyStoreDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const token = integrations.shopifyStorefrontAccessToken;

  if (!domain || !token) {
    return { ok: false, message: "Store domain and Storefront access token are required." };
  }

  const res = await fetch(`https://${domain}/api/2026-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: "{ shop { name } }" }),
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      ok: false,
      message: `Shopify returned HTTP ${res.status}. Check the store domain and token.`,
    };
  }

  const payload = await res.json().catch(() => ({}));
  if (payload.errors?.length) {
    return {
      ok: false,
      message: payload.errors[0]?.message || "Shopify rejected the Storefront token.",
    };
  }

  const shopName = payload.data?.shop?.name;
  return {
    ok: true,
    message: shopName
      ? `Connected to ${shopName}.`
      : "Storefront API connection succeeded.",
  };
}
