import Link from "next/link";

/**
 * Editorial collection card — category landing grids and Shop All summaries.
 *
 * @param {{
 *   title: string;
 *   description: string;
 *   href: string;
 *   image?: string;
 *   alt?: string;
 *   symbol?: string;
 *   symbolClass?: string;
 *   ctaLabel?: string;
 * }} props
 */
export default function CollectionCard({
  title,
  description,
  href,
  image,
  alt,
  symbol,
  symbolClass,
  ctaLabel = "Explore collection",
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-sm border border-stone-200/75 bg-gradient-to-b from-ivory via-white to-champagne/35 shadow-[0_1px_2px_rgba(41,37,36,0.04),0_14px_36px_rgba(41,37,36,0.08)] ring-1 ring-stone-200/40 transition duration-500 hover:-translate-y-1 hover:border-stone-300/80 hover:shadow-[0_2px_4px_rgba(41,37,36,0.05),0_22px_44px_rgba(41,37,36,0.11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      {symbol ? (
        <div className="p-4 sm:p-5">
          <div className="flex aspect-[4/3] items-center justify-center rounded-sm bg-gradient-to-br from-champagne/90 via-ivory to-white shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_24px_rgba(41,37,36,0.08)] ring-1 ring-stone-200/60">
            <span
              className={`font-serif text-5xl font-semibold tracking-tight sm:text-6xl ${symbolClass || "text-site-fg"}`}
              aria-hidden
            >
              {symbol}
            </span>
          </div>
        </div>
      ) : image ? (
        <div className="p-4 sm:p-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-champagne shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_24px_rgba(41,37,36,0.08)] ring-1 ring-stone-200/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={alt || title}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-stone-950/5 opacity-80 transition duration-500 group-hover:opacity-100"
              aria-hidden
            />
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          <div className="flex aspect-[4/3] items-center justify-center rounded-sm bg-champagne/80 ring-1 ring-stone-200/60">
            <span className="text-xs uppercase tracking-[0.2em] text-site-secondary">
              {title}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col border-t border-stone-200/60 px-6 py-6 sm:px-7 sm:py-7">
        <h2 className="font-serif text-[1.35rem] font-medium leading-tight tracking-[-0.02em] text-site-fg sm:text-2xl">
          {title}
        </h2>
        <div
          className="mt-4 h-px w-9 bg-warm-gold/40 transition-all duration-500 group-hover:w-14"
          aria-hidden
        />
        <p className="mt-4 flex-1 text-sm leading-7 text-site-secondary sm:text-[0.9375rem]">
          {description}
        </p>
        <span className="mt-7 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-warm-gold-dark transition group-hover:text-warm-gold">
          {ctaLabel}
          <span
            className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
