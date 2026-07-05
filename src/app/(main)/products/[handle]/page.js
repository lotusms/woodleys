import { notFound } from "next/navigation";
import Link from "next/link";
import ProductDetailAside from "@/components/catalog/ProductDetailAside";
import ProductDetailGallery from "@/components/catalog/ProductDetailGallery";
import SimilarProductsCarousel from "@/components/catalog/SimilarProductsCarousel";
import InnerPageBackdrop from "@/components/InnerPageBackdrop";
import SectionBandHighlightEdge from "@/components/ui/SectionBandHighlightEdge";
import {
  sitePageEdgeMediaAsideInsetClass,
  sitePageInsetClass,
  sitePageTitle,
} from "@/config";
import { getProductImages } from "@/lib/catalog/product-images";
import {
  getCatalogProductByHandle,
  getProductCategoryNavigation,
  getSimilarCatalogProducts,
} from "@/lib/catalog/products";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = await getCatalogProductByHandle(handle);
  if (!product) return {};
  return {
    title: product.seoTitle || sitePageTitle(product.title),
    description: product.metaDescription || product.description,
  };
}

function ProductBreadcrumbs({ categoryNav }) {
  return (
    <nav
      aria-label="Product navigation"
      className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-site-secondary"
    >
      <Link href="/shop-all" className="transition hover:text-site-fg">
        Shop all
      </Link>
      {categoryNav ? (
        <>
          <span aria-hidden className="text-stone-300">
            /
          </span>
          <Link href={categoryNav.href} className="transition hover:text-site-fg">
            {categoryNav.label}
          </Link>
        </>
      ) : null}
    </nav>
  );
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getCatalogProductByHandle(handle);
  if (!product) notFound();

  const shopDomain =
    process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "") || "";
  const shopifyProductUrl =
    shopDomain && product.source === "shopify"
      ? `https://${shopDomain}/products/${product.handle}`
      : null;

  const images = getProductImages(product);
  const categoryNav = getProductCategoryNavigation(product);
  const similarProducts = await getSimilarCatalogProducts(product, { limit: 8 });

  return (
    <div className="relative z-10 bg-ivory">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-2 opacity-[0.03] mix-blend-multiply fabric-texture"
      />
      <InnerPageBackdrop />

      <div className="relative z-10 w-full pb-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <ProductDetailGallery images={images} title={product.title} />
          </div>

          <div
            className={`min-w-0 pt-8 sm:pt-10 lg:sticky lg:top-28 lg:self-start ${sitePageEdgeMediaAsideInsetClass}`}
          >
            <ProductBreadcrumbs categoryNav={categoryNav} />

            <div className="mt-6 lg:mt-8">
              <ProductDetailAside
                product={product}
                shopifyProductUrl={shopifyProductUrl}
              />
            </div>
          </div>
        </div>

        {similarProducts.length > 0 ? (
          <section className="relative mt-14 lg:mt-16">
            <SectionBandHighlightEdge position="top" />
            <div className={`${sitePageInsetClass} pt-12 lg:pt-14`}>
              <SimilarProductsCarousel products={similarProducts} />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
