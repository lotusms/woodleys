import { NextResponse } from "next/server";
import { getActiveProductsList } from "@/lib/catalog/catalog-cache";
import { listAllMockCatalogProducts } from "@/lib/catalog/mock-catalog";
import { getProductChargeUsd } from "@/lib/catalog/product-pricing";
import { normalizeCatalogImageSrc } from "@/lib/catalog/normalize-image-src";

export const revalidate = 60;

function serializeProducts(products) {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    slug: product.handle,
    priceUsd: getProductChargeUsd(product),
    image: normalizeCatalogImageSrc(product.image?.src ?? ""),
    originalImage: normalizeCatalogImageSrc(product.image?.src ?? ""),
    variantId: product.id,
    catalogVariantId: product.id,
    source: product.source ?? "local",
    availableForSale: product.availableForSale,
    artist: "Woodley's Jewelers",
    shippingIncluded: false,
  }));
}

export async function GET() {
  const mockProducts = listAllMockCatalogProducts().filter(
    (product) => product.availableForSale,
  );

  let products = [];
  try {
    products = await Promise.race([
      getActiveProductsList(),
      new Promise((resolve) => {
        setTimeout(() => resolve([]), 600);
      }),
    ]);
  } catch {
    products = [];
  }

  if (products.length === 0) {
    products = mockProducts;
  }

  return NextResponse.json(
    { products: serializeProducts(products) },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    },
  );
}
