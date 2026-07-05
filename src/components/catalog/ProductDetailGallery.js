"use client";

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
      <div className="flex aspect-[4/5] items-center justify-center bg-champagne text-xs uppercase tracking-[0.2em] text-site-secondary">
        No image
      </div>
    );
  }

  return (
    <div className="relative min-w-0 overflow-hidden bg-champagne px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 lg:pr-12">
      <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImage.src}
          alt={activeImage.alt || title}
          className="h-full w-full object-contain object-center"
        />

        {hasMultiple ? (
          <>
            <p className="absolute left-4 top-4 z-20 font-serif text-sm tabular-nums text-site-fg/85 sm:left-5 sm:top-5">
              {activeIndex + 1} / {images.length}
            </p>

            <ul
              className="absolute left-4 top-14 z-20 flex max-h-[calc(100%-4.5rem)] flex-col gap-2 overflow-y-auto sm:left-5 sm:top-16 sm:gap-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              aria-label="Product photos"
            >
              {images.map((image, index) => {
                const selected = index === activeIndex;
                return (
                  <li key={image.src}>
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`block w-12 overflow-hidden border bg-ivory/90 shadow-sm shadow-stone-900/10 backdrop-blur-[1px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 sm:w-14 ${
                        selected
                          ? "border-site-fg"
                          : "border-stone-300/70 hover:border-stone-500/80"
                      }`}
                      aria-label={`Show photo ${index + 1} of ${images.length}`}
                      aria-current={selected ? "true" : undefined}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.src}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
