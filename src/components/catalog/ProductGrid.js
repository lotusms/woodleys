"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "@/components/catalog/ProductCard";
import ProductPreviewDialog from "@/components/catalog/ProductPreviewDialog";
import { useFlipAnimation } from "@/hooks/useFlipAnimation";

/**
 * @param {{ products: import("@/lib/catalog/product-types").CatalogProduct[]; emptyMessage?: string }} props
 */
export default function ProductGrid({ products, emptyMessage }) {
  const [previewProduct, setPreviewProduct] = useState(null);

  const orderKey = useMemo(
    () => products.map((product) => product.id).join("|"),
    [products],
  );
  const setFlipRef = useFlipAnimation(orderKey);

  function openPreview(product) {
    setPreviewProduct(product);
  }

  if (!products.length) {
    return (
      <div className="rounded-sm border border-dashed border-stone-300/80 bg-champagne/30 px-6 py-12 text-center">
        <p className="text-sm leading-relaxed text-site-secondary">
          {emptyMessage ||
            "No products in this collection yet. Check back soon or browse Shop All."}
        </p>
        <Link
          href="/shop-all"
          className="mt-4 inline-flex text-sm font-medium text-warm-gold-dark underline-offset-4 hover:underline"
        >
          Shop All
        </Link>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3" role="list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onPreview={openPreview}
            itemRef={setFlipRef(product.id)}
          />
        ))}
      </ul>

      <ProductPreviewDialog
        product={previewProduct}
        open={previewProduct !== null}
        onClose={() => setPreviewProduct(null)}
      />
    </>
  );
}
