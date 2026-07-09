import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  createFirestoreProduct,
  listFirestoreProducts,
  syncCatalogProductsFromMock,
} from "@/lib/catalog/firestore-products";
import { slugifyProductHandle } from "@/lib/catalog/product-handle";

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const sync = await syncCatalogProductsFromMock();
    const products = await listFirestoreProducts();
    return NextResponse.json({ products, sync });
  } catch (e) {
    console.error("[admin/products GET]", e);
    const msg = e instanceof Error ? e.message : String(e);
    if (
      msg.includes("FIREBASE_SERVICE_ACCOUNT") ||
      msg.includes("Could not load the default credentials")
    ) {
      return NextResponse.json(
        {
          error:
            "Server Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON in .env.local.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: msg || "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const imageSrc =
    typeof body?.image?.src === "string" ? body.image.src.trim() : "";
  if (!imageSrc) {
    return NextResponse.json(
      { error: "A main product image is required." },
      { status: 400 },
    );
  }

  const handle =
    typeof body?.handle === "string" && body.handle.trim()
      ? body.handle.trim()
      : slugifyProductHandle(title);

  try {
    const product = await createFirestoreProduct({
      handle,
      title,
      description: body.description ?? "",
      descriptionHtml: body.descriptionHtml,
      priceUsd: body.priceUsd,
      salePriceUsd: body.salePriceUsd,
      maxPriceUsd: body.maxPriceUsd,
      quantity: body.quantity,
      active: body.active,
      featured: body.featured,
      featuredOrder: body.featuredOrder,
      collectionHandles: body.collectionHandles ?? [],
      image: body.image,
      images: body.images ?? [],
      specs: body.specs ?? [],
    });

    revalidateTag("catalog-products");
    revalidateTag(`product-${product.handle}`);
    for (const collectionHandle of product.collectionHandles ?? []) {
      revalidateTag(`collection-${collectionHandle}`);
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    console.error("[admin/products POST]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg || "Server error" }, { status: 500 });
  }
}
