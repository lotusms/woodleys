"use client";

import Link from "next/link";

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 min-w-fit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold-dark";

const VARIANT_CLASSES =
  "border-stone-300/90 bg-white text-site-fg hover:border-warm-gold hover:bg-champagne/60";

export default function SecondaryButton({
  href,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
