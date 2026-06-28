import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { isShopifyConfigured, getShopifyCollectionUrl } from "@/lib/shopify/config";
import { sitePageTitle } from "@/config";

/**
 * @param {{ sectionKey: string; section: import("@/lib/catalog/categories").CATALOG_SECTIONS[string]; entry: import("@/lib/catalog/categories").CategoryEntry }} props
 */
export default function CategoryDetailPage({ sectionKey, section, entry }) {
  const shopifyUrl = getShopifyCollectionUrl(entry.shopifyHandle);
  const shopifyLive = isShopifyConfigured() && shopifyUrl;

  return (
    <PageLayout
      eyebrow={section.eyebrow}
      title={entry.title}
      subtitle={entry.description}
      heroImage={entry.image}
      buttonArea={
        <div className="flex flex-wrap gap-3">
          <PrimaryButton href="/shop-all">Browse catalog</PrimaryButton>
          <SecondaryButton href={`/${sectionKey}`}>
            All {section.title}
          </SecondaryButton>
        </div>
      }
    >
      <p>{entry.description}</p>

      {sectionKey === "custom-jewelry" && entry.slug === "consultation" ? (
        <div className="rounded-sm border border-stone-200/80 bg-champagne/50 p-6">
          <h2 className="font-serif text-xl text-site-fg">Design consultation</h2>
          <p className="mt-3 leading-relaxed text-site-secondary">
            Schedule a one-on-one consultation with our design team. Your $200
            consultation fee is applied toward your final design when you
            proceed.
          </p>
          <PrimaryButton href="/appointments" className="mt-5">
            Request consultation
          </PrimaryButton>
        </div>
      ) : null}

      {sectionKey === "diamonds" &&
      (entry.slug === "natural-diamonds" || entry.slug === "lab-grown-diamonds") ? (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-stone-200/80 bg-white p-6">
            <h2 className="font-serif text-lg text-site-fg">Natural diamonds</h2>
            <p className="mt-2 text-sm leading-relaxed text-site-secondary">
              Formed over millennia—each stone carries its own character. We
              explain origin and grading in plain language.
            </p>
            <Link
              href="/diamonds/natural-diamonds"
              className="mt-4 inline-block text-sm font-medium text-warm-gold-dark hover:underline"
            >
              Explore natural diamonds
            </Link>
          </div>
          <div className="rounded-sm border border-stone-200/80 bg-white p-6">
            <h2 className="font-serif text-lg text-site-fg">Lab-grown diamonds</h2>
            <p className="mt-2 text-sm leading-relaxed text-site-secondary">
              Created in controlled environments with identical optical
              properties—we help you compare options without pressure.
            </p>
            <Link
              href="/diamonds/lab-grown-diamonds"
              className="mt-4 inline-block text-sm font-medium text-warm-gold-dark hover:underline"
            >
              Explore lab-grown diamonds
            </Link>
          </div>
        </div>
      ) : null}

      <div className="rounded-sm border border-dashed border-stone-300/80 bg-white/70 p-8 text-center">
        {shopifyLive ? (
          <>
            <p className="text-sm text-site-secondary">
              View live inventory for {entry.title} through our Shopify catalog.
            </p>
            <a
              href={shopifyUrl}
              className="mt-4 inline-flex rounded-full bg-warm-gold px-6 py-3 text-sm font-semibold text-white hover:bg-warm-gold-dark"
            >
              View {entry.title} collection
            </a>
          </>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-site-secondary">
              Product listings for {entry.title} will appear here when Shopify is
              connected. Browse our full catalog below or visit us in Beaumont.
            </p>
            <PrimaryButton href="/shop-all" className="mt-4">
              Shop All
            </PrimaryButton>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export function buildEntryMetadata(section, entry) {
  return {
    title: sitePageTitle(entry.title),
    description: entry.description,
  };
}
