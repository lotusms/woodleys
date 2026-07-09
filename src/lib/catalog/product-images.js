/**
 * Gallery for product detail — main photo first, then additional photos (deduped).
 *
 * @param {import("./product-types").CatalogProduct | Record<string, unknown> | null | undefined} product
 * @returns {{ src: string; alt: string }[]}
 */
export function getProductImages(product) {
  if (!product) return [];

  /** @type {{ src: string; alt: string }[]} */
  const gallery = [];
  const seen = new Set();
  const fallbackAlt = String(product.title ?? "");

  /**
   * @param {{ src?: string; alt?: string } | null | undefined} img
   */
  function pushImage(img) {
    const src = img?.src?.trim();
    if (!src || seen.has(src)) return;
    seen.add(src);
    gallery.push({
      src,
      alt: String(img?.alt ?? "").trim() || fallbackAlt,
    });
  }

  pushImage(product.image);

  if (Array.isArray(product.images)) {
    for (const img of product.images) {
      pushImage(img);
    }
  }

  return gallery;
}
