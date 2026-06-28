import PageLayout from "@/components/PageLayout";
import CategoryGrid from "@/components/catalog/CategoryGrid";
import StullerEmbed from "@/components/shop/StullerEmbed";
import { CATALOG_SECTIONS } from "@/lib/catalog/categories";
import { orgName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Shop All"),
  description:
    "Browse engagement rings, diamonds, fine jewelry, watches, and services at Woodley's Jewelers.",
};

export default function ShopAllPage() {
  const categories = Object.entries(CATALOG_SECTIONS).map(([key, section]) => ({
    title: section.title,
    description: section.intro,
    href: `/${key}`,
    image: section.children[0]?.image?.src,
    alt: section.children[0]?.image?.alt,
  }));

  return (
    <PageLayout
      eyebrow="Catalog"
      title="Shop All"
      subtitle={`Explore every collection at ${orgName}. When Shopify is connected, product inventory and checkout flow through a single, secure experience.`}
    >
      <CategoryGrid items={categories} />

      <div className="mt-16">
        <h2 className="font-serif text-2xl text-site-fg">Extended catalog</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-site-secondary">
          Browse additional styles through our Stuller catalog, embedded below
          within the same refined layout. Purchases complete through Shopify
          checkout when connected.
        </p>
        <div className="mt-8">
          <StullerEmbed />
        </div>
      </div>
    </PageLayout>
  );
}
