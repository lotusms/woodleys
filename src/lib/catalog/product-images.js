import { normalizeCatalogImage } from "./normalize-image-src.js";

/**
 * Gallery for product detail — main photo first, then additional photos (deduped).
 * Local `/images/products/*.png` paths are rewritten to `.webp` when that is what
 * ships in `public/` (Firestore often still stores legacy `.png` URLs).
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
    const normalized = normalizeCatalogImage(img);
    const src = normalized?.src?.trim();
    if (!src || seen.has(src)) return;
    seen.add(src);
    gallery.push({
      src,
      alt: String(normalized?.alt ?? "").trim() || fallbackAlt,
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
