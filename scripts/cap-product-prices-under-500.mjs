/**
 * Caps all Firestore product prices under $500 for checkout testing.
 *
 *   node --env-file=.env.local scripts/cap-product-prices-under-500.mjs
 */
import { createRequire } from "node:module";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const require = createRequire(import.meta.url);
const firebaseAuth = require("firebase-tools/lib/auth");
const scopes = require("firebase-tools/lib/scopes");

const PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "woodleys-3c319";
const DB =
  process.env.FIRESTORE_DATABASE_ID?.trim() ||
  process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID?.trim() ||
  "main";
const PRODUCTS = "products";
const MAX_TEST_PRICE = 499;

/**
 * Bring a price under $500 while keeping relative magnitude when possible.
 * @param {unknown} value
 * @returns {number | null}
 */
function toUnder500(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n < 500) return Math.round(n * 100) / 100;
  let next = n;
  while (next >= 500) next /= 10;
  return Math.min(MAX_TEST_PRICE, Math.max(49, Math.round(next * 100) / 100));
}

function initAdminSdk() {
  if (getApps().length) return true;
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    initializeApp({ credential: cert(JSON.parse(json)), projectId: PROJECT_ID });
    return true;
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) {
    initializeApp({ projectId: PROJECT_ID });
    return true;
  }
  return false;
}

async function getCliAccessToken() {
  const account = firebaseAuth.getGlobalDefaultAccount();
  if (!account?.tokens?.refresh_token) {
    throw new Error("Not logged in. Run: firebase login");
  }
  const token = await firebaseAuth.getAccessToken(account.tokens.refresh_token, [
    scopes.CLOUD_PLATFORM,
    scopes.FIREBASE_PLATFORM,
  ]);
  return typeof token === "string" ? token : token?.access_token;
}

function firestoreNumber(v) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (v && typeof v === "object") {
    if ("integerValue" in v) return Number(v.integerValue);
    if ("doubleValue" in v) return Number(v.doubleValue);
  }
  return NaN;
}

function restFieldsToPatch(fields) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(fields)) {
    if (typeof v === "number" && Number.isInteger(v)) {
      out[k] = { integerValue: String(v) };
    } else if (typeof v === "number") {
      out[k] = { doubleValue: v };
    } else if (typeof v === "string") {
      out[k] = { stringValue: v };
    }
  }
  return out;
}

/**
 * @param {Record<string, unknown>} data
 */
function buildPricePatch(data) {
  const priceUsd = toUnder500(data.priceUsd);
  if (priceUsd == null) return null;

  const maxRaw = data.maxPriceUsd != null ? toUnder500(data.maxPriceUsd) : priceUsd;
  const maxPriceUsd =
    maxRaw == null ? priceUsd : Math.max(priceUsd, maxRaw);

  /** @type {Record<string, unknown>} */
  const patch = {
    priceUsd,
    maxPriceUsd,
    updatedAt: new Date().toISOString(),
  };

  if (data.salePriceUsd != null && data.salePriceUsd !== "") {
    const sale = toUnder500(data.salePriceUsd);
    if (sale != null) patch.salePriceUsd = Math.min(sale, priceUsd);
  }

  const currentPrice = Number(data.priceUsd);
  const currentMax = Number(data.maxPriceUsd ?? data.priceUsd);
  const currentSale =
    data.salePriceUsd != null && data.salePriceUsd !== ""
      ? Number(data.salePriceUsd)
      : null;

  const unchanged =
    currentPrice === priceUsd &&
    currentMax === maxPriceUsd &&
    (currentSale == null || currentSale === patch.salePriceUsd);

  if (unchanged) return null;
  return patch;
}

async function updateWithAdmin() {
  const db = getFirestore(undefined, DB);
  const snap = await db.collection(PRODUCTS).get();
  let updated = 0;
  let skipped = 0;

  let batch = db.batch();
  let ops = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const patch = buildPricePatch(data);
    if (!patch) {
      skipped += 1;
      continue;
    }
    batch.update(doc.ref, patch);
    ops += 1;
    updated += 1;
    if (ops >= 400) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }
  if (ops > 0) await batch.commit();
  return { total: snap.size, updated, skipped };
}

async function updateWithRest() {
  const token = await getCliAccessToken();
  const listUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DB}/documents/${PRODUCTS}?pageSize=300`;
  /** @type {Array<{ name: string; fields: Record<string, unknown> }>} */
  const docs = [];
  let pageToken = "";

  do {
    const url = pageToken
      ? `${listUrl}&pageToken=${encodeURIComponent(pageToken)}`
      : listUrl;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error(`List failed (${res.status}): ${await res.text()}`);
    }
    const payload = await res.json();
    for (const doc of payload.documents || []) docs.push(doc);
    pageToken = payload.nextPageToken || "";
  } while (pageToken);

  let updated = 0;
  let skipped = 0;

  for (const doc of docs) {
    const fields = doc.fields || {};
    const data = {
      priceUsd: firestoreNumber(fields.priceUsd),
      maxPriceUsd: firestoreNumber(fields.maxPriceUsd),
      salePriceUsd: fields.salePriceUsd
        ? firestoreNumber(fields.salePriceUsd)
        : null,
    };
    const patch = buildPricePatch(data);
    if (!patch) {
      skipped += 1;
      continue;
    }

    const mask = Object.keys(patch)
      .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
      .join("&");
    const res = await fetch(
      `https://firestore.googleapis.com/v1/${doc.name}?${mask}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: restFieldsToPatch(patch) }),
      },
    );
    if (!res.ok) {
      throw new Error(`PATCH failed (${res.status}): ${await res.text()}`);
    }
    updated += 1;
  }

  return { total: docs.length, updated, skipped };
}

async function main() {
  console.log(`Capping product prices under $${MAX_TEST_PRICE + 0.01}…`);
  console.log(`Project: ${PROJECT_ID}  database: ${DB}`);

  let result;
  if (initAdminSdk()) {
    console.log("Using Firebase Admin SDK");
    result = await updateWithAdmin();
  } else {
    console.log("Using Firebase CLI credentials (REST)");
    result = await updateWithRest();
  }

  console.log(
    `Done. ${result.updated} updated, ${result.skipped} already under $500, ${result.total} total.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
