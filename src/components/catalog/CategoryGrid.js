import CollectionCard from "@/components/catalog/CollectionCard";

/**
 * Grid layout for {@link CollectionCard} items.
 *
 * @param {{
 *   items: {
 *     title: string;
 *     description: string;
 *     href: string;
 *     image?: string;
 *     alt?: string;
 *     symbol?: string;
 *     symbolClass?: string;
 *     ctaLabel?: string;
 *   }[];
 *   ctaLabel?: string;
 * }} props
 */
export default function CategoryGrid({ items, ctaLabel }) {
  return (
    <ul className="grid gap-7 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3" role="list">
      {items.map((item) => (
        <li key={item.href}>
          <CollectionCard
            title={item.title}
            description={item.description}
            href={item.href}
            image={item.image}
            alt={item.alt}
            symbol={item.symbol}
            symbolClass={item.symbolClass}
            ctaLabel={item.ctaLabel || ctaLabel}
          />
        </li>
      ))}
    </ul>
  );
}
