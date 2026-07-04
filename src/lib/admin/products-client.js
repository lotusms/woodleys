"use client";

import { getFirebaseAuth } from "@firebase/client";

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

export function fetchAdminProducts() {
  return adminFetch("/api/admin/products");
}

/**
 * @param {Record<string, unknown>} payload
 */
export function createAdminProduct(payload) {
  return adminFetch("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * @param {string} handle
 */
export function fetchAdminProduct(handle) {
  return adminFetch(`/api/admin/products/${encodeURIComponent(handle)}`);
}

/**
 * @param {string} handle
 * @param {Record<string, unknown>} patch
 */
export function updateAdminProduct(handle, patch) {
  return adminFetch(`/api/admin/products/${encodeURIComponent(handle)}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/**
 * @param {string} handle
 */
export function deleteAdminProduct(handle) {
  return adminFetch(`/api/admin/products/${encodeURIComponent(handle)}`, {
    method: "DELETE",
  });
}
