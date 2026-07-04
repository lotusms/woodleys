"use client";

import { formatUsd } from "@/lib/money";
import { resolveProductPricing } from "@/lib/catalog/product-pricing";

/**
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct | Record<string, unknown>;
 *   layout?: "inline" | "stacked" | "charge";
 *   className?: string;
 *   compareLabelClassName?: string;
 *   regularClassName?: string;
 *   saleClassName?: string;
 *   singleClassName?: string;
 * }} props
 */
export default function ProductPrice({
  product,
  layout = "inline",
  className = "",
  compareLabelClassName = "font-normal text-site-secondary",
  regularClassName = "line-through decoration-current/70 opacity-60 tabular-nums",
  saleClassName = "",
  singleClassName = "",
}) {
  const { regularUsd, saleUsd, onSale } = resolveProductPricing(product);

  if (onSale && saleUsd != null) {
    if (layout === "charge") {
      return <span className={className}>{formatUsd(saleUsd)}</span>;
    }

    const compareAt = (
      <>
        was{" "}
        <span className={regularClassName}>{formatUsd(regularUsd)}</span>
      </>
    );

    if (layout === "stacked") {
      return (
        <span className={`inline-flex flex-col items-start gap-0.5 leading-none ${className}`}>
          <span className={compareLabelClassName}>{compareAt}</span>
          <span className={saleClassName}>{formatUsd(saleUsd)}</span>
        </span>
      );
    }

    return (
      <span className={`inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 ${className}`}>
        <span className={compareLabelClassName}>{compareAt}</span>
        <span className={saleClassName}>{formatUsd(saleUsd)}</span>
      </span>
    );
  }

  return (
    <span className={[className, singleClassName].filter(Boolean).join(" ")}>
      {formatUsd(regularUsd)}
    </span>
  );
}
