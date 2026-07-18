"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@firebase/client";
import { slugifyProductHandle } from "./product-handle";
import { normalizeProductPricingForSave } from "./product-pricing";
import { filterAssignableCollectionHandles } from "./collections-meta";
import { parseMainProductImageInput } from "@/lib/admin/product-image-input";
import {
  firestoreDocToProductDetail,
  PRODUCTS_COLLECTION,
  CATALOG_SUPPRESSIONS_COLLECTION,
} from "./product-firestore-map";

/**
 * @param {import("./product-firestore-map").ReturnType<typeof firestoreDocToProductDetail>[]} products
 */
function sortDashboardProducts(products) {
  return [...products].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.featured && b.featured) {
      return (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0);
    }
    return a.title.localeCompare(b.title);
  });
}

export async function listDashboardProducts() {
  const db = getFirebaseDb();
  const [productSnap, suppressionSnap] = await Promise.all([
    getDocs(collection(db, PRODUCTS_COLLECTION)),
    getDocs(collection(db, CATALOG_SUPPRESSIONS_COLLECTION)),
  ]);

  const suppressed = new Set(suppressionSnap.docs.map((docSnap) => docSnap.id));

  const products = productSnap.docs
    .map((d) => firestoreDocToProductDetail(d.data(), d.id, { includeInactive: true }))
    .filter(Boolean);

  // Orphan cleanup: suppression tombstones only apply after permanent delete.
  // If the product document still exists, clear the stale tombstone.
  const staleSuppressions = products
    .map((product) => product.handle)
    .filter((handle) => suppressed.has(handle));

  if (staleSuppressions.length > 0) {
    await Promise.all(
      staleSuppressions.map((handle) =>
        deleteDoc(doc(db, CATALOG_SUPPRESSIONS_COLLECTION, handle)),
      ),
    );
  }

  return sortDashboardProducts(products);
}

/**
 * @param {string} handle
 */
export async function getDashboardProductByHandle(handle) {
  if (!handle) return null;

  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, PRODUCTS_COLLECTION, handle));
  if (!snap.exists()) return null;

  return firestoreDocToProductDetail(snap.data(), snap.id, { includeInactive: true });
}

/**
 * @param {string} handle
 * @param {Record<string, unknown>} patch
 */
export async function updateDashboardProduct(handle, patch) {
  const db = getFirebaseDb();
  const ref = doc(db, PRODUCTS_COLLECTION, handle);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error("Product not found.");
  }

  const now = new Date().toISOString();
  /** @type {Record<string, unknown>} */
  const updates = { updatedAt: now };

  if (patch.title !== undefined) updates.title = String(patch.title).trim();
  if (patch.description !== undefined) {
    updates.description = String(patch.description).trim();
  }
  if (patch.descriptionHtml !== undefined) {
    updates.descriptionHtml = patch.descriptionHtml;
  } else if (patch.description !== undefined) {
    updates.description = String(patch.description).trim();
    updates.descriptionHtml = updates.description
      ? `<p>${updates.description}</p>`
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
  if (patch.audience !== undefined) {
    updates.audience =
      patch.audience === "women" || patch.audience === "men" || patch.audience === "unisex"
        ? patch.audience
        : "unisex";
  }
  if (patch.collectionHandles !== undefined) {
    updates.collectionHandles = filterAssignableCollectionHandles(patch.collectionHandles);
  }
  if (patch.image !== undefined) {
    updates.image = patch.image?.src ? patch.image : null;
  }
  if (patch.images !== undefined) {
    updates.images = patch.images.filter((img) => img?.src);
  }
  if (patch.specs !== undefined) {
    updates.specs = patch.specs.filter((s) => s?.label && s?.value);
  }

  await setDoc(ref, updates, { merge: true });

  const updated = await getDoc(ref);
  return firestoreDocToProductDetail(updated.data(), updated.id, { includeInactive: true });
}

/**
 * @param {Record<string, unknown>} input
 */
export async function createDashboardProduct(input) {
  const db = getFirebaseDb();
  const handle =
    typeof input.handle === "string" && input.handle.trim()
      ? input.handle.trim()
      : slugifyProductHandle(String(input.title ?? ""));

  if (!handle) {
    throw new Error("A valid product handle is required.");
  }

  const ref = doc(db, PRODUCTS_COLLECTION, handle);
  const existing = await getDoc(ref);
  const suppressionRef = doc(db, CATALOG_SUPPRESSIONS_COLLECTION, handle);
  const suppressionSnap = await getDoc(suppressionRef);
  const isSuppressed = suppressionSnap.exists();

  if (existing.exists() && !isSuppressed) {
    throw new Error(`A product with handle "${handle}" already exists.`);
  }

  if (existing.exists() && isSuppressed) {
    await deleteDoc(suppressionRef);
  }

  const now = new Date().toISOString();
  const pricing = normalizeProductPricingForSave(input.priceUsd, input.salePriceUsd);
  const description = String(input.description ?? "").trim();
  const collectionHandles = filterAssignableCollectionHandles(
    Array.isArray(input.collectionHandles) ? input.collectionHandles : [],
  );
  const image = parseMainProductImageInput(input);
  if (!image?.src) {
    throw new Error("A main product image is required.");
  }

  const docData = {
    handle,
    title: String(input.title ?? "").trim(),
    description,
    descriptionHtml: description ? `<p>${description}</p>` : "",
    priceUsd: pricing.priceUsd,
    salePriceUsd: pricing.salePriceUsd,
    maxPriceUsd: pricing.maxPriceUsd,
    quantity: Math.max(0, Number(input.quantity ?? 0)),
    active: input.active !== false,
    featured: Boolean(input.featured),
    featuredOrder: Number(input.featuredOrder ?? Date.now()),
    audience:
      input.audience === "women" || input.audience === "men" || input.audience === "unisex"
        ? input.audience
        : "unisex",
    collectionHandles,
    image,
    images: Array.isArray(input.images) ? input.images.filter((img) => img?.src) : [],
    specs: Array.isArray(input.specs)
      ? input.specs.filter((s) => s?.label && s?.value)
      : [],
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(ref, docData);

  return firestoreDocToProductDetail(docData, handle, { includeInactive: true });
}

/**
 * Permanently deletes a product document from Firestore.
 * @param {string} handle
 */
export async function deleteDashboardProduct(handle) {
  if (!handle) {
    throw new Error("A product handle is required.");
  }

  const db = getFirebaseDb();
  const ref = doc(db, PRODUCTS_COLLECTION, handle);
  const snap = await getDoc(ref);
  const now = new Date().toISOString();

  if (snap.exists()) {
    await deleteDoc(ref);
  }

  await setDoc(doc(db, CATALOG_SUPPRESSIONS_COLLECTION, handle), {
    handle,
    suppressedAt: now,
  });
}
