"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import NewReleaseCard from "@/components/home/NewReleaseCard";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";

/**
 * @param {{
 *   products: import("@/lib/catalog/product-types").CatalogProduct[];
 * }} props
 */
export default function HomeNewReleases({ products }) {
  const regionId = useId();
  const scrollerRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const node = scrollerRef.current;
    if (!node) return;
    const maxScroll = node.scrollWidth - node.clientWidth;
    setCanScrollPrev(node.scrollLeft > 8);
    setCanScrollNext(node.scrollLeft < maxScroll - 8);
  }, []);

  const scrollByPage = useCallback(
    (direction) => {
      const node = scrollerRef.current;
      if (!node) return;
      const amount = Math.max(node.clientWidth * 0.82, 300);
      node.scrollBy({ left: direction * amount, behavior: "smooth" });
      window.setTimeout(updateScrollState, 320);
    },
    [updateScrollState],
  );

  useEffect(() => {
    updateScrollState();
    const node = scrollerRef.current;
    if (!node) return undefined;

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(node);
    return () => observer.disconnect();
  }, [products, updateScrollState]);

  if (!products.length) return null;

  return (
    <section
      aria-labelledby={`${regionId}-heading`}
      className="relative isolate overflow-hidden bg-ivory py-20 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 fabric-texture opacity-[0.08]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-site-secondary">
              New releases
            </p>
            <h2
              id={`${regionId}-heading`}
              className="mt-4 font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-[2.35rem]"
            >
              Fresh arrivals from the showroom
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-site-secondary">
              Recently added pieces — explore online, then visit us in Beaumont to
              see them in person.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/shop-all"
              className="text-sm font-medium text-warm-gold-dark underline-offset-4 transition hover:underline"
            >
              Browse all collections
            </Link>

            {products.length > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollByPage(-1)}
                  disabled={!canScrollPrev}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-secondary transition hover:border-warm-gold/50 hover:text-site-fg disabled:opacity-35"
                  aria-label="Scroll to previous new releases"
                >
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByPage(1)}
                  disabled={!canScrollNext}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-secondary transition hover:border-warm-gold/50 hover:text-site-fg disabled:opacity-35"
                  aria-label="Scroll to next new releases"
                >
                  <ChevronRightIcon className="h-5 w-5" aria-hidden />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label="New release products"
        >
          {products.map((product) => (
            <NewReleaseCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <SectionBandHighlightEdge />
    </section>
  );
}
