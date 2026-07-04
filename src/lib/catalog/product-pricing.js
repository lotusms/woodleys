import { formatUsd } from "@/lib/money";

/**
 * @param {import("@/lib/catalog/product-types").CatalogProduct | Record<string, unknown> | null | undefined} product
 * @returns {{ regularUsd: number; saleUsd: number | null; onSale: boolean; chargeUsd: number }}
 */
export function resolveProductPricing(product) {
  const priceUsd = Number(product?.priceUsd ?? 0);
  const maxPriceUsd = Number(product?.maxPriceUsd ?? priceUsd);
  const saleFromField =
    product?.salePriceUsd != null && product.salePriceUsd !== ""
      ? Number(product.salePriceUsd)
      : null;

  if (
    saleFromField != null &&
    Number.isFinite(saleFromField) &&
    saleFromField > 0 &&
    saleFromField < priceUsd
  ) {
    return {
      regularUsd: priceUsd,
      saleUsd: saleFromField,
      onSale: true,
      chargeUsd: saleFromField,
    };
  }

  // Legacy seeded data used maxPriceUsd > priceUsd as a range — treat as compare-at + sale.
  if (maxPriceUsd > priceUsd && priceUsd > 0) {
    return {
      regularUsd: maxPriceUsd,
      saleUsd: priceUsd,
      onSale: true,
      chargeUsd: priceUsd,
    };
  }

  return {
    regularUsd: priceUsd,
    saleUsd: null,
    onSale: false,
    chargeUsd: priceUsd,
  };
}

/**
 * @param {import("@/lib/catalog/product-types").CatalogProduct | Record<string, unknown> | null | undefined} product
 */
export function formatProductPriceLabel(product) {
  const { regularUsd, saleUsd, onSale } = resolveProductPricing(product);
  if (onSale && saleUsd != null) return formatUsd(saleUsd);
  return formatUsd(regularUsd);
}

/**
 * @param {import("@/lib/catalog/product-types").CatalogProduct | Record<string, unknown> | null | undefined} product
 */
export function formatProductPriceAccessibleLabel(product) {
  const { regularUsd, saleUsd, onSale } = resolveProductPricing(product);
  if (onSale && saleUsd != null) {
    return `Sale price ${formatUsd(saleUsd)}, was ${formatUsd(regularUsd)}`;
  }
  return formatUsd(regularUsd);
}

/**
 * @param {import("@/lib/catalog/product-types").CatalogProduct | Record<string, unknown> | null | undefined} product
 */
export function getProductChargeUsd(product) {
  return resolveProductPricing(product).chargeUsd;
}

/**
 * @param {number} regularUsd
 * @param {number | null | undefined} saleUsd
 */
export function normalizeProductPricingForSave(regularUsd, saleUsd) {
  const regular = Number(regularUsd ?? 0);
  const sale =
    saleUsd != null && saleUsd !== "" && Number.isFinite(Number(saleUsd))
      ? Number(saleUsd)
      : null;

  if (sale != null && sale > 0 && sale < regular) {
    return {
      priceUsd: regular,
      salePriceUsd: sale,
      maxPriceUsd: regular,
    };
  }

  return {
    priceUsd: regular,
    salePriceUsd: null,
    maxPriceUsd: regular,
  };
}
