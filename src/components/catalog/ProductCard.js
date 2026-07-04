"use client";

import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ProductPrice from "@/components/catalog/ProductPrice";
import {
  formatProductPriceAccessibleLabel,
  formatProductPriceLabel,
  resolveProductPricing,
} from "@/lib/catalog/product-pricing";

/**
 * Primary catalog product card — collection grids with quick preview.
 *
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct;
 *   onPreview?: (product: import("@/lib/catalog/product-types").CatalogProduct) => void;
 *   itemRef?: (node: HTMLLIElement | null) => void;
 * }} props
 */
export default function ProductCard({ product, onPreview, itemRef }) {
  const { onSale } = resolveProductPricing(product);
  const priceLabel = formatProductPriceLabel(product);
  const priceAccessibleLabel = formatProductPriceAccessibleLabel(product);
  const isSoldOut = !product.availableForSale;
  const productUrl = `/products/${product.handle}`;

  return (
    <li ref={itemRef}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-stone-200/70 bg-ivory shadow-sm shadow-stone-900/5 transition hover:border-warm-gold/35 hover:shadow-md">
        <div
          className={`relative isolate aspect-[4/5] overflow-hidden bg-gradient-to-b from-champagne/70 via-ivory to-stone-100/80 ${
            isSoldOut ? "opacity-80" : ""
          }`}
        >
          <Link
            href={productUrl}
            className="absolute inset-0 z-[1] block focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warm-gold-dark"
            aria-label={`View ${product.title}, ${priceAccessibleLabel}`}
          >
            <span className="sr-only">
              View {product.title}. {product.description}
            </span>
          </Link>

          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image.src}
              alt=""
              className={`pointer-events-none h-full w-full object-cover transition duration-700 ease-out ${
                isSoldOut ? "grayscale" : "group-hover:scale-[1.04]"
              }`}
            />
          ) : (
            <div
              className="pointer-events-none flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-site-secondary"
              aria-hidden
            >
              No image
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-start p-4 sm:p-5">
            {isSoldOut ? (
              <span className="rounded-full border border-stone-300/80 bg-ivory/90 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-site-secondary backdrop-blur-sm">
                Sold out
              </span>
            ) : null}
          </div>

          {onPreview ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview(product);
              }}
              className="absolute right-2 top-2 z-[3] cursor-pointer rounded-full border border-stone-200/80 bg-white/85 p-2 text-stone-600 shadow-sm backdrop-blur-sm transition hover:border-warm-gold/40 hover:text-site-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 sm:right-2.5 sm:top-2.5"
              aria-label={`Quick preview: ${product.title}`}
              aria-haspopup="dialog"
            >
              <MagnifyingGlassIcon
                className="pointer-events-none h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
                strokeWidth={1.75}
                aria-hidden
              />
            </button>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col border-t border-stone-200/60 bg-gradient-to-b from-ivory to-champagne/35 px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="font-serif text-[1.2rem] font-medium leading-tight tracking-[-0.02em] text-site-fg sm:text-[1.35rem]">
            {product.title}
          </h3>

          {product.description ? (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-site-secondary">
              {product.description}
            </p>
          ) : null}

          <div className="mt-4 flex items-end justify-between gap-4 border-t border-stone-200/70 pt-4">
            <div className="min-w-0">
              {onSale ? (
                <ProductPrice
                  product={product}
                  layout="stacked"
                  compareLabelClassName="text-[0.68rem] font-normal tabular-nums tracking-wide text-site-secondary"
                  regularClassName="line-through decoration-stone-400/70 tabular-nums text-site-secondary/70"
                  saleClassName="text-sm font-medium tabular-nums tracking-wide text-warm-gold-dark"
                />
              ) : (
                <p className="text-sm font-medium tabular-nums tracking-wide text-warm-gold-dark">
                  {priceLabel}
                </p>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-warm-gold-dark/85 transition duration-300 group-hover:text-warm-gold-dark">
              View
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </span>
          </div>
        </div>
      </article>
    </li>
  );
}
