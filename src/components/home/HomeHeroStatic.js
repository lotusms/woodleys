import Link from "next/link";
import CatalogImage from "@/components/ui/CatalogImage";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";
import { orgEstablished, orgLocation } from "@/config";
import { HOME_HERO_LCP_SLIDE } from "@/lib/home-hero-slides";

const primaryBtnClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-warm-gold px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-300 ease-out hover:bg-warm-gold-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold-dark sm:w-auto";

const secondaryBtnClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-full border border-stone-300/90 bg-white px-6 py-3.5 text-sm font-semibold text-site-fg transition duration-300 ease-out hover:border-warm-gold hover:bg-champagne/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold-dark sm:w-auto";

/** Server-rendered first hero slide — zero client JS on the critical path. */
export default function HomeHeroStatic() {
  const slide = HOME_HERO_LCP_SLIDE;

  return (
    <div
      data-hero-static
      className="relative left-1/2 z-10 w-screen max-w-[100vw] -translate-x-1/2 [.home-hero-root:has([data-hero-interactive])_&]:invisible"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className={`absolute inset-0 ${slide.sectionBg}`} />
        <div className={`absolute inset-0 ${slide.sectionGlow}`} />
        <div className="fabric-texture absolute inset-0 opacity-[0.12]" />
      </div>

      <section
        aria-label="Featured collections"
        className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pb-12 pt-8 sm:px-10 sm:pb-16 sm:pt-10 lg:grid-cols-2 lg:items-stretch lg:gap-12 lg:px-12 lg:pb-16 lg:pt-12 xl:min-h-[calc(100vh-8rem)]"
      >
        <div className="max-w-xl lg:col-start-1 lg:row-start-1 lg:self-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
            {orgLocation} · Est. {orgEstablished} · By appointment
          </p>
          <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.08] tracking-[-0.03em] text-site-fg sm:text-6xl lg:text-[4.25rem]">
            {slide.heading}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-site-secondary">
            {slide.body}
          </p>
          <div className="relative mt-8 flex w-full max-w-full flex-col gap-3 sm:min-h-11 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
              <Link href={slide.primaryHref} className={primaryBtnClass}>
                {slide.primaryLabel}
              </Link>
              <Link href={slide.secondaryHref} className={secondaryBtnClass}>
                {slide.secondaryLabel}
              </Link>
            </div>
            <div
              className="hidden shrink-0 items-center gap-2 sm:flex motion-reduce:hidden sm:min-w-[8.75rem]"
              aria-hidden
            >
              <span className="size-11 rounded-full border border-transparent" />
              <span className="size-11 rounded-full border border-transparent" />
              <span className="size-11 rounded-full border border-transparent" />
            </div>
          </div>
        </div>

        <div className="relative min-h-[22rem] lg:col-start-2 lg:row-start-1 lg:min-h-0">
          <div className="relative aspect-[4/5] max-h-[26rem] overflow-hidden rounded-sm bg-champagne shadow-lg shadow-stone-900/8 sm:max-h-[30rem] lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:max-h-none">
            <CatalogImage
              src={slide.image}
              alt={slide.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>
      <SectionBandHighlightEdge />
    </div>
  );
}
