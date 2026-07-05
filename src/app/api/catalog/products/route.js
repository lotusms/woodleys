import { NextResponse } from "next/server";
import { getActiveProductsList } from "@/lib/catalog/catalog-cache";
import { listAllMockCatalogProducts } from "@/lib/catalog/mock-catalog";
import { getProductChargeUsd } from "@/lib/catalog/product-pricing";

export const revalidate = 60;

function serializeProducts(products) {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    slug: product.handle,
    priceUsd: getProductChargeUsd(product),
    image: product.image?.src ?? "",
    originalImage: product.image?.src ?? "",
    variantId: product.id,
    catalogVariantId: product.id,
    source: product.source ?? "local",
    availableForSale: product.availableForSale,
    artist: "Woodley's Jewelers",
    shippingIncluded: false,
  }));
}

export async function GET() {
  let products = await getActiveProductsList();

  if (products.length === 0) {
    products = listAllMockCatalogProducts().filter((product) => product.availableForSale);
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
