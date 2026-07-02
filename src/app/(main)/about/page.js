import PageLayout from "@/components/PageLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import {
  orgName,
  orgEstablished,
  orgLocation,
  sitePageTitle,
} from "@/config";

export const metadata = {
  title: sitePageTitle("About"),
  description: `Family-owned fine jewelry in ${orgLocation} since ${orgEstablished}. Heritage, trust, and craftsmanship at ${orgName}.`,
};

const values = [
  {
    title: "Family-owned since 1948",
    body:
      "Three generations of jewelers serving Beaumont and surrounding communities with the same values that opened our doors—honesty, patience, and respect.",
  },
  {
    title: "Guidance without pressure",
    body:
      "We believe fine jewelry decisions deserve unhurried conversation. Every guest is welcomed, and every piece is inspected and cleaned at no charge.",
  },
  {
    title: "Craft that endures",
    body:
      "From engagement rings to restoration work on heirloom pieces, our bench jewelers combine traditional technique with modern precision.",
  },
];

export default function AboutPage() {
  return (
    <PageLayout
      eyebrow="Heritage"
      title={`About ${orgName}`}
      subtitle={`Trusted in ${orgLocation} since ${orgEstablished}. A family-owned fine jeweler devoted to relationships that last as long as the jewelry we create and care for.`}
      buttonArea={<PrimaryButton href="/contact">Visit us</PrimaryButton>}
    >
      <p>
        Woodley&apos;s Jewelers has devotedly served Beaumont and surrounding
        areas since {orgEstablished}. As a family-owned business, we believe
        that family is defined by actions—not words. With your trust, we take
        pride in guiding you toward jewelry that feels genuinely yours.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {values.map((value) => (
          <article
            key={value.title}
            className="rounded-sm border border-stone-200/80 bg-white p-6"
          >
            <h2 className="font-serif text-xl text-site-fg">{value.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-site-secondary">
              {value.body}
            </p>
          </article>
        ))}
      </div>

      <p className="border-l-2 border-warm-gold/30 pl-6 text-sm leading-7 text-site-secondary">
        Your relationship with your jeweler does not end at purchase. We remain
        here for repairs, appraisals, watch service, and the quiet milestones
        that follow.
      </p>
    </PageLayout>
  );
}
