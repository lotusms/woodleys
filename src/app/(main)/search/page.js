import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import CatalogProductSection from "@/components/catalog/CatalogProductSection";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sitePageTitle } from "@/config";
import { getActiveProductsList } from "@/lib/catalog/catalog-cache";

export const metadata = {
  title: sitePageTitle("Search"),
  description: "Search Woodley's Jewelers for jewelry, watches, diamonds, and services.",
};

/**
 * @param {{ searchParams: Promise<{ q?: string }> }} props
 */
export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = String(params?.q || "").trim();
  const products = await getActiveProductsList();
  const needle = query.toLowerCase();

  const results = needle
    ? products.filter((product) => {
        const title = String(product.title || "").toLowerCase();
        const handle = String(product.handle || "").toLowerCase();
        const description = String(product.description || "").toLowerCase();
        return (
          title.includes(needle) ||
          handle.includes(needle) ||
          description.includes(needle)
        );
      })
    : [];

  return (
    <PageLayout
      eyebrow="Search"
      title={query ? `Results for “${query}”` : "Search the collection"}
      subtitle={
        query
          ? `${results.length} ${results.length === 1 ? "piece" : "pieces"} matched your search.`
          : "Search jewelry, watches, diamonds, and services."
      }
      buttonArea={<PrimaryButton href="/shop-all">Browse catalog</PrimaryButton>}
    >
      <form role="search" action="/search" method="get" className="mb-12 max-w-xl">
        <label htmlFor="search-page-q" className="sr-only">
          Search jewelry, watches, diamonds, and services
        </label>
        <div className="flex gap-2">
          <input
            id="search-page-q"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search jewelry, watches, diamonds, and services"
            className="h-11 flex-1 rounded-sm border border-stone-300/80 bg-white px-4 text-sm text-site-fg focus:border-warm-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark/40"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-sm bg-warm-gold px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-warm-gold-dark"
          >
            Search
          </button>
        </div>
      </form>

      {query ? (
        <CatalogProductSection
          label="Matching pieces"
          products={results}
          emptyMessage={`No pieces matched “${query}”. Try a broader term or browse the catalog.`}
        />
      ) : (
        <p className="text-site-secondary">
          Enter a term above, or{" "}
          <Link
            href="/shop-all"
            className="font-medium text-warm-gold-dark underline-offset-4 hover:underline"
          >
            browse all collections
          </Link>
          .
        </p>
      )}
    </PageLayout>
  );
}
