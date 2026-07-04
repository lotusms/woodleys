import { isShopifyIntegrationConfigured } from "./integration-config";
import { shopifyStorefrontQuery } from "./storefront";

/** @typedef {{ id: string; title: string; handle: string; description: string; priceUsd: number; maxPriceUsd: number; image?: { src: string; alt: string }; availableForSale: boolean }} CatalogProduct */

/**
 * @param {string} scope
 * @param {string} handle
 * @param {unknown[]} errors
 */
function logShopifyCatalogIssue(scope, handle, errors) {
  if (process.env.NODE_ENV !== "development") return;
  console.warn(`[shopify] ${scope}`, handle, errors);
}

const COLLECTION_PRODUCTS_QUERY = `
  query CollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      products(first: $first) {
        nodes {
          id
          title
          handle
          description
          availableForSale
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice { amount }
            maxVariantPrice { amount }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      featuredImage {
        url
        altText
      }
      images(first: 8) {
        nodes {
          url
          altText
        }
      }
      variants(first: 25) {
        nodes {
          id
          title
          availableForSale
          price { amount }
        }
      }
      priceRange {
        minVariantPrice { amount }
        maxVariantPrice { amount }
      }
    }
  }
`;

/**
 * @param {Record<string, unknown> | null | undefined} node
 * @returns {CatalogProduct | null}
 */
function normalizeProduct(node) {
  if (!node) return null;

  const min = Number(node.priceRange?.minVariantPrice?.amount ?? 0);
  const max = Number(node.priceRange?.maxVariantPrice?.amount ?? min);

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description || "",
    priceUsd: min,
    maxPriceUsd: max,
    availableForSale: Boolean(node.availableForSale),
    image: node.featuredImage?.url
      ? {
          src: node.featuredImage.url,
          alt: node.featuredImage.altText || node.title,
        }
      : undefined,
  };
}

/**
 * @param {string} handle Shopify collection handle
 * @param {{ first?: number }} [opts]
 * @returns {Promise<CatalogProduct[]>}
 */
export async function getProductsByCollectionHandle(handle, { first = 48 } = {}) {
  if (!(await isShopifyIntegrationConfigured()) || !handle) return [];

  const { data, errors } = await shopifyStorefrontQuery(COLLECTION_PRODUCTS_QUERY, {
    handle,
    first,
  });

  if (errors?.length) {
    logShopifyCatalogIssue("collection products", handle, errors);
    return [];
  }

  const nodes = data?.collection?.products?.nodes ?? [];
  return nodes.map(normalizeProduct).filter(Boolean);
}

/**
 * @param {string} handle
 * @returns {Promise<(CatalogProduct & { descriptionHtml?: string; images: { src: string; alt: string }[]; variants: { id: string; title: string; priceUsd: number; availableForSale: boolean }[] }) | null>}
 */
export async function getProductByHandle(handle) {
  if (!(await isShopifyIntegrationConfigured()) || !handle) return null;

  const { data, errors } = await shopifyStorefrontQuery(PRODUCT_BY_HANDLE_QUERY, {
    handle,
  });

  if (errors?.length) {
    logShopifyCatalogIssue("product", handle, errors);
    return null;
  }

  const node = data?.product;
  if (!node) return null;

  const base = normalizeProduct(node);
  if (!base) return null;

  return {
    ...base,
    descriptionHtml: node.descriptionHtml || "",
    images: (node.images?.nodes ?? [])
      .filter((img) => img?.url)
      .map((img) => ({
        src: img.url,
        alt: img.altText || node.title,
      })),
    variants: (node.variants?.nodes ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      priceUsd: Number(v.price?.amount ?? 0),
      availableForSale: Boolean(v.availableForSale),
    })),
  };
}

/**
 * @deprecated Use getProductsByCollectionHandle
 * @param {{ shopifyHandle: string }} entry
 */
export async function getCategoryProducts(entry) {
  return getProductsByCollectionHandle(entry.shopifyHandle);
}
