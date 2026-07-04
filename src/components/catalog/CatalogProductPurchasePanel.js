"use client";

import Link from "next/link";
import { useState } from "react";
import ProductPrice from "@/components/catalog/ProductPrice";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { getProductChargeUsd } from "@/lib/catalog/product-pricing";

/**
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProductDetail;
 *   shopifyProductUrl?: string | null;
 * }} props
 */
export default function CatalogProductPurchasePanel({ product, shopifyProductUrl }) {
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
    <div className="rounded-sm border border-stone-200/80 bg-champagne/25 p-5 sm:p-6">
      <div className="text-warm-gold-dark">
        <ProductPrice
          product={product}
          layout="stacked"
          compareLabelClassName="text-base font-normal tabular-nums text-site-secondary"
          regularClassName="line-through decoration-site-secondary/40 tabular-nums text-site-secondary/60"
          singleClassName="text-3xl font-medium tabular-nums sm:text-4xl"
          saleClassName="text-3xl font-medium tabular-nums sm:text-4xl"
        />
      </div>

      {product.source === "mock" ? (
        <p className="mt-4 rounded-sm border border-stone-200/80 bg-white/70 px-4 py-3 text-sm text-site-secondary">
          Preview listing. Live inventory will appear here when your catalog database
          is connected.
        </p>
      ) : null}

      {isSoldOut ? (
        <p className="mt-4 text-sm text-site-secondary">Currently out of stock</p>
      ) : product.source === "local" && stockQty > 0 ? (
        <p className="mt-4 text-sm text-site-secondary">
          {stockQty === 1 ? "Only 1 left in stock" : `${stockQty} in stock`}
        </p>
      ) : null}

      {shopifyProductUrl ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryButton href={shopifyProductUrl} className="sm:min-w-[200px]">
            Buy on Shopify
          </PrimaryButton>
          <Link
            href="/contact"
            className="text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
          >
            Request appointment
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <label
                htmlFor="product-qty"
                className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-site-secondary"
              >
                Qty
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={isSoldOut || quantity <= 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold disabled:opacity-40"
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
                  disabled={isSoldOut}
                  onChange={(e) => {
                    const next = Number.parseInt(e.target.value, 10);
                    if (Number.isFinite(next)) {
                      setQuantity(Math.max(1, Math.min(maxQty, next)));
                    }
                  }}
                  className="w-14 rounded-full border border-stone-300/80 bg-white px-1 py-2 text-center text-sm tabular-nums text-site-fg focus:border-warm-gold focus:outline-none focus:ring-2 focus:ring-warm-gold/20"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  disabled={isSoldOut || quantity >= maxQty}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <PrimaryButton
              type="button"
              onClick={handleAddToCart}
              disabled={isSoldOut}
              className="min-w-[200px]"
            >
              {isSoldOut
                ? "Sold out"
                : added
                  ? "Added to cart"
                  : "Add to cart"}
            </PrimaryButton>
          </div>

          <Link
            href="/contact"
            className="mt-4 inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
          >
            Prefer to see it in person? Request an appointment
          </Link>
        </>
      )}
    </div>
  );
}
