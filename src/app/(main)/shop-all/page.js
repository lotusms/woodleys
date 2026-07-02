import Link from "next/link";
import CategoryPageLayout from "@/components/catalog/CategoryPageLayout";
import ShopAllCatalogGrid from "@/components/catalog/ShopAllCatalogGrid";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StullerEmbed from "@/components/shop/StullerEmbed";
import { CATALOG_SECTIONS } from "@/lib/catalog/categories";
import { getCollectionProducts } from "@/lib/catalog/products";
import { orgName, sitePageTitle } from "@/config";

export const metadata = {
  title: sitePageTitle("Shop All"),
  description:
    "Browse engagement rings, diamonds, fine jewelry, watches, and services at Woodley's Jewelers.",
};

const HERO_IMAGE = {
  src: "https://woodleyjewelers.com/cdn/shop/files/129D2D0B-124A-47E7-9AAD-754D6F1BA1BB_1200x.jpg?v=1639025505",
  alt: "Fine jewelry collection at Woodley's Jewelers",
};

async function buildCatalogSummaries() {
  const entries = Object.entries(CATALOG_SECTIONS);

  return Promise.all(
    entries.map(async ([key, section]) => {
      const products = await getCollectionProducts(section.shopifyHandle);
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
        productCount: products.length,
      };
    }),
  );
}

export default async function ShopAllPage() {
  const catalogs = await buildCatalogSummaries();

  return (
    <CategoryPageLayout
      eyebrow="Catalog"
      title="Shop All"
      subtitle={`Every collection at ${orgName}, from engagement rings and diamonds to custom design, fine jewelry, watches, and expert care.`}
      heroImage={HERO_IMAGE}
      breadcrumbs={[{ label: "Shop All" }]}
      actions={
        <>
          <PrimaryButton href="/contact">Book a visit</PrimaryButton>
          <Link
            href="/engagement-wedding"
            className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/70 hover:bg-white/20"
          >
            Engagement & Wedding
          </Link>
        </>
      }
    >
      <p className="max-w-3xl text-lg leading-relaxed text-site-secondary">
        Start with a main collection below, or browse our extended Stuller catalog
        for additional styles. When Shopify is connected, inventory and checkout
        flow through one secure experience.
      </p>

      <div className="mt-16">
        <ShopAllCatalogGrid catalogs={catalogs} />
      </div>

      <div className="mt-20 border-t border-stone-200/80 pt-16">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
          Extended catalog
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
          Stuller showcase
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-site-secondary">
          Browse additional styles through our Stuller catalog, embedded below
          within the same refined layout.
        </p>
        <div className="mt-8 overflow-hidden rounded-sm border border-stone-200/80 bg-white shadow-sm shadow-stone-900/5">
          <StullerEmbed />
        </div>
      </div>
    </CategoryPageLayout>
  );
}
