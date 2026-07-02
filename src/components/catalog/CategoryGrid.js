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
            className="group flex h-full flex-col overflow-hidden bg-white transition duration-300 hover:-translate-y-0.5"
          >
            {item.image ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-champagne shadow-sm shadow-stone-900/5 ring-1 ring-stone-200/60 transition group-hover:shadow-md group-hover:shadow-stone-900/10 group-hover:ring-warm-gold/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.alt || item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col px-1 pt-5 pb-1">
              <h2 className="font-serif text-xl tracking-[-0.01em] text-site-fg">{item.title}</h2>
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
