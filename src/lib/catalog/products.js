import {
  getFirestoreProductByHandle,
  listFirestoreProducts,
  listFirestoreProductsByCollection,
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
import { loadSiteIntegrations } from "@/lib/site-integrations";
import { isFirebaseAdminAuthError } from "@/lib/firebase-admin-server";
import { isShopifyIntegrationCatalogEnabled } from "@/lib/shopify/integration-config";
import {
  getProductByHandle as getShopifyProductByHandle,
  getProductsByCollectionHandle as getShopifyCollectionProducts,
} from "@/lib/shopify/products";

/**
 * @param {string} collectionHandle
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
async function getLocalDatabaseProducts(collectionHandle) {
  try {
    return await listFirestoreProductsByCollection(collectionHandle);
  } catch (e) {
    if (!isFirebaseAdminAuthError(e)) {
      console.error("[catalog] local products by collection:", collectionHandle, e);
    }
    return [];
  }
}

/**
 * @param {string} handle
 * @returns {Promise<import("./product-types").CatalogProductDetail | null>}
 */
async function getLocalDatabaseProductByHandle(handle) {
  try {
    return await getFirestoreProductByHandle(handle);
  } catch (e) {
    if (!isFirebaseAdminAuthError(e)) {
      console.error("[catalog] local product by handle:", handle, e);
    }
    return null;
  }
}

/**
 * Products for a collection page. Firestore (admin inventory) first, then Shopify when
 * explicitly enabled, then mock preview listings.
 *
 * @param {string} collectionHandle
 * @param {{ title?: string; description?: string; image?: { src: string; alt: string } }} [meta]
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
export async function getCollectionProducts(collectionHandle, meta) {
  if (!collectionHandle) return [];

  await loadSiteIntegrations();

  const fromDb = await getLocalDatabaseProducts(collectionHandle);
  if (fromDb.length > 0) {
    return fromDb.map((p) => ({ ...p, source: /** @type {const} */ ("local") }));
  }

  if (await isShopifyIntegrationCatalogEnabled()) {
    const fromShopify = await getShopifyCollectionProducts(collectionHandle);
    if (fromShopify.length > 0) {
      return fromShopify.map((p) => ({ ...p, source: /** @type {const} */ ("shopify") }));
    }
  }

  const mocks = getMockProductsByCollectionHandle(collectionHandle);
  if (mocks.length > 0) return mocks;

  return [];
}

/**
 * @param {string} handle
 * @returns {Promise<import("./product-types").CatalogProductDetail | null>}
 */
export const getCatalogProductByHandle = cache(async function getCatalogProductByHandle(
  handle,
) {
  if (!handle) return null;

  const fromDb = await getLocalDatabaseProductByHandle(handle);
  if (fromDb) return fromDb;

  if ((await isShopifyIntegrationCatalogEnabled()) && !isMockPreviewHandle(handle)) {
    const fromShopify = await getShopifyProductByHandle(handle);
    if (fromShopify) {
      return { ...fromShopify, source: /** @type {const} */ ("shopify") };
    }
  }

  return getMockProductByHandle(handle);
});

/**
 * @param {import("./product-types").CatalogProductDetail | Record<string, unknown>} product
 */
function resolveProductCollectionHandles(product) {
  if (Array.isArray(product.collectionHandles) && product.collectionHandles.length > 0) {
    return product.collectionHandles.map(String);
  }

  const handle = String(product.handle ?? "");
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

  /** @type {import("./product-types").CatalogProduct[]} */
  const similar = [];
  const seen = new Set([product.handle]);

  for (const collectionHandle of collectionHandles) {
    const items = await getCollectionProducts(collectionHandle);
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
  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    description: product.description,
    priceUsd: product.priceUsd,
    maxPriceUsd: product.maxPriceUsd,
    salePriceUsd: product.salePriceUsd,
    image: product.image,
    availableForSale: product.availableForSale,
    source: product.source,
    createdAt: product.createdAt,
  };
}

/**
 * Recently added active products for the homepage new-releases carousel.
 *
 * @param {{ limit?: number }} [opts]
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
export async function getNewReleaseProducts({ limit = 12 } = {}) {
  try {
    const fromDb = await listFirestoreProducts({ activeOnly: true });
    if (fromDb.length > 0) {
      return sortCatalogProducts(fromDb, "newest")
        .slice(0, limit)
        .map(toHomeCatalogProduct);
    }
  } catch (e) {
    console.error("[catalog] new release products:", e);
  }

  const mocks = sortCatalogProducts(listAllMockCatalogProducts(), "newest");
  return mocks.slice(0, limit).map((product) => ({
    ...toHomeCatalogProduct({ ...product, source: /** @type {const} */ ("mock") }),
  }));
}

/**
 * Homepage showcase — Firestore featured products first, then config handles.
 *
 * @param {readonly string[]} [fallbackHandles]
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
export async function getFeaturedProducts(fallbackHandles = []) {
  try {
    const featured = await listFirestoreProducts({
      activeOnly: true,
      featuredOnly: true,
    });
    if (featured.length > 0) {
      return featured.map((product) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        priceUsd: product.priceUsd,
        maxPriceUsd: product.maxPriceUsd,
        salePriceUsd: product.salePriceUsd,
        image: product.image,
        availableForSale: product.availableForSale,
        source: product.source,
      }));
    }
  } catch (e) {
    console.error("[catalog] featured products:", e);
  }

  if (!fallbackHandles?.length) return [];

  const resolved = await Promise.all(
    fallbackHandles.map((handle) => getCatalogProductByHandle(handle)),
  );

  return resolved
    .filter(Boolean)
    .map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      description: product.description,
      priceUsd: product.priceUsd,
      maxPriceUsd: product.maxPriceUsd,
      salePriceUsd: product.salePriceUsd,
      image: product.image,
      availableForSale: product.availableForSale,
      source: product.source,
    }));
}
