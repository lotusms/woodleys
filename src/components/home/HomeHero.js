import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { orgEstablished, orgLocation } from "@/config";

const heroImage =
  "https://woodleyjewelers.com/cdn/shop/files/129D2D0B-124A-47E7-9AAD-754D6F1BA1BB_2048x.jpg?v=1639025505";

export default function HomeHero() {
  return (
    <section className="relative z-10 mx-auto grid min-h-[calc(100vh-4.5rem)] w-full max-w-7xl items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:px-12 xl:min-h-[calc(100vh-7.5rem)]">
      <div className="max-w-xl">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
          Beaumont, California · Est. {orgEstablished}
        </p>
        <h1 className="mt-5 font-serif text-5xl font-medium leading-[1.08] tracking-[-0.03em] text-site-fg sm:text-6xl lg:text-[4.25rem]">
          Imagine a jeweler trusted for generations
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-site-secondary">
          Family-owned fine jewelry since {orgEstablished}. Engagement rings,
          diamonds, custom design, watches, and expert care, presented with a quiet
          confidence in {orgLocation}.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <PrimaryButton href="/engagement-wedding">
            Engagement & Wedding
          </PrimaryButton>
          <SecondaryButton href="/appointments">
            Request Appointment
          </SecondaryButton>
        </div>
      </div>

      <div className="relative">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-champagne shadow-lg shadow-stone-900/8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Engagement ring with brilliant diamond in an elegant setting"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
