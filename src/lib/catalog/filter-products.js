import { productMatchesMetal } from "@/config/metals";

/**
 * @param {import("./product-types").CatalogProduct & { catalogShapeSlug?: string }} product
 * @param {string | null | undefined} shapeSlug
 */
export function productMatchesShape(product, shapeSlug) {
  if (!shapeSlug) return true;
  return product.catalogShapeSlug === shapeSlug;
}

/**
 * @param {Array<import("./product-types").CatalogProduct & { catalogShapeSlug?: string }}>} products
 * @param {{ metalSlug?: string | null; shapeSlug?: string | null }} filters
 */
export function filterCatalogProducts(products, filters = {}) {
  const { metalSlug, shapeSlug } = filters;
  return products.filter(
    (product) =>
      productMatchesMetal(product, metalSlug || "") &&
      productMatchesShape(product, shapeSlug),
  );
}
