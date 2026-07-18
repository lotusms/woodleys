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
  },
  {
    quote:
      "Three generations of our family have shopped here. The care they give heirloom pieces is unmatched.",
    name: "Elena R.",
    detail: "Beaumont",
  },
  {
    quote:
      "Custom design felt collaborative, not overwhelming. They listened, sketched, and delivered something we will wear for life.",
    name: "James T.",
    detail: "Custom jewelry",
  },
  {
    quote:
      "Clear guidance on natural versus lab-grown diamonds without any pressure. Exactly the honesty we hoped for.",
    name: "Priya & David",
    detail: "Diamond consultation",
  },
  {
    quote:
      "Brought in a watch that needed attention and a necklace that needed resizing. Both came back looking renewed.",
    name: "Robert K.",
    detail: "Repairs & service",
  },
  {
    quote:
      "A quiet, welcoming showroom. You feel like a guest, not a transaction.",
    name: "Amanda L.",
    detail: "Showroom visit",
  },
];

export default function TestimonialsPage() {
  return (
    <PageLayout
      eyebrow="Voices"
      title="Testimonials"
      subtitle={`Words from guests who have trusted ${orgName} with milestones, heirlooms, and everyday elegance.`}
      buttonArea={<PrimaryButton href="/contact">Book a visit</PrimaryButton>}
    >
      <ul className="grid gap-6 md:grid-cols-2" role="list">
        {testimonials.map((item) => (
          <li key={item.name}>
            <blockquote className="flex h-full flex-col rounded-sm border border-stone-200/80 bg-white p-6 sm:p-8">
              <p className="font-serif text-xl leading-relaxed text-site-fg">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-stone-100 pt-4">
                <cite className="not-italic text-sm font-semibold text-site-fg">
                  {item.name}
                </cite>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-site-secondary">
                  {item.detail}
                </p>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
