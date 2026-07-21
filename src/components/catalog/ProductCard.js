"use client";

import ProductTileCard from "@/components/catalog/ProductTileCard";

/**
 * Collection grid product card with optional quick preview.
 *
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct;
 *   onPreview?: (product: import("@/lib/catalog/product-types").CatalogProduct) => void;
 *   itemRef?: (node: HTMLLIElement | null) => void;
 *   className?: string;
 * }} props
 */
export default function ProductCard({ product, onPreview, itemRef, className = "" }) {
  return (
    <li ref={itemRef} className={className}>
      <ProductTileCard product={product} variant="grid" onPreview={onPreview} />
    </li>
  );
}
