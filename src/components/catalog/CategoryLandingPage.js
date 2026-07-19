import Link from "next/link";
import CategoryPageLayout from "@/components/catalog/CategoryPageLayout";
import CategoryGrid from "@/components/catalog/CategoryGrid";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sitePageTitle } from "@/config";
import { isServiceCatalogSection } from "@/lib/catalog/categories";

/**
 * @param {{
 *   sectionKey: string;
 *   section: import("@/lib/catalog/categories").CatalogSection;
 * }} props
 */
export default function CategoryLandingPage({ sectionKey, section }) {
  const items = section.children.map((child) => ({
    title: child.title,
    description: child.description,
    href: `/${sectionKey}/${child.slug}`,
    image: child.image?.src,
    alt: child.image?.alt,
  }));

  const heroImage = section.children[0]?.image;
  const isAudienceHub = section.hub === "audience";
  const isService = isServiceCatalogSection(section);

  return (
    <CategoryPageLayout
      eyebrow={section.eyebrow}
      title={section.title}
      subtitle={section.description}
      heroImage={heroImage}
      breadcrumbs={
        isService
          ? [{ label: section.title }]
          : [{ label: "Shop All", href: "/shop-all" }, { label: section.title }]
      }
      actions={
        <>
          {isService ? (
            <PrimaryButton href="/contact">Book a visit</PrimaryButton>
          ) : (
            <PrimaryButton href="/shop-all">Shop All</PrimaryButton>
          )}
          {isAudienceHub ? (
            <Link
              href={sectionKey === "women" ? "/men" : "/women"}
              className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/20"
            >
              Shop {sectionKey === "women" ? "Men" : "Women"}
            </Link>
          ) : null}
        </>
      }
    >
      <p className="max-w-3xl text-lg leading-relaxed text-site-secondary">
        {section.intro}
      </p>

      <div className="mt-16">
        <div className="border-b border-stone-200/80 pb-8">
          <h2 className="font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
            {isService
              ? sectionKey === "custom-jewelry"
                ? "Ways to begin"
                : "How we can help"
              : isAudienceHub
                ? `Shop ${section.title}`
                : `Within ${section.title}`}
          </h2>
          {isAudienceHub ? (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-site-secondary">
              Choose a jewelry type below. Pieces marked unisex appear in both
              Women and Men; bridal and service paths remain available in the main menu.
            </p>
          ) : null}
          {isService ? (
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-site-secondary">
              These are appointments and bench work, not products. Choose a path
              below, then book a visit or call the showroom.
            </p>
          ) : null}
        </div>
        <div className="mt-10">
          <CategoryGrid
            items={items}
            ctaLabel={isService ? "Learn more" : undefined}
          />
        </div>
      </div>
    </CategoryPageLayout>
  );
}

export function buildSectionMetadata(section) {
  return {
    title: sitePageTitle(section.title),
    description: section.description,
  };
}
