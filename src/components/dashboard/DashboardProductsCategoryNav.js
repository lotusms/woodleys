"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import { useDashboardProducts } from "@/context/DashboardProductsContext";
import {
  PRODUCTS_CATEGORY_NAV,
  PRODUCTS_FILTER_ALL,
  buildProductsFilterHref,
  countProductsBySection,
  countProductsBySubcategory,
  sectionSubcategories,
} from "@/lib/dashboard-products-filter";
import * as dash from "@/lib/dashboardChrome";

/**
 * @param {boolean} light
 * @param {boolean} active
 */
function categoryLinkClass(light, active) {
  if (active) {
    return light
      ? "bg-amber-50 font-medium text-amber-950 ring-1 ring-amber-200/80"
      : "bg-amber-950/35 font-medium text-amber-100 ring-1 ring-amber-400/30";
  }
  return light
    ? "text-stone-700 hover:bg-stone-200/70"
    : "text-slate-300 hover:bg-white/[0.05]";
}

/**
 * @param {{ light: boolean }} props
 */
export default function DashboardProductsCategoryNav({ light }) {
  const searchParams = useSearchParams();
  const { products } = useDashboardProducts();

  const activeSection = searchParams.get("section") || PRODUCTS_FILTER_ALL;
  const activeCollection = searchParams.get("collection") || PRODUCTS_FILTER_ALL;
  const searchQuery = searchParams.get("q") || "";
  const sortKey = searchParams.get("sort") || undefined;
  const perPage = searchParams.get("per") || undefined;

  const filterExtras = useMemo(
    () => ({ q: searchQuery, sort: sortKey, per: perPage }),
    [searchQuery, sortKey, perPage],
  );

  const sectionCounts = useMemo(
    () => countProductsBySection(products),
    [products],
  );

  const [expandedSections, setExpandedSections] = useState(() => {
    if (activeSection !== PRODUCTS_FILTER_ALL) {
      return { [activeSection]: true };
    }
    return {};
  });

  function toggleSection(sectionKey) {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  }

  return (
    <nav
      aria-label="Product categories"
      className={`rounded-2xl border p-4 ${
        light
          ? "border-stone-300/70 bg-stone-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
          : "border-white/[0.08] bg-slate-900/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      }`}
    >
      <p className={dash.dashboardNavLabel(light)}>Categories</p>
      <ul className="space-y-0.5" role="list">
        {PRODUCTS_CATEGORY_NAV.map((item) => {
          const subcategories = sectionSubcategories(item.key);
          const hasChildren = subcategories.length > 0;
          const sectionActive =
            activeSection === item.key &&
            (activeCollection === PRODUCTS_FILTER_ALL || !hasChildren);
          const expanded =
            expandedSections[item.key] || activeSection === item.key;
          const subCounts = hasChildren
            ? countProductsBySubcategory(products, item.key)
            : {};

          return (
            <li key={item.key}>
              <div className="flex items-stretch gap-0.5">
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(item.key)}
                    className={`flex shrink-0 items-center justify-center rounded-lg px-1.5 py-2.5 transition ${light ? "text-stone-500 hover:bg-stone-200/60" : "text-slate-500 hover:bg-white/[0.05]"}`}
                    aria-expanded={expanded}
                    aria-label={
                      expanded ? `Collapse ${item.label}` : `Expand ${item.label}`
                    }
                  >
                    {expanded ? (
                      <RiArrowDownSLine className="size-4" aria-hidden />
                    ) : (
                      <RiArrowRightSLine className="size-4" aria-hidden />
                    )}
                  </button>
                ) : (
                  <span className="w-7 shrink-0" aria-hidden />
                )}

                <Link
                  href={buildProductsFilterHref(item.key, undefined, filterExtras)}
                  className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm transition ${categoryLinkClass(light, sectionActive)}`}
                  aria-current={sectionActive ? "true" : undefined}
                >
                  <span className="truncate">{item.label}</span>
                  <span
                    className={`shrink-0 tabular-nums text-xs ${sectionActive ? (light ? "text-amber-800/75" : "text-amber-100/75") : light ? "text-stone-500" : "text-slate-500"}`}
                  >
                    {sectionCounts[item.key] ?? 0}
                  </span>
                </Link>
              </div>

              {hasChildren && expanded ? (
                <ul
                  className={`ml-7 mt-0.5 space-y-0.5 border-l pl-2 ${light ? "border-stone-300/40" : "border-white/[0.08]"}`}
                  role="list"
                >
                  {subcategories.map((child) => {
                    const childActive =
                      activeSection === item.key &&
                      activeCollection === child.shopifyHandle;
                    return (
                      <li key={child.shopifyHandle}>
                        <Link
                          href={buildProductsFilterHref(
                            item.key,
                            child.shopifyHandle,
                            filterExtras,
                          )}
                          className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-[0.82rem] transition ${categoryLinkClass(light, childActive)}`}
                          aria-current={childActive ? "true" : undefined}
                        >
                          <span className="truncate">{child.title}</span>
                          <span
                            className={`shrink-0 tabular-nums text-[0.7rem] ${childActive ? (light ? "text-amber-800/75" : "text-amber-100/75") : light ? "text-stone-500" : "text-slate-500"}`}
                          >
                            {subCounts[child.shopifyHandle] ?? 0}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
