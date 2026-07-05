/**
 * Prefer WebP siblings for local product assets when Firestore still has .png paths.
 *
 * @param {string | undefined | null} src
 */
export function normalizeCatalogImageSrc(src) {
  if (!src || typeof src !== "string") return src;
  return src.replace(
    /(\/images\/[^"']+)\.png(\?.*)?$/i,
    "$1.webp$2",
  );
}

/**
 * @param {{ src?: string; alt?: string } | null | undefined} image
 */
export function normalizeCatalogImage(image) {
  if (!image?.src) return image;
  return {
    ...image,
    src: normalizeCatalogImageSrc(image.src),
  };
}
