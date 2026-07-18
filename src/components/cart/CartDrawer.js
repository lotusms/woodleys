"use client";

import dynamic from "next/dynamic";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import PrimaryButton from "@/components/ui/PrimaryButton";
import CatalogImage from "@/components/ui/CatalogImage";
import { useCart } from "@/context/CartContext";
import {
  cartIsLocalOnly,
  cartRequiresShopifyCheckout,
} from "@/lib/cart-checkout";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import { lineImageAlt, lineImageSrc, productToCartPayload } from "@/lib/cart-line-helpers";
import { getProductChargeUsd } from "@/lib/catalog/product-pricing";
import { formatUsd } from "@/lib/money";
import * as overlayChrome from "@/lib/overlayChrome";

const CheckoutFlow = dynamic(
  () => import("@/components/checkout/CheckoutFlow"),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-site-secondary">Loading checkout…</p>
    ),
  },
);

/**
 * @param {{
 *   products: import("@/lib/catalog/product-types").CatalogProduct[];
 *   cartSlugs: Set<string>;
 *   onAdd: (product: import("@/lib/catalog/product-types").CatalogProduct) => void;
 *   onNavigate: () => void;
 * }} props
 */
function CartDrawerSuggestions({ products, cartSlugs, onAdd, onNavigate }) {
  const suggestions = products
    .filter((product) => product.availableForSale && !cartSlugs.has(product.handle))
    .slice(0, 4);

  if (suggestions.length === 0) return null;

  return (
    <aside className="flex min-h-0 flex-col border-b border-stone-200/80 bg-champagne/20 lg:w-[42%] lg:border-b-0 lg:border-r">
      <div className="shrink-0 px-5 py-5 sm:px-6 lg:px-8 lg:py-6">
        <h2 className="font-serif text-xl font-medium tracking-[-0.02em] text-site-fg sm:text-2xl">
          We think you would like
        </h2>
      </div>

      <ul
        className="flex min-h-0 flex-1 gap-4 overflow-x-auto px-5 pb-5 sm:px-6 lg:flex-col lg:gap-6 lg:overflow-y-auto lg:overflow-x-hidden lg:px-8 lg:pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
      >
        {suggestions.map((product) => {
          const imageSrc =
            typeof product.image === "string"
              ? product.image
              : product.image?.src;
          const priceUsd = Number(product.priceUsd ?? getProductChargeUsd(product));

          return (
            <li
              key={product.id}
              className="relative w-[min(72vw,14rem)] shrink-0 lg:w-full"
            >
              <Link
                href={`/products/${product.handle}`}
                onClick={onNavigate}
                className="block overflow-hidden bg-champagne"
              >
                {imageSrc ? (
                  <CatalogImage
                    src={imageSrc}
                    alt={
                      (typeof product.image === "object" && product.image?.alt) ||
                      product.title
                    }
                    width={320}
                    height={400}
                    sizes="224px"
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center text-xs uppercase tracking-[0.2em] text-site-secondary">
                    No image
                  </div>
                )}
              </Link>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/products/${product.handle}`}
                    onClick={onNavigate}
                    className="block font-serif text-base leading-tight text-site-fg transition hover:text-warm-gold-dark"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-1 text-sm tabular-nums text-site-secondary">
                    {formatUsd(priceUsd)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAdd(product)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold hover:text-warm-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                  aria-label={`Add ${product.title} to cart`}
                >
                  <ShoppingBagIcon className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default function CartDrawer() {
  const {
    ready,
    isOpen,
    closeCart,
    lines,
    subtotalUsd,
    setQuantity,
    removeLine,
    addItem,
  } = useCart();
  const { light } = useOverlayChrome();
  const [suggestions, setSuggestions] = useState([]);
  const [step, setStep] = useState("cart");
  const [checkoutError, setCheckoutError] = useState("");
  const [redirectingCheckout, setRedirectingCheckout] = useState(false);

  const cartSlugs = useMemo(
    () => new Set(lines.map((line) => line.slug).filter(Boolean)),
    [lines],
  );

  const hasShopifyLines = useMemo(
    () => cartRequiresShopifyCheckout(lines),
    [lines],
  );
  const hasLocalLines = useMemo(
    () => lines.some((line) => line.source !== "shopify" && !line.shopifyVariantId),
    [lines],
  );
  const mixedCart = hasShopifyLines && hasLocalLines;
  const localOnlyCart = cartIsLocalOnly(lines);

  useEffect(() => {
    if (isOpen) return undefined;
    setStep("cart");
    setCheckoutError("");
    setRedirectingCheckout(false);
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || lines.length === 0) return;
    let active = true;

    async function loadSuggestions() {
      try {
        const response = await fetch("/api/catalog/products");
        const data = await response.json();
        if (!active || !Array.isArray(data?.products)) return;
        setSuggestions(data.products);
      } catch {
        if (active) setSuggestions([]);
      }
    }

    loadSuggestions();
    return () => {
      active = false;
    };
  }, [isOpen, lines.length]);

  const hasSuggestions = suggestions.some(
    (product) => product.availableForSale && !cartSlugs.has(product.handle),
  );

  function handleNavigate() {
    closeCart();
  }

  function handleAddSuggestion(product) {
    addItem(productToCartPayload(product), 1);
  }

  async function handleSecureCheckout() {
    setCheckoutError("");

    if (!ready || lines.length === 0) return;

    if (mixedCart) {
      setCheckoutError(
        "Your cart mixes items sold here with items sold through Shopify. Please check out each group separately.",
      );
      return;
    }

    if (hasShopifyLines) {
      setRedirectingCheckout(true);
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data?.ok || !data.redirectUrl) {
          setCheckoutError(
            data?.message || "Could not open Shopify checkout. Please try again.",
          );
          setRedirectingCheckout(false);
          return;
        }
        closeCart();
        window.location.assign(data.redirectUrl);
      } catch {
        setCheckoutError("Could not open Shopify checkout. Please try again.");
        setRedirectingCheckout(false);
      }
      return;
    }

    if (localOnlyCart) {
      setStep("checkout");
    }
  }

  return (
    <Dialog open={isOpen} onClose={closeCart} className="relative z-[200]">
      <DialogBackdrop
        transition
        className={overlayChrome.FAINT_BLUR_BACKDROP_CLASS}
      />

      <div className="fixed inset-0 flex justify-end">
        <DialogPanel transition className={overlayChrome.cartDrawerPanel(light)}>
          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            {step === "cart" && hasSuggestions ? (
              <CartDrawerSuggestions
                products={suggestions}
                cartSlugs={cartSlugs}
                onAdd={handleAddSuggestion}
                onNavigate={handleNavigate}
              />
            ) : null}

            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-stone-200/80 px-5 py-4 sm:px-6 lg:px-8">
                {step === "checkout" ? (
                  <button
                    type="button"
                    onClick={() => setStep("cart")}
                    className="inline-flex items-center gap-2 font-serif text-xl font-medium tracking-[-0.02em] text-site-fg transition hover:text-warm-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark sm:text-2xl"
                  >
                    <ArrowLeftIcon className="h-5 w-5 shrink-0" aria-hidden />
                    Complete your order
                  </button>
                ) : (
                  <DialogTitle className="font-serif text-xl font-medium tracking-[-0.02em] text-site-fg sm:text-2xl">
                    Shopping cart
                  </DialogTitle>
                )}
                <button
                  type="button"
                  onClick={closeCart}
                  className="inline-flex h-10 w-10 items-center justify-center text-site-secondary transition hover:text-site-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                  aria-label="Close cart"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 lg:px-8">
                {step === "checkout" ? (
                  <CheckoutFlow
                    variant="drawer"
                    skipShopifyRedirect
                    onBackToCart={() => setStep("cart")}
                    onComplete={closeCart}
                  />
                ) : !ready ? (
                  <p className="text-sm text-site-secondary">Loading cart…</p>
                ) : lines.length === 0 ? (
                  <div className="py-8">
                    <p className="font-serif text-2xl text-site-fg">Your cart is empty</p>
                    <p className="mt-3 text-sm leading-relaxed text-site-secondary">
                      Browse the catalog and add pieces you would like to see in
                      person or take home today.
                    </p>
                    <PrimaryButton
                      href="/shop-all"
                      onClick={handleNavigate}
                      className="mt-6"
                    >
                      Browse catalog
                    </PrimaryButton>
                  </div>
                ) : (
                  <ul className="space-y-6" role="list">
                    {lines.map((line) => {
                      const imageSrc = lineImageSrc(line);
                      const productHref = line.slug
                        ? `/products/${line.slug}`
                        : "/shop-all";

                      return (
                        <li
                          key={line.lineKey}
                          className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 border-b border-stone-200/70 pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
                        >
                          <Link
                            href={productHref}
                            onClick={handleNavigate}
                            className="relative aspect-square overflow-hidden bg-champagne"
                          >
                            {imageSrc ? (
                              <CatalogImage
                                src={imageSrc}
                                alt={lineImageAlt(line)}
                                width={88}
                                height={88}
                                sizes="88px"
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </Link>

                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <Link
                                  href={productHref}
                                  onClick={handleNavigate}
                                  className="font-serif text-lg leading-tight text-site-fg transition hover:text-warm-gold-dark"
                                >
                                  {line.title}
                                </Link>
                                <p className="mt-2 text-sm tabular-nums text-site-secondary">
                                  {formatUsd(line.priceUsd)}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeLine(line.lineKey)}
                                className="shrink-0 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-site-secondary underline decoration-stone-300 underline-offset-4 transition hover:text-warm-gold-dark"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="mt-4 inline-flex items-center gap-3 border border-stone-300/80 bg-white px-2 py-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(line.lineKey, line.quantity - 1)
                                }
                                disabled={line.quantity <= 1}
                                className="flex h-8 w-8 items-center justify-center text-site-fg transition hover:text-warm-gold-dark disabled:opacity-35"
                                aria-label={`Decrease quantity of ${line.title}`}
                              >
                                −
                              </button>
                              <span className="min-w-[1.25rem] text-center text-sm tabular-nums text-site-fg">
                                {line.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(line.lineKey, line.quantity + 1)
                                }
                                className="flex h-8 w-8 items-center justify-center text-site-fg transition hover:text-warm-gold-dark"
                                aria-label={`Increase quantity of ${line.title}`}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {step === "cart" && lines.length > 0 ? (
                <div className="shrink-0 border-t border-stone-200/80 px-5 py-5 sm:px-6 lg:px-8 lg:py-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-site-secondary">Subtotal</span>
                    <span className="text-base font-medium tabular-nums text-site-fg">
                      {formatUsd(subtotalUsd)}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-site-secondary">
                    Free shipping on orders over $500. Under $500: $15 flat-rate
                    shipping per item. Taxes calculated at checkout.
                  </p>
                  {checkoutError ? (
                    <p className="mt-3 text-sm text-red-700" role="alert">
                      {checkoutError}
                    </p>
                  ) : null}
                  <PrimaryButton
                    type="button"
                    onClick={handleSecureCheckout}
                    disabled={redirectingCheckout}
                    className="mt-5 w-full rounded-sm px-6 py-4 text-[0.68rem] uppercase tracking-[0.24em] hover:translate-y-0"
                  >
                    {redirectingCheckout ? "Opening checkout…" : "Secure checkout"}
                  </PrimaryButton>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="mt-4 w-full text-center text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
