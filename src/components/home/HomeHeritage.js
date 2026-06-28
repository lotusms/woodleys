import Link from "next/link";
import { orgEstablished, orgLocation, orgName } from "@/config";

const heritageBackgroundImage = "/images/map.png";

export default function HomeHeritage() {
  return (
    <section className="relative isolate overflow-hidden border-y border-stone-200/70 bg-ivory py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heritageBackgroundImage}
          alt=""
          className="h-full w-full object-cover object-center opacity-[0.18] saturate-[0.55] sm:opacity-[0.16]"
        />
        <div className="absolute inset-0 fabric-texture opacity-[0.22]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12">
        <div className="min-w-0 max-w-xl">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
            Heritage
          </p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl">
            Imagine a jeweler trusted for generations
          </h2>
        </div>

        <div className="min-w-0 space-y-5 text-base leading-8 text-site-secondary sm:text-lg sm:leading-9">
          <p>
            {orgName} has served {orgLocation} and surrounding communities since{" "}
            {orgEstablished}. As a family-owned house, we believe trust is built
            through actions, patient guidance, honest conversations, and work that
            honors both the piece and the person wearing it.
          </p>
          <p>
            We welcome you as a guest, not a transaction. Every visit includes
            complimentary inspection and cleaning. We never rush a decision that
            deserves time.
          </p>
          <Link
            href="/about"
            className="inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
          >
            Our story
          </Link>
        </div>
      </div>
    </section>
  );
}
