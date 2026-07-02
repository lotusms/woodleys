import CategoryPageLayout from "@/components/catalog/CategoryPageLayout";
import CatalogProductSection from "@/components/catalog/CatalogProductSection";
import CategoryGrid from "@/components/catalog/CategoryGrid";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sitePageTitle } from "@/config";

/**
 * @param {{
 *   sectionKey: string;
 *   section: import("@/lib/catalog/categories").CATALOG_SECTIONS[string];
 *   products: import("@/lib/catalog/product-types").CatalogProduct[];
 * }} props
 */
export default function CategoryLandingPage({ sectionKey, section, products }) {
  const items = section.children.map((child) => ({
    title: child.title,
    description: child.description,
    href: `/${sectionKey}/${child.slug}`,
    image: child.image?.src,
    alt: child.image?.alt,
  }));

  const emptyMessage = `No products in ${section.title} yet.`;
  const heroImage = section.children[0]?.image;

  return (
    <CategoryPageLayout
      eyebrow={section.eyebrow}
      title={section.title}
      subtitle={section.description}
      heroImage={heroImage}
      breadcrumbs={[{ label: "Shop All", href: "/shop-all" }, { label: section.title }]}
      actions={<PrimaryButton href="/shop-all">Shop All</PrimaryButton>}
    >
      <p className="max-w-3xl text-lg leading-relaxed text-site-secondary">
        {section.intro}
      </p>

      <div className="mt-16">
        <CatalogProductSection
          label={section.title}
          products={products}
          emptyMessage={emptyMessage}
        />
      </div>

      <div className="mt-20">
        <div className="border-b border-stone-200/80 pb-8">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
            Browse by style
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
            Within {section.title}
          </h2>
        </div>
        <div className="mt-10">
          <CategoryGrid items={items} />
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
