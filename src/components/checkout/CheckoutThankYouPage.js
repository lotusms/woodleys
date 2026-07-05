"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { RiAlertLine, RiDownloadLine, RiMailLine } from "react-icons/ri";
import PageLayout from "@/components/PageLayout";
import Card from "@/components/ui/Card";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useAuth } from "@/context/AuthContext";
import { formatUsd } from "@/lib/money";
import { EMPTY_VALUE_LABEL } from "@/lib/prose";
import { ORDER_EMAIL_STATUS_KEY, ORDER_STORAGE_KEY } from "@/lib/checkout";
import {
  getOrderTransactionId,
  getPaymentMethodLabel,
} from "@/lib/order-receipt";
import { downloadOrderReceiptPdf } from "@/lib/order-receipt-pdf";
import { getSampleThankYouOrder } from "@/lib/thank-you-sample-data";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import * as overlayChrome from "@/lib/overlayChrome";
import { isLightThemeId } from "@/theme";

/**
 * @param {Record<string, unknown> | null | undefined} order
 * @param {{ uid?: string } | null | undefined} user
 * @param {{ status?: string; guest?: boolean }} userAccount
 */
function canShowProfileLink(order, user, userAccount) {
  if (order?.checkoutAsGuest === true) return false;
  if (typeof order?.checkoutUid === "string" && order.checkoutUid) return true;
  return Boolean(
    user?.uid &&
      userAccount.status === "ready" &&
      userAccount.guest !== true,
  );
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const { user, userAccount } = useAuth();
  const themeId = useDocumentThemeId();
  const lightSurface = isLightThemeId(themeId);
  const ref = searchParams.get("ref");
  const [emailNotice, setEmailNotice] = useState(null);
  const [order, setOrder] = useState(null);
  const [orderLoaded, setOrderLoaded] = useState(false);
  const [emailState, setEmailState] = useState({
    loading: false,
    message: "",
    error: "",
  });
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_EMAIL_STATUS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      sessionStorage.removeItem(ORDER_EMAIL_STATUS_KEY);
      if (parsed && typeof parsed === "object") {
        if (parsed.ok === false) setEmailNotice({ kind: "error", ...parsed });
        else if (parsed.buyerReceiptViaSeller)
          setEmailNotice({ kind: "forward", ...parsed });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (ref && parsed.id === ref) {
          setOrder(parsed);
          return;
        }
        if (!ref && parsed.id) {
          setOrder(parsed);
          return;
        }
      }
      setOrder(getSampleThankYouOrder());
    } catch {
      setOrder(getSampleThankYouOrder());
    } finally {
      setOrderLoaded(true);
    }
  }, [ref]);

  const showProfileLink = useMemo(
    () => canShowProfileLink(order, user, userAccount),
    [order, user, userAccount],
  );

  const transactionId = useMemo(
    () => (order ? getOrderTransactionId(order) : ""),
    [order],
  );

  async function handleEmailReceipt() {
    if (!order) return;
    setEmailState({ loading: true, message: "", error: "" });
    try {
      const res = await fetch("/api/orders/send-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order,
          payment: order.payment,
          fulfillment: order.fulfillment,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Could not send receipt email");
      }
      setEmailState({
        loading: false,
        message: `Receipt emailed to ${order.email}.`,
        error: "",
      });
    } catch (e) {
      setEmailState({
        loading: false,
        message: "",
        error: e instanceof Error ? e.message : "Could not send receipt email",
      });
    }
  }

  async function handleDownloadPdf() {
    if (!order) return;
    setPdfBusy(true);
    setPdfError("");
    try {
      await downloadOrderReceiptPdf(order);
    } catch (e) {
      setPdfError(
        e instanceof Error ? e.message : "Could not generate PDF receipt",
      );
    } finally {
      setPdfBusy(false);
    }
  }

  if (!orderLoaded) {
    return (
      <PageLayout eyebrow="Order" title="Loading…" width="wide">
        <p className="text-stone-400">Loading order…</p>
      </PageLayout>
    );
  }

  if (!order) {
    return (
      <PageLayout eyebrow="Order" title="Loading…" width="wide">
        <p className="text-stone-400">Loading order…</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      eyebrow="Confirmed"
      title="Thank you"
      subtitle="Your payment was successful and your order is recorded."
      width="wide"
    >
      {emailNotice ? (
        <div
          className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
            emailNotice.kind === "forward"
              ? "border-sky-400/35 bg-sky-950/35 text-sky-100/95"
              : "border-amber-400/35 bg-amber-950/40 text-amber-100/95"
          }`}
          role="status"
        >
          {emailNotice.kind === "forward" ? (
            <>
              <p className="font-medium text-sky-200">
                Confirmation email may arrive from the shop instead of automatically to you.
              </p>
              <p className="mt-1 text-sky-100/85">
                Your mail provider may have blocked our receipt. We sent a full copy to the studio
                to forward to you. Also check your spam folder. Your order is still confirmed below.
              </p>
            </>
          ) : (
            <>
              <p className="font-medium text-amber-200">
                Confirmation email could not be sent automatically.
              </p>
              <p className="mt-1 text-amber-100/85">
                {emailNotice.skipped && emailNotice.reason === "smtp_not_configured"
                  ? "The shop’s mail settings are not configured on this server (for example on Vercel, add the same SMTP variables you use locally)."
                  : "You can still use the order number on this page for your records. If you need a receipt, contact us with your order number."}
              </p>
            </>
          )}
        </div>
      ) : null}

      <div
        role="alert"
        className={`mb-6 rounded-2xl border px-4 py-4 sm:px-5 ${
          lightSurface
            ? "border-amber-500/35 bg-amber-50 text-amber-950"
            : "border-amber-400/35 bg-amber-950/35 text-amber-50"
        }`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="flex min-w-0 flex-1 gap-3">
            <RiAlertLine
              className={`mt-0.5 h-5 w-5 shrink-0 ${lightSurface ? "text-amber-700" : "text-amber-200"}`}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="font-semibold">Save your transaction ID</p>
              <p
                className={`mt-1 text-sm leading-relaxed ${lightSurface ? "text-amber-900/85" : "text-amber-50/85"}`}
              >
                Please write down or save your transaction ID somewhere safe. You may
                need it for order support, returns, or warranty service.
              </p>
              <p
                className={`mt-3 break-all font-mono text-base sm:text-lg ${lightSurface ? "text-amber-950" : "text-amber-100"}`}
              >
                {transactionId || EMPTY_VALUE_LABEL}
              </p>
            </div>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto lg:min-w-[15rem]">
            <SecondaryButton
              type="button"
              onClick={handleEmailReceipt}
              disabled={emailState.loading || pdfBusy}
              className={`w-full justify-center px-4 py-3 ${overlayChrome.secondaryButtonLightOutline(lightSurface)}`.trim()}
            >
              <RiMailLine className="h-4 w-4" aria-hidden />
              {emailState.loading ? "Sending email…" : "Email receipt to me"}
            </SecondaryButton>
            <SecondaryButton
              type="button"
              onClick={handleDownloadPdf}
              disabled={emailState.loading || pdfBusy}
              className={`w-full justify-center px-4 py-3 ${overlayChrome.secondaryButtonLightOutline(lightSurface)}`.trim()}
            >
              <RiDownloadLine className="h-4 w-4" aria-hidden />
              {pdfBusy ? "Preparing PDF…" : "Download PDF receipt"}
            </SecondaryButton>
          </div>
        </div>
      </div>

      {emailState.message ? (
        <p className="mb-6 text-sm text-emerald-700" role="status">
          {emailState.message}
        </p>
      ) : null}
      {emailState.error ? (
        <p className="mb-6 text-sm text-red-600" role="alert">
          {emailState.error}
        </p>
      ) : null}
      {pdfError ? (
        <p className="mb-6 text-sm text-red-600" role="alert">
          {pdfError}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 md:flex-row">
        <Card variant="inset" className="w-full" title="Order reference" titleTag="h4">
          <div className="mt-2 flex flex-col gap-1 font-mono text-sm text-site-fg/90 sm:text-base">
            <p>
              <span className="text-site-secondary">Order #:</span> {order.id}
            </p>
            <p>
              <span className="text-site-secondary">Order date:</span>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <span className="text-site-secondary">Transaction ID:</span>{" "}
              <span className="break-all text-site-primary">{transactionId || EMPTY_VALUE_LABEL}</span>
            </p>
            <p>
              <span className="text-site-secondary">Payment method:</span>{" "}
              {getPaymentMethodLabel(order.payment)}
            </p>
            {order.payment?.paypalOrderId ? (
              <p>
                <span className="text-site-secondary">PayPal order:</span>{" "}
                <span className="break-all">{order.payment.paypalOrderId}</span>
              </p>
            ) : null}
          </div>
        </Card>

        <Card variant="inset" className="w-full" title="Ship to" titleTag="h4">
          <div className="mt-2 flex flex-col">
            <p className="font-mono text-site-fg/90">{order.shippingAddress.fullName}</p>
            <p className="font-mono text-site-fg/90">
              {order.shippingAddress.address1}
              {order.shippingAddress.address2 ? (
                <>
                  <br />
                  {order.shippingAddress.address2}
                </>
              ) : null}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode} {order.shippingAddress.country}
            </p>
            <p className="font-mono text-site-fg/90">
              Email: <span className="text-site-primary">{order.email}</span>
            </p>
          </div>
        </Card>
      </div>

      <Card variant="inset" className="w-full" title="Items" titleTag="h4">
        <ul className="mt-4 space-y-3 text-sm">
          {order.lines.map((l) => (
            <li
              key={l.productId ?? `${l.title}-${l.quantity}`}
              className={`flex justify-between gap-4 border-b pb-3 last:border-0 last:pb-0 ${lightSurface ? "border-stone-300/45" : "border-site-fg/10"}`}
            >
              <span className={lightSurface ? "text-stone-800" : "text-site-fg/90"}>
                {l.title}{" "}
                <span className={overlayChrome.checkoutOrderQty(lightSurface)}>
                  ×{l.quantity}
                </span>
              </span>
              <span
                className={`shrink-0 tabular-nums ${lightSurface ? "text-stone-900" : "text-site-fg"}`}
              >
                {formatUsd(l.priceUsd * l.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl
          className={`mt-6 space-y-2 border-t pt-6 text-sm ${lightSurface ? "border-stone-300/55 text-stone-900" : "border-site-fg/15 text-site-fg"}`}
        >
          <div className="flex justify-between">
            <dt className={overlayChrome.checkoutSummaryMuted(lightSurface)}>Subtotal</dt>
            <dd className="tabular-nums">{formatUsd(order.subtotalUsd)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className={overlayChrome.checkoutSummaryMuted(lightSurface)}>Shipping</dt>
            <dd className="tabular-nums">
              {order.shippingUsd === 0 ? (
                <span className={overlayChrome.cartShippingComplimentary(lightSurface)}>
                  Complimentary
                </span>
              ) : (
                formatUsd(order.shippingUsd)
              )}
            </dd>
          </div>
          <div
            className={`flex justify-between border-t pt-4 text-base font-semibold text-site-primary ${lightSurface ? "border-stone-300/60" : "border-site-fg/15"}`}
          >
            <dt className={lightSurface ? "text-stone-900" : undefined}>Total</dt>
            <dd className="tabular-nums">{formatUsd(order.totalUsd)}</dd>
          </div>
        </dl>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          {showProfileLink ? (
            <PrimaryButton href="/account/profile" className="px-8">
              View your profile
            </PrimaryButton>
          ) : null}
          <SecondaryButton
            href="/contact"
            className={`px-2 py-3.5 ${overlayChrome.secondaryButtonLightOutline(lightSurface)}`.trim()}
          >
            Questions? Contact
          </SecondaryButton>
        </div>
        <PrimaryButton href="/shop" className="px-8">
          Continue shopping
        </PrimaryButton>
      </div>
    </PageLayout>
  );
}

export default function CheckoutThankYouPage() {
  return (
    <Suspense
      fallback={
        <PageLayout eyebrow="Order" title="Loading…" width="wide">
          <p className="text-stone-400">Loading order…</p>
        </PageLayout>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
