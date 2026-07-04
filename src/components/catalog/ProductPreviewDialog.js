"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import ProductPrice from "@/components/catalog/ProductPrice";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { getProductChargeUsd } from "@/lib/catalog/product-pricing";
import { getProductImages } from "@/lib/catalog/product-images";
import {
  catalogPreviewDialogPanel,
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
  const [imageIndex, setImageIndex] = useState(0);

  const images = useMemo(() => getProductImages(product), [product]);
  const activeImage = images[imageIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;
  const hasPrevImage = hasMultipleImages && imageIndex > 0;
  const hasNextImage = hasMultipleImages && imageIndex < images.length - 1;
  const imagePositionLabel = hasMultipleImages
    ? `${imageIndex + 1} of ${images.length}`
    : "";

  const goPrevImage = useCallback(() => {
    if (hasPrevImage) setImageIndex((index) => index - 1);
  }, [hasPrevImage]);

  const goNextImage = useCallback(() => {
    if (hasNextImage) setImageIndex((index) => index + 1);
  }, [hasNextImage]);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setAdded(false);
      setImageIndex(0);
    }
  }, [open, product?.id]);

  useEffect(() => {
    if (!open || !hasMultipleImages) return;

    function onKeyDown(event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevImage();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNextImage();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, hasMultipleImages, goPrevImage, goNextImage]);

  if (!product) return null;

  const chargeUsd = getProductChargeUsd(product);
  const isSoldOut = !product.availableForSale;
  const productUrl = `/products/${product.handle}`;

  function handleAddToCart() {
    if (isSoldOut) return;
    const qty = Math.max(1, Math.min(99, quantity));
    addItem(
      {
        id: product.id,
        slug: product.handle,
        title: product.title,
        artist: "Woodley's Jewelers",
        priceUsd: chargeUsd,
        image: activeImage?.src ?? product.image?.src ?? "",
        originalImage: activeImage?.src ?? product.image?.src ?? "",
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
          className={`${catalogPreviewDialogPanel(true)} flex max-h-[min(92vh,44rem)] flex-col overflow-hidden`}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 rounded-full border border-stone-200/80 bg-white/90 p-2 text-site-secondary transition hover:border-warm-gold/40 hover:text-site-fg sm:right-4 sm:top-4"
            aria-label="Close preview"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden />
          </button>

          <div className="grid min-h-0 flex-1 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative min-h-[14rem] bg-champagne sm:min-h-[18rem] lg:min-h-0">
              {activeImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeImage.src}
                    alt={activeImage.alt || product.title}
                    className="h-full w-full object-cover"
                  />
                </>
              ) : (
                <div className="flex h-full min-h-[14rem] items-center justify-center text-xs uppercase tracking-[0.2em] text-site-secondary">
                  No image
                </div>
              )}

              {hasMultipleImages ? (
                <>
                  <button
                    type="button"
                    onClick={goPrevImage}
                    disabled={!hasPrevImage}
                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-stone-950/45 text-white backdrop-blur-sm transition hover:bg-stone-950/60 disabled:pointer-events-none disabled:opacity-30 sm:left-4"
                    aria-label="Previous photo"
                  >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={goNextImage}
                    disabled={!hasNextImage}
                    className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-stone-950/45 text-white backdrop-blur-sm transition hover:bg-stone-950/60 disabled:pointer-events-none disabled:opacity-30 sm:right-4"
                    aria-label="Next photo"
                  >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden />
                  </button>
                  <p className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/25 bg-stone-950/50 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                    {imagePositionLabel}
                  </p>
                </>
              ) : null}
            </div>

            <div className="flex min-h-0 flex-col px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-site-secondary">
                Quick preview
              </p>
              <DialogTitle className="mt-1.5 font-serif text-2xl font-medium leading-tight tracking-[-0.02em] text-site-fg sm:text-3xl">
                {product.title}
              </DialogTitle>

              <div className="mt-3 text-warm-gold-dark">
                <ProductPrice
                  product={product}
                  layout="stacked"
                  compareLabelClassName="text-sm font-normal tabular-nums text-site-secondary"
                  regularClassName="line-through decoration-site-secondary/40 tabular-nums text-site-secondary/60"
                  saleClassName="text-xl font-medium tabular-nums tracking-wide sm:text-2xl"
                  singleClassName="text-xl font-medium tabular-nums tracking-wide sm:text-2xl"
                />
              </div>

              {product.description ? (
                <p className="mt-4 max-h-[9rem] overflow-y-auto text-sm leading-relaxed text-site-secondary sm:max-h-[10.5rem] sm:text-[0.9375rem] sm:leading-7">
                  {product.description}
                </p>
              ) : null}

              {isSoldOut ? (
                <p className="mt-4 text-sm text-site-secondary">Currently sold out</p>
              ) : null}

              <div className="mt-auto flex flex-col gap-4 border-t border-stone-200/80 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
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

                <Link
                  href={productUrl}
                  className="inline-flex items-center gap-2 self-start text-sm font-medium text-warm-gold-dark underline-offset-4 transition hover:underline"
                  onClick={onClose}
                >
                  View full product page
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
