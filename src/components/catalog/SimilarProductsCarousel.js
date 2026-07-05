"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import SuggestionCard from "@/components/catalog/SuggestionCard";

/**
 * Horizontal carousel of product tiles for related products.
 *
 * @param {{
 *   products: import("@/lib/catalog/product-types").CatalogProduct[];
 *   className?: string;
 * }} props
 */
export default function SimilarProductsCarousel({ products, className = "" }) {
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

  const scrollByPage = useCallback((direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.max(node.clientWidth * 0.85, 280);
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
    window.setTimeout(updateScrollState, 320);
  }, [updateScrollState]);

  useEffect(() => {
    updateScrollState();
  }, [products, updateScrollState]);

  if (!products.length) return null;

  return (
    <section
      className={className}
      aria-labelledby={`${regionId}-heading`}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-site-secondary">
            Similar items
          </p>
          <h2
            id={`${regionId}-heading`}
            className="mt-2 font-serif text-2xl font-medium tracking-[-0.02em] text-site-fg sm:text-[1.75rem]"
          >
            You might also like
          </h2>
        </div>

        {products.length > 1 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByPage(-1)}
              disabled={!canScrollPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-secondary transition hover:border-warm-gold/50 hover:text-site-fg disabled:opacity-35"
              aria-label="Scroll to previous similar items"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByPage(1)}
              disabled={!canScrollNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-300/80 bg-white text-site-secondary transition hover:border-warm-gold/50 hover:text-site-fg disabled:opacity-35"
              aria-label="Scroll to next similar items"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Similar products"
      >
        {products.map((product) => (
          <SuggestionCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
