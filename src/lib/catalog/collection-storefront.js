import { filterSuppressedCatalogProducts } from "./catalog-suppressions";
import { getMockProductsByCollectionHandle } from "./mock-catalog";
import { withNormalizedProse } from "@/lib/prose";
import { isLegacyRingPreviewHandle } from "./ring-sample-products.js";

/**
 * Storefront collection pages show seed catalog products plus any admin inventory
 * in the same collection. Firestore entries override seed data when handles match.
 * When a seeded product exists in Firestore but is deactivated, the seed fallback
 * is hidden as well.
 *
 * @param {string} collectionHandle
 * @param {import("./product-types").CatalogProduct[]} activeInCollection
 * @param {Set<string>} suppressed
 * @param {Set<string>} [inactiveHandlesInCollection]
 * @returns {import("./product-types").CatalogProduct[]}
 */
export function mergeCollectionStorefrontProducts(
  collectionHandle,
  activeInCollection,
  suppressed,
  inactiveHandlesInCollection = new Set(),
) {
  const mocks = filterSuppressedCatalogProducts(
    getMockProductsByCollectionHandle(collectionHandle),
    suppressed,
  );

  /** @type {Map<string, import("./product-types").CatalogProduct>} */
  const byHandle = new Map();

  for (const mock of mocks) {
    if (inactiveHandlesInCollection.has(mock.handle)) continue;

    byHandle.set(mock.handle, withNormalizedProse({ ...mock, source: "mock" }));
  }

  for (const product of activeInCollection) {
    if (isLegacyRingPreviewHandle(product.handle)) continue;
    if (suppressed.has(product.handle)) continue;

    byHandle.set(
      product.handle,
      withNormalizedProse({ ...product, source: /** @type {const} */ ("local") }),
    );
  }

  return [...byHandle.values()];
}

/**
 * @param {import("./product-types").CatalogProduct[]} inventory
 * @param {string} collectionHandle
 * @param {Set<string>} [suppressed]
 */
export function splitCollectionInventory(inventory, collectionHandle, suppressed = new Set()) {
  const inCollection = inventory.filter(
    (product) =>
      !suppressed.has(product.handle) &&
      Array.isArray(product.collectionHandles) &&
      product.collectionHandles.includes(collectionHandle),
  );

  const activeInCollection = inCollection.filter((product) => product.active);
  const inactiveHandlesInCollection = new Set(
    inCollection.filter((product) => !product.active).map((product) => product.handle),
  );

  return { activeInCollection, inactiveHandlesInCollection };
}
