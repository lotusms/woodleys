"use client";

import { useMemo } from "react";
import SelectListbox from "@/components/ui/SelectListbox";

const BUTTON_CLASS =
  "cursor-pointer rounded-full border border-stone-300/80 bg-white/95 px-4 py-2.5 text-left text-[0.68rem] font-medium uppercase tracking-[0.14em] text-site-fg shadow-sm shadow-stone-900/5 transition hover:border-warm-gold/45 hover:bg-champagne/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold-dark focus-visible:ring-offset-2 focus-visible:ring-offset-ivory sm:text-[0.7rem] sm:tracking-[0.16em]";

const OPTIONS_CLASS =
  "z-[120] mt-1 max-h-60 w-max min-w-[var(--button-width)] overflow-auto rounded-xl border border-stone-200/80 bg-white/98 py-1 text-sm text-site-fg shadow-lg shadow-stone-900/10 ring-1 ring-stone-200/50 outline-none data-closed:opacity-0 data-leave:transition data-leave:duration-100 data-leave:ease-in";

const OPTION_CLASS =
  "group relative cursor-default select-none py-2.5 pl-4 pr-10 text-site-fg data-focus:bg-champagne/80 data-focus:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-40";

const CHECK_CLASS =
  "absolute inset-y-0 right-0 flex items-center pr-3 text-warm-gold-dark group-[:not([data-selected])]:hidden group-data-focus:text-warm-gold-dark";

/**
 * Compact shape filter — updates in place without a full page navigation.
 *
 * @param {{
 *   allLabel?: string;
 *   activeShapeSlug?: string | null;
 *   onShapeChange: (slug: string | null) => void;
 *   items: {
 *     title: string;
 *     slug: string;
 *   }[];
 *   className?: string;
 * }} props
 */
export default function CatalogShapeFilter({
  allLabel = "All shapes",
  activeShapeSlug = null,
  onShapeChange,
  items,
  className = "",
}) {
  const options = useMemo(
    () => [
      { value: "", label: allLabel },
      ...items.map((item) => ({ value: item.slug, label: item.title })),
    ],
    [allLabel, items],
  );

  if (!items.length) return null;

  const selected = activeShapeSlug || "";

  return (
    <div className={`w-fit ${className}`.trim()}>
      <SelectListbox
        label="Shape"
        showLabel={false}
        placeholder="Shape"
        options={options}
        value={selected}
        onChange={(nextSlug) => {
          const slug = nextSlug || null;
          if (slug !== (activeShapeSlug || "")) {
            onShapeChange(slug);
          }
        }}
        compact
        buttonClassName={BUTTON_CLASS}
        optionsClassName={OPTIONS_CLASS}
        optionClassName={OPTION_CLASS}
        checkIconClassName={CHECK_CLASS}
        anchor={{ to: "bottom end", gap: 6, padding: 12 }}
        ariaDescribedBy="catalog-shape-filter-hint"
      />
      <span id="catalog-shape-filter-hint" className="sr-only">
        Filter this collection by shape
      </span>
    </div>
  );
}
