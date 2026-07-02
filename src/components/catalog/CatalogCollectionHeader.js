"use client";

import CatalogSortSelect from "@/components/catalog/CatalogSortSelect";

/**
 * @param {{
 *   label: string;
 *   count?: number;
 *   sort: string;
 *   onSortChange: (value: string) => void;
 * }} props
 */
export default function CatalogCollectionHeader({
  label,
  count,
  sort,
  onSortChange,
}) {
  const showCount = typeof count === "number" && count > 0;

  return (
    <div className="border-b border-stone-200/80 pb-8">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-site-secondary">
        The collection
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-serif text-3xl font-medium tracking-[-0.02em] text-site-fg sm:text-4xl">
          {label}
          {showCount ? (
            <span
              className="ml-2 font-sans text-xl font-normal tabular-nums tracking-normal text-site-secondary sm:text-2xl"
              aria-label={`${count} item${count === 1 ? "" : "s"}`}
            >
              ({count})
            </span>
          ) : null}
        </h2>

        <CatalogSortSelect
          id={`sort-${label.replace(/\s+/g, "-").toLowerCase()}`}
          value={sort}
          onChange={onSortChange}
          className="shrink-0 self-start sm:self-center"
        />
      </div>
    </div>
  );
}
