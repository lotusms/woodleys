import Link from "next/link";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { sitePageTitle } from "@/config";
import { formatUsd } from "@/lib/money";
import { getCatalogProductByHandle } from "@/lib/catalog/products";

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

  const isPreview = product.source === "mock";

  const min = product.priceUsd;
  const max = product.maxPriceUsd;
  const priceLabel =
    max > min && min > 0
      ? `${formatUsd(min)} to ${formatUsd(max)}`
      : formatUsd(min);

  const shopDomain = isPreview
    ? ""
    : process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "") || "";
  const shopifyProductUrl =
    shopDomain && product.source === "shopify"
      ? `https://${shopDomain}/products/${product.handle}`
      : null;

  const hero = product.images[0] || product.image;

  return (
    <PageLayout
      eyebrow="Collection"
      title={product.title}
      subtitle={product.description}
      heroImage={
        hero
          ? { src: hero.src, alt: hero.alt }
          : undefined
      }
      buttonArea={
        <div className="flex flex-wrap gap-3">
          {shopifyProductUrl ? (
            <PrimaryButton href={shopifyProductUrl}>Buy on Shopify</PrimaryButton>
          ) : isPreview ? (
            <PrimaryButton href="/contact">Request appointment</PrimaryButton>
          ) : null}
          <Link
            href="/shop-all"
            className="inline-flex items-center justify-center rounded-full border border-stone-300/90 bg-white px-6 py-3 text-sm font-semibold text-site-fg transition hover:border-warm-gold hover:bg-champagne/60"
          >
            Shop All
          </Link>
        </div>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <p className="text-2xl font-medium tabular-nums text-warm-gold-dark">
            {priceLabel}
          </p>
          {isPreview ? (
            <p className="mt-3 rounded-sm border border-stone-200/80 bg-champagne/40 px-4 py-3 text-sm text-site-secondary">
              Preview listing. Live inventory will appear here when Shopify or your
              catalog database is connected.
            </p>
          ) : null}
          {!isPreview && !product.availableForSale ? (
            <p className="mt-2 text-sm text-site-secondary">Currently sold out</p>
          ) : null}
        </div>

        {product.descriptionHtml ? (
          <div
            className="prose prose-stone max-w-none text-site-secondary prose-headings:font-serif prose-headings:text-site-fg"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        ) : (
          <p className="leading-relaxed text-site-secondary">{product.description}</p>
        )}
      </div>

      {product.source === "shopify" ? (
        <p className="mt-10 text-sm text-site-secondary">
          Checkout is completed securely through Shopify.
        </p>
      ) : null}
    </PageLayout>
  );
}
