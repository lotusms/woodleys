"use client";

import Link from "next/link";
import { useState } from "react";
import ProductDetailTabs from "@/components/catalog/ProductDetailTabs";
import ProductPrice from "@/components/catalog/ProductPrice";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { getProductChargeUsd } from "@/lib/catalog/product-pricing";

/**
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProductDetail & {
 *     specs?: { label: string; value: string }[];
 *   };
 *   shopifyProductUrl?: string | null;
 * }} props
 */
export default function ProductDetailAside({
  product,
  shopifyProductUrl,
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isSoldOut = !product.availableForSale;
  const stockQty = Number(product.quantity ?? 0);
  const maxQty =
    product.source === "local" && stockQty > 0
      ? Math.min(99, stockQty)
      : 99;
  const chargeUsd = getProductChargeUsd(product);

  function handleAddToCart() {
    if (isSoldOut) return;
    const qty = Math.max(1, Math.min(maxQty, quantity));
    addItem(
      {
        id: product.id,
        slug: product.handle,
        title: product.title,
        artist: "Woodley's Jewelers",
        priceUsd: chargeUsd,
        image: product.image?.src ?? "",
        originalImage: product.image?.src ?? "",
        variantId: product.id,
        source: product.source ?? "local",
        shippingIncluded: false,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="min-w-0">
      <h1 className="font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-[2.75rem] sm:leading-[1.08]">
        {product.title}
      </h1>

      <div className="mt-4 text-warm-gold-dark">
        <ProductPrice
          product={product}
          layout="stacked"
          compareLabelClassName="text-sm font-normal tabular-nums text-site-secondary"
          regularClassName="line-through decoration-site-secondary/40 tabular-nums text-site-secondary/60"
          singleClassName="text-2xl font-medium tabular-nums sm:text-[1.75rem]"
          saleClassName="text-2xl font-medium tabular-nums sm:text-[1.75rem]"
        />
      </div>

      {product.source === "mock" ? (
        <p className="mt-4 text-sm leading-relaxed text-site-secondary">
          Preview listing. Live inventory will appear here when your catalog
          database is connected.
        </p>
      ) : null}

      <div className="mt-5">
        {isSoldOut ? (
          <p className="text-sm text-site-secondary">Currently unavailable</p>
        ) : (
          <p className="inline-flex items-center gap-2 text-sm text-site-secondary">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-emerald-600"
              aria-hidden
            />
            {product.source === "local" && stockQty > 0
              ? stockQty === 1
                ? "Only 1 left in stock"
                : `${stockQty} in stock`
              : "In stock"}
          </p>
        )}
      </div>

      {!shopifyProductUrl && !isSoldOut ? (
        <div className="mt-6 flex items-center gap-3">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-site-secondary">
            Qty
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="product-qty"
              type="number"
              min={1}
              max={maxQty}
              value={quantity}
              onChange={(e) => {
                const next = Number.parseInt(e.target.value, 10);
                if (Number.isFinite(next)) {
                  setQuantity(Math.max(1, Math.min(maxQty, next)));
                }
              }}
              className="w-12 border border-stone-300/80 bg-white px-1 py-2 text-center text-sm tabular-nums text-site-fg focus:border-warm-gold focus:outline-none focus:ring-2 focus:ring-warm-gold/20"
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty}
              className="flex h-9 w-9 items-center justify-center border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      <ProductDetailTabs
        description={product.description}
        descriptionHtml={product.descriptionHtml}
        specs={product.specs ?? []}
      />

      <div className="mt-8">
        {shopifyProductUrl ? (
          <div className="flex flex-col gap-3">
            <PrimaryButton
              href={shopifyProductUrl}
              className="w-full rounded-sm px-6 py-4 text-[0.68rem] uppercase tracking-[0.24em]"
            >
              Buy on Shopify
            </PrimaryButton>
            <Link
              href="/contact"
              className="text-center text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
            >
              Request appointment
            </Link>
          </div>
        ) : (
          <>
            <PrimaryButton
              type="button"
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="w-full rounded-sm px-6 py-4 text-[0.68rem] uppercase tracking-[0.24em] hover:translate-y-0"
            >
              {isSoldOut
                ? "Sold out"
                : added
                  ? "Added to bag"
                  : "Add to bag"}
            </PrimaryButton>
            <Link
              href="/contact"
              className="mt-4 inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
            >
              Prefer to see it in person? Book a visit
            </Link>
          </>
        )}
      </div>

      {product.source === "shopify" ? (
        <p className="mt-8 text-xs leading-relaxed text-site-secondary">
          Checkout is completed securely through Shopify.
        </p>
      ) : null}
    </div>
  );
}
