"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/solid";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";
import { orgEstablished, orgLocation, siteHeaderProgressBarTopClass } from "@/config";
import { BULOVA_CATEGORY_IMAGE } from "@/lib/catalog/bulova-sample-products.js";

const ROTATE_MS = 10000;
const SLIDE_FADE_MS = 900;

const SLIDES = [
  {
    id: "engagement",
    image:
      "https://woodleyjewelers.com/cdn/shop/files/129D2D0B-124A-47E7-9AAD-754D6F1BA1BB_2048x.jpg?v=1639025505",
    imageAlt: "Engagement ring with brilliant diamond in an elegant setting",
    heading: "A ring worthy of the moment you say yes",
    body: `Your engagement ring marks a promise you will carry for a lifetime. We help you choose a setting and stone with patience and care, so the ring you wear feels as meaningful as the marriage it represents.`,
    primaryLabel: "Engagement & Wedding",
    primaryHref: "/engagement-wedding",
    secondaryLabel: "Explore diamonds",
    secondaryHref: "/diamonds",
    sectionBg:
      "bg-[linear-gradient(118deg,#f3e6dc_0%,#f8f1ea_42%,#faf8f4_100%)]",
    sectionGlow:
      "bg-[radial-gradient(ellipse_90%_80%_at_15%_50%,rgba(228,196,168,0.35),transparent_55%)]",
  },
  {
    id: "watches",
    image: BULOVA_CATEGORY_IMAGE.src,
    imageAlt: BULOVA_CATEGORY_IMAGE.alt,
    heading: "Precision you feel on your wrist every day",
    body: `From Bulova classics to sport and dress styles, a fine watch balances craftsmanship with everyday wear. Explore authorized timepieces chosen for reliability, design, and the quiet confidence of a name trusted for generations.`,
    primaryLabel: "Shop watches",
    primaryHref: "/watches",
    secondaryLabel: "View all collections",
    secondaryHref: "/shop-all",
    sectionBg:
      "bg-[linear-gradient(118deg,#e6eaee_0%,#f0eeea_44%,#faf8f4_100%)]",
    sectionGlow:
      "bg-[radial-gradient(ellipse_90%_80%_at_15%_50%,rgba(176,190,204,0.28),transparent_55%)]",
  },
  {
    id: "custom",
    image:
      "https://woodleyjewelers.com/cdn/shop/files/blowtorch-shaping-ring_800x800@2x.jpg?v=1639027342",
    imageAlt: "Jeweler shaping a custom ring at the bench",
    heading: "Jewelry shaped around you alone",
    body: `Some stories deserve a piece that exists nowhere else. Work with our bench jewelers to design jewelry made for your taste, your milestones, and the moments only you can name, from first sketch to finished heirloom.`,
    primaryLabel: "Custom jewelry",
    primaryHref: "/custom-jewelry",
    secondaryLabel: "Book a visit",
    secondaryHref: "/contact",
    sectionBg:
      "bg-[linear-gradient(118deg,#ebe2cf_0%,#f3ecdf_46%,#faf8f4_100%)]",
    sectionGlow:
      "bg-[radial-gradient(ellipse_90%_80%_at_15%_50%,rgba(196,165,116,0.26),transparent_55%)]",
  },
];

export default function HomeHero() {
  const regionId = useId();
  const heroRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [progressVisible, setProgressVisible] = useState(true);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return undefined;

    const xlQuery = window.matchMedia("(min-width: 1280px)");
    let observer;

    function attach() {
      observer?.disconnect();
      const rootMargin = xlQuery.matches ? "-120px 0px 0px 0px" : "-72px 0px 0px 0px";
      observer = new IntersectionObserver(
        ([entry]) => setProgressVisible(entry.isIntersecting),
        { threshold: 0, rootMargin },
      );
      observer.observe(node);
    }

    attach();
    xlQuery.addEventListener("change", attach);
    return () => {
      xlQuery.removeEventListener("change", attach);
      observer?.disconnect();
    };
  }, []);

  const fadeMs = reduceMotion ? 0 : SLIDE_FADE_MS;

  const goTo = useCallback((nextIndex) => {
    setIndex(((nextIndex % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused || reduceMotion || SLIDES.length <= 1) return undefined;
    const id = window.setInterval(goNext, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, goNext]);

  const current = SLIDES[index];

  return (
    <>
      <div
        className={`fixed inset-x-0 z-[111] h-[2px] w-screen max-w-none overflow-hidden bg-stone-400/15 ${siteHeaderProgressBarTopClass} transition-opacity duration-300 ${
          progressVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="progressbar"
        aria-label={`Slide ${index + 1} of ${SLIDES.length}: ${current.primaryLabel}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`Showing slide ${index + 1} of ${SLIDES.length}`}
        aria-hidden={!progressVisible}
      >
        <span
          key={`${current.id}-progress-${index}`}
          className={`block h-full w-full bg-warm-gold-dark/35 ${
            reduceMotion ? "" : "hero-slide-progress"
          }`}
          style={
            reduceMotion
              ? { transform: "scaleX(1)" }
              : {
                  animationDuration: `${ROTATE_MS}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }
          }
        />
      </div>

      <div className="sr-only" role="tablist" aria-label="Hero slides">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            id={`${regionId}-tab-${idx}`}
            aria-selected={idx === index}
            aria-controls={`${regionId}-panel`}
            onClick={() => goTo(idx)}
            tabIndex={idx === index ? 0 : -1}
          >
            {slide.primaryLabel}
          </button>
        ))}
      </div>

      <div
        ref={heroRef}
        className="relative left-1/2 z-10 w-screen max-w-[100vw] -translate-x-1/2"
      >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity ease-in-out ${slide.sectionBg} ${
              idx === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${fadeMs}ms` }}
          />
        ))}
        {SLIDES.map((slide, idx) => (
          <div
            key={`${slide.id}-glow`}
            className={`absolute inset-0 transition-opacity ease-in-out ${slide.sectionGlow} ${
              idx === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${fadeMs}ms` }}
          />
        ))}
        <div className="fabric-texture absolute inset-0 opacity-[0.12]" />
      </div>

      <section
        aria-roledescription="carousel"
        aria-label="Featured collections"
        className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-12 pt-8 sm:px-10 sm:pb-16 sm:pt-10 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:pb-16 lg:pt-12 xl:min-h-[calc(100vh-8rem)]"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
          }
        }}
      >
        <div className="max-w-xl lg:col-start-1 lg:row-start-1 lg:self-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
            {orgLocation} · Est. {orgEstablished} · By appointment
          </p>

          <div
            id={`${regionId}-panel`}
            role="tabpanel"
            aria-labelledby={`${regionId}-tab-${index}`}
            className="relative mt-5 grid"
          >
            {SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`col-start-1 row-start-1 transition-opacity ease-in-out ${
                  idx === index
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
                aria-hidden={idx !== index}
                style={{ transitionDuration: `${fadeMs}ms` }}
              >
                <h1 className="font-serif text-5xl font-medium leading-[1.08] tracking-[-0.03em] text-site-fg sm:text-6xl lg:text-[4.25rem]">
                  {slide.heading}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-site-secondary">
                  {slide.body}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mt-8 flex w-fit max-w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
            <div className="relative grid">
            {SLIDES.map((slide, idx) => (
              <div
                key={`${slide.id}-actions`}
                className={`col-start-1 row-start-1 flex flex-col gap-3 transition-opacity ease-in-out sm:flex-row sm:gap-2 ${
                  idx === index
                    ? "relative z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                }`}
                aria-hidden={idx !== index}
                style={{ transitionDuration: `${fadeMs}ms` }}
              >
                <PrimaryButton href={slide.primaryHref} className="w-full sm:w-auto">
                  {slide.primaryLabel}
                </PrimaryButton>
                <SecondaryButton href={slide.secondaryHref} className="w-full sm:w-auto">
                  {slide.secondaryLabel}
                </SecondaryButton>
              </div>
            ))}
            </div>

            {!reduceMotion && SLIDES.length > 1 ? (
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <SecondaryButton
                  type="button"
                  onClick={goPrev}
                  className="!size-11 !p-0"
                  aria-label="Previous slide"
                >
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden />
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  className="!size-11 shrink-0 !p-0"
                  aria-label={paused ? "Play carousel" : "Pause carousel"}
                  aria-pressed={paused}
                >
                  {paused ? (
                    <PlayIcon className="h-4 w-4" aria-hidden />
                  ) : (
                    <PauseIcon className="h-4 w-4" aria-hidden />
                  )}
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  onClick={goNext}
                  className="!size-11 !p-0"
                  aria-label="Next slide"
                >
                  <ChevronRightIcon className="h-4 w-4" aria-hidden />
                </SecondaryButton>
              </div>
            ) : null}
          </div>
        </div>

        <div className="relative lg:col-start-2 lg:row-start-1 lg:self-center">
          <div className="relative aspect-[4/5] max-h-[26rem] overflow-hidden rounded-sm bg-champagne shadow-lg shadow-stone-900/8 lg:max-h-none">
            {SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity ease-in-out ${
                  idx === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
                }`}
                aria-hidden={idx !== index}
                style={{ transitionDuration: `${fadeMs}ms` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  className="h-full w-full object-cover"
                  fetchPriority={idx === 0 ? "high" : undefined}
                />
              </div>
            ))}
          </div>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {current.heading}. {current.primaryLabel}.
          </p>
        </div>
      </section>
      <SectionBandHighlightEdge />
      </div>
    </>
  );
}
