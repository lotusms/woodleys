/** @typedef {import("./product-types").CatalogProduct} CatalogProduct */

/** @typedef {'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest' | 'popular'} CatalogSortKey */

export const CATALOG_SORT_OPTIONS = [
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Recently Added" },
  { value: "popular", label: "Most Popular" },
];

export const DEFAULT_CATALOG_SORT = /** @type {const} */ ("newest");

/** @param {string} str */
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** @param {CatalogProduct} product */
function createdAtMs(product) {
  if (product.createdAt) {
    const ms = Date.parse(product.createdAt);
    if (Number.isFinite(ms)) return ms;
  }
  return hashString(product.id);
}

/** @param {CatalogProduct} product */
function popularityScore(product) {
  if (typeof product.popularity === "number") return product.popularity;
  return hashString(product.handle);
}

/**
 * @param {CatalogProduct[]} products
 * @param {CatalogSortKey | string} sortKey
 * @returns {CatalogProduct[]}
 */
export function sortCatalogProducts(products, sortKey) {
  const list = [...products];

  switch (sortKey) {
    case "name-asc":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return list.sort((a, b) => b.title.localeCompare(a.title));
    case "price-asc":
      return list.sort((a, b) => a.priceUsd - b.priceUsd);
    case "price-desc":
      return list.sort((a, b) => b.priceUsd - a.priceUsd);
    case "newest":
      return list.sort((a, b) => createdAtMs(b) - createdAtMs(a));
    case "popular":
      return list.sort((a, b) => popularityScore(b) - popularityScore(a));
    default:
      return list;
  }
}
