import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import { revalidateAfterProductChange } from "@/lib/admin/revalidate-catalog-server";

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  revalidateAfterProductChange(undefined);

  return NextResponse.json({ ok: true });
}
