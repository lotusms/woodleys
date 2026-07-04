import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  buildIntegrationsDraft,
  loadSiteIntegrations,
  saveSiteIntegrations,
  toAdminSettingsResponse,
} from "@/lib/site-integrations";

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const integrations = await loadSiteIntegrations();
    return NextResponse.json(toAdminSettingsResponse(integrations));
  } catch (e) {
    console.error("[admin/settings GET]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg || "Server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const current = await loadSiteIntegrations();
    const draft = buildIntegrationsDraft(current, body);
    const integrations = await saveSiteIntegrations(draft, auth.uid);

    return NextResponse.json({
      ok: true,
      settings: toAdminSettingsResponse(integrations),
    });
  } catch (e) {
    console.error("[admin/settings PUT]", e);
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
