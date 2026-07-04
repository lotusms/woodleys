"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";

/**
 * @param {{
 *   images: { src: string; alt: string }[];
 *   title: string;
 * }} props
 */
export default function ProductDetailGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const activeImage = images[activeIndex] ?? images[0];
  const hasPrev = hasMultiple && activeIndex > 0;
  const hasNext = hasMultiple && activeIndex < images.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) setActiveIndex((index) => index - 1);
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (hasNext) setActiveIndex((index) => index + 1);
  }, [hasNext]);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    if (!hasMultiple) return;

    function onKeyDown(event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hasMultiple, goPrev, goNext]);

  if (!activeImage) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-champagne text-xs uppercase tracking-[0.2em] text-site-secondary">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-sm bg-champagne">
        <div className="relative aspect-[4/5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage.src}
            alt={activeImage.alt || title}
            className="h-full w-full object-cover"
          />

          {hasMultiple ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                disabled={!hasPrev}
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-stone-950/45 text-white backdrop-blur-sm transition hover:bg-stone-950/60 disabled:pointer-events-none disabled:opacity-30 sm:left-4"
                aria-label="Previous photo"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!hasNext}
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-stone-950/45 text-white backdrop-blur-sm transition hover:bg-stone-950/60 disabled:pointer-events-none disabled:opacity-30 sm:right-4"
                aria-label="Next photo"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden />
              </button>
              <p className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/25 bg-stone-950/50 px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                {activeIndex + 1} of {images.length}
              </p>
            </>
          ) : null}
        </div>
      </div>

      {hasMultiple ? (
        <ul
          className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Product photos"
        >
          {images.map((image, index) => {
            const selected = index === activeIndex;
            return (
              <li key={image.src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`overflow-hidden rounded-sm border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 ${
                    selected
                      ? "border-warm-gold-dark ring-1 ring-warm-gold-dark/25"
                      : "border-stone-300/60 hover:border-stone-400/80"
                  }`}
                  aria-label={`Show photo ${index + 1} of ${images.length}`}
                  aria-current={selected ? "true" : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.src}
                    alt=""
                    className="h-16 w-16 object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
