import Link from "next/link";
import {
  RiCalendarLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
} from "react-icons/ri";
import {
  orgEmail,
  orgLocation,
  orgPhone,
  orgPhoneTel,
} from "@/config";

const visitHighlights = [
  {
    title: "Engagement & wedding",
    body: "Compare settings, stones, and proportions side by side with unhurried guidance.",
  },
  {
    title: "Custom design",
    body: "Bring a sketch, a photo, or a family stone, we shape the idea at the bench.",
  },
  {
    title: "Repairs & service",
    body: "Restoration, watch service, appraisals, and complimentary inspection while you visit.",
  },
];

/** Beaumont heritage image with visit highlight cards overlaid at the bottom. */
export function ContactPageHero() {
  return (
    <figure className="relative left-1/2 m-0 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-champagne">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/beaumont-heritage.png"
        alt=""
        className="block aspect-[16/10] w-full object-cover object-center"
      />
      <div
        className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/92 via-stone-950/55 to-transparent pb-4 pt-20 sm:pb-5 sm:pt-24"
        aria-label="Reasons to visit"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            {visitHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-sm border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-5"
              >
                <h2 className="font-serif text-lg text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

/** Full-width dark band: call, email, showroom, and complimentary visit note. */
export function ContactPageContactBand() {
  return (
    <section
      aria-label="Contact Woodley's Jewelers"
      className="relative left-1/2 m-0 w-screen max-w-[100vw] -translate-x-1/2 bg-stone-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-14 lg:px-12">
        <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          <a
            href={`tel:${orgPhoneTel}`}
            className="group rounded-sm border border-white/10 bg-white/5 p-6 transition hover:border-amber-200/30 hover:bg-white/8"
          >
            <RiPhoneLine className="h-6 w-6 text-amber-200/90" aria-hidden />
            <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/55">
              Call
            </p>
            <p className="mt-2 font-serif text-xl text-white transition group-hover:text-amber-100">
              {orgPhone}
            </p>
          </a>

          <a
            href={`mailto:${orgEmail}`}
            className="group rounded-sm border border-white/10 bg-white/5 p-6 transition hover:border-amber-200/30 hover:bg-white/8"
          >
            <RiMailLine className="h-6 w-6 text-amber-200/90" aria-hidden />
            <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/55">
              Email
            </p>
            <p className="mt-2 break-words font-serif text-xl text-white transition group-hover:text-amber-100">
              {orgEmail}
            </p>
          </a>

          <div className="rounded-sm border border-white/10 bg-white/5 p-6">
            <RiMapPinLine className="h-6 w-6 text-amber-200/90" aria-hidden />
            <p className="mt-4 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/55">
              Showroom
            </p>
            <p className="mt-2 font-serif text-xl text-white">{orgLocation}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              Private appointments by request
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="inline-flex items-center gap-2 text-sm text-white/70">
            <RiCalendarLine className="h-4 w-4 text-amber-200/80" aria-hidden />
            Complimentary inspection & cleaning at every visit
          </p>
          <Link
            href="/about"
            className="text-sm font-semibold text-amber-100/90 underline-offset-4 transition hover:text-amber-50 hover:underline"
          >
            Our story →
          </Link>
        </div>
      </div>
    </section>
  );
}
