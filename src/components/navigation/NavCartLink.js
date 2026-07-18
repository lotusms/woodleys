"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { desktopNavItemClass } from "@/config";
import { formatUsd } from "@/lib/money";

/**
 * Cart control for the main shop navigation — visible only when the cart has items.
 * @param {{ onNavigate?: () => void, variant?: "desktop" | "mobile", className?: string }} props
 */
export default function NavCartLink({
  onNavigate,
  variant = "desktop",
  className = "",
}) {
  const { ready, itemCount, subtotalUsd, openCart } = useCart();

  if (!ready || itemCount === 0) return null;

  const ariaLabel = `Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}, ${formatUsd(subtotalUsd)} total`;

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
        <span className="font-serif text-lg tabular-nums">{formatUsd(subtotalUsd)}</span>
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
      <span className="whitespace-nowrap tabular-nums">{formatUsd(subtotalUsd)}</span>
    </button>
  );
}
