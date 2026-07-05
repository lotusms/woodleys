/** @param {{ image?: string | { src?: string; alt?: string }; title?: string }} line */
export function lineImageSrc(line) {
  if (!line?.image) return null;
  if (typeof line.image === "string") return line.image;
  return line.image.src ?? null;
}

/** @param {{ image?: string | { src?: string; alt?: string }; title?: string }} line */
export function lineImageAlt(line) {
  if (!line?.image || typeof line.image === "string") {
    return line?.title ?? "Product";
  }
  return line.image.alt ?? line.title ?? "Product";
}

/**
 * @param {import("@/lib/catalog/product-types").CatalogProduct} product
 */
export function productToCartPayload(product) {
  const imageSrc = product.image?.src ?? "";
  return {
    id: product.id,
    slug: product.handle,
    title: product.title,
    artist: "Woodley's Jewelers",
    priceUsd: Number(product.salePriceUsd ?? product.priceUsd ?? 0),
    image: imageSrc,
    originalImage: imageSrc,
    variantId: product.id,
    source: product.source ?? "local",
    shippingIncluded: false,
  };
}
