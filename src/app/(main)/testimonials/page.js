import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { orgName, orgLocation, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Testimonials"),
  description: `What guests say about their experience with ${orgName} in ${orgLocation}.`,
};

const testimonials = [
  {
    quote:
      "They never rushed us. We left understanding every option and feeling certain about the ring we chose.",
    name: "Sarah & Michael",
    detail: "Engagement ring",
    image: {
      src: "/images/testimonials/testimonial-engagement.jpg",
      alt: "A couple celebrating their engagement ring purchase with a Woodley's jeweler",
    },
  },
  {
    quote:
      "Three generations of our family have shopped here. The care they give heirloom pieces is unmatched.",
    name: "Elena R.",
    detail: "Beaumont",
    image: {
      src: "/images/testimonials/testimonial-beaumont.jpg",
      alt: "A multi-generational family with a Woodley's sales associate in the showroom",
    },
  },
  {
    quote:
      "Custom design felt collaborative, not overwhelming. They listened, sketched, and delivered something we will wear for life.",
    name: "James T.",
    detail: "Custom jewelry",
    image: {
      src: "/images/testimonials/testimonial-custom.jpg",
      alt: "A customer and jeweler celebrating a finished custom design at the bench",
    },
  },
  {
    quote:
      "Clear guidance on natural versus lab-grown diamonds without any pressure. Exactly the honesty we hoped for.",
    name: "Priya & David",
    detail: "Diamond consultation",
    image: {
      src: "/images/testimonials/testimonial-diamonds.jpg",
      alt: "A couple with a jeweler after a diamond consultation in the showroom",
    },
  },
  {
    quote:
      "Brought in a watch that needed attention and a necklace that needed resizing. Both came back looking renewed.",
    name: "Robert K.",
    detail: "Repairs & service",
    image: {
      src: "/images/testimonials/testimonial-service.jpg",
      alt: "A customer receiving repaired jewelry from a Woodley's jeweler",
    },
  },
  {
    quote:
      "A quiet, welcoming showroom. You feel like a guest, not a transaction.",
    name: "Amanda L.",
    detail: "Showroom visit",
    image: {
      src: "/images/testimonials/testimonial-showroom.jpg",
      alt: "A guest with a sales associate enjoying a welcoming showroom visit",
    },
  },
];

/**
 * @param {{
 *   item: (typeof testimonials)[number];
 *   featured?: boolean;
 * }} props
 */
function TestimonialCard({ item, featured = false }) {
  if (featured) {
    return (
      <blockquote className="group relative grid overflow-hidden rounded-sm border border-stone-200/70 bg-white shadow-[0_18px_40px_-28px_rgba(44,40,37,0.45)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="relative aspect-[16/11] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-stone-950/25 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-stone-950/10"
            aria-hidden
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-8 sm:px-9 sm:py-10 lg:px-10 lg:py-12">
          <span
            className="font-serif text-5xl leading-none text-warm-gold/70"
            aria-hidden
          >
            &ldquo;
          </span>
          <p className="mt-3 font-serif text-2xl leading-relaxed tracking-[-0.02em] text-site-fg sm:text-[1.65rem] sm:leading-[1.45]">
            {item.quote}
          </p>
          <footer className="mt-8">
            <div className="h-px w-10 bg-warm-gold/55" aria-hidden />
            <cite className="mt-4 block not-italic text-sm font-semibold tracking-wide text-site-fg">
              {item.name}
            </cite>
            <p className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-warm-gold-dark">
              {item.detail}
            </p>
          </footer>
        </div>
      </blockquote>
    );
  }

  return (
    <blockquote className="group flex h-full flex-col overflow-hidden rounded-sm border border-stone-200/70 bg-white shadow-[0_14px_32px_-26px_rgba(44,40,37,0.4)]">
      <div className="relative aspect-[5/3] overflow-hidden">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950/35 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col px-5 py-6 sm:px-6 sm:py-7">
        <span
          className="font-serif text-4xl leading-none text-warm-gold/65"
          aria-hidden
        >
          &ldquo;
        </span>
        <p className="mt-2 font-serif text-lg leading-relaxed text-site-fg sm:text-xl sm:leading-relaxed">
          {item.quote}
        </p>
        <footer className="mt-auto pt-6">
          <div className="h-px w-8 bg-warm-gold/50" aria-hidden />
          <cite className="mt-3.5 block not-italic text-sm font-semibold text-site-fg">
            {item.name}
          </cite>
          <p className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-warm-gold-dark">
            {item.detail}
          </p>
        </footer>
      </div>
    </blockquote>
  );
}

export default function TestimonialsPage() {
  const [featured, ...rest] = testimonials;

  return (
    <PageLayout
      eyebrow="Voices"
      title="Testimonials"
      subtitle={`Words from guests who have trusted ${orgName} with milestones, heirlooms, and everyday elegance.`}
      buttonArea={<PrimaryButton href="/contact">Book a visit</PrimaryButton>}
    >
      <div className="flex flex-col gap-6 sm:gap-8">
        <TestimonialCard item={featured} featured />

        <ul className="grid gap-6 md:grid-cols-2" role="list">
          {rest.map((item) => (
            <li key={item.name}>
              <TestimonialCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}
