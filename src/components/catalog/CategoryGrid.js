import Link from "next/link";

/**
 * @param {{ title: string; description: string; href: string; image?: string; alt?: string }[]} items
 */
export default function CategoryGrid({ items }) {
  return (
    <ul
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      role="list"
    >
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="group flex h-full flex-col overflow-hidden rounded-sm border border-stone-200/80 bg-white transition hover:border-warm-gold/40 hover:shadow-md hover:shadow-stone-900/5"
          >
            {item.image ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-champagne">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.alt || item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-serif text-xl text-site-fg">{item.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-site-secondary">
                {item.description}
              </p>
              <span className="mt-5 text-sm font-medium text-warm-gold-dark">
                Explore
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
