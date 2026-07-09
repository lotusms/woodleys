import {
  getFirebaseAdminDb,
  hasFirebaseAdminCredentials,
  isFirebaseAdminAuthError,
} from "@/lib/firebase-admin-server";
import {
  isFirestoreRestConfigured,
  restListCollectionDocumentIds,
} from "./firestore-products-rest-server";
import { CATALOG_SUPPRESSIONS_COLLECTION } from "./product-firestore-map";

export { CATALOG_SUPPRESSIONS_COLLECTION } from "./product-firestore-map";

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

  return new Set();
}

/** @param {unknown} handles */
export function toSuppressedHandleSet(handles) {
  if (handles instanceof Set) return handles;
  if (Array.isArray(handles)) return new Set(handles.filter(Boolean));
  return new Set();
}

/**
 * Records a permanently deleted handle so seed/mock fallbacks stay hidden.
 * Internal only — not shown in the dashboard as a product status.
 *
 * @param {string} handle
 */
export async function suppressProductHandle(handle) {
  if (!handle) return;

  const db = getFirebaseAdminDb();
  const now = new Date().toISOString();
  await db.collection(CATALOG_SUPPRESSIONS_COLLECTION).doc(handle).set({
    handle,
    suppressedAt: now,
  });
}

/** @param {string} handle */
export async function clearProductSuppression(handle) {
  if (!handle) return;

  const db = getFirebaseAdminDb();
  await db.collection(CATALOG_SUPPRESSIONS_COLLECTION).doc(handle).delete();
}

/** @returns {Promise<Set<string>>} */
export async function listSuppressedProductHandles() {
  return withFirestoreRead(
    async () => {
      const db = getFirebaseAdminDb();
      const snap = await db.collection(CATALOG_SUPPRESSIONS_COLLECTION).get();
      return new Set(snap.docs.map((doc) => doc.id));
    },
    async () => {
      const ids = await restListCollectionDocumentIds(CATALOG_SUPPRESSIONS_COLLECTION);
      return new Set(ids);
    },
  );
}

/**
 * @param {import("./product-types").CatalogProduct[]} products
 * @param {Set<string>} suppressed
 */
export function filterSuppressedCatalogProducts(products, suppressed) {
  const suppressedSet = toSuppressedHandleSet(suppressed);
  if (!suppressedSet.size) return products;
  return products.filter((product) => !suppressedSet.has(product.handle));
}
