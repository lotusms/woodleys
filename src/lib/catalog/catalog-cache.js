import { unstable_cache } from "next/cache";
import { cache } from "react";
import { listFirestoreProducts, listFeaturedFirestoreProducts, listRecentFirestoreProducts } from "./firestore-products";
import {
  listSuppressedProductHandles,
} from "./catalog-suppressions";
import { mergeCollectionStorefrontProducts, splitCollectionInventory } from "./collection-storefront";
import { listAllCatalogCollectionOptions } from "./collections-meta";
import {
  getMockProductByHandle,
  getMockProductsByCollectionHandle,
  isMockPreviewHandle,
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
function mergeActiveSeedProducts(products, suppressed = new Set(), inactiveHandles = new Set()) {
  /** @type {import("./product-types").CatalogProduct[]} */
  const merged = [];
  const handles = new Set();

  for (const product of products) {
    if (shouldHideFromStorefront(product.handle)) continue;
    if (suppressed.has(product.handle)) continue;

    if (
      isRingSampleProductHandle(product.handle) ||
      isBulovaSampleProductHandle(product.handle)
    ) {
      const mock = getMockProductByHandle(product.handle);
      if (mock) {
        merged.push({
          ...withSeedCollectionHandles(mock),
          active: true,
          featured: Boolean(product.featured),
          featuredOrder: product.featuredOrder,
        });
        handles.add(mock.handle);
        continue;
      }
    }

    merged.push(product);
    handles.add(product.handle);
  }

  for (const collectionHandle of ["fine-rings", "bulova"]) {
    for (const mock of getMockProductsByCollectionHandle(collectionHandle)) {
      if (
        handles.has(mock.handle) ||
        suppressed.has(mock.handle) ||
        inactiveHandles.has(mock.handle)
      ) {
        continue;
      }
      merged.push({ ...withSeedCollectionHandles(mock), active: true });
      handles.add(mock.handle);
    }
  }

  return merged;
}

const FIRESTORE_TIMEOUT_MS = 10000;

const loadFirestoreInventory = cache(async () => {
  try {
    const products = await Promise.race([
      listFirestoreProducts(),
      new Promise((resolve) => {
        setTimeout(() => resolve(null), FIRESTORE_TIMEOUT_MS);
      }),
    ]);

    return products ?? [];
  } catch {
    return [];
  }
});

const loadActiveProducts = cache(async () => {
  try {
    const [products, suppressed] = await Promise.all([
      loadFirestoreInventory(),
      listSuppressedProductHandles(),
    ]);

    const activeProducts = products.filter((product) => product.active);
    const inactiveHandles = new Set(
      products.filter((product) => !product.active).map((product) => product.handle),
    );

    if (activeProducts.length === 0) {
      return mergeActiveSeedProducts([], suppressed, inactiveHandles);
    }

    return mergeActiveSeedProducts(
      activeProducts.filter((product) => !suppressed.has(product.handle)),
      suppressed,
      inactiveHandles,
    );
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

const loadAllCatalogInventory = cache(async () => loadFirestoreInventory());

/** Full Firestore inventory (active + inactive) for collection merge and admin overrides. */
export const getAllCatalogInventory = unstable_cache(
  async () => loadAllCatalogInventory(),
  ["catalog-all-inventory"],
  { revalidate: 60, tags: ["catalog-products"] },
);

const loadFeaturedFirestoreProducts = cache(async () => {
  try {
    const [products, suppressed] = await Promise.all([
      listFeaturedFirestoreProducts(),
      listSuppressedProductHandles(),
    ]);
    return products.filter((product) => !suppressed.has(product.handle));
  } catch {
    return [];
  }
});

/** Featured active products for the homepage showroom slider. */
export const getFeaturedFirestoreProducts = unstable_cache(
  async () => loadFeaturedFirestoreProducts(),
  ["catalog-featured-firestore"],
  { revalidate: 60, tags: ["catalog-products"] },
);

const loadRecentFirestoreProducts = cache(async (limit = 10) => {
  try {
    const [products, suppressed] = await Promise.all([
      listRecentFirestoreProducts(limit),
      listSuppressedProductHandles(),
    ]);
    return products.filter((product) => !suppressed.has(product.handle));
  } catch {
    return [];
  }
});

/** Recently created active products for the homepage new-arrivals slider. */
export const getRecentFirestoreProducts = unstable_cache(
  async (limit = 10) => loadRecentFirestoreProducts(limit),
  ["catalog-recent-firestore"],
  { revalidate: 60, tags: ["catalog-products"] },
);

export const getSuppressedProductHandles = unstable_cache(
  async () => listSuppressedProductHandles(),
  ["catalog-suppressed-handles"],
  { revalidate: 60, tags: ["catalog-products"] },
);

/** Product counts keyed by collection handle (one cached scan instead of N queries). */
export const getCollectionProductCounts = unstable_cache(
  async () => {
    const [inventory, suppressed] = await Promise.all([
      getAllCatalogInventory(),
      getSuppressedProductHandles(),
    ]);
    /** @type {Record<string, number>} */
    const counts = {};

    for (const { shopifyHandle } of listAllCatalogCollectionOptions()) {
      const { activeInCollection, inactiveHandlesInCollection } =
        splitCollectionInventory(inventory, shopifyHandle, suppressed);
      counts[shopifyHandle] = mergeCollectionStorefrontProducts(
        shopifyHandle,
        activeInCollection,
        suppressed,
        inactiveHandlesInCollection,
      ).length;
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
