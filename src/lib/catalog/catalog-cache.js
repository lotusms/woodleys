import { unstable_cache } from "next/cache";
import { listFirestoreProducts } from "./firestore-products";
import { listAllMockCatalogProducts } from "./mock-catalog";

/** Active catalog products — shared by homepage, shop-all counts, and similar sections. */
export const getActiveProductsList = unstable_cache(
  async () => {
    try {
      return await listFirestoreProducts({ activeOnly: true });
    } catch {
      return [];
    }
  },
  ["catalog-active-products"],
  { revalidate: 60, tags: ["catalog-products"] },
);

/** Product counts keyed by collection handle (one cached scan instead of N queries). */
export const getCollectionProductCounts = unstable_cache(
  async () => {
    const products = await getActiveProductsList();
    /** @type {Record<string, number>} */
    const counts = {};

    if (products.length > 0) {
      for (const product of products) {
        for (const handle of product.collectionHandles || []) {
          counts[handle] = (counts[handle] || 0) + 1;
        }
      }
      return counts;
    }

    for (const mock of listAllMockCatalogProducts()) {
      for (const handle of mock.collectionHandles || []) {
        counts[handle] = (counts[handle] || 0) + 1;
      }
    }

    return counts;
  },
  ["catalog-collection-counts"],
  { revalidate: 60, tags: ["catalog-products"] },
);

/**
 * @param {string} collectionHandle
 * @param {() => Promise<unknown>} loader
 */
export async function getCachedCollectionProducts(collectionHandle, loader) {
  return unstable_cache(loader, ["collection-products", collectionHandle], {
    revalidate: 60,
    tags: ["catalog-products", `collection-${collectionHandle}`],
  })();
}

/**
 * @param {string} handle
 * @param {() => Promise<unknown>} loader
 */
export async function getCachedCatalogProduct(handle, loader) {
  return unstable_cache(loader, ["catalog-product", handle], {
    revalidate: 60,
    tags: ["catalog-products", `product-${handle}`],
  })();
}
