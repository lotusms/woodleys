"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Card from "@/components/ui/Card";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import { fetchOrderByIdForCurrentUser } from "@/lib/orders-queries";
import { getSampleOrderById } from "@/lib/orders-sample-data";
import { formatUsd } from "@/lib/money";
import { EMPTY_VALUE_LABEL } from "@/lib/prose";
import * as overlayChrome from "@/lib/overlayChrome";

function formatWhen(iso) {
  if (!iso) return EMPTY_VALUE_LABEL;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(iso);
  }
}

/**
 * @param {{
 *   open: boolean;
 *   orderId: string | null;
 *   onClose: () => void;
 *   demoMode?: boolean;
 * }} props
 */
export default function OrderDetailDialog({ open, orderId, onClose, demoMode = false }) {
  const { light } = useOverlayChrome();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !orderId) {
      setOrder(null);
      setError("");
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        if (demoMode) {
          const sample = getSampleOrderById(orderId);
          if (cancelled) return;
          if (!sample) {
            setOrder(null);
            setError("Order not found.");
          } else {
            setOrder(sample);
          }
          return;
        }

        const o = await fetchOrderByIdForCurrentUser(orderId);
        if (cancelled) return;
        if (!o) {
          setOrder(null);
          setError("Order not found or you do not have access.");
        } else {
          setOrder(o);
        }
      } catch (e) {
        if (!cancelled) {
          setOrder(null);
          setError(e instanceof Error ? e.message : "Could not load order.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, orderId, demoMode]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[200]">
      <DialogBackdrop transition className={overlayChrome.FAINT_BLUR_BACKDROP_CLASS} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`${overlayChrome.checkoutDialogModalPanel(light)} !max-w-3xl max-h-[min(94vh,960px)] overflow-y-auto !p-8 sm:!p-9`}
        >
          <DialogTitle className={`${overlayChrome.dialogTitleModal(light)} text-2xl sm:text-[1.65rem]`}>
            Order details
          </DialogTitle>

          {loading ? (
            <p className={`mt-6 text-sm ${overlayChrome.pageMutedText(light)}`}>
              Loading order…
            </p>
          ) : error ? (
            <p className={`mt-6 text-sm ${overlayChrome.authInlineError(light)}`} role="alert">
              {error}
            </p>
          ) : order ? (
            <div className="mt-6 space-y-5">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary">
                    Order ID
                  </dt>
                  <dd className="mt-1 font-mono text-sm text-site-fg">{order.id}</dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary">
                    Placed
                  </dt>
                  <dd className="mt-1 text-sm text-site-fg">
                    {formatWhen(order.createdAt)}
                  </dd>
                </div>
              </dl>

              {order.shippingAddress ? (
                <Card variant="inset" title="Shipping" titleTag="h3">
                  <address className="mt-3 text-sm not-italic leading-relaxed text-site-fg">
                    {order.shippingAddress.fullName ? (
                      <p>{order.shippingAddress.fullName}</p>
                    ) : null}
                    <p>
                      {order.shippingAddress.address1}
                      {order.shippingAddress.address2
                        ? `, ${order.shippingAddress.address2}`
                        : ""}
                    </p>
                    <p>
                      {order.shippingAddress.city}
                      {order.shippingAddress.state
                        ? `, ${order.shippingAddress.state}`
                        : ""}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                  </address>
                </Card>
              ) : null}

              <Card variant="inset" title="Items" titleTag="h3">
                <ul className="mt-4 divide-y divide-stone-200/80">
                  {Array.isArray(order.lines) && order.lines.length > 0 ? (
                    order.lines.map((line, i) => (
                      <li
                        key={`${line.slug ?? line.variantId ?? i}-${i}`}
                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        {line.image ? (
                          <img
                            src={line.image}
                            alt=""
                            className="h-16 w-16 shrink-0 rounded-lg border border-stone-200/80 object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 shrink-0 rounded-lg bg-champagne" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-site-fg">{line.title}</p>
                          <p className="mt-1 text-sm text-site-secondary">
                            Qty {line.quantity ?? 0} · {formatUsd(line.priceUsd ?? 0)} each
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold tabular-nums text-site-fg">
                          {formatUsd(
                            Number(line.priceUsd ?? 0) * Number(line.quantity ?? 0),
                          )}
                        </p>
                      </li>
                    ))
                  ) : (
                    <li className="py-2 text-sm text-site-secondary">No line items.</li>
                  )}
                </ul>
                <div className="mt-4 space-y-2 border-t border-stone-200/80 pt-4 text-sm">
                  <div className="flex justify-between text-site-secondary">
                    <span>Subtotal</span>
                    <span className="tabular-nums">{formatUsd(order.subtotalUsd ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-site-secondary">
                    <span>Shipping</span>
                    <span className="tabular-nums">{formatUsd(order.shippingUsd ?? 0)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-site-fg">
                    <span>Total</span>
                    <span className="tabular-nums">{formatUsd(order.totalUsd ?? 0)}</span>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}

          <div className="mt-8 flex justify-end">
            <SecondaryButton type="button" onClick={onClose}>
              Close
            </SecondaryButton>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
