import Link from "next/link";
import PrimaryButton from "@/components/ui/PrimaryButton";
import CatalogImage from "@/components/ui/CatalogImage";
import { SiteLogoImage } from "@/components/brand/SiteLogo";
import {
  orgEstablished,
  orgLocation,
  orgPhone,
  orgPhoneTel,
} from "@/config";

const SHOWROOM_IMAGE =
  "https://woodleyjewelers.com/cdn/shop/files/blowtorch-shaping-ring_800x800.jpg?v=1639027342";

export default function VisitShowroomCta() {
  return (
    <section
      aria-labelledby="visit-showroom-heading"
      className="relative left-1/2 z-10 w-screen max-w-[100vw] -translate-x-1/2"
    >
      <div className="relative min-h-[28rem] overflow-hidden bg-stone-950 sm:min-h-[32rem]">
        <CatalogImage
          src={SHOWROOM_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="scale-105 object-cover object-center opacity-35"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/88 to-stone-950/75"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-stone-950/20"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16 lg:px-12 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-amber-100/80">
              Private appointments · {orgLocation}
            </p>
            <h2
              id="visit-showroom-heading"
              className="mt-5 font-serif text-4xl font-medium leading-[1.06] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.35rem]"
            >
              See it in person before you decide.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/78 sm:text-lg">
              See the weight, the fire, the fit before you commit. A private hour
              in our showroom for engagement selections, custom design, heirloom
              restoration, and guidance from jewelers trusted here since{" "}
              {orgEstablished}.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <PrimaryButton href="/contact" className="shadow-lg shadow-stone-950/30">
                Book a private visit
              </PrimaryButton>
              <Link
                href={`tel:${orgPhoneTel}`}
                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/55 hover:bg-white/14 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warm-gold"
              >
                Call {orgPhone}
              </Link>
            </div>
          </div>

          <div className="hidden max-w-xs border-l border-white/15 pl-10 lg:block">
            <SiteLogoImage height={92} className="opacity-40" />
            <p className="mt-6 max-w-[12rem] text-sm leading-relaxed text-white/55">
              Three generations of jewelers, one quiet showroom in {orgLocation}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
