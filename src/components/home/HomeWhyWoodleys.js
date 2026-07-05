import Link from "next/link";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { orgEstablished, orgLocation, orgName } from "@/config";

const heritageBackgroundImage = "/images/map.png";

const pillars = [
  {
    title: "Showroom guidance",
    description:
      "Work one-on-one with jewelers who listen first, then help you compare stones, settings, and styles without pressure.",
    href: "/engagement-wedding",
  },
  {
    title: "Custom bench work",
    description:
      "From a first sketch to resetting a family heirloom, our bench jewelers bring designs to life in-house.",
    href: "/custom-jewelry",
  },
  {
    title: "Complimentary care",
    description:
      "Every visit includes inspection and cleaning, plus honest advice on wear, repair, and preservation.",
    href: "/services",
  },
  {
    title: `Trusted since ${orgEstablished}`,
    description:
      `Three generations serving ${orgLocation} and families across Southern California with quiet confidence.`,
    href: "/about",
  },
];

export default function HomeWhyWoodleys() {
  return (
    <section
      aria-labelledby="home-why-heading"
      className="relative isolate overflow-hidden bg-ivory py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heritageBackgroundImage}
          alt=""
          className="h-full w-full object-cover object-[center_42%] opacity-[0.24] saturate-[0.62] contrast-[1.04] sm:opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(253,251,247,0.72)_0%,rgba(253,251,247,0.28)_42%,rgba(253,251,247,0.08)_68%,transparent_88%)]" />
        <div className="absolute inset-0 fabric-texture opacity-[0.18]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end lg:gap-16">
          <div className="min-w-0 max-w-xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-site-secondary">
              Why Woodley&apos;s
            </p>
            <h2
              id="home-why-heading"
              className="mt-4 text-balance font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl"
            >
              Every visit is personal. Every decision, unhurried.
            </h2>
          </div>

          <div className="min-w-0 space-y-5 rounded-sm bg-ivory/55 px-5 py-5 text-base leading-8 text-site-fg backdrop-blur-[2px] sm:px-6 sm:text-lg sm:leading-9 lg:bg-ivory/40 lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <p>
              {orgName} is built for moments that matter: engagements, anniversaries,
              heirlooms restored, and pieces you will wear for decades. Browse our
              collections online, then visit our showroom when you are ready to see,
              feel, and compare in person.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <SecondaryButton href="/about">Our story</SecondaryButton>
              <PrimaryButton href="/shop-all">Browse collections</PrimaryButton>
            </div>
          </div>
        </div>

        <ul
          className="mt-14 grid gap-px overflow-hidden rounded-sm border border-stone-300/35 bg-stone-300/35 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {pillars.map((pillar, index) => (
            <li key={pillar.title}>
              <Link
                href={pillar.href}
                className="group block h-full bg-ivory/92 px-6 py-8 backdrop-blur-[3px] transition hover:bg-ivory sm:px-7 sm:py-9 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warm-gold-dark"
              >
                <p className="font-sans text-[0.62rem] font-semibold tabular-nums tracking-[0.28em] text-warm-gold-dark">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-serif text-xl font-medium tracking-[-0.02em] text-site-fg transition group-hover:text-warm-gold-dark">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-site-secondary">
                  {pillar.description}
                </p>
                <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-warm-gold-dark opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  Learn more
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <SectionBandHighlightEdge />
    </section>
  );
}
