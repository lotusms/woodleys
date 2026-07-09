"use client";

import { getFirebaseAuth } from "@firebase/client";
import {
  createDashboardProduct,
  getDashboardProductByHandle,
  updateDashboardProduct,
} from "@/lib/catalog/firestore-products-browser";

/** @param {unknown} error */
function isAdminServerUnavailable(error) {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("Firebase Admin is not configured") ||
    msg.includes("default credentials") ||
    msg.includes("FIREBASE_SERVICE_ACCOUNT")
  );
}

async function getAdminToken() {
  const auth = getFirebaseAuth();
  await auth.authStateReady();

  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in as an administrator.");
  }

  return user.getIdToken(true);
}

/**
 * @param {string} path
 * @param {RequestInit} [init]
 * @param {{ retry?: boolean }} [options]
 */
async function adminFetch(path, init = {}, options = {}) {
  const token = await getAdminToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res = await fetch(path, { ...init, headers });
  let data = await res.json().catch(() => ({}));

  if (res.status === 401 && options.retry !== false) {
    headers.set("Authorization", `Bearer ${await getAdminToken()}`);
    res = await fetch(path, { ...init, headers });
    data = await res.json().catch(() => ({}));
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export async function refreshStorefrontCatalog() {
  try {
    await Promise.race([
      adminFetch("/api/admin/revalidate-catalog", { method: "POST" }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("revalidate timeout")), 8000);
      }),
    ]);
  } catch {
    // Storefront may lag briefly when Admin credentials are unavailable.
  }
}

export function fetchAdminProducts() {
  return adminFetch("/api/admin/products");
}

/**
 * @param {Record<string, unknown>} payload
 */
export async function createAdminProduct(payload) {
  try {
    const result = await adminFetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    await refreshStorefrontCatalog();
    return result;
  } catch (error) {
    if (!isAdminServerUnavailable(error)) throw error;
    const product = await createDashboardProduct(payload);
    await refreshStorefrontCatalog();
    return { product };
  }
}

/**
 * @param {string} handle
 */
export async function fetchAdminProduct(handle) {
  try {
    return await adminFetch(`/api/admin/products/${encodeURIComponent(handle)}`);
  } catch (error) {
    if (!isAdminServerUnavailable(error)) throw error;
    const product = await getDashboardProductByHandle(handle);
    if (!product) throw new Error("Product not found.");
    return { product };
  }
}

/**
 * @param {string} handle
 * @param {Record<string, unknown>} patch
 */
export async function updateAdminProduct(handle, patch) {
  try {
    const result = await adminFetch(`/api/admin/products/${encodeURIComponent(handle)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    });
    await refreshStorefrontCatalog();
    return result;
  } catch (error) {
    if (!isAdminServerUnavailable(error)) throw error;
    const product = await updateDashboardProduct(handle, patch);
    await refreshStorefrontCatalog();
    return { product };
  }
}

/**
 * @param {string} handle
 */
export async function deleteAdminProduct(handle) {
  try {
    const result = await adminFetch(`/api/admin/products/${encodeURIComponent(handle)}`, {
      method: "DELETE",
    });
    await refreshStorefrontCatalog();
    return result;
  } catch (error) {
    if (!isAdminServerUnavailable(error)) throw error;
    const { deleteDashboardProduct } = await import(
      "@/lib/catalog/firestore-products-browser"
    );
    await deleteDashboardProduct(handle);
    await refreshStorefrontCatalog();
    return { ok: true };
  }
}
