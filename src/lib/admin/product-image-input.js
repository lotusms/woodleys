/**
 * Normalize main product image input from admin API bodies and dashboard forms.
 *
 * @param {unknown} body
 * @returns {{ src: string; alt: string } | null}
 */
export function parseMainProductImageInput(body) {
  const image = body?.image;
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (typeof image === "string" && image.trim()) {
    return { src: image.trim(), alt: title };
  }

  if (image && typeof image === "object") {
    const src =
      typeof image.src === "string"
        ? image.src.trim()
        : typeof image.url === "string"
          ? image.url.trim()
          : "";
    if (src) {
      const alt =
        typeof image.alt === "string" && image.alt.trim()
          ? image.alt.trim()
          : title;
      return { src, alt };
    }
  }

  const images = Array.isArray(body?.images) ? body.images : [];
  for (const entry of images) {
    if (!entry || typeof entry !== "object") continue;
    const src =
      typeof entry.src === "string"
        ? entry.src.trim()
        : typeof entry.url === "string"
          ? entry.url.trim()
          : "";
    if (src) {
      const alt =
        typeof entry.alt === "string" && entry.alt.trim()
          ? entry.alt.trim()
          : title;
      return { src, alt };
    }
  }

  if (typeof body?.imageSrc === "string" && body.imageSrc.trim()) {
    return { src: body.imageSrc.trim(), alt: title };
  }

  return null;
}

/**
 * @param {{ image?: { src?: string; alt?: string }; images?: { src?: string; alt?: string }[]; title?: string }} form
 * @param {string} [domSrc]
 */
export function buildMainProductImagePayload(form, domSrc = "") {
  const title = String(form?.title ?? "").trim();
  const candidates = [
    domSrc,
    form?.image?.src,
    ...(Array.isArray(form?.images) ? form.images.map((img) => img?.src) : []),
  ];

  const src = candidates
    .map((value) => String(value ?? "").trim())
    .find(Boolean);

  if (!src) return null;

  const alt = String(form?.image?.alt ?? "").trim() || title;
  return { src, alt };
}
