import Link from "next/link";
import ProductPrice from "@/components/catalog/ProductPrice";
import { formatProductPriceLabel } from "@/lib/catalog/product-pricing";

/**
 * Compact product card for “Similar pieces” carousels and related suggestions.
 *
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct;
 *   className?: string;
 * }} props
 */
export default function SuggestionCard({ product, className = "" }) {
  const priceLabel = formatProductPriceLabel(product);
  const productUrl = `/products/${product.handle}`;

  return (
    <article
      role="listitem"
      className={`group w-[min(78vw,16.5rem)] shrink-0 snap-start sm:w-[17.5rem] ${className}`.trim()}
    >
      <Link
        href={productUrl}
        className="flex h-full flex-col overflow-hidden rounded-sm border border-stone-200/70 bg-ivory shadow-sm shadow-stone-900/5 transition hover:border-warm-gold/35 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-champagne">
          {product.image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image.src}
                alt={product.image.alt || product.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-site-secondary">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col border-t border-stone-200/60 bg-gradient-to-b from-ivory to-champagne/35 px-4 py-4">
          <h3 className="font-serif text-lg font-medium leading-tight tracking-[-0.02em] text-site-fg">
            {product.title}
          </h3>
          <p className="mt-2 text-sm font-medium tabular-nums text-warm-gold-dark">
            <ProductPrice
              product={product}
              layout="stacked"
              compareLabelClassName="text-[0.68rem] font-normal tabular-nums text-site-secondary"
              regularClassName="line-through decoration-stone-400/70 tabular-nums text-site-secondary/70"
              saleClassName="text-sm font-medium tabular-nums text-warm-gold-dark"
              singleClassName="text-sm font-medium tabular-nums text-warm-gold-dark"
            />
          </p>
          {!product.availableForSale ? (
            <p className="mt-2 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-site-secondary">
              Sold out
            </p>
          ) : (
            <p className="mt-auto pt-3 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-warm-gold-dark/90 transition group-hover:text-warm-gold-dark">
              View piece
            </p>
          )}
        </div>
      </Link>
      <span className="sr-only">
        {product.title}, {priceLabel}
      </span>
    </article>
  );
}
