import SimilarProductsCarousel from "@/components/catalog/SimilarProductsCarousel";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";
import { sitePageInsetClass } from "@/config";
import {
  getCatalogProductByHandle,
  getSimilarCatalogProducts,
} from "@/lib/catalog/products";

/**
 * @param {{ handle: string }} props
 */
export default async function ProductSimilarSection({ handle }) {
  const product = await getCatalogProductByHandle(handle);
  if (!product) return null;

  const similarProducts = await getSimilarCatalogProducts(product, { limit: 8 });
  if (!similarProducts.length) return null;

  return (
    <section className="relative mt-14 lg:mt-16">
      <SectionBandHighlightEdge position="top" />
      <div className={`${sitePageInsetClass} pt-12 lg:pt-14`}>
        <SimilarProductsCarousel products={similarProducts} />
      </div>
    </section>
  );
}
