import { FIRESTORE_DATABASE_ID } from "@firebase/config";
import { PRODUCTS_COLLECTION } from "./product-firestore-map";

function projectId() {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || "";
}

function apiKey() {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || "";
}

function restConfigured() {
  return Boolean(projectId() && apiKey());
}

function baseUrl() {
  return `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/${FIRESTORE_DATABASE_ID}/documents`;
}

/**
 * @param {Record<string, unknown>} value
 * @returns {unknown}
 */
function parseFirestoreValue(value) {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) {
    const values = /** @type {{ values?: Record<string, unknown>[] }} */ (value.arrayValue).values;
    return (values ?? []).map((item) => parseFirestoreValue(item));
  }
  if ("mapValue" in value) {
    const fields = /** @type {{ fields?: Record<string, Record<string, unknown>> }} */ (
      value.mapValue
    ).fields;
    /** @type {Record<string, unknown>} */
    const obj = {};
    for (const [key, fieldValue] of Object.entries(fields ?? {})) {
      obj[key] = parseFirestoreValue(fieldValue);
    }
    return obj;
  }
  return null;
}

/**
 * @param {{ name?: string; fields?: Record<string, Record<string, unknown>> }} doc
 */
function parseFirestoreDocument(doc) {
  const id = doc.name?.split("/").pop() ?? "";
  /** @type {Record<string, unknown>} */
  const data = {};
  for (const [key, fieldValue] of Object.entries(doc.fields ?? {})) {
    data[key] = parseFirestoreValue(fieldValue);
  }
  return { id, data };
}

/**
 * @param {string} path
 */
async function restGet(path) {
  if (!restConfigured()) {
    throw new Error("Firestore REST is not configured (missing Firebase web env).");
  }

  const url = `${baseUrl()}/${path}?key=${encodeURIComponent(apiKey())}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore REST GET failed (${res.status}): ${text}`);
  }
  return res.json();
}

/**
 * @param {Record<string, unknown>} body
 * @returns {Promise<{ id: string; data: Record<string, unknown> }[]>}
 */
async function runQuery(body) {
  if (!restConfigured()) return [];

  const url = `${baseUrl()}:runQuery?key=${encodeURIComponent(apiKey())}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore REST runQuery failed (${res.status}): ${text}`);
  }

  const payload = await res.json();
  if (!Array.isArray(payload)) return [];

  return payload
    .filter((row) => row?.document)
    .map((row) => parseFirestoreDocument(row.document));
}

/** @param {string} collectionHandle */
function collectionQueryBody(collectionHandle) {
  return {
    structuredQuery: {
      from: [{ collectionId: PRODUCTS_COLLECTION }],
      where: {
        fieldFilter: {
          field: { fieldPath: "collectionHandles" },
          op: "ARRAY_CONTAINS",
          value: { stringValue: collectionHandle },
        },
      },
    },
  };
}

/**
 * @param {string} [pageToken]
 */
async function listAllProductDocuments(pageToken) {
  if (!restConfigured()) return [];

  const params = new URLSearchParams({
    key: apiKey(),
    pageSize: "300",
  });
  if (pageToken) params.set("pageToken", pageToken);

  const url = `${baseUrl()}/${PRODUCTS_COLLECTION}?${params}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firestore REST list failed (${res.status}): ${text}`);
  }

  const payload = await res.json();
  const docs = Array.isArray(payload.documents)
    ? payload.documents.map(parseFirestoreDocument)
    : [];

  if (payload.nextPageToken) {
    const more = await listAllProductDocuments(payload.nextPageToken);
    return [...docs, ...more];
  }

  return docs;
}

export function isFirestoreRestConfigured() {
  return restConfigured();
}

export async function restListProductDocuments() {
  return listAllProductDocuments();
}

/**
 * @param {string} handle
 */
export async function restGetProductDocument(handle) {
  if (!handle) return null;
  const doc = await restGet(`${PRODUCTS_COLLECTION}/${encodeURIComponent(handle)}`);
  if (!doc) return null;
  return parseFirestoreDocument(doc);
}

/**
 * @param {string} collectionHandle
 */
export async function restListProductDocumentsByCollection(collectionHandle) {
  if (!collectionHandle) return [];
  try {
    return await runQuery(collectionQueryBody(collectionHandle));
  } catch (error) {
    console.error("[catalog] REST collection query failed, falling back to scan:", collectionHandle, error);
    const all = await listAllProductDocuments();
    return all.filter((doc) => {
      const handles = doc.data.collectionHandles;
      return Array.isArray(handles) && handles.includes(collectionHandle);
    });
  }
}
