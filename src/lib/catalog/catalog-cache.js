import { unstable_cache } from "next/cache";
import { cache } from "react";
import { listFirestoreProducts } from "./firestore-products";
import {
  getMockProductByHandle,
  getMockProductsByCollectionHandle,
  isMockPreviewHandle,
  listAllMockCatalogProducts,
} from "./mock-catalog";
import { isBulovaSampleProductHandle } from "./bulova-sample-products.js";
import { RING_SAMPLE_COLLECTION_HANDLES } from "./ring-sample-products.js";

/** @param {import("./product-types").CatalogProduct} mock */
function withSeedCollectionHandles(mock) {
  if (isRingSampleProductHandle(mock.handle)) {
    return { ...mock, collectionHandles: [...RING_SAMPLE_COLLECTION_HANDLES] };
  }
  if (isBulovaSampleProductHandle(mock.handle)) {
    return { ...mock, collectionHandles: ["bulova"] };
  }
  return mock;
}
import {
  isLegacyRingPreviewHandle,
  isRingSampleProductHandle,
} from "./ring-sample-products.js";

/** @param {string} handle */
function shouldHideFromStorefront(handle) {
  return isMockPreviewHandle(handle) || isLegacyRingPreviewHandle(handle);
}

/** @param {import("./product-types").CatalogProduct[]} products */
function mergeActiveSeedProducts(products) {
  /** @type {import("./product-types").CatalogProduct[]} */
  const merged = [];
  const handles = new Set();

  for (const product of products) {
    if (shouldHideFromStorefront(product.handle)) continue;

    if (
      isRingSampleProductHandle(product.handle) ||
      isBulovaSampleProductHandle(product.handle)
    ) {
      const mock = getMockProductByHandle(product.handle);
      if (mock) {
        merged.push({ ...withSeedCollectionHandles(mock), active: true });
        handles.add(mock.handle);
        continue;
      }
    }

    merged.push(product);
    handles.add(product.handle);
  }

  for (const collectionHandle of ["fine-rings", "bulova"]) {
    for (const mock of getMockProductsByCollectionHandle(collectionHandle)) {
      if (handles.has(mock.handle)) continue;
      merged.push({ ...withSeedCollectionHandles(mock), active: true });
      handles.add(mock.handle);
    }
  }

  return merged;
}

const loadActiveProducts = cache(async () => {
  try {
    const products = await listFirestoreProducts({ activeOnly: true });
    if (products.length === 0) return [];
    return mergeActiveSeedProducts(products);
  } catch {
    return [];
  }
});

/** Active catalog products — shared by homepage, shop-all counts, and similar sections. */
export const getActiveProductsList = unstable_cache(
  async () => loadActiveProducts(),
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
