import { NextResponse } from "next/server";
import {
  emailResultForClient,
  sendOrderDetailsEmailBuyerWithCc,
} from "@/lib/email/order-emails.mjs";
import { sanitizeOrder } from "@/lib/order-sanitize.mjs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawOrder = body?.order;
  if (!rawOrder || typeof rawOrder !== "object") {
    return NextResponse.json({ error: "Order is required" }, { status: 400 });
  }

  const order = sanitizeOrder(rawOrder);
  if (!order.id || !order.email) {
    return NextResponse.json(
      { error: "Order is missing required fields" },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(order.email)) {
    return NextResponse.json({ error: "Invalid order email" }, { status: 400 });
  }

  const payment = body?.payment ?? order.payment ?? null;
  const fulfillment = body?.fulfillment ?? order.fulfillment ?? null;

  if (!payment || typeof payment !== "object") {
    return NextResponse.json(
      { error: "Payment details are required for a receipt" },
      { status: 400 },
    );
  }

  try {
    const result = await sendOrderDetailsEmailBuyerWithCc({
      order,
      payment,
      fulfillment,
    });

    if (!result.ok) {
      const status = result.skipped ? 503 : 502;
      return NextResponse.json(
        {
          error:
            result.reason === "smtp_not_configured"
              ? "Email is not configured on the server yet"
              : result.error || "Could not send receipt email",
          email: emailResultForClient(result),
        },
        { status },
      );
    }

    return NextResponse.json({
      ok: true,
      email: emailResultForClient(result),
    });
  } catch (e) {
    console.error("[orders/send-receipt]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg || "Server error" }, { status: 500 });
  }
}
