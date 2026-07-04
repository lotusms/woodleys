"use client";

import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useCart } from "@/context/CartContext";
import { orderTotal, shippingForSubtotal } from "@/lib/checkout";
import { formatUsd } from "@/lib/money";

function lineImageSrc(line) {
  if (!line?.image) return null;
  if (typeof line.image === "string") return line.image;
  return line.image.src ?? null;
}

function lineImageAlt(line) {
  if (!line?.image || typeof line.image === "string") {
    return line?.title ?? "Product";
  }
  return line.image.alt ?? line.title ?? "Product";
}

export default function CartPageContent() {
  const { ready, lines, subtotalUsd, setQuantity, removeLine } = useCart();

  if (!ready) {
    return (
      <PageLayout eyebrow="Shopping" title="Your cart">
        <p className="text-site-secondary">Loading cart…</p>
      </PageLayout>
    );
  }

  if (lines.length === 0) {
    return (
      <PageLayout
        eyebrow="Shopping"
        title="Your cart"
        subtitle="Your cart is empty."
      >
        <PrimaryButton href="/shop-all">Browse catalog</PrimaryButton>
      </PageLayout>
    );
  }

  const shippingUsd = shippingForSubtotal(subtotalUsd, lines);
  const totalUsd = orderTotal(subtotalUsd, lines);
  const itemCount = lines.reduce((count, line) => count + line.quantity, 0);

  return (
    <PageLayout
      eyebrow="Shopping"
      title="Your cart"
      subtitle={`${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_min(20rem,100%)] lg:items-start">
        <ul className="space-y-4" role="list">
          {lines.map((line) => {
            const imageSrc = lineImageSrc(line);
            const productHref = line.slug ? `/products/${line.slug}` : "/shop-all";

            return (
              <li
                key={line.lineKey}
                className="flex gap-4 rounded-sm border border-stone-200/80 bg-white p-4 sm:gap-5 sm:p-5"
              >
                <Link
                  href={productHref}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm border border-stone-200/80 bg-champagne/40 sm:h-28 sm:w-24"
                >
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={lineImageAlt(line)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs text-site-secondary">
                      No image
                    </span>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    href={productHref}
                    className="font-serif text-lg text-site-fg transition hover:text-warm-gold-dark sm:text-xl"
                  >
                    {line.title}
                  </Link>
                  <p className="mt-2 text-sm tabular-nums text-site-secondary">
                    {formatUsd(line.priceUsd)} each
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-site-secondary">
                      Qty
                      <input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(event) =>
                          setQuantity(line.lineKey, event.target.value)
                        }
                        className="w-16 rounded-sm border border-stone-300/80 bg-ivory px-2 py-1.5 text-center text-sm tabular-nums text-site-fg focus:border-warm-gold focus:outline-none focus:ring-1 focus:ring-warm-gold/40"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeLine(line.lineKey)}
                      className="text-xs uppercase tracking-[0.2em] text-site-secondary underline decoration-stone-300 underline-offset-4 transition hover:text-warm-gold-dark"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="hidden shrink-0 text-sm font-semibold tabular-nums text-site-fg sm:block">
                  {formatUsd(line.priceUsd * line.quantity)}
                </p>
              </li>
            );
          })}
        </ul>

        <aside className="h-fit rounded-sm border border-stone-200/80 bg-white p-6 sm:p-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
            Order summary
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-site-secondary">Subtotal</dt>
              <dd className="tabular-nums text-site-fg">{formatUsd(subtotalUsd)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-site-secondary">Shipping</dt>
              <dd className="tabular-nums text-site-fg">
                {shippingUsd === 0 ? "Complimentary" : formatUsd(shippingUsd)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-stone-200/80 pt-4 text-base font-semibold text-site-fg">
              <dt>Total</dt>
              <dd className="tabular-nums text-warm-gold-dark">{formatUsd(totalUsd)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-3">
            <PrimaryButton href="/checkout" className="w-full justify-center">
              Continue to checkout
            </PrimaryButton>
            <SecondaryButton href="/shop-all" className="w-full justify-center">
              Continue shopping
            </SecondaryButton>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
