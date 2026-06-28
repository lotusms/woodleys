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
    { ok: false, message: "PayPal checkout disabled — use Shopify checkout." },
    { status: 503 },
  );
}
