import { NextResponse } from "next/server";
import { listFirestoreProducts } from "@/lib/catalog/firestore-products";
import { listAllMockCatalogProducts } from "@/lib/catalog/mock-catalog";
import { isFirebaseAdminAuthError } from "@/lib/firebase-admin-server";
import { getProductChargeUsd } from "@/lib/catalog/product-pricing";

export async function GET() {
  try {
    let products = await listFirestoreProducts({ activeOnly: true });

    if (products.length === 0) {
      products = listAllMockCatalogProducts().filter((product) => product.availableForSale);
    }

    return NextResponse.json({
      products: products.map((product) => ({
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
      })),
    });
  } catch (error) {
    if (!isFirebaseAdminAuthError(error)) {
      console.error("[catalog/products GET]", error);
    }

    const products = listAllMockCatalogProducts().filter((product) => product.availableForSale);
    return NextResponse.json({
      products: products.map((product) => ({
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
      })),
    });
  }
}
