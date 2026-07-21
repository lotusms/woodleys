"use client";

import CatalogMetalFilter from "@/components/catalog/CatalogMetalFilter";
import CatalogShapeFilter from "@/components/catalog/CatalogShapeFilter";
import CatalogSortSelect from "@/components/catalog/CatalogSortSelect";

/**
 * @param {{
 *   label: string;
 *   count?: number;
 *   sort: string;
 *   onSortChange: (value: string) => void;
 *   metalFilter?: {
 *     allLabel?: string;
 *     activeMetalSlug?: string | null;
 *     onMetalChange: (slug: string | null) => void;
 *     items: { title: string; slug: string; symbol?: string; symbolClass?: string }[];
 *   } | null;
 *   shapeFilter?: {
 *     allLabel?: string;
 *     activeShapeSlug?: string | null;
 *     onShapeChange: (slug: string | null) => void;
 *     items: { title: string; slug: string }[];
 *   } | null;
 * }} props
 */
export default function CatalogCollectionHeader({
  label,
  count,
  sort,
  onSortChange,
  metalFilter = null,
  shapeFilter = null,
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

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <CatalogSortSelect
            id={`sort-${label.replace(/\s+/g, "-").toLowerCase()}`}
            value={sort}
            onChange={onSortChange}
            className="shrink-0"
          />
          {metalFilter?.items?.length ? (
            <CatalogMetalFilter
              allLabel={metalFilter.allLabel}
              activeMetalSlug={metalFilter.activeMetalSlug}
              onMetalChange={metalFilter.onMetalChange}
              items={metalFilter.items}
              className="shrink-0"
            />
          ) : null}
          {shapeFilter?.items?.length ? (
            <CatalogShapeFilter
              allLabel={shapeFilter.allLabel}
              activeShapeSlug={shapeFilter.activeShapeSlug}
              onShapeChange={shapeFilter.onShapeChange}
              items={shapeFilter.items}
              className="shrink-0"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
