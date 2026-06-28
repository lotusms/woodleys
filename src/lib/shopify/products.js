import { isShopifyConfigured, getShopifyCollectionUrl } from "./config";

/**
 * Placeholder product grid until Shopify Storefront API is connected.
 * Returns static editorial cards that link to collection handles when Shopify is live.
 *
 * @param {{ shopifyHandle: string; title: string; description: string }} entry
 */
export function getCategoryProducts(entry) {
  if (isShopifyConfigured()) {
    // Future: fetch from Shopify Storefront API by collection handle
    return [];
  }

  return [
    {
      id: `${entry.shopifyHandle}-placeholder-1`,
      title: `${entry.title} Collection`,
      description: entry.description,
      priceLabel: "View in store",
      href: getShopifyCollectionUrl(entry.shopifyHandle) || "/shop-all",
      image: entry.image,
    },
  ];
}
