"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

/**
 * Header search — submits to /search using existing catalog inventory.
 * @param {{
 *   variant?: "field" | "icon";
 *   className?: string;
 *   onSubmit?: () => void;
 * }} props
 */
export default function HeaderSearch({
  variant = "field",
  className = "",
  onSubmit,
}) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const q = query.trim();
    onSubmit?.();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/search");
    }
  }

  if (variant === "icon") {
    return (
      <Link
        href="/search"
        onClick={onSubmit}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-fg transition hover:border-warm-gold hover:bg-champagne focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark ${className}`.trim()}
        aria-label="Search jewelry, watches, diamonds, and services"
      >
        <MagnifyingGlassIcon className="h-4 w-4" aria-hidden />
      </Link>
    );
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`relative min-w-0 ${className}`.trim()}
    >
      <label htmlFor={inputId} className="sr-only">
        Search jewelry, watches, diamonds, and services
      </label>
      <MagnifyingGlassIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-site-secondary"
        aria-hidden
      />
      <input
        id={inputId}
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search jewelry, watches, diamonds, and services"
        className="h-10 w-full min-w-0 rounded-full border border-stone-300/80 bg-white py-2 pl-9 pr-4 text-sm text-site-fg placeholder:text-site-secondary/80 transition focus:border-warm-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark/40"
      />
    </form>
  );
}
