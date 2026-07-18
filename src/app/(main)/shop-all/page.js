import Link from "next/link";
import CategoryPageLayout from "@/components/catalog/CategoryPageLayout";
import ShopAllCatalogGrid from "@/components/catalog/ShopAllCatalogGrid";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { CATALOG_SECTIONS, SHOP_ALL_HERO } from "@/lib/catalog/categories";
import { getCollectionProductCounts } from "@/lib/catalog/catalog-cache";
import { orgName, sitePageTitle } from "@/config";

export const revalidate = 60;

const heroSecondaryClass =
  "inline-flex items-center justify-center rounded-full border border-white/45 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/20";

export const metadata = {
  title: sitePageTitle("Shop All"),
  description:
    "Explore Woodley's collections for women and men: engagement and wedding, diamonds, custom jewelry, fine jewelry, watches, and expert care.",
};

async function buildCatalogSummaries() {
  const counts = await getCollectionProductCounts();
  const entries = Object.entries(CATALOG_SECTIONS);

  return entries.map(([key, section]) => {
    const heroImage = section.children[0]?.image;

    return {
      key,
      title: section.title,
      eyebrow: section.eyebrow,
      description: section.intro || section.description,
      href: `/${key}`,
      image: heroImage?.src,
      alt: heroImage?.alt || section.title,
      subcategoryCount: section.children.length,
      productCount: counts[section.shopifyHandle] ?? 0,
    };
  });
}

export default async function ShopAllPage() {
  const catalogs = await buildCatalogSummaries();

  return (
    <CategoryPageLayout
      eyebrow="Catalog"
      title="Shop All"
      subtitle={`Every collection at ${orgName}: engagement and wedding, diamonds, custom design, fine jewelry, watches, and expert care, in one place.`}
      heroImage={SHOP_ALL_HERO}
      breadcrumbs={[{ label: "Shop All" }]}
      actions={
        <>
          <PrimaryButton href="/contact">Book a visit</PrimaryButton>
          <Link href="#collections" className={heroSecondaryClass}>
            Explore collections
          </Link>
        </>
      }
    >
      <p className="max-w-3xl text-lg leading-relaxed text-site-secondary">
        Start with a main collection below, then explore Women&apos;s and
        Men&apos;s paths, bridal styles, diamonds, and services at your pace.
      </p>

      <div id="collections" className="mt-16 scroll-mt-28">
        <ShopAllCatalogGrid catalogs={catalogs} />
      </div>
    </CategoryPageLayout>
  );
}
