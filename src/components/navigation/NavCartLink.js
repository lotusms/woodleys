"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/context/CartContext";
import { desktopNavItemClass } from "@/config";
import { formatUsd } from "@/lib/money";

/**
 * Cart link for the main shop navigation — visible only when the cart has items.
 * @param {{ onNavigate?: () => void, variant?: "desktop" | "mobile", className?: string }} props
 */
export default function NavCartLink({
  onNavigate,
  variant = "desktop",
  className = "",
}) {
  const pathname = usePathname();
  const { ready, itemCount, subtotalUsd } = useCart();
  const active = pathname === "/cart" || pathname.startsWith("/cart/");

  if (!ready || itemCount === 0) return null;

  const ariaLabel = `View cart, ${itemCount} item${itemCount === 1 ? "" : "s"}, ${formatUsd(subtotalUsd)} total`;

  if (variant === "mobile") {
    return (
      <Link
        href="/cart"
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        aria-label={ariaLabel}
        className={`mobile-nav-item flex items-center justify-between gap-3 border-b border-stone-200/80 py-4 transition ${
          active ? "text-warm-gold-dark" : "text-site-fg"
        } ${className}`.trim()}
      >
        <span className="flex items-center gap-3 font-serif text-2xl">
          <ShoppingBagIcon className="h-6 w-6 shrink-0" aria-hidden />
          Cart
        </span>
        <span className="font-serif text-lg tabular-nums">{formatUsd(subtotalUsd)}</span>
      </Link>
    );
  }

  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={ariaLabel}
      className={`${desktopNavItemClass} ml-1 border-l border-stone-200/70 pl-5 ${className} ${
        active
          ? "border-b-warm-gold text-site-fg"
          : "text-site-secondary hover:border-b-stone-300 hover:text-site-fg"
      }`}
    >
      <ShoppingBagIcon className="h-4 w-4 shrink-0" aria-hidden />
      <span className="whitespace-nowrap tabular-nums">{formatUsd(subtotalUsd)}</span>
    </Link>
  );
}
