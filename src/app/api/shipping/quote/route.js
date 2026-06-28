import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { ok: false, message: "Shipping quotes are handled through Shopify checkout." },
    { status: 503 },
  );
}
