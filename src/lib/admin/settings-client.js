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
 */
async function adminFetch(path, init = {}) {
  const token = await getAdminToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(path, { ...init, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export function fetchAdminSettings() {
  return adminFetch("/api/admin/settings");
}

/**
 * @param {Record<string, unknown>} payload
 */
export function saveAdminSettings(payload) {
  return adminFetch("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * @param {"shopify"} target
 * @param {Record<string, unknown>} payload
 * @param {{ saveOnSuccess?: boolean }} [opts]
 */
export function testAdminIntegration(target, payload, opts = {}) {
  return adminFetch("/api/admin/settings/test", {
    method: "POST",
    body: JSON.stringify({
      target,
      ...payload,
      saveOnSuccess: Boolean(opts.saveOnSuccess),
    }),
  });
}
