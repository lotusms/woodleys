"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ProductPrice from "@/components/catalog/ProductPrice";
import ProductTileBlobArt from "@/components/catalog/ProductTileBlobArt";
import { formatProductPriceAccessibleLabel } from "@/lib/catalog/product-pricing";

const TINTS = ["#3d3834", "#4a4038", "#2f3438", "#42362e", "#353130"];

const VARIANT_CLASSES = {
  grid: "w-full h-full",
  carousel: "w-[min(78vw,18.5rem)] shrink-0 snap-start sm:w-[19rem]",
};

/** @param {string} handle */
function tintForHandle(handle) {
  let h = 0;
  for (let i = 0; i < handle.length; i += 1) {
    h = (h << 5) - h + handle.charCodeAt(i);
    h |= 0;
  }
  return TINTS[Math.abs(h) % TINTS.length];
}

/** @param {string} text @param {number} max */
function excerpt(text, max = 72) {
  const trimmed = String(text || "").replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

/**
 * Shared product tile — animated blob backdrop, split image area, title/price layout.
 *
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct;
 *   variant?: "grid" | "carousel";
 *   className?: string;
 *   onPreview?: (product: import("@/lib/catalog/product-types").CatalogProduct) => void;
 *   listItem?: boolean;
 * }} props
 */
export default function ProductTileCard({
  product,
  variant = "grid",
  className = "",
  onPreview,
  listItem = false,
}) {
  const router = useRouter();
  const productUrl = `/products/${product.handle}`;
  const tint = tintForHandle(product.handle);
  const priceA11y = formatProductPriceAccessibleLabel(product);
  const isSoldOut = !product.availableForSale;

  const prefetchProduct = useCallback(() => {
    router.prefetch(productUrl);
  }, [router, productUrl]);

  return (
    <article
      {...(listItem ? { role: "listitem" } : {})}
      className={`product-tile-card group relative ${VARIANT_CLASSES[variant]} ${className}`.trim()}
      style={{
        "--product-tile-tint": tint,
        "--product-tile-blob-stroke":
          "color-mix(in oklab, var(--product-tile-tint) 55%, var(--color-warm-gold) 45%)",
      }}
    >
      <Link
        href={productUrl}
        prefetch
        onMouseEnter={prefetchProduct}
        onFocus={prefetchProduct}
        className="flex h-full flex-col bg-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2"
        aria-label={`View ${product.title}, from ${priceA11y}`}
      >
        <div
          className={`relative aspect-square overflow-hidden ${isSoldOut ? "opacity-90" : ""}`}
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in oklab, var(--product-tile-tint) 72%, #8a8278) 0 50%, color-mix(in oklab, var(--color-champagne) 88%, white) 50% 100%)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <ProductTileBlobArt side="left" />
            <ProductTileBlobArt side="right" />
          </div>

          {isSoldOut ? (
            <span className="absolute left-3 top-3 z-10 rounded-full border border-stone-300/80 bg-ivory/90 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-site-secondary backdrop-blur-sm">
              Sold out
            </span>
          ) : null}

          <div className="relative z-[1] flex h-full items-center justify-center p-5 sm:p-6">
            {product.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image.src}
                  alt={product.image.alt || product.title}
                  className={`max-h-full max-w-full object-contain drop-shadow-[0_18px_28px_rgba(45,38,32,0.22)] transition duration-500 group-hover:scale-[1.04] ${
                    isSoldOut ? "grayscale" : ""
                  }`}
                />
              </>
            ) : (
              <div className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white/80">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 border-t border-stone-200/70 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-lg font-medium leading-snug tracking-[-0.02em] text-site-fg">
              {product.title}
            </h3>

            <div className="shrink-0 text-right">
              <p className="text-[0.62rem] font-medium uppercase tracking-[0.16em] text-site-secondary">
                From
              </p>
              <p className="mt-0.5 text-sm font-medium tabular-nums text-site-fg">
                <ProductPrice product={product} layout="charge" />
              </p>
            </div>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3">
            <p className="max-w-[12rem] text-sm leading-relaxed text-site-secondary">
              {excerpt(product.description)}
            </p>

            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-warm-gold-dark/80 px-3.5 py-2 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-warm-gold-dark transition group-hover:border-warm-gold-dark group-hover:bg-warm-gold-dark/5">
              View
              <span
                className="h-2 w-2 rounded-full bg-warm-gold-dark transition group-hover:scale-110"
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>

      {onPreview ? (
        <button
          type="button"
          onClick={() => onPreview(product)}
          className="absolute right-2 top-2 z-20 cursor-pointer rounded-full border border-stone-200/80 bg-white/85 p-2 text-stone-600 shadow-sm backdrop-blur-sm transition hover:border-warm-gold/40 hover:text-site-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 sm:right-2.5 sm:top-2.5"
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

      <span className="sr-only">
        {product.title}, from {priceA11y}
      </span>
    </article>
  );
}
