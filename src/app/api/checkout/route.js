import { NextResponse } from "next/server";
import { getShopifyCheckoutUrl, isShopifyConfigured } from "@/lib/shopify/config";

export async function POST() {
  if (isShopifyConfigured()) {
    return NextResponse.json({
      ok: true,
      redirectUrl: getShopifyCheckoutUrl(),
      mode: "shopify",
    });
  }

  return NextResponse.json(
    {
      ok: false,
      message: "Shopify checkout is not configured. Set SHOPIFY_STORE_DOMAIN.",
    },
    { status: 503 },
  );
}
