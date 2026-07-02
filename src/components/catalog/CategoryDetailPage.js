import Link from "next/link";
import CategoryPageLayout from "@/components/catalog/CategoryPageLayout";
import CatalogProductSection from "@/components/catalog/CatalogProductSection";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sitePageTitle } from "@/config";

const heroSecondaryClass =
  "inline-flex items-center justify-center rounded-full border border-white/45 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/20";

/**
 * @param {{
 *   sectionKey: string;
 *   section: import("@/lib/catalog/categories").CATALOG_SECTIONS[string];
 *   entry: import("@/lib/catalog/categories").CategoryEntry;
 *   products: import("@/lib/catalog/product-types").CatalogProduct[];
 * }} props
 */
export default function CategoryDetailPage({ sectionKey, section, entry, products }) {
  const emptyMessage = `No products in ${entry.title} yet.`;

  return (
    <CategoryPageLayout
      eyebrow={section.eyebrow}
      title={entry.title}
      subtitle={entry.description}
      heroImage={entry.image}
      breadcrumbs={[
        { label: section.title, href: `/${sectionKey}` },
        { label: entry.title },
      ]}
      actions={
        <>
          <PrimaryButton href="/shop-all">Browse catalog</PrimaryButton>
          <Link href={`/${sectionKey}`} className={heroSecondaryClass}>
            All {section.title}
          </Link>
        </>
      }
    >
      {sectionKey === "custom-jewelry" && entry.slug === "consultation" ? (
        <div className="mb-14 rounded-sm border border-stone-200/80 bg-gradient-to-br from-champagne/80 to-ivory p-8 sm:p-10">
          <h2 className="font-serif text-2xl text-site-fg">Design consultation</h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-site-secondary">
            Schedule a one-on-one consultation with our design team. Your $200
            consultation fee is applied toward your final design when you proceed.
          </p>
          <PrimaryButton href="/contact" className="mt-6">
            Request consultation
          </PrimaryButton>
        </div>
      ) : null}

      {sectionKey === "diamonds" &&
      (entry.slug === "natural-diamonds" || entry.slug === "lab-grown-diamonds") ? (
        <div className="mb-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-stone-200/80 bg-white p-8 shadow-sm shadow-stone-900/5">
            <h2 className="font-serif text-xl text-site-fg">Natural diamonds</h2>
            <p className="mt-3 text-sm leading-relaxed text-site-secondary">
              Formed over millennia. Each stone carries its own character. We
              explain origin and grading in plain language.
            </p>
            <Link
              href="/diamonds/natural-diamonds"
              className="mt-5 inline-block text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
            >
              Explore natural diamonds
            </Link>
          </div>
          <div className="rounded-sm border border-stone-200/80 bg-white p-8 shadow-sm shadow-stone-900/5">
            <h2 className="font-serif text-xl text-site-fg">Lab-grown diamonds</h2>
            <p className="mt-3 text-sm leading-relaxed text-site-secondary">
              Created in controlled environments with identical optical
              properties. We help you compare options without pressure.
            </p>
            <Link
              href="/diamonds/lab-grown-diamonds"
              className="mt-5 inline-block text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
            >
              Explore lab-grown diamonds
            </Link>
          </div>
        </div>
      ) : null}

      <CatalogProductSection
        label={entry.title}
        products={products}
        emptyMessage={emptyMessage}
      />
    </CategoryPageLayout>
  );
}

export function buildEntryMetadata(section, entry) {
  return {
    title: sitePageTitle(entry.title),
    description: entry.description,
  };
}
