import PageLayout from "@/components/PageLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { orgName, orgLocation, orgPhone, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("FAQs"),
  description: `Common questions about shopping, appointments, diamonds, shipping, and care at ${orgName} in ${orgLocation}.`,
};

const faqs = [
  {
    question: "Do I need an appointment to visit?",
    answer:
      "Walk-ins are always welcome. For engagement consultations, custom design, or a private viewing, booking a visit helps us prepare pieces and give you unhurried time with our team.",
  },
  {
    question: "What is your shipping policy?",
    answer:
      "Orders over $500 ship free. Orders under $500 have a $15 flat-rate shipping fee per item. We pack discreetly and with care.",
  },
  {
    question: "Do you offer both natural and lab-grown diamonds?",
    answer:
      "Yes. We present both clearly so you can compare origin, cut, and pricing with confidence. Our team explains the differences in plain language—never with pressure.",
  },
  {
    question: "Can you create a custom piece?",
    answer:
      "Absolutely. From first sketch to finished jewelry, we guide you through custom design. A design consultation is available, and the consultation fee is applied toward your final design when you proceed.",
  },
  {
    question: "Do you repair jewelry not purchased at Woodley's?",
    answer:
      "Yes. Our bench jewelers restore and repair pieces whether they were purchased here or elsewhere—prongs, sizing, clasps, cleaning, and more.",
  },
  {
    question: "How do I care for my jewelry after purchase?",
    answer:
      "Bring pieces in for complimentary inspection and cleaning. We also offer professional care services including rhodium plating, watch service, and appraisals.",
  },
];

export default function FaqsPage() {
  return (
    <PageLayout
      eyebrow="Help"
      title="Frequently asked questions"
      subtitle={`Straightforward answers about visiting ${orgName}, shopping with us, and caring for your jewelry.`}
      buttonArea={<PrimaryButton href="/contact">Ask us anything</PrimaryButton>}
    >
      <div className="space-y-8">
        {faqs.map((item) => (
          <section
            key={item.question}
            className="border-b border-stone-200/80 pb-8 last:border-b-0 last:pb-0"
          >
            <h2 className="font-serif text-2xl text-site-fg">{item.question}</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-site-secondary">
              {item.answer}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-site-secondary">
        Still have a question? Call us at{" "}
        <a
          href={`tel:${orgPhone.replace(/\D/g, "")}`}
          className="font-medium text-warm-gold-dark underline-offset-4 hover:underline"
        >
          {orgPhone}
        </a>{" "}
        or{" "}
        <a
          href="/contact"
          className="font-medium text-warm-gold-dark underline-offset-4 hover:underline"
        >
          contact us
        </a>
        .
      </p>
    </PageLayout>
  );
}
