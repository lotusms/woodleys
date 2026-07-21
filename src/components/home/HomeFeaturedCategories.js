import Link from "next/link";
import Image from "next/image";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";
import {
  CATALOG_SECTIONS,
  HOME_FEATURED_CATEGORIES,
} from "@/lib/catalog/categories";

/** First path segment for catalog section eyebrow lookup. */
function sectionKeyFromHref(href) {
  const segment = href.replace(/^\//, "").split("/")[0];
  return segment || href.replace(/^\//, "");
}

export default function HomeFeaturedCategories() {
  return (
    <section
      aria-labelledby="home-collections-heading"
      className="relative left-1/2 z-10 w-screen max-w-[100vw] -translate-x-1/2"
    >
      <div className="relative overflow-hidden bg-gradient-to-b from-[#e8e2d6] via-[#ddd6c8] to-[#e2dbd0] py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 fabric-texture opacity-[0.16]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-stone-600/5"
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-14 xl:gap-20">
            <div className="max-w-xl">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-stone-600">
                Collections
              </p>
              <h2
                id="home-collections-heading"
                className="mt-4 text-balance font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl"
              >
                From engagement to everyday
              </h2>
              <p className="mt-5 text-base leading-relaxed text-stone-700 sm:text-lg sm:leading-8">
                Six starting points — bridal, rings, necklaces, watches, custom
                design, and in-store care. Each opens a curated selection; shop
                Women&apos;s or Men&apos;s where the collection offers both.
              </p>
              <Link
                href="/shop-all"
                className="mt-6 inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 transition hover:underline"
              >
                Explore all collections
              </Link>
            </div>

            <nav
              aria-label="Featured collections"
              className="rounded-sm border border-stone-300/50 bg-white/35 px-5 py-6 backdrop-blur-sm sm:px-7 sm:py-7 lg:mt-2"
            >
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-stone-500">
                Browse by collection
              </p>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4" role="list">
                {HOME_FEATURED_CATEGORIES.map((category, index) => {
                  const sectionKey = sectionKeyFromHref(category.href);
                  const eyebrow =
                    CATALOG_SECTIONS[sectionKey]?.eyebrow ?? "Collection";
                  const indexLabel = String(index + 1).padStart(2, "0");

                  return (
                    <li key={category.href}>
                      <Link
                        href={category.href}
                        className="group flex items-start gap-3 rounded-sm py-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-[#e2dbd0]"
                      >
                        <span
                          className="mt-0.5 shrink-0 tabular-nums text-[0.62rem] font-semibold tracking-[0.2em] text-stone-400 transition group-hover:text-warm-gold-dark"
                          aria-hidden
                        >
                          {indexLabel}
                        </span>
                        <span className="min-w-0">
                          <span className="block font-serif text-lg font-medium tracking-[-0.02em] text-site-fg transition group-hover:text-warm-gold-dark sm:text-xl">
                            {category.title}
                          </span>
                          <span className="mt-0.5 block text-[0.68rem] font-medium uppercase tracking-[0.16em] text-stone-500">
                            {eyebrow}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>

          <ul
            className="mt-14 grid gap-0.5 sm:mt-16 sm:grid-cols-2"
            role="list"
          >
            {HOME_FEATURED_CATEGORIES.map((category, index) => {
              const sectionKey = sectionKeyFromHref(category.href);
              const eyebrow = CATALOG_SECTIONS[sectionKey]?.eyebrow ?? "Collection";
              const indexLabel = String(index + 1).padStart(2, "0");
              const isFeatured = index === 0;
              const gridItemCount = HOME_FEATURED_CATEGORIES.length - 1;
              const isLastOrphan =
                index > 0 &&
                index === HOME_FEATURED_CATEGORIES.length - 1 &&
                gridItemCount % 2 === 1;
              const isFullWidth = isFeatured || isLastOrphan;

              return (
                <li
                  key={category.href}
                  className={isFullWidth ? "sm:col-span-2" : undefined}
                >
                  <Link
                    href={category.href}
                    className={`group relative block overflow-hidden shadow-lg shadow-stone-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-[#ddd6c8] ${
                      isFullWidth
                        ? "aspect-[16/10] sm:aspect-[21/9]"
                        : "aspect-[4/5] sm:aspect-[3/4]"
                    }`}
                  >
                    <Image
                      src={category.image}
                      alt=""
                      width={1680}
                      height={720}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      aria-hidden
                    />

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-stone-950/82 via-stone-950/28 to-stone-950/8 transition duration-500 group-hover:from-stone-950/88"
                      aria-hidden
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-stone-950/35 via-transparent to-transparent opacity-80 sm:opacity-100"
                      aria-hidden
                    />

                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                      <div className="flex items-end justify-between gap-6">
                        <div className="min-w-0 max-w-xl">
                          <div className="flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/70">
                            <span className="tabular-nums">{indexLabel}</span>
                            <span className="h-px w-8 bg-white/35" aria-hidden />
                            <span>{eyebrow}</span>
                          </div>
                          <h3 className="mt-3 font-serif text-3xl font-medium tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08]">
                            {category.title}
                          </h3>
                          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/78 sm:text-base">
                            {category.description}
                          </p>
                        </div>

                        <span
                          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-lg text-white backdrop-blur-sm transition duration-300 group-hover:border-white/55 group-hover:bg-white/18 sm:flex"
                          aria-hidden
                        >
                          →
                        </span>
                      </div>

                      <span className="mt-5 inline-flex text-sm font-medium text-amber-100/95 transition group-hover:text-white">
                        Explore collection
                        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <SectionBandHighlightEdge />
    </section>
  );
}
