"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { desktopNavItemClass } from "@/config";
import { formatUsd } from "@/lib/money";

/**
 * Cart control — always available; quantity announced accessibly.
 * @param {{ onNavigate?: () => void, variant?: "desktop" | "mobile" | "icon", className?: string }} props
 */
export default function NavCartLink({
  onNavigate,
  variant = "desktop",
  className = "",
}) {
  const { ready, itemCount, subtotalUsd, openCart } = useCart();
  const count = ready ? itemCount : 0;
  const ariaLabel =
    count === 0
      ? "Cart, empty"
      : `Cart, ${count} item${count === 1 ? "" : "s"}, ${formatUsd(subtotalUsd)} total`;

  function handleClick() {
    onNavigate?.();
    openCart();
  }

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`mobile-nav-item flex w-full items-center justify-between gap-3 border-b border-stone-200/80 py-4 text-left transition text-site-fg ${className}`.trim()}
      >
        <span className="flex items-center gap-3 font-serif text-2xl">
          <ShoppingBagIcon className="h-6 w-6 shrink-0" aria-hidden />
          Cart
        </span>
        <span className="font-serif text-lg tabular-nums">
          {count === 0 ? "Empty" : formatUsd(subtotalUsd)}
        </span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={ariaLabel}
        className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold hover:bg-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark ${className}`.trim()}
      >
        <ShoppingBagIcon className="h-4 w-4" aria-hidden />
        {count > 0 ? (
          <span
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-warm-gold px-1 text-[0.6rem] font-semibold text-white"
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`${desktopNavItemClass} shrink-0 text-site-secondary hover:border-b-stone-300 hover:text-site-fg ${className}`.trim()}
    >
      <ShoppingBagIcon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="whitespace-nowrap">
        Cart
        {count > 0 ? (
          <span className="ml-1 tabular-nums" aria-hidden>
            ({count})
          </span>
        ) : null}
      </span>
    </button>
  );
}
