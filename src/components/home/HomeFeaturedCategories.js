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
      <div className="relative overflow-hidden bg-gradient-to-b from-[#e8e2d6] via-[#ddd6c8] to-[#e2dbd0] pt-20 sm:pt-28">
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
                Explore the main collections
              </h2>
              <p className="mt-5 text-base leading-relaxed text-stone-700 sm:text-lg sm:leading-8">
                Eight starting points from the current menu: engagement, wedding,
                rings, necklaces, earrings, bracelets, watches, and diamonds.
                Begin with the collection you have in mind, then narrow by
                audience or style where it helps.
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
                Browse the menu collections
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
        </div>

        <ul
          className="relative mt-14 grid w-full grid-cols-1 gap-0.5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {HOME_FEATURED_CATEGORIES.map((category) => {
            return (
              <li key={category.href}>
                <Link
                  href={category.href}
                  aria-label={`View ${category.title} collection`}
                  className="group relative block aspect-[4/5] overflow-hidden shadow-lg shadow-stone-900/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-[#ddd6c8] sm:aspect-[3/4]"
                >
                  <Image
                    src={category.image}
                    alt=""
                    width={840}
                    height={1120}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                    aria-hidden
                  />

                  <div
                    className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-stone-950/25 transition duration-500 group-hover:from-stone-950/82 group-hover:via-stone-950/25 group-hover:to-stone-950/35"
                    aria-hidden
                  />

                  <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 lg:p-7">
                    <h3 className="font-serif text-2xl font-medium tracking-[-0.02em] text-white drop-shadow-sm transition duration-300 group-hover:translate-y-[-2px] lg:text-[1.7rem] lg:leading-[1.12]">
                      {category.title}
                    </h3>
                    <span
                      className="mt-3 block h-px w-8 bg-white/55 transition-all duration-500 ease-out group-hover:w-14 group-hover:bg-warm-gold"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <SectionBandHighlightEdge />
    </section>
  );
}
