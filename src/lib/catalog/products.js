import {
  getFirestoreProductByHandle,
} from "./firestore-products";
import {
  getMockProductByHandle,
  getMockProductsByCollectionHandle,
  isMockPreviewHandle,
  listAllMockCatalogProducts,
} from "./mock-catalog";
import { sortCatalogProducts } from "./sort-products";
import { cache } from "react";
import { listAllCatalogCollectionOptions } from "./collections-meta";
import { getCatalogPathForShopifyHandle } from "./categories";
import { isFirebaseAdminAuthError } from "@/lib/firebase-admin-server";
import { isShopifyIntegrationCatalogEnabled } from "@/lib/shopify/integration-config";
import {
  getActiveProductsList,
  getAllCatalogInventory,
  getCachedCatalogProduct,
  getCachedCollectionProducts,
  getFeaturedFirestoreProducts,
  getRecentFirestoreProducts,
  getSuppressedProductHandles,
} from "./catalog-cache";
import {
  getProductByHandle as getShopifyProductByHandle,
  getProductsByCollectionHandle as getShopifyCollectionProducts,
} from "@/lib/shopify/products";
import { withNormalizedProse } from "@/lib/prose";
import {
  isLegacyRingPreviewHandle,
  isRingSampleProductHandle,
} from "./ring-sample-products.js";
import { isBulovaSampleProductHandle } from "./bulova-sample-products.js";
import { normalizeCatalogImage } from "./normalize-image-src.js";
import { HOME_FEATURED_PRODUCT_HANDLES, HOME_NEW_RELEASE_HANDLES, HOME_NEW_RELEASE_LIMIT } from "@/config/featured-products";
import { mergeCollectionStorefrontProducts, splitCollectionInventory } from "./collection-storefront";

/**
 * @param {string} collectionHandle
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
async function fetchCollectionProductsUncached(collectionHandle) {
  const [inventory, suppressed] = await Promise.all([
    getAllCatalogInventory(),
    getSuppressedProductHandles(),
  ]);
  const { activeInCollection, inactiveHandlesInCollection } =
    splitCollectionInventory(inventory, collectionHandle, suppressed);

  const merged = mergeCollectionStorefrontProducts(
    collectionHandle,
    activeInCollection,
    suppressed,
    inactiveHandlesInCollection,
  );
  if (merged.length > 0) {
    return merged;
  }

  if (process.env.SHOPIFY_CATALOG_ENABLED === "true") {
    if (await isShopifyIntegrationCatalogEnabled()) {
      const fromShopify = await getShopifyCollectionProducts(collectionHandle);
      if (fromShopify.length > 0) {
        return fromShopify.map((p) =>
          withNormalizedProse({ ...p, source: /** @type {const} */ ("shopify") }),
        );
      }
    }
  }

  return [];
}

/**
 * Products for a collection page — seed catalog listings plus admin inventory.
 *
 * @param {string} collectionHandle
 * @param {{ title?: string; description?: string; image?: { src: string; alt: string } }} [meta]
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
export async function getCollectionProducts(collectionHandle, meta) {
  if (!collectionHandle) return [];

  return getCachedCollectionProducts(collectionHandle, () =>
    fetchCollectionProductsUncached(collectionHandle),
  );
}

/**
 * @param {string} handle
 * @returns {Promise<import("./product-types").CatalogProductDetail | null>}
 */
export async function getCatalogProductByHandle(handle) {
  if (!handle) return null;

  return getCachedCatalogProduct(handle, () =>
    getCatalogProductByHandleRequest(handle),
  );
}

export const getCatalogProductByHandleRequest = cache(async function getCatalogProductByHandleRequest(
  handle,
) {
  if (!handle) return null;

  const suppressed = await getSuppressedProductHandles();
  if (suppressed.has(handle)) return null;

  if (isLegacyRingPreviewHandle(handle)) {
    return null;
  }

  let firestoreProduct = null;
  try {
    firestoreProduct = await getFirestoreProductByHandle(handle, {
      includeInactive: true,
    });
  } catch (e) {
    if (!isFirebaseAdminAuthError(e)) {
      console.error("[catalog] product by handle:", handle, e);
    }
  }

  if (firestoreProduct) {
    if (!firestoreProduct.active) return null;
    return withNormalizedProse(firestoreProduct);
  }

  if (isRingSampleProductHandle(handle) || isBulovaSampleProductHandle(handle)) {
    const mock = getMockProductByHandle(handle);
    if (mock) return withNormalizedProse(mock);
  }

  if (process.env.SHOPIFY_CATALOG_ENABLED === "true" && !isMockPreviewHandle(handle)) {
    if (await isShopifyIntegrationCatalogEnabled()) {
      const fromShopify = await getShopifyProductByHandle(handle);
      if (fromShopify) {
        return withNormalizedProse({
          ...fromShopify,
          source: /** @type {const} */ ("shopify"),
        });
      }
    }
  }

  const mock = getMockProductByHandle(handle);
  return mock ? withNormalizedProse(mock) : null;
});

/**
 * @param {import("./product-types").CatalogProductDetail | Record<string, unknown>} product
 */
function resolveProductCollectionHandles(product) {
  if (Array.isArray(product.collectionHandles) && product.collectionHandles.length > 0) {
    return product.collectionHandles.map(String);
  }

  const handle = String(product.handle ?? "");
  if (isRingSampleProductHandle(handle)) {
    return ["fine-rings", "wedding-bands"];
  }
  if (isBulovaSampleProductHandle(handle)) {
    return ["bulova"];
  }
  if (!handle.startsWith("preview-")) return [];

  const rest = handle.slice("preview-".length);
  const knownHandles = listAllCatalogCollectionOptions()
    .map((option) => option.shopifyHandle)
    .sort((a, b) => b.length - a.length);

  for (const collectionHandle of knownHandles) {
    if (rest === collectionHandle || rest.startsWith(`${collectionHandle}-`)) {
      return [collectionHandle];
    }
  }

  return [];
}

/**
 * Other products from the same collection(s), excluding the current item.
 *
 * @param {import("./product-types").CatalogProductDetail} product
 * @param {{ limit?: number }} [opts]
 */
export async function getSimilarCatalogProducts(product, { limit = 12 } = {}) {
  const collectionHandles = resolveProductCollectionHandles(product);
  if (!collectionHandles.length) return [];

  const batches = await Promise.all(
    collectionHandles.map((collectionHandle) => getCollectionProducts(collectionHandle)),
  );

  /** @type {import("./product-types").CatalogProduct[]} */
  const similar = [];
  const seen = new Set([product.handle]);

  for (const items of batches) {
    for (const item of items) {
      if (seen.has(item.handle)) continue;
      seen.add(item.handle);
      similar.push(item);
      if (similar.length >= limit) return similar;
    }
  }

  return similar;
}

/**
 * @param {import("./product-types").CatalogProductDetail | Record<string, unknown>} product
 * @returns {{ href: string; label: string } | null}
 */
export function getProductCategoryNavigation(product) {
  const handles = resolveProductCollectionHandles(product);
  const primaryHandle = handles[0];
  if (!primaryHandle) return null;
  return getCatalogPathForShopifyHandle(primaryHandle);
}

/**
 * @param {import("./product-types").CatalogProductDetail | import("./product-types").CatalogProduct} product
 */
function toHomeCatalogProduct(product) {
  const normalized = withNormalizedProse(product);
  return {
    id: normalized.id,
    title: normalized.title,
    handle: normalized.handle,
    description: normalized.description,
    priceUsd: normalized.priceUsd,
    maxPriceUsd: normalized.maxPriceUsd,
    salePriceUsd: normalized.salePriceUsd,
    image: normalizeCatalogImage(normalized.image),
    availableForSale: normalized.availableForSale,
    source: normalized.source,
    createdAt: normalized.createdAt,
  };
}

/**
 * Recently added active products for the homepage new-releases carousel.
 *
 * @param {{ limit?: number; handles?: readonly string[] }} [opts]
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
export async function getNewReleaseProducts({
  limit = HOME_NEW_RELEASE_LIMIT,
  handles,
} = {}) {
  try {
    const [recent, suppressed] = await Promise.all([
      getRecentFirestoreProducts(limit),
      getSuppressedProductHandles(),
    ]);
    const active = recent.filter((product) => !suppressed.has(product.handle));
    if (active.length > 0) {
      return active.map(toHomeCatalogProduct);
    }
  } catch (e) {
    console.error("[catalog] new release products:", e);
  }

  const fallbackHandles =
    handles?.length ? handles : HOME_NEW_RELEASE_HANDLES;
  if (fallbackHandles.length > 0) {
    const resolved = await Promise.all(
      fallbackHandles.map((handle) => getCatalogProductByHandle(handle)),
    );
    const found = resolved.filter(Boolean);
    if (found.length > 0) {
      return found.map(toHomeCatalogProduct).slice(0, limit);
    }
  }

  const mocks = sortCatalogProducts(listAllMockCatalogProducts(), "newest");
  return mocks.slice(0, limit).map((product) => ({
    ...toHomeCatalogProduct({ ...product, source: /** @type {const} */ ("mock") }),
  }));
}

/**
 * Featured active products for the homepage showroom slider.
 *
 * @param {readonly string[]} [fallbackHandles]
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
export async function getFeaturedProducts(
  fallbackHandles = HOME_FEATURED_PRODUCT_HANDLES,
) {
  try {
    const featured = await getFeaturedFirestoreProducts();
    if (featured.length > 0) {
      return featured.map(toHomeCatalogProduct);
    }
  } catch (e) {
    console.error("[catalog] featured products:", e);
  }

  if (!fallbackHandles?.length) return [];

  const resolved = await Promise.all(
    fallbackHandles.map((handle) => getCatalogProductByHandle(handle)),
  );

  return resolved.filter(Boolean).map(toHomeCatalogProduct);
}
