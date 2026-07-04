import { NextResponse } from "next/server";
import {
  cartRequiresShopifyCheckout,
  getShopifyCheckoutUrlForCart,
} from "@/lib/cart-checkout";
import { isShopifyIntegrationConfigured } from "@/lib/shopify/integration-config";
import { loadSiteIntegrations } from "@/lib/site-integrations";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const lines = Array.isArray(body?.lines) ? body.lines : [];

  if (cartRequiresShopifyCheckout(lines)) {
    if (!(await isShopifyIntegrationConfigured())) {
      return NextResponse.json(
        {
          ok: false,
          message: "Shopify checkout is not configured.",
        },
        { status: 503 },
      );
    }

    const integrations = await loadSiteIntegrations();
    const redirectUrl = getShopifyCheckoutUrlForCart(lines, {
      domain: integrations.shopifyStoreDomain,
    });

    if (!redirectUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Could not build a Shopify checkout URL for this cart.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      mode: "shopify",
      redirectUrl,
    });
  }

  return NextResponse.json({
    ok: true,
    mode: "local",
    redirectUrl: "/checkout",
  });
}
