"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AddressLine1Autocomplete from "@/components/checkout/AddressLine1Autocomplete";
import Card from "@/components/ui/Card";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import {
  buildCheckoutOrder,
  emptyCheckoutForm,
  validateCheckoutForm,
} from "@/lib/build-checkout-order";
import {
  cartIsLocalOnly,
  cartRequiresShopifyCheckout,
} from "@/lib/cart-checkout";
import { CHECKOUT_COUNTRY_OPTIONS } from "@/lib/checkout-countries";
import {
  ORDER_EMAIL_STATUS_KEY,
  ORDER_STORAGE_KEY,
  orderTotal,
  shippingForSubtotal,
} from "@/lib/checkout";
import { formatUsd } from "@/lib/money";
import * as overlayChrome from "@/lib/overlayChrome";

const CheckoutAuthSection = dynamic(
  () => import("@/components/checkout/CheckoutAuthSection"),
  { ssr: false },
);

const CheckoutPayPalSection = dynamic(
  () => import("@/components/checkout/CheckoutPayPalSection"),
  { ssr: false },
);

/**
 * @param {{
 *   variant?: "page" | "drawer";
 *   onBackToCart?: () => void;
 *   onComplete?: () => void;
 *   skipShopifyRedirect?: boolean;
 * }} props
 */
export default function CheckoutFlow({
  variant = "page",
  onBackToCart,
  onComplete,
  skipShopifyRedirect = false,
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { ready, lines, subtotalUsd, clearCart, openCart } = useCart();
  const { light } = useOverlayChrome();
  const [form, setForm] = useState(emptyCheckoutForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [payBusy, setPayBusy] = useState(false);
  const [redirectingShopify, setRedirectingShopify] = useState(false);
  const idPrefix = variant === "drawer" ? "drawer-checkout" : "checkout";

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
    if (skipShopifyRedirect || !ready || !hasShopifyLines || mixedCart) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines }),
        });
        const data = await res.json().catch(() => ({}));
        if (
          cancelled ||
          !res.ok ||
          !data?.ok ||
          data.mode !== "shopify" ||
          !data.redirectUrl
        ) {
          return;
        }
        setRedirectingShopify(true);
        window.location.assign(data.redirectUrl);
      } catch (e) {
        console.error("[checkout] Shopify redirect:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [skipShopifyRedirect, ready, hasShopifyLines, mixedCart, lines]);

  useEffect(() => {
    if (!user?.email) return;
    setForm((prev) => ({
      ...prev,
      email: prev.email || user.email || "",
    }));
  }, [user?.email]);

  const shippingUsd = shippingForSubtotal(subtotalUsd, lines);
  const totalUsd = orderTotal(subtotalUsd, lines);
  const formInvalid = useMemo(
    () => Object.keys(validateCheckoutForm(form)).length > 0,
    [form],
  );
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();

  const patchForm = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setFieldErrors({});
  }, []);

  const buildOrder = useCallback(() => {
    setSubmitError("");
    try {
      const order = buildCheckoutOrder({ form, cartLines: lines });
      setFieldErrors({});
      return order;
    } catch (error) {
      if (error && typeof error === "object" && "fieldErrors" in error) {
        setFieldErrors(error.fieldErrors ?? {});
      }
      throw error;
    }
  }, [form, lines]);

  const handlePaid = useCallback(
    async ({ order, payment, email }) => {
      const savedOrder = {
        ...order,
        payment,
        checkoutUid: user?.uid ?? null,
        checkoutAsGuest: !user?.uid,
        fulfillment: {
          provider: "local",
          printfulOrderId: null,
          printfulStatus: null,
        },
      };

      try {
        const { saveOrderToFirestore } = await import("@/lib/orders-store");
        await saveOrderToFirestore(savedOrder);
      } catch {
        /* checkout can still complete if Firestore is temporarily unavailable */
      }

      try {
        sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(savedOrder));
        if (email) {
          sessionStorage.setItem(ORDER_EMAIL_STATUS_KEY, JSON.stringify(email));
        }
      } catch {
        /* ignore quota */
      }

      clearCart();
      onComplete?.();
      router.push(`/checkout/thank-you?ref=${encodeURIComponent(order.id)}`);
    },
    [clearCart, onComplete, router, user?.uid],
  );

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function backToCart() {
    if (onBackToCart) {
      onBackToCart();
      return;
    }
    openCart();
  }

  function statusMessage(message) {
    return (
      <p className={variant === "drawer" ? "text-sm text-site-secondary" : overlayChrome.pageMutedText(light)}>
        {message}
      </p>
    );
  }

  if (!ready) {
    return statusMessage("Loading checkout…");
  }

  if (lines.length === 0) {
    return (
      <div className="space-y-4">
        <p className="font-serif text-2xl text-site-fg">Your cart is empty</p>
        <p className="text-sm text-site-secondary">Add items before checking out.</p>
        {variant === "drawer" ? (
          <PrimaryButton type="button" onClick={backToCart}>
            Back to cart
          </PrimaryButton>
        ) : (
          <PrimaryButton href="/shop-all">Browse catalog</PrimaryButton>
        )}
      </div>
    );
  }

  if (mixedCart) {
    return (
      <div className="space-y-4">
        <p className="font-serif text-2xl text-site-fg">Separate checkout required</p>
        <p className="text-sm leading-relaxed text-site-secondary">
          Your cart mixes items sold here with items sold through Shopify. Please
          check out each group separately.
        </p>
        <div className="flex flex-wrap gap-3">
          <PrimaryButton type="button" onClick={backToCart}>
            Review cart
          </PrimaryButton>
          {variant === "page" ? (
            <SecondaryButton href="/shop-all">Continue shopping</SecondaryButton>
          ) : null}
        </div>
      </div>
    );
  }

  if (redirectingShopify || (hasShopifyLines && !mixedCart)) {
    return statusMessage("Opening secure Shopify checkout…");
  }

  if (!localOnlyCart) {
    return (
      <div className="space-y-4">
        <p className="font-serif text-2xl text-site-fg">Checkout unavailable</p>
        <PrimaryButton type="button" onClick={backToCart}>
          Back to cart
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CheckoutAuthSection onApplyPrefill={patchForm} />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_min(22rem,100%)] xl:items-start">
        <Card variant="inset" className="w-full" title="Contact & shipping" titleTag="h2">
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-email`} className={overlayChrome.formFieldLabel(light)}>
                Email
              </label>
              <input
                id={`${idPrefix}-email`}
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
                aria-invalid={Boolean(fieldErrors.email)}
              />
              {fieldErrors.email ? (
                <p className={overlayChrome.checkoutInlineError(light)}>{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor={`${idPrefix}-phone`} className={overlayChrome.formFieldLabel(light)}>
                Phone (optional)
              </label>
              <input
                id={`${idPrefix}-phone`}
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
              />
            </div>

            <div>
              <label htmlFor={`${idPrefix}-fullName`} className={overlayChrome.formFieldLabel(light)}>
                Full name
              </label>
              <input
                id={`${idPrefix}-fullName`}
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
                aria-invalid={Boolean(fieldErrors.fullName)}
              />
              {fieldErrors.fullName ? (
                <p className={overlayChrome.checkoutInlineError(light)}>{fieldErrors.fullName}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <AddressLine1Autocomplete
                label="Address line 1"
                value={form.address1}
                onChange={(value) => updateField("address1", value)}
                country={form.country}
                inputClassName={overlayChrome.checkoutInputBase(light)}
                onSelectSuggestion={(item) => {
                  patchForm({
                    address1: item.address1 ?? item.label ?? form.address1,
                    city: item.city ?? form.city,
                    state: item.state ?? form.state,
                    postalCode: item.postalCode ?? form.postalCode,
                    country: item.country ?? form.country,
                  });
                }}
                aria-invalid={Boolean(fieldErrors.address1)}
                errorMessage={fieldErrors.address1}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-address2`} className={overlayChrome.formFieldLabel(light)}>
                Address line 2 (optional)
              </label>
              <input
                id={`${idPrefix}-address2`}
                type="text"
                autoComplete="address-line2"
                value={form.address2}
                onChange={(e) => updateField("address2", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
              />
            </div>

            <div>
              <label htmlFor={`${idPrefix}-city`} className={overlayChrome.formFieldLabel(light)}>
                City
              </label>
              <input
                id={`${idPrefix}-city`}
                type="text"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
                aria-invalid={Boolean(fieldErrors.city)}
              />
              {fieldErrors.city ? (
                <p className={overlayChrome.checkoutInlineError(light)}>{fieldErrors.city}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor={`${idPrefix}-state`} className={overlayChrome.formFieldLabel(light)}>
                State / province
              </label>
              <input
                id={`${idPrefix}-state`}
                type="text"
                autoComplete="address-level1"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
                aria-invalid={Boolean(fieldErrors.state)}
              />
              {fieldErrors.state ? (
                <p className={overlayChrome.checkoutInlineError(light)}>{fieldErrors.state}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor={`${idPrefix}-postal`} className={overlayChrome.formFieldLabel(light)}>
                Postal code
              </label>
              <input
                id={`${idPrefix}-postal`}
                type="text"
                autoComplete="postal-code"
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
                aria-invalid={Boolean(fieldErrors.postalCode)}
              />
              {fieldErrors.postalCode ? (
                <p className={overlayChrome.checkoutInlineError(light)}>{fieldErrors.postalCode}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor={`${idPrefix}-country`} className={overlayChrome.formFieldLabel(light)}>
                Country
              </label>
              <select
                id={`${idPrefix}-country`}
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
              >
                {CHECKOUT_COUNTRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${idPrefix}-notes`} className={overlayChrome.formFieldLabel(light)}>
                Order notes (optional)
              </label>
              <textarea
                id={`${idPrefix}-notes`}
                rows={3}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className={overlayChrome.checkoutInputBase(light)}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card variant="inset" className="w-full" title="Order summary" titleTag="h2">
            <ul className="mt-4 space-y-3 text-sm">
              {lines.map((line) => (
                <li
                  key={line.lineKey}
                  className={`flex justify-between gap-4 border-b pb-3 last:border-0 last:pb-0 ${overlayChrome.checkoutSummaryBorder(light)}`}
                >
                  <span className={overlayChrome.checkoutOrderLine(light)}>
                    {line.title}{" "}
                    <span className={overlayChrome.checkoutOrderQty(light)}>
                      ×{line.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatUsd(line.priceUsd * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className={`mt-6 space-y-2 text-sm ${overlayChrome.checkoutSummaryBorder(light)} pt-6`}>
              <div className="flex justify-between">
                <dt className={overlayChrome.checkoutSummaryMuted(light)}>Subtotal</dt>
                <dd className="tabular-nums">{formatUsd(subtotalUsd)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className={overlayChrome.checkoutSummaryMuted(light)}>Shipping</dt>
                <dd className="tabular-nums">
                  {shippingUsd === 0 ? "Complimentary" : formatUsd(shippingUsd)}
                </dd>
              </div>
              <div
                className={`flex justify-between border-t pt-4 text-base font-semibold ${overlayChrome.checkoutSummaryTotalBorder(light)}`}
              >
                <dt>Total</dt>
                <dd className="tabular-nums text-warm-gold-dark">{formatUsd(totalUsd)}</dd>
              </div>
            </dl>
          </Card>

          <Card variant="inset" className="w-full" title="Payment" titleTag="h2">
            {submitError ? (
              <p className={overlayChrome.checkoutSubmitError(light)} role="alert">
                {submitError}
              </p>
            ) : null}

            {paypalClientId ? (
              <CheckoutPayPalSection
                disabled={payBusy || formInvalid}
                buildOrder={buildOrder}
                onBusy={setPayBusy}
                onError={setSubmitError}
                onPaid={handlePaid}
              />
            ) : (
              <div className="mt-4 space-y-4">
                <p className={overlayChrome.pageMutedText(light)}>
                  Online payment is not configured yet. Save your details and contact us to
                  complete this order.
                </p>
                <PrimaryButton href="/contact" className="w-full justify-center">
                  Contact us to complete order
                </PrimaryButton>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
