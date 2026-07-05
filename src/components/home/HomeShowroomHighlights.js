"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import ProductPrice from "@/components/catalog/ProductPrice";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";
import { formatProductPriceLabel } from "@/lib/catalog/product-pricing";

const ROTATE_MS = 8500;
const FADE_MS = 700;

/**
 * @param {import("@/lib/catalog/product-types").CatalogProduct} product
 */
function priceLabel(product) {
  return formatProductPriceLabel(product);
}

/**
 * @param {{ products: import("@/lib/catalog/product-types").CatalogProduct[] }} props
 */
export default function HomeShowroomHighlights({ products }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const regionId = useId();
  const count = products.length;
  const current = products[active];

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const goTo = useCallback(
    (index) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(active + 1), [active, goTo]);
  const goPrev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (count <= 1 || paused || reduceMotion) return undefined;

    const id = window.setInterval(goNext, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count, paused, reduceMotion, goNext]);

  if (!current) return null;

  return (
    <section
      aria-labelledby={`${regionId}-heading`}
      className="relative isolate overflow-hidden bg-champagne py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 fabric-texture opacity-[0.14]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <div className="max-w-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-site-secondary">
              From the showroom
            </p>
            <h2
              id={`${regionId}-heading`}
              className="mt-4 font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl"
            >
              Pieces worth seeing in person
            </h2>
          </div>

          <p className="max-w-lg text-base leading-relaxed text-site-secondary sm:text-lg sm:leading-8">
            A rotating selection from our Beaumont showroom: engagement styles,
            diamonds, and fine jewelry chosen to inspire your visit. Browse here,
            then see them under natural light when you are ready.
          </p>
        </div>

        <div
          className="mt-12 sm:mt-14"
          role="region"
          aria-roledescription="carousel"
          aria-label="Showroom highlights"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              goPrev();
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              goNext();
            }
          }}
        >
          <div className="overflow-hidden rounded-sm border border-stone-300/45 bg-ivory shadow-md shadow-stone-900/6">
            <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="relative min-h-[20rem] overflow-hidden bg-champagne sm:min-h-[24rem] lg:min-h-[30rem]">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className={`absolute inset-0 transition-opacity ease-in-out ${
                      index === active
                        ? "z-10 opacity-100"
                        : "pointer-events-none z-0 opacity-0"
                    }`}
                    aria-hidden={index !== active}
                    style={{
                      transitionDuration: reduceMotion ? "0ms" : `${FADE_MS}ms`,
                    }}
                  >
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image.src}
                        alt={product.image.alt || product.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-site-secondary">
                        No image
                      </div>
                    )}
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent"
                      aria-hidden
                    />
                  </div>
                ))}

                <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between gap-4 p-5 sm:p-7">
                  <p className="font-sans text-[0.62rem] font-semibold tabular-nums tracking-[0.28em] text-white/85">
                    {String(active + 1).padStart(2, "0")}
                    <span className="mx-2 text-white/40">/</span>
                    {String(count).padStart(2, "0")}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-stone-950/40 text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-stone-950/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                      aria-label="Previous piece"
                    >
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden />
                    </button>
                    {count > 1 && !reduceMotion ? (
                      <button
                        type="button"
                        onClick={() => setPaused((value) => !value)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-stone-950/40 text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-stone-950/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                        aria-label={paused ? "Play carousel" : "Pause carousel"}
                        aria-pressed={paused}
                      >
                        {paused ? (
                          <PlayIcon className="h-4 w-4" aria-hidden />
                        ) : (
                          <PauseIcon className="h-4 w-4" aria-hidden />
                        )}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-stone-950/40 text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-stone-950/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark"
                      aria-label="Next piece"
                    >
                      <ChevronRightIcon className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>

              <div
                id={`${regionId}-slide-panel`}
                className="flex flex-col justify-between gap-8 border-t border-stone-200/70 bg-ivory p-7 sm:p-9 lg:border-t-0 lg:border-l lg:p-10"
                role="tabpanel"
                aria-labelledby={`${regionId}-tab-${active}`}
              >
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-warm-gold-dark">
                    Now showing
                  </p>
                  <h3 className="mt-3 font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
                    {current.title}
                  </h3>
                  <div className="mt-4 text-warm-gold-dark">
                    <ProductPrice
                      product={current}
                      layout="stacked"
                      compareLabelClassName="text-sm font-normal tabular-nums text-site-secondary"
                      regularClassName="line-through decoration-site-secondary/40 tabular-nums text-site-secondary/60"
                      saleClassName="text-lg font-medium tabular-nums tracking-wide"
                    />
                  </div>
                  {current.description ? (
                    <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-site-secondary sm:text-base sm:leading-7">
                      {current.description}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <Link
                    href={`/products/${current.handle}`}
                    className="inline-flex items-center justify-center rounded-full bg-warm-gold px-6 py-3 text-sm font-semibold text-white transition hover:bg-warm-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2"
                  >
                    View this piece
                  </Link>
                  <Link
                    href="/shop-all"
                    className="text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
                  >
                    Explore all collections
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-5 flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Choose a piece to preview"
          >
            {products.map((product, index) => {
              const selected = index === active;
              return (
                <button
                  key={product.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${regionId}-slide-panel`}
                  id={`${regionId}-tab-${index}`}
                  onClick={() => goTo(index)}
                  className={`group relative shrink-0 snap-start overflow-hidden rounded-sm border bg-ivory transition focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-champagne ${
                    selected
                      ? "border-warm-gold-dark ring-1 ring-warm-gold-dark/25"
                      : "border-stone-300/55 hover:border-stone-400/70"
                  }`}
                >
                  <span className="sr-only">{product.title}</span>
                  <div className="relative h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image.src}
                        alt=""
                        className={`h-full w-full object-cover transition duration-500 ${
                          selected ? "opacity-100" : "opacity-80 group-hover:opacity-100"
                        }`}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[0.55rem] uppercase tracking-widest text-site-secondary">
                        No image
                      </div>
                    )}
                  </div>
                  <span
                    className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/60 to-transparent px-1 py-1 text-center font-sans text-[0.55rem] font-semibold tabular-nums tracking-[0.2em] text-white/90 ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Showing {current.title}, {priceLabel(current)}
          </p>
        </div>
      </div>
      <SectionBandHighlightEdge />
    </section>
  );
}
