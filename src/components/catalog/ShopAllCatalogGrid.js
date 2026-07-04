import CategoryGrid from "@/components/catalog/CategoryGrid";

/**
 * @param {{
 *   key: string;
 *   title: string;
 *   eyebrow: string;
 *   description: string;
 *   href: string;
 *   image?: string;
 *   alt?: string;
 *   subcategoryCount: number;
 *   productCount: number;
 * }[]} catalogs
 */
export default function ShopAllCatalogGrid({ catalogs }) {
  const items = catalogs.map((catalog) => ({
    title: catalog.title,
    description: catalog.description,
    href: catalog.href,
    image: catalog.image,
    alt: catalog.alt || catalog.title,
  }));

  return (
    <div>
      <div className="border-b border-stone-200/80 pb-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
          Our collections
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
          Browse by category
          <span className="ml-2 font-sans text-xl font-normal tabular-nums tracking-normal text-site-secondary sm:text-2xl">
            ({catalogs.length})
          </span>
        </h2>
      </div>

      <div className="mt-10">
        <CategoryGrid items={items} />
      </div>
    </div>
  );
}
