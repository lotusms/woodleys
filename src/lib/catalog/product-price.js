import { formatUsd } from "@/lib/money";

/**
 * Reads optional sale price from catalog product shapes (supports legacy maxPriceUsd).
 * @param {{ priceUsd?: number; salePriceUsd?: number; maxPriceUsd?: number } | null | undefined} product
 * @returns {number}
 */
export function getSalePriceUsd(product) {
  const sale = Number(product?.salePriceUsd ?? product?.maxPriceUsd ?? 0);
  const original = Number(product?.priceUsd ?? 0);
  if (!Number.isFinite(sale) || sale <= 0) return 0;
  if (!Number.isFinite(original) || original <= 0) return 0;
  if (sale >= original) return 0;
  return sale;
}

/**
 * @param {{ priceUsd?: number; salePriceUsd?: number; maxPriceUsd?: number } | null | undefined} product
 * @returns {boolean}
 */
export function isProductOnSale(product) {
  return getSalePriceUsd(product) > 0;
}

/**
 * Price shown to shoppers and used at checkout when a sale is active.
 * @param {{ priceUsd?: number; salePriceUsd?: number; maxPriceUsd?: number } | null | undefined} product
 * @returns {number}
 */
export function getEffectivePriceUsd(product) {
  const sale = getSalePriceUsd(product);
  if (sale > 0) return sale;
  return Number(product?.priceUsd ?? 0);
}

/**
 * @param {{ priceUsd?: number; salePriceUsd?: number; maxPriceUsd?: number } | null | undefined} product
 * @returns {string}
 */
export function formatProductPriceLabel(product) {
  const original = Number(product?.priceUsd ?? 0);
  const sale = getSalePriceUsd(product);
  if (sale > 0) {
    return `${formatUsd(original)} ${formatUsd(sale)}`;
  }
  return formatUsd(original);
}
