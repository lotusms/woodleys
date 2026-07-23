"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import * as overlayChrome from "@/lib/overlayChrome";

/**
 * @typedef {{
 *   configured: boolean;
 *   environment: string;
 *   sdkUrl: string;
 *   publicKey: string;
 *   merchantId: string;
 * }} CloverBrowserConfig
 */

/**
 * Load the Clover iframe SDK once per page.
 * @param {string} sdkUrl
 * @returns {Promise<any>}
 */
function loadCloverSdk(sdkUrl) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Clover SDK requires a browser."));
  }
  const existingCtor = /** @type {any} */ (window).Clover;
  if (existingCtor) {
    return Promise.resolve(existingCtor);
  }

  const existing = document.querySelector(`script[data-clover-sdk="true"]`);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => {
        const ctor = /** @type {any} */ (window).Clover;
        if (ctor) resolve(ctor);
        else reject(new Error("Clover SDK failed to load."));
      });
      existing.addEventListener("error", () =>
        reject(new Error("Clover SDK failed to load.")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = sdkUrl;
    script.async = true;
    script.dataset.cloverSdk = "true";
    script.onload = () => {
      const ctor = /** @type {any} */ (window).Clover;
      if (ctor) resolve(ctor);
      else reject(new Error("Clover SDK failed to load."));
    };
    script.onerror = () => reject(new Error("Clover SDK failed to load."));
    document.body.appendChild(script);
  });
}

const FIELD_STYLES = {
  input: {
    fontSize: "16px",
    fontFamily: "ui-sans-serif, system-ui, sans-serif",
    fontWeight: "400",
    color: "#1a2e26",
    backgroundColor: "transparent",
  },
};

/**
 * @param {{
 *   disabled?: boolean;
 *   buildOrder: () => object;
 *   onBusy?: (busy: boolean) => void;
 *   onError?: (message: string) => void;
 *   onPaid: (data: {
 *     order: object;
 *     payment: object;
 *     mode: string;
 *     printfulOrderId: string | null;
 *     printfulStatus: string | null;
 *     email?: object;
 *   }) => void;
 * }} props
 */
export default function CloverCheckoutForm({
  disabled = false,
  buildOrder,
  onBusy,
  onError,
  onPaid,
}) {
  const { light } = useOverlayChrome();
  const cloverRef = useRef(/** @type {any} */ (null));
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    number: "",
    date: "",
    cvv: "",
    postal: "",
  });
  const [initError, setInitError] = useState("");

  useEffect(() => {
    let cancelled = false;
    /** @type {Array<{ destroy?: () => void }>} */
    const mounted = [];

    (async () => {
      try {
        const res = await fetch("/api/clover/charge");
        const config = /** @type {CloverBrowserConfig} */ (
          await res.json().catch(() => ({}))
        );
        if (!res.ok || !config?.configured) {
          throw new Error(
            config?.error || "Card payments are not configured yet.",
          );
        }

        const CloverCtor = await loadCloverSdk(config.sdkUrl);
        if (cancelled) return;

        const clover = new CloverCtor(config.publicKey, {
          merchantId: config.merchantId,
        });
        cloverRef.current = clover;
        const elements = clover.elements();

        const cardNumber = elements.create("CARD_NUMBER", FIELD_STYLES);
        const cardDate = elements.create("CARD_DATE", FIELD_STYLES);
        const cardCvv = elements.create("CARD_CVV", FIELD_STYLES);
        const cardPostal = elements.create("CARD_POSTAL_CODE", FIELD_STYLES);

        cardNumber.mount("#clover-card-number");
        cardDate.mount("#clover-card-date");
        cardCvv.mount("#clover-card-cvv");
        cardPostal.mount("#clover-card-postal");
        mounted.push(cardNumber, cardDate, cardCvv, cardPostal);

        const syncErrors = (event) => {
          const errors = event?.CARD_NUMBER
            ? event
            : event?.errors
              ? event.errors
              : null;
          if (!errors || typeof errors !== "object") return;
          setFieldErrors({
            number: errors.CARD_NUMBER?.error || "",
            date: errors.CARD_DATE?.error || "",
            cvv: errors.CARD_CVV?.error || "",
            postal: errors.CARD_POSTAL_CODE?.error || "",
          });
        };

        for (const el of [cardNumber, cardDate, cardCvv, cardPostal]) {
          el.addEventListener?.("change", syncErrors);
          el.addEventListener?.("blur", syncErrors);
        }

        if (!cancelled) {
          setReady(true);
          setInitError("");
        }
      } catch (e) {
        if (!cancelled) {
          setInitError(
            e instanceof Error
              ? e.message
              : "Could not load secure card form.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
      for (const el of mounted) {
        try {
          el.destroy?.();
        } catch {
          /* ignore */
        }
      }
      cloverRef.current = null;
    };
  }, []);

  const handlePay = useCallback(async () => {
    onError?.("");
    let order;
    try {
      order = buildOrder();
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Check your details and try again.";
      onError?.(msg);
      return;
    }

    const clover = cloverRef.current;
    if (!clover?.createToken) {
      onError?.("Card form is still loading. Try again in a moment.");
      return;
    }

    setPaying(true);
    onBusy?.(true);
    try {
      const result = await clover.createToken();
      if (result?.errors) {
        const messages = Object.values(result.errors).filter(Boolean);
        setFieldErrors({
          number: result.errors.CARD_NUMBER || "",
          date: result.errors.CARD_DATE || "",
          cvv: result.errors.CARD_CVV || "",
          postal: result.errors.CARD_POSTAL_CODE || "",
        });
        throw new Error(
          messages[0] || "Check your card details and try again.",
        );
      }
      const source = result?.token;
      if (!source || typeof source !== "string") {
        throw new Error("Could not tokenize card. Please try again.");
      }

      const response = await fetch("/api/clover/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, order }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "Payment could not be completed.");
      }

      await Promise.resolve(
        onPaid({
          order,
          payment: data.payment,
          mode: data.mode,
          printfulOrderId: data.printfulOrderId ?? null,
          printfulStatus: data.printfulStatus ?? null,
          email: data.email,
        }),
      );
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Payment could not be completed.";
      onError?.(msg);
    } finally {
      setPaying(false);
      onBusy?.(false);
    }
  }, [buildOrder, onBusy, onError, onPaid]);

  const fieldShell = `min-h-12 rounded-xl border px-3 py-2 ${
    light
      ? "border-stone-300 bg-white"
      : "border-amber-400/25 bg-[#0b0e14]/80"
  }`;

  if (initError) {
    return (
      <div className="mt-6 space-y-4">
        <p className={overlayChrome.checkoutSubmitError(light)} role="alert">
          {initError}
        </p>
        <PrimaryButton href="/contact" className="w-full justify-center">
          Contact us to complete order
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-amber-700/90 dark:text-amber-300/90">
        Pay with card
      </p>
      <p className={`text-xs leading-relaxed ${overlayChrome.pageMutedText(light)}`}>
        Your card details are encrypted and processed securely by Clover. We never
        store your full card number.
      </p>

      <form
        id="clover-payment-form"
        className={`space-y-4 rounded-2xl border p-4 sm:p-5 ${
          light
            ? "border-stone-200 bg-stone-50/80"
            : "border-amber-400/20 bg-[#0b0e14]/80 ring-1 ring-white/5"
        }`}
        onSubmit={(e) => {
          e.preventDefault();
          if (!disabled && !paying && ready) void handlePay();
        }}
      >
        <div>
          <label
            className={`mb-1.5 block text-xs font-medium uppercase tracking-wider ${overlayChrome.checkoutLabelUppercase(light)}`}
            htmlFor="clover-card-number"
          >
            Card number
          </label>
          <div id="clover-card-number" className={fieldShell} />
          {fieldErrors.number ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {fieldErrors.number}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              className={`mb-1.5 block text-xs font-medium uppercase tracking-wider ${overlayChrome.checkoutLabelUppercase(light)}`}
              htmlFor="clover-card-date"
            >
              Exp.
            </label>
            <div id="clover-card-date" className={fieldShell} />
            {fieldErrors.date ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {fieldErrors.date}
              </p>
            ) : null}
          </div>
          <div>
            <label
              className={`mb-1.5 block text-xs font-medium uppercase tracking-wider ${overlayChrome.checkoutLabelUppercase(light)}`}
              htmlFor="clover-card-cvv"
            >
              CVV
            </label>
            <div id="clover-card-cvv" className={fieldShell} />
            {fieldErrors.cvv ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {fieldErrors.cvv}
              </p>
            ) : null}
          </div>
          <div>
            <label
              className={`mb-1.5 block text-xs font-medium uppercase tracking-wider ${overlayChrome.checkoutLabelUppercase(light)}`}
              htmlFor="clover-card-postal"
            >
              ZIP
            </label>
            <div id="clover-card-postal" className={fieldShell} />
            {fieldErrors.postal ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {fieldErrors.postal}
              </p>
            ) : null}
          </div>
        </div>

        <PrimaryButton
          type="submit"
          disabled={disabled || paying || !ready}
          className="w-full ring-white/20"
        >
          {!ready ? "Loading secure form…" : paying ? "Processing…" : "Pay now"}
        </PrimaryButton>
      </form>
    </div>
  );
}
