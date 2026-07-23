import { CATALOG_SECTIONS, walkCategoryEntries } from "@/lib/catalog/categories";

export const PRODUCTS_FILTER_ALL = "all";
export const PRODUCTS_FILTER_UNCATEGORIZED = "uncategorized";

/** @type {{ key: string; label: string; handle?: string }[]} */
export const PRODUCTS_CATEGORY_NAV = [
  { key: PRODUCTS_FILTER_ALL, label: "All products" },
  ...Object.entries(CATALOG_SECTIONS).map(([key, section]) => ({
    key,
    label: section.title,
    handle: section.shopifyHandle,
  })),
  { key: PRODUCTS_FILTER_UNCATEGORIZED, label: "Uncategorized" },
];

/** @param {string} sectionKey */
export function sectionCollectionHandles(sectionKey) {
  const section = CATALOG_SECTIONS[sectionKey];
  if (!section) return [];
  /** @type {string[]} */
  const handles = [section.shopifyHandle];
  walkCategoryEntries(section.children, (child) => {
    handles.push(child.shopifyHandle);
  });
  return handles;
}

/**
 * @param {string} sectionKey
 * @returns {{ shopifyHandle: string; title: string }[]}
 */
export function sectionSubcategories(sectionKey) {
  const section = CATALOG_SECTIONS[sectionKey];
  if (!section) return [];
  /** @type {{ shopifyHandle: string; title: string }[]} */
  const items = [];
  walkCategoryEntries(section.children, (child, slugPath) => {
    const parent =
      slugPath.length > 1
        ? section.children.find((c) => c.slug === slugPath[0])
        : null;
    items.push({
      shopifyHandle: child.shopifyHandle,
      title: parent ? `${parent.title} · ${child.title}` : child.title,
    });
  });
  return items;
}

/**
 * @param {Record<string, unknown>} product
 * @param {string} sectionKey
 */
export function productMatchesSection(product, sectionKey) {
  const handles = Array.isArray(product.collectionHandles)
    ? product.collectionHandles
    : [];

  if (sectionKey === PRODUCTS_FILTER_ALL) return true;
  if (sectionKey === PRODUCTS_FILTER_UNCATEGORIZED) return handles.length === 0;

  const sectionHandles = sectionCollectionHandles(sectionKey);
  return handles.some((handle) => sectionHandles.includes(handle));
}

/**
 * @param {Record<string, unknown>} product
 * @param {string} collectionHandle
 */
export function productMatchesCollection(product, collectionHandle) {
  if (!collectionHandle || collectionHandle === PRODUCTS_FILTER_ALL) return true;
  return Array.isArray(product.collectionHandles)
    ? product.collectionHandles.includes(collectionHandle)
    : false;
}

/**
 * @param {Record<string, unknown>} product
 * @param {string} query
 */
export function productMatchesSearch(product, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  const title = String(product.title ?? "").toLowerCase();
  const handle = String(product.handle ?? "").toLowerCase();
  return title.includes(normalized) || handle.includes(normalized);
}

/**
 * @param {Record<string, unknown>[]} products
 * @param {{ section?: string; collection?: string; query?: string }} filters
 */
export function filterDashboardProducts(products, filters) {
  const section = filters.section || PRODUCTS_FILTER_ALL;
  const collection = filters.collection || PRODUCTS_FILTER_ALL;
  const query = filters.query || "";

  return products.filter(
    (product) =>
      productMatchesSection(product, section) &&
      productMatchesCollection(product, collection) &&
      productMatchesSearch(product, query),
  );
}

/**
 * @param {Record<string, unknown>[]} products
 */
export function countProductsBySection(products) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const item of PRODUCTS_CATEGORY_NAV) {
    counts[item.key] = products.filter((product) =>
      productMatchesSection(product, item.key),
    ).length;
  }
  return counts;
}

/**
 * @param {Record<string, unknown>[]} products
 * @param {string} sectionKey
 */
export function countProductsBySubcategory(products, sectionKey) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const child of sectionSubcategories(sectionKey)) {
    counts[child.shopifyHandle] = products.filter((product) =>
      productMatchesCollection(product, child.shopifyHandle),
    ).length;
  }
  return counts;
}

export const PRODUCTS_SORT_TITLE_ASC = "title-asc";
export const PRODUCTS_SORT_TITLE_DESC = "title-desc";
export const PRODUCTS_SORT_PRICE_ASC = "price-asc";
export const PRODUCTS_SORT_PRICE_DESC = "price-desc";
export const PRODUCTS_SORT_FEATURED = "featured";
export const PRODUCTS_SORT_RECENTLY_ADDED = "recently-added";
export const PRODUCTS_SORT_RECENTLY_UPDATED = "recently-updated";

/** @type {{ value: string; label: string }[]} */
export const PRODUCTS_SORT_OPTIONS = [
  { value: PRODUCTS_SORT_TITLE_ASC, label: "A to Z" },
  { value: PRODUCTS_SORT_TITLE_DESC, label: "Z to A" },
  { value: PRODUCTS_SORT_PRICE_ASC, label: "Price: low to high" },
  { value: PRODUCTS_SORT_PRICE_DESC, label: "Price: high to low" },
  { value: PRODUCTS_SORT_FEATURED, label: "Featured" },
  { value: PRODUCTS_SORT_RECENTLY_ADDED, label: "Recently added" },
  { value: PRODUCTS_SORT_RECENTLY_UPDATED, label: "Recently updated" },
];

/** @param {string | null | undefined} sortKey */
export function normalizeProductsSort(sortKey) {
  const match = PRODUCTS_SORT_OPTIONS.find((option) => option.value === sortKey);
  return match ? match.value : PRODUCTS_SORT_TITLE_ASC;
}

/**
 * @param {string | null | undefined} sectionKey
 * @param {string | null | undefined} collectionHandle
 * @param {{ q?: string | null; sort?: string | null; per?: string | number | null }} [extras]
 */
export function buildProductsFilterHref(sectionKey, collectionHandle, extras = {}) {
  const params = new URLSearchParams();
  if (sectionKey && sectionKey !== PRODUCTS_FILTER_ALL) {
    params.set("section", sectionKey);
  }
  if (collectionHandle && collectionHandle !== PRODUCTS_FILTER_ALL) {
    params.set("collection", collectionHandle);
  }
  if (extras.q?.trim()) {
    params.set("q", extras.q.trim());
  }
  if (extras.sort && extras.sort !== PRODUCTS_SORT_TITLE_ASC) {
    params.set("sort", extras.sort);
  }
  const per = Number(extras.per);
  if (Number.isFinite(per) && per > 0 && per !== 25) {
    params.set("per", String(per));
  }
  const query = params.toString();
  return query ? `/dashboard/products?${query}` : "/dashboard/products";
}

/**
 * @param {Record<string, unknown>} product
 */
function productPrice(product) {
  const sale = Number(product.salePriceUsd);
  if (Number.isFinite(sale) && sale > 0) return sale;
  const price = Number(product.priceUsd);
  return Number.isFinite(price) ? price : 0;
}

/**
 * @param {unknown} value
 */
function productTimestamp(value) {
  if (!value) return 0;
  if (typeof value === "string" || typeof value === "number") {
    const ms = new Date(value).getTime();
    return Number.isFinite(ms) ? ms : 0;
  }
  if (typeof value === "object" && value !== null && "toDate" in value) {
    try {
      // @ts-expect-error Firestore Timestamp
      return value.toDate().getTime();
    } catch {
      return 0;
    }
  }
  if (typeof value === "object" && value !== null && "seconds" in value) {
    // @ts-expect-error Firestore Timestamp-like
    return Number(value.seconds) * 1000;
  }
  return 0;
}

/**
 * @param {Record<string, unknown>[]} products
 * @param {string | null | undefined} sortKey
 */
export function sortDashboardProducts(products, sortKey) {
  const sort = normalizeProductsSort(sortKey);
  const list = [...products];

  list.sort((a, b) => {
    switch (sort) {
      case PRODUCTS_SORT_TITLE_DESC: {
        return String(b.title ?? "").localeCompare(String(a.title ?? ""), undefined, {
          sensitivity: "base",
        });
      }
      case PRODUCTS_SORT_PRICE_ASC:
        return productPrice(a) - productPrice(b);
      case PRODUCTS_SORT_PRICE_DESC:
        return productPrice(b) - productPrice(a);
      case PRODUCTS_SORT_FEATURED: {
        if (Boolean(a.featured) !== Boolean(b.featured)) {
          return a.featured ? -1 : 1;
        }
        if (a.featured && b.featured) {
          return Number(a.featuredOrder ?? 0) - Number(b.featuredOrder ?? 0);
        }
        return String(a.title ?? "").localeCompare(String(b.title ?? ""), undefined, {
          sensitivity: "base",
        });
      }
      case PRODUCTS_SORT_RECENTLY_ADDED:
        return productTimestamp(b.createdAt) - productTimestamp(a.createdAt);
      case PRODUCTS_SORT_RECENTLY_UPDATED:
        return productTimestamp(b.updatedAt) - productTimestamp(a.updatedAt);
      case PRODUCTS_SORT_TITLE_ASC:
      default:
        return String(a.title ?? "").localeCompare(String(b.title ?? ""), undefined, {
          sensitivity: "base",
        });
    }
  });

  return list;
}
