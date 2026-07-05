"use client";

import ProductTileCard from "@/components/catalog/ProductTileCard";

/**
 * Collection grid product card with optional quick preview.
 *
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct;
 *   onPreview?: (product: import("@/lib/catalog/product-types").CatalogProduct) => void;
 *   itemRef?: (node: HTMLLIElement | null) => void;
 * }} props
 */
export default function ProductCard({ product, onPreview, itemRef }) {
  return (
    <li ref={itemRef}>
      <ProductTileCard product={product} variant="grid" onPreview={onPreview} />
    </li>
  );
}
