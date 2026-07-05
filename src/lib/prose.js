/** Shown when optional profile, order, or metadata fields are empty. */
export const EMPTY_VALUE_LABEL = "Not provided";

/**
 * Replaces em dashes and prose en dashes with commas or periods.
 *
 * @param {string | null | undefined} text
 * @returns {string}
 */
export function normalizeProsePunctuation(text) {
  if (text == null || text === "") return text ?? "";

  let s = String(text);

  // Tight em dashes between words (e.g. "profile—an").
  s = s.replace(/([^\s])\u2014([^\s])/g, (_, before, after) => {
    if (/[A-Z]/.test(after)) return `${before}. ${after}`;
    return `${before}, ${after}`;
  });

  // Spaced em dashes (e.g. "pieces — explore").
  s = s.replace(/\s*\u2014\s*/g, ". ");
  s = s.replace(/\. ([a-z])/g, (_, letter) => `. ${letter.toUpperCase()}`);

  // En dash used as a prose separator (not numeric ranges like 349–525).
  s = s.replace(/(?<!\d)\s*\u2013\s*(?!\d)/g, ", ");

  return s;
}

/**
 * @param {string | null | undefined} html
 * @returns {string}
 */
export function normalizeDescriptionHtml(html) {
  if (!html || typeof html !== "string") return html ?? "";

  return html.replace(/>([^<]*)</g, (match, text) => {
    if (!text.trim()) return match;
    return `>${normalizeProsePunctuation(text)}<`;
  });
}

/**
 * @template {Record<string, unknown> | null | undefined} T
 * @param {T} product
 * @returns {T}
 */
export function withNormalizedProse(product) {
  if (!product) return product;

  const description = normalizeProsePunctuation(String(product.description ?? ""));
  const descriptionHtml =
    typeof product.descriptionHtml === "string" && product.descriptionHtml.trim()
      ? normalizeDescriptionHtml(product.descriptionHtml)
      : description
        ? `<p>${description}</p>`
        : "";

  return {
    ...product,
    description,
    descriptionHtml,
  };
}
