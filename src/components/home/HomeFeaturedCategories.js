import Link from "next/link";
import {
  CATALOG_SECTIONS,
  HOME_FEATURED_CATEGORIES,
} from "@/lib/catalog/categories";

export default function HomeFeaturedCategories() {
  return (
    <section
      aria-labelledby="home-collections-heading"
      className="relative left-1/2 z-10 w-screen max-w-[100vw] -translate-x-1/2 border-y border-stone-400/25"
    >
      <div className="relative overflow-hidden bg-gradient-to-b from-[#e8e2d6] via-[#ddd6c8] to-[#e2dbd0] py-20 sm:py-24 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 fabric-texture opacity-[0.16]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-stone-600/5"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end lg:gap-16">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-stone-600">
                Collections
              </p>
              <h2
                id="home-collections-heading"
                className="mt-4 font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl"
              >
                Fine jewelry, thoughtfully presented
              </h2>
            </div>

            <div className="max-w-xl space-y-5 text-base leading-relaxed text-stone-700 sm:text-lg sm:leading-8">
              <p>
                Six paths into what we do best—engagement and wedding, diamonds,
                custom design, everyday fine jewelry, watches, and lifelong care.
                Each collection is curated in our showroom, meant to be explored
                at your pace.
              </p>
              <Link
                href="/shop-all"
                className="inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 transition hover:underline"
              >
                Explore all collections
              </Link>
            </div>
          </div>

          <ol className="mt-14 divide-y divide-stone-500/22 sm:mt-16" role="list">
            {HOME_FEATURED_CATEGORIES.map((category, index) => {
              const sectionKey = category.href.replace(/^\//, "");
              const eyebrow = CATALOG_SECTIONS[sectionKey]?.eyebrow ?? "Collection";
              const indexLabel = String(index + 1).padStart(2, "0");

              return (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="group -mx-3 flex flex-col gap-5 rounded-sm px-3 py-8 transition-colors hover:bg-white/18 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-[#ddd6c8] sm:-mx-4 sm:flex-row sm:items-center sm:gap-8 sm:px-4 sm:py-10 lg:gap-12"
                  >
                    <span className="w-10 shrink-0 font-sans text-xs font-medium tabular-nums tracking-[0.22em] text-stone-500">
                      {indexLabel}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-stone-600">
                        {eyebrow}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl font-medium tracking-[-0.02em] text-site-fg transition group-hover:text-warm-gold-dark sm:text-3xl lg:text-[2rem]">
                        {category.title}
                      </h3>
                      <p className="mt-3 max-w-lg text-sm leading-relaxed text-stone-700 lg:hidden">
                        {category.description}
                      </p>
                    </div>

                    <p className="hidden max-w-xs flex-1 text-sm leading-relaxed text-stone-700 lg:block">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-5 sm:shrink-0">
                      <div className="relative h-[4.75rem] w-[3.75rem] shrink-0 overflow-hidden bg-stone-600/10 shadow-sm shadow-stone-900/8 sm:h-24 sm:w-20 lg:h-28 lg:w-[5.5rem]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={category.image}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                          aria-hidden
                        />
                      </div>
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-stone-500/35 text-base text-stone-600 transition duration-300 group-hover:border-warm-gold-dark group-hover:bg-warm-gold/12 group-hover:text-warm-gold-dark"
                        aria-hidden
                      >
                        →
                      </span>
                      <span className="sr-only">Explore {category.title}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
