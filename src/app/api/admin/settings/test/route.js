import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  buildIntegrationsDraft,
  loadSiteIntegrations,
  saveSiteIntegrations,
  testShopifyConnection,
  testStullerEmbedUrl,
  toAdminSettingsResponse,
} from "@/lib/site-integrations";

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const target = body?.target;
  if (target !== "shopify" && target !== "stuller") {
    return NextResponse.json(
      { error: 'target must be "shopify" or "stuller"' },
      { status: 400 },
    );
  }

  try {
    const current = await loadSiteIntegrations();
    const draft = buildIntegrationsDraft(current, body);

    const result =
      target === "shopify"
        ? await testShopifyConnection(draft)
        : await testStullerEmbedUrl(draft.stullerEmbedUrl);

    if (body.saveOnSuccess === true && result.ok) {
      const saved = await saveSiteIntegrations(draft, auth.uid);

      return NextResponse.json({
        ...result,
        saved: true,
        settings: toAdminSettingsResponse(saved),
      });
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("[admin/settings/test POST]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg || "Server error" }, { status: 500 });
  }
}
