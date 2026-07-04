import CollectionCard from "@/components/catalog/CollectionCard";

/**
 * Grid layout for {@link CollectionCard} items.
 *
 * @param {{ title: string; description: string; href: string; image?: string; alt?: string }[]} items
 */
export default function CategoryGrid({ items }) {
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
          />
        </li>
      ))}
    </ul>
  );
}
