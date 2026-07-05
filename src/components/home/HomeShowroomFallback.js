import Link from "next/link";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Card from "@/components/ui/Card";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";

export default function HomeShowroomFallback() {
  return (
    <section
      aria-labelledby="home-showroom-fallback-heading"
      className="relative isolate overflow-hidden bg-champagne py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 fabric-texture opacity-[0.14]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="max-w-xl">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-site-secondary">
            From the showroom
          </p>
          <h2
            id="home-showroom-fallback-heading"
            className="mt-4 font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl"
          >
            Pieces worth seeing in person
          </h2>
          <p className="mt-5 text-base leading-relaxed text-site-secondary sm:text-lg sm:leading-8">
            Browse our collections online, then visit the showroom to compare
            stones, settings, and styles under natural light.
          </p>
        </div>

        <Card variant="inset" className="mt-10 max-w-2xl">
          <p className="text-sm leading-relaxed text-site-secondary">
            Featured pieces will appear here as the catalog is updated. In the
            meantime, explore engagement rings, diamonds, watches, and custom
            design.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/shop-all">Explore collections</PrimaryButton>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center text-sm font-semibold text-warm-gold-dark underline-offset-4 hover:underline"
            >
              Book a visit
            </Link>
          </div>
        </Card>
      </div>
      <SectionBandHighlightEdge />
    </section>
  );
}
