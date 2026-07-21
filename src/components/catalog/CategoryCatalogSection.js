"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import CatalogProductSection from "@/components/catalog/CatalogProductSection";
import {
  CATALOG_FILTER_EVENT,
  dispatchCatalogFilterChange,
  readCatalogFiltersFromLocation,
  replaceCatalogFilterUrl,
} from "@/lib/catalog/catalog-filter";
import { filterCatalogProducts } from "@/lib/catalog/filter-products";

/**
 * Client-side metal/shape filtering with URL sync and animated grid reorder.
 *
 * @param {{
 *   basePath: string;
 *   entryTitle: string;
 *   products: Array<import("@/lib/catalog/product-types").CatalogProduct & { catalogShapeSlug?: string }>;
 *   emptyMessage: string;
 *   initialMetalSlug?: string;
 *   initialShapeSlug?: string;
 *   metalOptions?: {
 *     title: string;
 *     href: string;
 *     slug: string;
 *     symbol?: string;
 *     symbolClass?: string;
 *   }[];
 *   shapeOptions?: {
 *     title: string;
 *     slug: string;
 *   }[];
 *   showAllLabel?: boolean;
 * }} props
 */
export default function CategoryCatalogSection({
  basePath,
  entryTitle,
  products,
  emptyMessage,
  initialMetalSlug,
  initialShapeSlug,
  metalOptions = [],
  shapeOptions = [],
  showAllLabel = false,
}) {
  const pathname = usePathname();
  const [metalSlug, setMetalSlug] = useState(initialMetalSlug ?? null);
  const [shapeSlug, setShapeSlug] = useState(initialShapeSlug ?? null);

  const applyFilters = useCallback(
    (next) => {
      const metal = next.metal !== undefined ? next.metal : metalSlug;
      const shape = next.shape !== undefined ? next.shape : shapeSlug;
      setMetalSlug(metal);
      setShapeSlug(shape);
      replaceCatalogFilterUrl(pathname, { metal, shape });
      dispatchCatalogFilterChange({ metal, shape });
    },
    [metalSlug, shapeSlug, pathname],
  );

  useEffect(() => {
    function onFilterEvent(event) {
      const detail = /** @type {CustomEvent<{ metal?: string | null; shape?: string | null }>} */ (
        event
      ).detail;
      setMetalSlug(detail.metal ?? null);
      setShapeSlug(detail.shape ?? null);
    }

    function onPopState() {
      const { metal, shape } = readCatalogFiltersFromLocation(pathname);
      setMetalSlug(metal);
      setShapeSlug(shape);
    }

    window.addEventListener(CATALOG_FILTER_EVENT, onFilterEvent);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener(CATALOG_FILTER_EVENT, onFilterEvent);
      window.removeEventListener("popstate", onPopState);
    };
  }, [pathname]);

  const filteredProducts = useMemo(
    () => filterCatalogProducts(products, { metalSlug, shapeSlug }),
    [products, metalSlug, shapeSlug],
  );

  const productLabel = useMemo(() => {
    if (metalSlug) {
      const metal = metalOptions.find((option) => option.slug === metalSlug);
      return `${entryTitle} · ${metal?.title || "Metal"}`;
    }
    if (shapeSlug) {
      const shape = shapeOptions.find((option) => option.slug === shapeSlug);
      return `${shape?.title || "Shape"} · ${entryTitle}`;
    }
    return showAllLabel ? `All ${entryTitle}` : entryTitle;
  }, [
    entryTitle,
    metalOptions,
    metalSlug,
    shapeOptions,
    shapeSlug,
    showAllLabel,
  ]);

  return (
    <CatalogProductSection
      label={productLabel}
      products={filteredProducts}
      emptyMessage={emptyMessage}
      metalFilter={
        metalOptions.length
          ? {
              allLabel: "All metals",
              activeMetalSlug: metalSlug,
              onMetalChange: (slug) => applyFilters({ metal: slug }),
              items: metalOptions,
            }
          : null
      }
      shapeFilter={
        shapeOptions.length
          ? {
              allLabel: "All shapes",
              activeShapeSlug: shapeSlug,
              onShapeChange: (slug) => applyFilters({ shape: slug }),
              items: shapeOptions,
            }
          : null
      }
    />
  );
}
