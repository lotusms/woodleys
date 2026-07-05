import { normalizeDescriptionHtml, normalizeProsePunctuation } from "@/lib/prose";

export const PRODUCTS_COLLECTION = "products";
export const CATALOG_COLLECTIONS_COLLECTION = "catalogCollections";

/**
 * @param {Record<string, unknown>} data
 * @param {string} id
 * @param {{ includeInactive?: boolean }} [opts]
 */
export function firestoreDocToProductDetail(data, id, opts = {}) {
  const active = data.active !== false;
  if (!active && !opts.includeInactive) return null;

  const quantity = Number(data.quantity ?? 0);
  const priceUsd = Number(data.priceUsd ?? 0);
  const maxPriceUsd = Number(data.maxPriceUsd ?? priceUsd);
  const salePriceUsd =
    data.salePriceUsd != null && data.salePriceUsd !== ""
      ? Number(data.salePriceUsd)
      : null;
  const handle = String(data.handle ?? id);
  const images = Array.isArray(data.images)
    ? data.images.filter((img) => img?.src)
    : [];
  const image = data.image?.src ? data.image : (images[0] ?? undefined);

  const description = normalizeProsePunctuation(String(data.description ?? ""));
  const descriptionHtml =
    typeof data.descriptionHtml === "string" && data.descriptionHtml.trim()
      ? normalizeDescriptionHtml(data.descriptionHtml)
      : description
        ? `<p>${description}</p>`
        : "";

  return {
    id: `local:${handle}`,
    handle,
    title: String(data.title ?? handle),
    description,
    descriptionHtml,
    priceUsd,
    maxPriceUsd,
    salePriceUsd,
    quantity,
    active,
    featured: Boolean(data.featured),
    featuredOrder: Number(data.featuredOrder ?? 0),
    collectionHandles: Array.isArray(data.collectionHandles)
      ? data.collectionHandles.map(String)
      : [],
    image,
    images: images.length > 0 ? images : image ? [image] : [],
    specs: Array.isArray(data.specs)
      ? data.specs.filter((s) => s?.label && s?.value)
      : [],
    sku: typeof data.sku === "string" ? data.sku : undefined,
    brand: typeof data.brand === "string" ? data.brand : undefined,
    model: typeof data.model === "string" ? data.model : undefined,
    condition: typeof data.condition === "string" ? data.condition : undefined,
    seoTitle: typeof data.seoTitle === "string" ? data.seoTitle : undefined,
    metaDescription:
      typeof data.metaDescription === "string" ? data.metaDescription : undefined,
    availableForSale:
      active && quantity > 0 && data.availableForSale !== false,
    source: /** @type {const} */ ("local"),
    createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
  };
}
