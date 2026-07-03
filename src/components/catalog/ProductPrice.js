import { formatUsd } from "@/lib/money";
import {
  getEffectivePriceUsd,
  getSalePriceUsd,
  isProductOnSale,
} from "@/lib/catalog/product-price";

/**
 * @param {{
 *   product: { priceUsd?: number; salePriceUsd?: number; maxPriceUsd?: number };
 *   className?: string;
 *   originalClassName?: string;
 *   saleClassName?: string;
 *   variant?: "default" | "onDark";
 * }} props
 */
export default function ProductPrice({
  product,
  className = "",
  originalClassName = "",
  saleClassName = "",
  variant = "default",
}) {
  const original = Number(product?.priceUsd ?? 0);
  const sale = getSalePriceUsd(product);
  const onSale = isProductOnSale(product);

  if (!onSale) {
    return (
      <span className={`tabular-nums tracking-wide ${className}`}>
        {formatUsd(getEffectivePriceUsd(product))}
      </span>
    );
  }

  const originalTone =
    originalClassName ||
    (variant === "onDark"
      ? "text-white/55 line-through decoration-white/45"
      : "text-site-secondary line-through decoration-stone-400/80");
  const saleTone =
    saleClassName ||
    (variant === "onDark"
      ? "text-white"
      : "text-warm-gold-dark");

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
      <span className={`text-[0.92em] font-normal tabular-nums ${originalTone}`}>
        {formatUsd(original)}
      </span>
      <span className={`font-medium tabular-nums tracking-wide ${saleTone}`}>
        {formatUsd(sale)}
      </span>
    </span>
  );
}
