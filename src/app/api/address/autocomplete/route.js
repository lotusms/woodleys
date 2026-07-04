import { NextResponse } from "next/server";
import {
  gatherAddressSuggestions,
  isAddressAutocompleteQueryAllowed,
} from "@/lib/address/gather-address-suggestions";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = String(searchParams.get("q") || "").trim();
  const checkoutCountry = String(searchParams.get("country") || "US").trim() || "US";
  const preferState = String(searchParams.get("preferState") || "").trim();

  if (!isAddressAutocompleteQueryAllowed(q)) {
    return NextResponse.json({ ok: true, suggestions: [] });
  }

  try {
    const suggestions = await gatherAddressSuggestions(q, checkoutCountry, {
      preferState,
    });
    return NextResponse.json({ ok: true, suggestions });
  } catch {
    return NextResponse.json({ ok: false, suggestions: [] }, { status: 502 });
  }
}
