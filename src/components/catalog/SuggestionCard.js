import ProductTileCard from "@/components/catalog/ProductTileCard";

/**
 * Compact product tile for carousels and related-product rows.
 *
 * @param {{
 *   product: import("@/lib/catalog/product-types").CatalogProduct;
 *   className?: string;
 * }} props
 */
export default function SuggestionCard({ product, className = "" }) {
  return (
    <ProductTileCard
      product={product}
      variant="carousel"
      className={className}
      listItem
    />
  );
}
