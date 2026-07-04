/**
 * @param {import("./product-types").CatalogProduct | Record<string, unknown> | null | undefined} product
 * @returns {{ src: string; alt: string }[]}
 */
export function getProductImages(product) {
  if (!product) return [];

  const fromArray = Array.isArray(product.images)
    ? product.images.filter((img) => img?.src)
    : [];

  if (fromArray.length > 0) return fromArray;
  if (product.image?.src) return [product.image];
  return [];
}
