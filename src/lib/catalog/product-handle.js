/**
 * @param {string} title
 */
export function slugifyProductHandle(title) {
  return String(title ?? "")
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
