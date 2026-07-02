import Link from "next/link";

/**
 * @param {{
 *   key: string;
 *   title: string;
 *   eyebrow: string;
 *   description: string;
 *   href: string;
 *   image?: string;
 *   alt?: string;
 *   subcategoryCount: number;
 *   productCount: number;
 * }[]} catalogs
 */
export default function ShopAllCatalogGrid({ catalogs }) {
  return (
    <div>
      <div className="border-b border-stone-200/80 pb-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
          Our collections
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
          Browse by category
          <span className="ml-2 font-sans text-xl font-normal tabular-nums tracking-normal text-site-secondary sm:text-2xl">
            ({catalogs.length})
          </span>
        </h2>
      </div>

      <ul className="mt-10 grid gap-8 sm:grid-cols-2" role="list">
        {catalogs.map((catalog) => (
          <li key={catalog.key}>
            <Link
              href={catalog.href}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-b from-champagne/70 via-ivory to-stone-100/80">
                {catalog.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={catalog.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div
                    className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-site-secondary"
                    aria-hidden
                  >
                    {catalog.title}
                  </div>
                )}

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-stone-950/5"
                  aria-hidden
                />

                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/75">
                    {catalog.eyebrow}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl font-medium leading-tight tracking-[-0.02em] text-white sm:text-[1.75rem]">
                    {catalog.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/75">
                    {catalog.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
                    <p className="text-sm text-amber-100/90">
                      {catalog.subcategoryCount}{" "}
                      {catalog.subcategoryCount === 1 ? "collection" : "collections"}
                      {catalog.productCount > 0 ? (
                        <span className="text-white/60">
                          {" · "}
                          {catalog.productCount}{" "}
                          {catalog.productCount === 1 ? "piece" : "pieces"}
                        </span>
                      ) : null}
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/90 transition group-hover:text-white">
                      Explore
                      <span
                        className="inline-block transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden
                      >
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
