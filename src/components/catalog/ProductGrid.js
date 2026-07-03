"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ProductPreviewDialog from "@/components/catalog/ProductPreviewDialog";
import ProductPrice from "@/components/catalog/ProductPrice";
import { useFlipAnimation } from "@/hooks/useFlipAnimation";
import { formatProductPriceLabel } from "@/lib/catalog/product-price";

/**
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct;
 *   onPreview: (product: import("@/lib/catalog/product-types").CatalogProduct) => void;
 *   itemRef?: (node: HTMLLIElement | null) => void;
 * }} props
 */
function ProductCard({ product, onPreview, itemRef }) {
  const priceLabel = formatProductPriceLabel(product);
  const isPreview = product.source === "mock";
  const isSoldOut = !product.availableForSale;
  const productUrl = `/products/${product.handle}`;

  return (
    <li ref={itemRef}>
      <article className="group relative flex h-full flex-col">
        <div
          className={`relative isolate aspect-[4/5] overflow-hidden bg-gradient-to-b from-champagne/70 via-ivory to-stone-100/80 ${
            isSoldOut ? "opacity-80" : ""
          }`}
        >
          <Link
            href={productUrl}
            className="absolute inset-0 z-[1] block focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warm-gold-dark"
            aria-label={`View ${product.title}, ${priceLabel}`}
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
                isSoldOut
                  ? "grayscale"
                  : "group-hover:scale-[1.04]"
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

          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-stone-950/5"
            aria-hidden
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] flex items-start justify-between gap-2 p-4 sm:p-5">
            {isSoldOut ? (
              <span className="rounded-full border border-white/25 bg-stone-950/55 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
                Sold out
              </span>
            ) : (
              <span aria-hidden />
            )}

            {!isPreview || isSoldOut ? (
              <span className="ml-auto rounded-full border border-white/25 bg-stone-950/50 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
                <ProductPrice product={product} variant="onDark" />
              </span>
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] p-5 sm:p-6">
            <h3 className="font-serif text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-white sm:text-2xl">
              {product.title}
            </h3>

            {product.description ? (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">
                {product.description}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
              <ProductPrice product={product} variant="onDark" className="text-sm" />
              <span className="inline-flex shrink-0 items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/90 transition duration-300 group-hover:text-white">
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

          {isPreview && !isSoldOut ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview(product);
              }}
              className="absolute right-3 top-3 z-[2] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-warm-gold transition hover:bg-white/20 hover:text-warm-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900/40 sm:right-4 sm:top-4"
              aria-label={`Quick preview: ${product.title}`}
              aria-haspopup="dialog"
            >
              <MagnifyingGlassIcon
                className="pointer-events-none h-6 w-6 sm:h-7 sm:w-7"
                strokeWidth={1.75}
                aria-hidden
              />
            </button>
          ) : null}
        </div>
      </article>
    </li>
  );
}

/**
 * @param {{ products: import("@/lib/catalog/product-types").CatalogProduct[]; emptyMessage?: string }} props
 */
export default function ProductGrid({ products, emptyMessage }) {
  const [previewProduct, setPreviewProduct] = useState(null);

  const orderKey = useMemo(
    () => products.map((product) => product.id).join("|"),
    [products],
  );
  const setFlipRef = useFlipAnimation(orderKey);

  if (!products.length) {
    return (
      <div className="rounded-sm border border-dashed border-stone-300/80 bg-champagne/30 px-6 py-12 text-center">
        <p className="text-sm leading-relaxed text-site-secondary">
          {emptyMessage ||
            "No products in this collection yet. Check back soon or browse Shop All."}
        </p>
        <Link
          href="/shop-all"
          className="mt-4 inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
        >
          Shop All
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3" role="list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPreview={setPreviewProduct}
            itemRef={setFlipRef(product.id)}
          />
        ))}
      </ul>

      <ProductPreviewDialog
        product={previewProduct}
        open={Boolean(previewProduct)}
        onClose={() => setPreviewProduct(null)}
      />
    </>
  );
}
