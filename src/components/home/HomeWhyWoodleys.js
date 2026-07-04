import Link from "next/link";
import { orgEstablished, orgLocation, orgName } from "@/config";

const heritageBackgroundImage = "/images/map.png";

const pillars = [
  {
    title: "Showroom guidance",
    description:
      "Work one-on-one with jewelers who listen first, then help you compare stones, settings, and styles without pressure.",
  },
  {
    title: "Custom bench work",
    description:
      "From a first sketch to resetting a family heirloom, our bench jewelers bring designs to life in-house.",
  },
  {
    title: "Complimentary care",
    description:
      "Every visit includes inspection and cleaning, plus honest advice on wear, repair, and preservation.",
  },
  {
    title: `Trusted since ${orgEstablished}`,
    description:
      `Three generations serving ${orgLocation} and families across Southern California with quiet confidence.`,
  },
];

export default function HomeWhyWoodleys() {
  return (
    <section
      aria-labelledby="home-why-heading"
      className="relative isolate overflow-hidden border-y border-stone-200/70 bg-ivory py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heritageBackgroundImage}
          alt=""
          className="h-full w-full object-cover object-center opacity-[0.18] saturate-[0.55] sm:opacity-[0.16]"
        />
        <div className="absolute inset-0 fabric-texture opacity-[0.22]" />
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

          <div className="min-w-0 space-y-5 text-base leading-8 text-site-secondary sm:text-lg sm:leading-9">
            <p>
              {orgName} is built for moments that matter: engagements, anniversaries,
              heirlooms restored, and pieces you will wear for decades. Browse our
              collections online, then visit our showroom when you are ready to see,
              feel, and compare in person.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
              <Link
                href="/shop-all"
                className="inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
              >
                Browse collections
              </Link>
              <Link
                href="/about"
                className="inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
              >
                Our story
              </Link>
              <Link
                href="/contact"
                className="inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
              >
                Book a visit
              </Link>
            </div>
          </div>
        </div>

        <ul
          className="mt-14 grid gap-px overflow-hidden rounded-sm border border-stone-300/35 bg-stone-300/35 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
          role="list"
        >
          {pillars.map((pillar, index) => (
            <li
              key={pillar.title}
              className="bg-ivory/95 px-6 py-8 backdrop-blur-[2px] sm:px-7 sm:py-9"
            >
              <p className="font-sans text-[0.62rem] font-semibold tabular-nums tracking-[0.28em] text-warm-gold-dark">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-xl font-medium tracking-[-0.02em] text-site-fg">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-site-secondary">
                {pillar.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
