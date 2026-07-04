/**
 * @param {{
 *   specs: { label: string; value: string }[];
 * }} props
 */
export default function ProductSpecsSection({ specs }) {
  if (!Array.isArray(specs) || specs.length === 0) return null;

  return (
    <section className="border-t border-stone-200/80 pt-10" aria-labelledby="product-specs-heading">
      <h2
        id="product-specs-heading"
        className="font-serif text-2xl font-medium tracking-[-0.02em] text-site-fg sm:text-[1.75rem]"
      >
        Specifications
      </h2>
      <dl className="mt-6 divide-y divide-stone-200/70 border-y border-stone-200/70">
        {specs.map((spec) => (
          <div
            key={`${spec.label}-${spec.value}`}
            className="grid gap-1 py-4 sm:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] sm:gap-8"
          >
            <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-site-secondary">
              {spec.label}
            </dt>
            <dd className="text-sm leading-relaxed text-site-fg sm:text-[0.9375rem]">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
