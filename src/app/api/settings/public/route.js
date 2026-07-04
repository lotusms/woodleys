import { NextResponse } from "next/server";
import {
  loadSiteIntegrations,
  toPublicSettingsResponse,
} from "@/lib/site-integrations";

export async function GET() {
  try {
    const integrations = await loadSiteIntegrations();
    return NextResponse.json(toPublicSettingsResponse(integrations), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (e) {
    console.error("[settings/public GET]", e);
    return NextResponse.json(
      {
        stullerEmbedUrl: null,
        shopifyConfigured: false,
        shopifyCatalogEnabled: false,
        shopifyStoreDomain: null,
      },
      { status: 200 },
    );
  }
}
