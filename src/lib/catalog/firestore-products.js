import {
  getFirebaseAdminDb,
  hasFirebaseAdminCredentials,
  isFirebaseAdminAuthError,
} from "@/lib/firebase-admin-server";
import { HOME_FEATURED_PRODUCT_HANDLES } from "@/config/featured-products";
import { getCatalogCollectionMeta, filterAssignableCollectionHandles } from "./collections-meta";
import { listAllMockCatalogProducts } from "./mock-catalog";
import {
  isFirestoreRestConfigured,
  restGetProductDocument,
  restListProductDocuments,
  restListProductDocumentsByCollection,
} from "./firestore-products-rest-server";
import {
  firestoreDocToProductDetail,
  PRODUCTS_COLLECTION,
  CATALOG_COLLECTIONS_COLLECTION,
  CATALOG_SUPPRESSIONS_COLLECTION,
} from "./product-firestore-map";
import { listSuppressedProductHandles, clearProductSuppression } from "./catalog-suppressions";
import { normalizeProductPricingForSave } from "./product-pricing";

export { PRODUCTS_COLLECTION, CATALOG_COLLECTIONS_COLLECTION } from "./product-firestore-map";
export { slugifyProductHandle } from "./product-handle";

/**
 * @template T
 * @param {() => Promise<T>} adminRead
 * @param {() => Promise<T>} restRead
 */
async function withFirestoreRead(adminRead, restRead) {
  if (hasFirebaseAdminCredentials()) {
    try {
      return await adminRead();
    } catch (error) {
      if (isFirebaseAdminAuthError(error) && isFirestoreRestConfigured()) {
        return restRead();
      }
      throw error;
    }
  }

  if (isFirestoreRestConfigured()) {
    return restRead();
  }

  return [];
}

/**
 * @typedef {{
 *   handle: string;
 *   title: string;
 *   description: string;
 *   descriptionHtml?: string;
 *   priceUsd: number;
 *   maxPriceUsd: number;
 *   salePriceUsd?: number | null;
 *   quantity: number;
 *   active: boolean;
 *   featured: boolean;
 *   featuredOrder?: number;
 *   collectionHandles: string[];
 *   image?: { src: string; alt: string };
 *   images: { src: string; alt: string }[];
 *   specs: { label: string; value: string }[];
 *   createdAt?: string;
 *   updatedAt?: string;
 * }} FirestoreProductDoc
 */

/**
 * @param {FirebaseFirestore.Firestore} db
 * @param {string[]} collectionHandles
 */
export async function ensureCatalogCollectionDocs(db, collectionHandles) {
  const now = new Date().toISOString();
  const unique = [...new Set(collectionHandles.filter(Boolean))];

  await Promise.all(
    unique.map(async (shopifyHandle) => {
      const ref = db.collection(CATALOG_COLLECTIONS_COLLECTION).doc(shopifyHandle);
      const snap = await ref.get();
      const meta = getCatalogCollectionMeta(shopifyHandle);

      if (snap.exists) {
        await ref.set(
          {
            title: meta.title,
            sectionKey: meta.sectionKey,
            slug: meta.slug ?? null,
            description: meta.description ?? "",
            updatedAt: now,
          },
          { merge: true },
        );
        return;
      }

      await ref.set({
        shopifyHandle,
        title: meta.title,
        sectionKey: meta.sectionKey,
        slug: meta.slug ?? null,
        description: meta.description ?? "",
        createdAt: now,
        updatedAt: now,
      });
    }),
  );
}

/**
 * @param {{ activeOnly?: boolean; featuredOnly?: boolean }} [opts]
 */
export async function listFirestoreProducts(opts = {}) {
  const products = await withFirestoreRead(
    async () => {
      const db = getFirebaseAdminDb();
      const snap = await db.collection(PRODUCTS_COLLECTION).get();
      return snap.docs
        .map((doc) =>
          firestoreDocToProductDetail(doc.data(), doc.id, { includeInactive: true }),
        )
        .filter(Boolean);
    },
    async () => {
      const docs = await restListProductDocuments();
      return docs
        .map((doc) =>
          firestoreDocToProductDetail(doc.data, doc.id, { includeInactive: true }),
        )
        .filter(Boolean);
    },
  );

  let filtered = products;
  if (opts.activeOnly) {
    filtered = filtered.filter((p) => p.active);
  }
  if (opts.featuredOnly) {
    filtered = filtered.filter((p) => p.featured && p.active);
  }

  filtered.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.featured && b.featured) {
      return (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0);
    }
    return a.title.localeCompare(b.title);
  });

  return filtered;
}

/** Active featured products — uses a targeted Firestore query when Admin SDK is available. */
export async function listFeaturedFirestoreProducts() {
  const products = await withFirestoreRead(
    async () => {
      const db = getFirebaseAdminDb();
      const snap = await db
        .collection(PRODUCTS_COLLECTION)
        .where("featured", "==", true)
        .get();

      return snap.docs
        .map((doc) =>
          firestoreDocToProductDetail(doc.data(), doc.id, { includeInactive: true }),
        )
        .filter(Boolean);
    },
    async () => {
      const docs = await restListProductDocuments();
      return docs
        .map((doc) =>
          firestoreDocToProductDetail(doc.data, doc.id, { includeInactive: true }),
        )
        .filter((product) => product && product.featured && product.active);
    },
  );

  return products
    .filter((product) => product.active)
    .sort((a, b) => (b.featuredOrder ?? 0) - (a.featuredOrder ?? 0));
}

/**
 * Most recently created active products — targeted query when Admin SDK is available.
 * @param {number} [limit]
 */
export async function listRecentFirestoreProducts(limit = 10) {
  const fetchLimit = Math.max(limit * 3, 30);

  const products = await withFirestoreRead(
    async () => {
      const db = getFirebaseAdminDb();
      try {
        const snap = await db
          .collection(PRODUCTS_COLLECTION)
          .orderBy("createdAt", "desc")
          .limit(fetchLimit)
          .get();

        return snap.docs
          .map((doc) =>
            firestoreDocToProductDetail(doc.data(), doc.id, { includeInactive: true }),
          )
          .filter(Boolean);
      } catch {
        const snap = await db.collection(PRODUCTS_COLLECTION).get();
        return snap.docs
          .map((doc) =>
            firestoreDocToProductDetail(doc.data(), doc.id, { includeInactive: true }),
          )
          .filter(Boolean)
          .sort((a, b) => {
            const aTime = Date.parse(String(a.createdAt ?? 0));
            const bTime = Date.parse(String(b.createdAt ?? 0));
            return bTime - aTime;
          })
          .slice(0, fetchLimit);
      }
    },
    async () => {
      const docs = await restListProductDocuments();
      return docs
        .map((doc) =>
          firestoreDocToProductDetail(doc.data, doc.id, { includeInactive: true }),
        )
        .filter(Boolean)
        .sort((a, b) => {
          const aTime = Date.parse(String(a.createdAt ?? 0));
          const bTime = Date.parse(String(b.createdAt ?? 0));
          return bTime - aTime;
        })
        .slice(0, fetchLimit);
    },
  );

  return products.filter((product) => product.active).slice(0, limit);
}

/**
 * @param {string} collectionHandle
 */
export async function listFirestoreProductsByCollection(collectionHandle) {
  if (!collectionHandle) return [];

  return withFirestoreRead(
    async () => {
      const db = getFirebaseAdminDb();
      const snap = await db
        .collection(PRODUCTS_COLLECTION)
        .where("collectionHandles", "array-contains", collectionHandle)
        .get();

      return snap.docs
        .map((doc) => firestoreDocToProductDetail(doc.data(), doc.id))
        .filter(Boolean);
    },
    async () => {
      const docs = await restListProductDocumentsByCollection(collectionHandle);
      return docs
        .map((doc) => firestoreDocToProductDetail(doc.data, doc.id))
        .filter(Boolean);
    },
  );
}

/**
 * @param {string} handle
 * @param {{ includeInactive?: boolean }} [opts]
 */
export async function getFirestoreProductByHandle(handle, opts = {}) {
  if (!handle) return null;

  return withFirestoreRead(
    async () => {
      const db = getFirebaseAdminDb();
      const snap = await db.collection(PRODUCTS_COLLECTION).doc(handle).get();
      if (!snap.exists) return null;
      return firestoreDocToProductDetail(snap.data(), snap.id, opts);
    },
    async () => {
      const doc = await restGetProductDocument(handle);
      if (!doc) return null;
      return firestoreDocToProductDetail(doc.data, doc.id, opts);
    },
  );
}

/**
 * @param {Partial<FirestoreProductDoc> & { title: string; handle?: string }} input
 */
export async function createFirestoreProduct(input) {
  const db = getFirebaseAdminDb();
  const handle =
    input.handle?.trim() || slugifyProductHandle(input.title);

  if (!handle) {
    throw new Error("A valid product handle is required.");
  }

  const existing = await db.collection(PRODUCTS_COLLECTION).doc(handle).get();
  const suppressed = await listSuppressedProductHandles();

  if (existing.exists() && !suppressed.has(handle)) {
    throw new Error(`A product with handle "${handle}" already exists.`);
  }

  if (existing.exists() && suppressed.has(handle)) {
    await clearProductSuppression(handle);
  }

  const now = new Date().toISOString();
  const collectionHandles = filterAssignableCollectionHandles(
    Array.isArray(input.collectionHandles) ? input.collectionHandles : [],
  );

  await ensureCatalogCollectionDocs(db, collectionHandles);

  const priceUsd = Number(input.priceUsd ?? 0);
  const pricing = normalizeProductPricingForSave(
    priceUsd,
    input.salePriceUsd ?? (input.maxPriceUsd != null ? input.maxPriceUsd : null),
  );
  const quantity = Math.max(0, Number(input.quantity ?? 0));

  /** @type {FirestoreProductDoc} */
  const doc = {
    handle,
    title: String(input.title ?? "").trim(),
    description: String(input.description ?? "").trim(),
    descriptionHtml:
      typeof input.descriptionHtml === "string"
        ? input.descriptionHtml
        : input.description
          ? `<p>${String(input.description).trim()}</p>`
          : "",
    priceUsd: pricing.priceUsd,
    salePriceUsd: pricing.salePriceUsd,
    maxPriceUsd: pricing.maxPriceUsd,
    quantity,
    active: input.active !== false,
    featured: Boolean(input.featured),
    featuredOrder: Number(input.featuredOrder ?? Date.now()),
    collectionHandles,
    image: input.image?.src ? input.image : undefined,
    images: Array.isArray(input.images)
      ? input.images.filter((img) => img?.src)
      : [],
    specs: Array.isArray(input.specs)
      ? input.specs.filter((s) => s?.label && s?.value)
      : [],
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(PRODUCTS_COLLECTION).doc(handle).set(doc);
  return getFirestoreProductByHandle(handle, { includeInactive: true });
}

/**
 * @param {string} handle
 * @param {Partial<FirestoreProductDoc>} patch
 */
export async function updateFirestoreProduct(handle, patch) {
  const db = getFirebaseAdminDb();
  const ref = db.collection(PRODUCTS_COLLECTION).doc(handle);
  const snap = await ref.get();
  if (!snap.exists) {
    throw new Error("Product not found.");
  }

  const collectionHandles = patch.collectionHandles
    ? filterAssignableCollectionHandles(patch.collectionHandles)
    : undefined;

  if (collectionHandles) {
    await ensureCatalogCollectionDocs(db, collectionHandles);
  }

  const now = new Date().toISOString();
  const updates = { updatedAt: now };

  if (patch.title !== undefined) updates.title = String(patch.title).trim();
  if (patch.description !== undefined) {
    updates.description = String(patch.description).trim();
  }
  if (patch.descriptionHtml !== undefined) {
    updates.descriptionHtml = patch.descriptionHtml;
  } else if (patch.description !== undefined) {
    updates.descriptionHtml = patch.description
      ? `<p>${String(patch.description).trim()}</p>`
      : "";
  }
  if (patch.priceUsd !== undefined) updates.priceUsd = Number(patch.priceUsd);
  if (patch.salePriceUsd !== undefined) {
    updates.salePriceUsd =
      patch.salePriceUsd == null || patch.salePriceUsd === ""
        ? null
        : Number(patch.salePriceUsd);
  }
  if (patch.maxPriceUsd !== undefined) {
    updates.maxPriceUsd = Number(patch.maxPriceUsd);
  }
  if (patch.quantity !== undefined) {
    updates.quantity = Math.max(0, Number(patch.quantity));
  }
  if (patch.active !== undefined) updates.active = Boolean(patch.active);
  if (patch.featured !== undefined) {
    updates.featured = Boolean(patch.featured);
    if (
      updates.featured &&
      patch.featuredOrder === undefined &&
      !snap.data()?.featured
    ) {
      updates.featuredOrder = Date.now();
    }
  }
  if (patch.featuredOrder !== undefined) {
    updates.featuredOrder = Number(patch.featuredOrder);
  }
  if (collectionHandles !== undefined) {
    updates.collectionHandles = collectionHandles;
  }
  if (patch.image !== undefined) updates.image = patch.image?.src ? patch.image : null;
  if (patch.images !== undefined) {
    updates.images = patch.images.filter((img) => img?.src);
  }
  if (patch.specs !== undefined) {
    updates.specs = patch.specs.filter((s) => s?.label && s?.value);
  }

  await ref.set(updates, { merge: true });
  return getFirestoreProductByHandle(handle, { includeInactive: true });
}

/**
 * @param {string} handle
 */
export async function deleteFirestoreProduct(handle) {
  if (!handle) return;

  const db = getFirebaseAdminDb();
  const productRef = db.collection(PRODUCTS_COLLECTION).doc(handle);
  const snap = await productRef.get();

  if (snap.exists) {
    await productRef.delete();
  }

  await db.collection(CATALOG_SUPPRESSIONS_COLLECTION).doc(handle).set({
    handle,
    suppressedAt: new Date().toISOString(),
  });
}

/**
 * Imports preview catalog products into Firestore when missing so the admin
 * inventory matches what shoppers see on collection pages.
 *
 * @returns {Promise<{ created: number; skipped: number; total: number }>}
 */
export async function syncCatalogProductsFromMock() {
  const db = getFirebaseAdminDb();
  const mockProducts = listAllMockCatalogProducts();
  const featuredSet = new Set(HOME_FEATURED_PRODUCT_HANDLES);
  const suppressed = await listSuppressedProductHandles();
  let created = 0;
  let skipped = 0;

  for (const mock of mockProducts) {
    if (suppressed.has(mock.handle)) {
      skipped += 1;
      continue;
    }

    const ref = db.collection(PRODUCTS_COLLECTION).doc(mock.handle);
    const snap = await ref.get();
    if (snap.exists) {
      skipped += 1;
      continue;
    }

    await createFirestoreProduct({
      handle: mock.handle,
      title: mock.title,
      description: mock.description,
      priceUsd: mock.priceUsd,
      maxPriceUsd: mock.maxPriceUsd,
      quantity: mock.quantity,
      active: mock.active,
      featured: featuredSet.has(mock.handle),
      featuredOrder: featuredSet.has(mock.handle)
        ? HOME_FEATURED_PRODUCT_HANDLES.indexOf(mock.handle)
        : undefined,
      collectionHandles: mock.collectionHandles,
      image: mock.image,
      images:
        Array.isArray(mock.images) && mock.images.length
          ? mock.images
          : mock.image
            ? [mock.image]
            : [],
      specs: [],
    });
    created += 1;
  }

  return { created, skipped, total: mockProducts.length };
}
