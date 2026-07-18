/**
 * Who a jewelry piece is primarily offered for.
 * Untagged / missing values are treated as unisex on gendered browse paths
 * so existing inventory still appears until staff assigns an audience.
 *
 * @typedef {"women" | "men" | "unisex"} ProductAudience
 */

/** @type {readonly ProductAudience[]} */
export const PRODUCT_AUDIENCES = /** @type {const} */ (["women", "men", "unisex"]);

/**
 * @param {unknown} value
 * @returns {ProductAudience | null}
 */
export function normalizeProductAudience(value) {
  if (value === "women" || value === "men" || value === "unisex") return value;
  return null;
}

/**
 * @param {{ audience?: unknown } | null | undefined} product
 * @returns {ProductAudience}
 */
export function resolveProductAudience(product) {
  return normalizeProductAudience(product?.audience) ?? "unisex";
}

/**
 * @param {{ audience?: unknown } | null | undefined} product
 * @param {ProductAudience | null | undefined} audience
 */
export function productMatchesAudience(product, audience) {
  if (!audience) return true;
  const resolved = resolveProductAudience(product);
  if (resolved === "unisex") return true;
  return resolved === audience;
}

/**
 * @template {{ audience?: unknown }} T
 * @param {T[]} products
 * @param {ProductAudience | null | undefined} audience
 * @returns {T[]}
 */
export function filterProductsByAudience(products, audience) {
  if (!audience) return products;
  return products.filter((product) => productMatchesAudience(product, audience));
}

/**
 * @param {ProductAudience} audience
 */
export function audienceLabel(audience) {
  if (audience === "women") return "Women";
  if (audience === "men") return "Men";
  return "Unisex / all";
}
