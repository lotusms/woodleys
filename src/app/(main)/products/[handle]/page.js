import { notFound } from "next/navigation";
import CatalogProductPurchasePanel from "@/components/catalog/CatalogProductPurchasePanel";
import ProductDetailGallery from "@/components/catalog/ProductDetailGallery";
import ProductSpecsSection from "@/components/catalog/ProductSpecsSection";
import SimilarProductsCarousel from "@/components/catalog/SimilarProductsCarousel";
import InnerPageBackdrop from "@/components/InnerPageBackdrop";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { sitePageTitle } from "@/config";
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
    title: sitePageTitle(product.title),
    description: product.description,
  };
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

  const similarProducts = await getSimilarCatalogProducts(product, { limit: 12 });
  const images = getProductImages(product);
  const categoryNav = getProductCategoryNavigation(product);

  return (
    <div className="relative z-10 w-full min-w-0">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-2 opacity-[0.03] mix-blend-multiply fabric-texture"
      />
      <InnerPageBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-28 pt-10 sm:px-10 lg:px-12">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <SecondaryButton href="/shop-all">Shop All</SecondaryButton>
          {categoryNav ? (
            <SecondaryButton href={categoryNav.href}>
              ← {categoryNav.label}
            </SecondaryButton>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3 lg:items-start lg:gap-12">
          <div className="min-w-0 lg:col-span-1">
            <ProductDetailGallery images={images} title={product.title} />
          </div>

          <div className="min-w-0 lg:col-span-2">
            <h1 className="font-serif text-4xl font-medium tracking-[-0.03em] text-site-fg sm:text-5xl">
              {product.title}
            </h1>

            {product.descriptionHtml ? (
              <div
                className="prose prose-stone mt-5 max-w-none text-site-secondary prose-headings:font-serif prose-headings:text-site-fg"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p className="mt-5 text-lg leading-relaxed text-site-secondary">
                {product.description}
              </p>
            )}

            <div className="mt-8">
              <CatalogProductPurchasePanel
                product={product}
                shopifyProductUrl={shopifyProductUrl}
              />
            </div>
          </div>
        </div>

        <div className="mt-14 space-y-14">
          <ProductSpecsSection specs={product.specs ?? []} />
          <SimilarProductsCarousel products={similarProducts} />

          {product.source === "shopify" ? (
            <p className="text-sm text-site-secondary">
              Checkout is completed securely through Shopify.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
