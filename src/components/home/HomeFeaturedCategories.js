import Link from "next/link";
import { HOME_FEATURED_CATEGORIES } from "@/lib/catalog/categories";

export default function HomeFeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-12">
      <div className="max-w-2xl">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
          Collections
        </p>
        <h2 className="mt-4 font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg">
          Fine jewelry, thoughtfully presented
        </h2>
      </div>

      <ul
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
      >
        {HOME_FEATURED_CATEGORIES.map((category) => (
          <li key={category.href}>
            <Link
              href={category.href}
              className="group flex h-full flex-col overflow-hidden rounded-sm border border-stone-200/80 bg-white transition hover:border-warm-gold/35 hover:shadow-md hover:shadow-stone-900/5"
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-champagne">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={category.image}
                  alt={category.alt}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-serif text-xl text-site-fg">{category.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-site-secondary">
                  {category.description}
                </p>
                <span className="mt-5 text-sm font-medium text-warm-gold-dark">
                  View collection
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
