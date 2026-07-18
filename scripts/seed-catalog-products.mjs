/**
 * Seeds Firestore `products` and `catalogCollections` from the storefront catalog.
 *
 *   pnpm seed:products
 *
 * Uses Firebase Admin when FIREBASE_SERVICE_ACCOUNT_JSON / GOOGLE_APPLICATION_CREDENTIALS
 * are set; otherwise uses `firebase login` credentials (same as seed:admin).
 *
 * Safe to re-run — skips existing product documents; merges collection metadata.
 */
import { createRequire } from "node:module";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  listAllCatalogCollectionOptions,
  listAllCatalogProductsForSeed,
} from "./lib/catalog-products-data.mjs";
import {
  isBulovaSampleProductHandle,
  allLegacyBulovaHandles,
} from "../src/lib/catalog/bulova-sample-products.js";
import {
  isRingSampleProductHandle,
  allLegacyRingHandles,
} from "../src/lib/catalog/ring-sample-products.js";

function isCatalogSeedProductHandle(handle) {
  return isBulovaSampleProductHandle(handle) || isRingSampleProductHandle(handle);
}

function allLegacyCatalogHandles() {
  return [...allLegacyBulovaHandles(), ...allLegacyRingHandles()];
}

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
const CATALOG_COLLECTIONS = "catalogCollections";

function firestoreValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "number") return { integerValue: String(Math.trunc(v)) };
  if (typeof v === "boolean") return { booleanValue: v };
  if (Array.isArray(v)) {
    return { arrayValue: { values: v.map(firestoreValue) } };
  }
  if (v && typeof v === "object") {
    const fields = {};
    for (const [k, val] of Object.entries(v)) {
      fields[k] = firestoreValue(val);
    }
    return { mapValue: { fields } };
  }
  throw new Error(`Unsupported value type: ${typeof v}`);
}

function docPath(collection, id) {
  return `projects/${PROJECT_ID}/databases/${DB}/documents/${collection}/${id}`;
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

function initAdminSdk() {
  if (getApps().length) return true;
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    initializeApp({ credential: cert(JSON.parse(json)) });
    return true;
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) {
    initializeApp();
    return true;
  }
  return false;
}

async function restGetDoc(collection, id, token) {
  const url = `https://firestore.googleapis.com/v1/${docPath(collection, id)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore GET failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function restSetDoc(collection, id, data, token, { merge = false } = {}) {
  const fields = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = firestoreValue(v);
  }

  if (merge) {
    const url = `https://firestore.googleapis.com/v1/${docPath(collection, id)}?${Object.keys(data)
      .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
      .join("&")}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Firestore PATCH failed (${res.status}): ${text}`);
    }
    return true;
  }

  const createUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DB}/documents/${collection}?documentId=${encodeURIComponent(id)}`;
  const res = await fetch(createUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (res.status === 409) return false;

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore create failed (${res.status}): ${text}`);
  }

  return true;
}

function buildProductDoc(product, now) {
  const priceUsd = Number(product.priceUsd ?? 0);
  const description = String(product.description ?? "").trim();
  const images = Array.isArray(product.images) && product.images.length
    ? product.images.filter((img) => img?.src)
    : product.image?.src
      ? [product.image]
      : [];
  const image = images[0] ?? (product.image?.src ? product.image : null);

  return {
    handle: product.handle,
    title: String(product.title ?? "").trim(),
    description,
    descriptionHtml: description ? `<p>${description}</p>` : "",
    priceUsd,
    maxPriceUsd: Number(product.maxPriceUsd ?? priceUsd),
    quantity: Math.max(0, Number(product.quantity ?? 0)),
    active: product.active !== false,
    featured: Boolean(product.featured),
    featuredOrder: Number(product.featuredOrder ?? Date.now()),
    audience:
      product.audience === "women" || product.audience === "men" || product.audience === "unisex"
        ? product.audience
        : "unisex",
    collectionHandles: [...new Set(product.collectionHandles)],
    image,
    images,
    specs: Array.isArray(product.specs)
      ? product.specs.filter((s) => s?.label && s?.value)
      : [],
    sku: product.sku ?? null,
    brand: product.brand ?? null,
    model: product.model ?? null,
    condition: product.condition ?? null,
    seoTitle: product.seoTitle ?? null,
    metaDescription: product.metaDescription ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

function buildLegacyBulovaRetirePatch(now) {
  return {
    active: false,
    quantity: 0,
    updatedAt: now,
  };
}

async function seedWithAdminSdk() {
  const db = getFirestore(getApp(), DB);
  const now = new Date().toISOString();

  const collectionOptions = listAllCatalogCollectionOptions();
  let collectionsCreated = 0;
  let collectionsUpdated = 0;

  for (const meta of collectionOptions) {
    const ref = db.collection(CATALOG_COLLECTIONS).doc(meta.shopifyHandle);
    const snap = await ref.get();
    const doc = {
      shopifyHandle: meta.shopifyHandle,
      title: meta.title,
      sectionKey: meta.sectionKey,
      slug: meta.slug ?? null,
      description: meta.description ?? "",
      updatedAt: now,
    };

    if (snap.exists) {
      await ref.set(doc, { merge: true });
      collectionsUpdated += 1;
    } else {
      await ref.set({ ...doc, createdAt: now });
      collectionsCreated += 1;
    }
  }

  const products = listAllCatalogProductsForSeed();
  let productsCreated = 0;
  let productsSkipped = 0;
  let productsUpdated = 0;

  for (const product of products) {
    const ref = db.collection(PRODUCTS).doc(product.handle);
    const snap = await ref.get();
    if (snap.exists) {
      if (isCatalogSeedProductHandle(product.handle)) {
        await ref.set(buildProductDoc(product, now), { merge: true });
        productsUpdated += 1;
      } else {
        productsSkipped += 1;
      }
      continue;
    }
    await ref.set(buildProductDoc(product, now));
    productsCreated += 1;
  }

  let legacyBulovaRetired = 0;
  for (const handle of allLegacyCatalogHandles()) {
    const ref = db.collection(PRODUCTS).doc(handle);
    const snap = await ref.get();
    if (!snap.exists) continue;
    await ref.set(buildLegacyBulovaRetirePatch(now), { merge: true });
    legacyBulovaRetired += 1;
  }

  return {
    collections: {
      created: collectionsCreated,
      updated: collectionsUpdated,
      total: collectionOptions.length,
    },
    products: {
      created: productsCreated,
      skipped: productsSkipped,
      updated: productsUpdated,
      legacyBulovaRetired,
      total: products.length,
    },
  };
}

async function seedWithCliRest() {
  const token = await getCliAccessToken();
  const now = new Date().toISOString();

  const collectionOptions = listAllCatalogCollectionOptions();
  let collectionsCreated = 0;
  let collectionsUpdated = 0;

  for (const meta of collectionOptions) {
    const existing = await restGetDoc(CATALOG_COLLECTIONS, meta.shopifyHandle, token);
    const doc = {
      shopifyHandle: meta.shopifyHandle,
      title: meta.title,
      sectionKey: meta.sectionKey,
      slug: meta.slug ?? null,
      description: meta.description ?? "",
      updatedAt: now,
    };

    if (existing) {
      await restSetDoc(CATALOG_COLLECTIONS, meta.shopifyHandle, doc, token, {
        merge: true,
      });
      collectionsUpdated += 1;
    } else {
      await restSetDoc(
        CATALOG_COLLECTIONS,
        meta.shopifyHandle,
        { ...doc, createdAt: now },
        token,
      );
      collectionsCreated += 1;
    }
  }

  const products = listAllCatalogProductsForSeed();
  let productsCreated = 0;
  let productsSkipped = 0;
  let productsUpdated = 0;

  for (const product of products) {
    const existing = await restGetDoc(PRODUCTS, product.handle, token);
    if (existing) {
      if (isCatalogSeedProductHandle(product.handle)) {
        await restSetDoc(
          PRODUCTS,
          product.handle,
          buildProductDoc(product, now),
          token,
          { merge: true },
        );
        productsUpdated += 1;
      } else {
        productsSkipped += 1;
      }
      continue;
    }

    const ok = await restSetDoc(
      PRODUCTS,
      product.handle,
      buildProductDoc(product, now),
      token,
    );
    if (ok === false) {
      productsSkipped += 1;
    } else {
      productsCreated += 1;
    }
  }

  let legacyBulovaRetired = 0;
  for (const handle of allLegacyCatalogHandles()) {
    const existing = await restGetDoc(PRODUCTS, handle, token);
    if (!existing) continue;
    await restSetDoc(
      PRODUCTS,
      handle,
      buildLegacyBulovaRetirePatch(now),
      token,
      { merge: true },
    );
    legacyBulovaRetired += 1;
  }

  return {
    collections: {
      created: collectionsCreated,
      updated: collectionsUpdated,
      total: collectionOptions.length,
    },
    products: {
      created: productsCreated,
      skipped: productsSkipped,
      updated: productsUpdated,
      legacyBulovaRetired,
      total: products.length,
    },
  };
}

async function main() {
  const useAdmin = initAdminSdk();
  console.log(`Seeding Firestore project ${PROJECT_ID}, database: ${DB}`);
  console.log(`Auth: ${useAdmin ? "Firebase Admin SDK" : "Firebase CLI (firebase login)"}`);
  console.log("");

  const result = useAdmin ? await seedWithAdminSdk() : await seedWithCliRest();

  console.log(
    `catalogCollections: ${result.collections.created} created, ${result.collections.updated} updated (${result.collections.total} total)`,
  );
  console.log(
    `products: ${result.products.created} created, ${result.products.updated} updated, ${result.products.skipped} skipped (${result.products.total} catalog items)`,
  );

  if (result.products.legacyBulovaRetired > 0) {
    console.log(
      `Retired ${result.products.legacyBulovaRetired} legacy Bulova preview product(s).`,
    );
  }

  if (
    result.products.created === 0 &&
    result.products.updated === 0 &&
    result.products.skipped === result.products.total
  ) {
    console.log("\nAll catalog products already exist in Firestore.");
  } else {
    console.log(
      "\nDone. Products are now available on the storefront and admin Products page.",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
