"use client";

import { useMemo, useState } from "react";
import CatalogCollectionHeader from "@/components/catalog/CatalogCollectionHeader";
import ProductGrid from "@/components/catalog/ProductGrid";
import {
  DEFAULT_CATALOG_SORT,
  sortCatalogProducts,
} from "@/lib/catalog/sort-products";

/**
 * Collection header, sort control, and sorted product grid.
 *
 * @param {{
 *   label: string;
 *   products: import("@/lib/catalog/product-types").CatalogProduct[];
 *   emptyMessage?: string;
 * }} props
 */
export default function CatalogProductSection({
  label,
  products,
  emptyMessage,
}) {
  const [sort, setSort] = useState(DEFAULT_CATALOG_SORT);

  const sortedProducts = useMemo(
    () => sortCatalogProducts(products, sort),
    [products, sort],
  );

  return (
    <>
      <CatalogCollectionHeader
        label={label}
        count={products.length}
        sort={sort}
        onSortChange={setSort}
      />
      <div className="mt-10">
        <ProductGrid products={sortedProducts} emptyMessage={emptyMessage} />
      </div>
    </>
  );
}
