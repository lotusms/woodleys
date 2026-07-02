"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { formatUsd } from "@/lib/money";
import {
  catalogDialogPanel,
  FAINT_BLUR_BACKDROP_CLASS,
} from "@/lib/overlayChrome";

/**
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct | null;
 *   open: boolean;
 *   onClose: () => void;
 * }} props
 */
export default function ProductPreviewDialog({ product, open, onClose }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setAdded(false);
    }
  }, [open, product?.id]);

  if (!product) return null;

  const min = product.priceUsd;
  const max = product.maxPriceUsd;
  const hasRange = max > min && min > 0;
  const priceLabel = hasRange
    ? `${formatUsd(min)} – ${formatUsd(max)}`
    : formatUsd(min);
  const isSoldOut = !product.availableForSale;

  function handleAddToCart() {
    if (isSoldOut) return;
    const qty = Math.max(1, Math.min(99, quantity));
    addItem(
      {
        id: product.id,
        slug: product.handle,
        title: product.title,
        artist: "Woodley's Jewelers",
        priceUsd: min,
        image: product.image?.src ?? "",
        originalImage: product.image?.src ?? "",
        variantId: product.id,
        shippingIncluded: false,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[200]">
      <DialogBackdrop transition className={FAINT_BLUR_BACKDROP_CLASS} />
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
        <DialogPanel
          transition
          className={`${catalogDialogPanel(true)} flex max-h-[min(92vh,40rem)] flex-col overflow-hidden`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full border border-stone-200/80 bg-white/90 p-2 text-site-secondary transition hover:border-warm-gold/40 hover:text-site-fg"
            aria-label="Close preview"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden />
          </button>

          {product.image ? (
            <div className="relative h-[min(34vh,13.5rem)] w-full shrink-0 overflow-hidden bg-champagne sm:h-[min(36vh,14.5rem)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image.src}
                alt={product.image.alt}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-site-secondary">
              Preview
            </p>
            <DialogTitle className="mt-1.5 font-serif text-2xl font-medium leading-tight tracking-[-0.02em] text-site-fg sm:text-[1.65rem]">
              {product.title}
            </DialogTitle>

            <p className="mt-2 text-lg font-medium tabular-nums tracking-wide text-warm-gold-dark sm:text-xl">
              {priceLabel}
            </p>

            {product.description ? (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-site-secondary">
                {product.description}
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-stone-200/80 pt-4">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="preview-qty"
                  className="shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-site-secondary"
                >
                  Qty
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isSoldOut || quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    id="preview-qty"
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    disabled={isSoldOut}
                    onChange={(e) => {
                      const next = Number.parseInt(e.target.value, 10);
                      if (Number.isFinite(next)) {
                        setQuantity(Math.max(1, Math.min(99, next)));
                      }
                    }}
                    className="w-12 rounded-full border border-stone-300/80 bg-white px-1 py-1.5 text-center text-sm tabular-nums text-site-fg focus:border-warm-gold focus:outline-none focus:ring-2 focus:ring-warm-gold/20"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                    disabled={isSoldOut || quantity >= 99}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold disabled:opacity-40"
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
                className="shrink-0 px-5 py-3"
              >
                {isSoldOut
                  ? "Sold out"
                  : added
                    ? "Added to cart"
                    : "Add to cart"}
              </PrimaryButton>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
