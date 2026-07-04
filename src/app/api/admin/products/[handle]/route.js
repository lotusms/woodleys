import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require-admin";
import {
  deleteFirestoreProduct,
  getFirestoreProductByHandle,
  updateFirestoreProduct,
} from "@/lib/catalog/firestore-products";

/**
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ handle: string }> }} context
 */
export async function GET(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { handle } = await params;
  const productHandle = decodeURIComponent(handle ?? "").trim();
  if (!productHandle) {
    return NextResponse.json({ error: "handle is required" }, { status: 400 });
  }

  try {
    const product = await getFirestoreProductByHandle(productHandle, {
      includeInactive: true,
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (e) {
    console.error("[admin/products/[handle] GET]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg || "Server error" }, { status: 500 });
  }
}

/**
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ handle: string }> }} context
 */
export async function PATCH(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { handle } = await params;
  const productHandle = decodeURIComponent(handle ?? "").trim();
  if (!productHandle) {
    return NextResponse.json({ error: "handle is required" }, { status: 400 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const product = await updateFirestoreProduct(productHandle, body ?? {});
    return NextResponse.json({ product });
  } catch (e) {
    console.error("[admin/products/[handle] PATCH]", e);
    const msg = e instanceof Error ? e.message : String(e);
    const status = msg === "Product not found." ? 404 : 500;
    return NextResponse.json({ error: msg || "Server error" }, { status });
  }
}

/**
 * @param {import("next/server").NextRequest} request
 * @param {{ params: Promise<{ handle: string }> }} context
 */
export async function DELETE(request, { params }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { handle } = await params;
  const productHandle = decodeURIComponent(handle ?? "").trim();
  if (!productHandle) {
    return NextResponse.json({ error: "handle is required" }, { status: 400 });
  }

  try {
    await deleteFirestoreProduct(productHandle);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/products/[handle] DELETE]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg || "Server error" }, { status: 500 });
  }
}
