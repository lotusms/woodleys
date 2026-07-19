import Link from "next/link";
import CategoryPageLayout from "@/components/catalog/CategoryPageLayout";
import CategoryGrid from "@/components/catalog/CategoryGrid";
import CatalogProductSection from "@/components/catalog/CatalogProductSection";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { orgPhone, orgPhoneTel, sitePageTitle } from "@/config";
import { isServiceCatalogSection } from "@/lib/catalog/categories";

const heroSecondaryClass =
  "inline-flex items-center justify-center rounded-full border border-white/45 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/20";

/**
 * @param {{
 *   sectionKey: string;
 *   entry: import("@/lib/catalog/categories").CategoryEntry;
 * }} props
 */
function servicePrimaryCta({ sectionKey, entry }) {
  if (sectionKey === "custom-jewelry" && entry.slug === "consultation") {
    return { href: "/contact", label: "Request consultation" };
  }
  if (sectionKey === "custom-jewelry") {
    return { href: "/contact", label: "Start a conversation" };
  }
  return { href: "/contact", label: "Book a visit" };
}

/**
 * @param {{
 *   sectionKey: string;
 *   entry: import("@/lib/catalog/categories").CategoryEntry;
 * }} props
 */
function ServiceDetailPanel({ sectionKey, entry }) {
  const cta = servicePrimaryCta({ sectionKey, entry });
  const isConsultation =
    sectionKey === "custom-jewelry" && entry.slug === "consultation";

  return (
    <div className="mb-6 rounded-sm border border-stone-200/80 bg-gradient-to-br from-champagne/80 to-ivory p-8 sm:p-10">
      <h2 className="font-serif text-2xl text-site-fg sm:text-3xl">
        {isConsultation ? "Design consultation" : `About ${entry.title}`}
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-site-secondary sm:text-lg">
        {entry.description}
      </p>
      {isConsultation ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-site-secondary">
          Your $200 consultation fee is applied toward your final design when you
          proceed.
        </p>
      ) : (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-site-secondary">
          Visit our Beaumont showroom or call to discuss your piece with a jeweler.
          We will confirm timing, care details, and next steps before any work begins.
        </p>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <PrimaryButton href={cta.href}>{cta.label}</PrimaryButton>
        <a
          href={`tel:${orgPhoneTel}`}
          className="inline-flex items-center justify-center rounded-full border border-stone-300/80 bg-white px-6 py-3.5 text-sm font-semibold text-site-fg transition hover:border-warm-gold hover:bg-champagne"
        >
          Call {orgPhone}
        </a>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   sectionKey: string;
 *   section: import("@/lib/catalog/categories").CatalogSection;
 *   entry: import("@/lib/catalog/categories").CategoryEntry;
 *   ancestors?: import("@/lib/catalog/categories").CategoryEntry[];
 *   slugPath?: string[];
 *   products: import("@/lib/catalog/product-types").CatalogProduct[];
 * }} props
 */
export default function CategoryDetailPage({
  sectionKey,
  section,
  entry,
  ancestors = [],
  slugPath = [entry.slug],
  products,
}) {
  const isService = isServiceCatalogSection(section);
  const emptyMessage = `No products in ${entry.title} yet.`;
  const parentHref =
    ancestors.length > 0
      ? `/${sectionKey}/${ancestors.map((a) => a.slug).join("/")}`
      : `/${sectionKey}`;
  const parentLabel =
    ancestors.length > 0 ? ancestors[ancestors.length - 1].title : section.title;

  const breadcrumbs = [
    { label: section.title, href: `/${sectionKey}` },
    ...ancestors.map((ancestor, index) => ({
      label: ancestor.title,
      href: `/${sectionKey}/${ancestors
        .slice(0, index + 1)
        .map((a) => a.slug)
        .join("/")}`,
    })),
    { label: entry.title },
  ];

  const childItems =
    Array.isArray(entry.children) && entry.children.length > 0
      ? entry.children.map((child) => ({
          title: child.title,
          description: child.description,
          href: `/${sectionKey}/${[...slugPath, child.slug].join("/")}`,
          image: child.image?.src,
          alt: child.image?.alt,
          symbol: child.symbol,
          symbolClass: child.symbolClass,
        }))
      : [];

  const metalItems = childItems.filter((item) => item.symbol);
  const otherItems = childItems.filter((item) => !item.symbol);

  const isDiamondOrigin =
    sectionKey === "diamonds" &&
    (entry.slug === "natural-diamonds" || entry.slug === "lab-grown-diamonds");
  const isVintageWatches =
    sectionKey === "watches" && entry.slug === "vintage-watches";

  const otherHeading = isDiamondOrigin
    ? "Browse by shape"
    : isVintageWatches
      ? "Browse by brand"
      : `Within ${entry.title}`;

  const serviceCta = servicePrimaryCta({ sectionKey, entry });

  return (
    <CategoryPageLayout
      eyebrow={section.eyebrow}
      title={entry.title}
      subtitle={entry.description}
      heroImage={entry.image}
      breadcrumbs={breadcrumbs}
      actions={
        isService ? (
          <>
            <PrimaryButton href={serviceCta.href}>{serviceCta.label}</PrimaryButton>
            <Link href={parentHref} className={heroSecondaryClass}>
              {ancestors.length > 0 ? parentLabel : `All ${section.title}`}
            </Link>
          </>
        ) : (
          <>
            <PrimaryButton href="/shop-all">Browse catalog</PrimaryButton>
            <Link href={parentHref} className={heroSecondaryClass}>
              {ancestors.length > 0 ? parentLabel : `All ${section.title}`}
            </Link>
          </>
        )
      }
    >
      {isService ? <ServiceDetailPanel sectionKey={sectionKey} entry={entry} /> : null}

      {otherItems.length > 0 ? (
        <div className="mb-16">
          <div className="border-b border-stone-200/80 pb-8">
            <h2 className="font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
              {otherHeading}
            </h2>
            {isDiamondOrigin ? (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-site-secondary">
                Choose a cut to compare stones and pricing for this origin.
              </p>
            ) : null}
            {isVintageWatches ? (
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-site-secondary">
                Choose a maker to explore our vintage selection.
              </p>
            ) : null}
          </div>
          <div className="mt-10">
            <CategoryGrid items={otherItems} />
          </div>
        </div>
      ) : null}

      {metalItems.length > 0 ? (
        <div className="mb-16">
          <div className="border-b border-stone-200/80 pb-8">
            <h2 className="font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
              Shop by metal
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-site-secondary">
              Choose a metal to refine this collection.
            </p>
          </div>
          <div className="mt-10">
            <CategoryGrid items={metalItems} />
          </div>
        </div>
      ) : null}

      {!isService ? (
        <CatalogProductSection
          label={childItems.length > 0 ? `All ${entry.title}` : entry.title}
          products={products}
          emptyMessage={emptyMessage}
        />
      ) : null}
    </CategoryPageLayout>
  );
}

export function buildEntryMetadata(section, entry) {
  return {
    title: sitePageTitle(entry.title),
    description: entry.description,
  };
}
