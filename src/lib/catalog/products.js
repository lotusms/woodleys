import { getCatalogMetaByShopifyHandle } from "./categories";
import {
  getMockProductByHandle,
  getMockProductsByCollectionHandle,
} from "./mock-catalog";
import { isShopifyConfigured } from "@/lib/shopify/config";
import {
  getProductByHandle as getShopifyProductByHandle,
  getProductsByCollectionHandle as getShopifyCollectionProducts,
} from "@/lib/shopify/products";

/**
 * Future: load products from your own database (Firestore, etc.).
 * @param {string} _collectionHandle
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
async function getLocalDatabaseProducts(_collectionHandle) {
  return [];
}

/**
 * Future: load a single product from your own database.
 * @param {string} _handle
 * @returns {Promise<import("./product-types").CatalogProductDetail | null>}
 */
async function getLocalDatabaseProductByHandle(_handle) {
  return null;
}

/**
 * Products for a collection page. Shopify when live and populated, then local DB, then mock preview.
 *
 * @param {string} collectionHandle
 * @param {{ title?: string; description?: string; image?: { src: string; alt: string } }} [meta]
 * @returns {Promise<import("./product-types").CatalogProduct[]>}
 */
export async function getCollectionProducts(collectionHandle, meta) {
  if (!collectionHandle) return [];

  const catalogMeta = meta ?? getCatalogMetaByShopifyHandle(collectionHandle);

  if (isShopifyConfigured()) {
    const fromShopify = await getShopifyCollectionProducts(collectionHandle);
    if (fromShopify.length > 0) {
      return fromShopify.map((p) => ({ ...p, source: /** @type {const} */ ("shopify") }));
    }
  }

  const fromDb = await getLocalDatabaseProducts(collectionHandle);
  if (fromDb.length > 0) {
    return fromDb.map((p) => ({ ...p, source: /** @type {const} */ ("local") }));
  }

  const mocks = getMockProductsByCollectionHandle(collectionHandle);
  if (mocks.length > 0) return mocks;

  return [];
}

/**
 * @param {string} handle
 * @returns {Promise<import("./product-types").CatalogProductDetail | null>}
 */
export async function getCatalogProductByHandle(handle) {
  if (!handle) return null;

  if (isShopifyConfigured()) {
    const fromShopify = await getShopifyProductByHandle(handle);
    if (fromShopify) {
      return { ...fromShopify, source: /** @type {const} */ ("shopify") };
    }
  }

  const fromDb = await getLocalDatabaseProductByHandle(handle);
  if (fromDb) return fromDb;

  return getMockProductByHandle(handle);
}
