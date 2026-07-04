import { NextResponse } from "next/server";
import { sendOrderConfirmationEmails } from "@/lib/email/order-emails.mjs";
import { sanitizeOrder } from "@/lib/order-sanitize.mjs";
import { roundUsd2 } from "@/lib/money";
import {
  isPayPalConfigured,
  paypalCaptureCheckoutOrder,
  paypalCaptureId,
  paypalCapturedAmountUsd,
} from "@/lib/paypal/server";

function validateOrderPayload(order) {
  if (!order || typeof order !== "object") {
    throw new Error("Order payload is required.");
  }
  if (!order.id || !order.email) {
    throw new Error("Order is missing required fields.");
  }
  if (!Array.isArray(order.lines) || order.lines.length === 0) {
    throw new Error("Order has no line items.");
  }
  const totalUsd = Number(order.totalUsd);
  if (!Number.isFinite(totalUsd) || totalUsd <= 0) {
    throw new Error("Order total is invalid.");
  }
  return sanitizeOrder(order);
}

export async function POST(request) {
  try {
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "PayPal is not configured on the server." },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const paypalOrderID = body?.paypalOrderID;
    if (!paypalOrderID || typeof paypalOrderID !== "string") {
      return NextResponse.json(
        { error: "PayPal order id is required." },
        { status: 400 },
      );
    }

    const order = validateOrderPayload(body?.order);
    const capture = await paypalCaptureCheckoutOrder(paypalOrderID);
    const capturedUsd = paypalCapturedAmountUsd(capture);

    if (
      capturedUsd !== null &&
      Math.abs(roundUsd2(capturedUsd) - roundUsd2(order.totalUsd)) > 0.01
    ) {
      return NextResponse.json(
        { error: "Payment amount does not match the order total." },
        { status: 400 },
      );
    }

    const payment = {
      provider: "paypal",
      paypalOrderId: paypalOrderID,
      paypalCaptureId: paypalCaptureId(capture),
    };
    const fulfillment = {
      provider: "local",
      printfulOrderId: null,
      printfulStatus: null,
    };

    const email = await sendOrderConfirmationEmails({
      order,
      payment,
      fulfillment,
    });

    return NextResponse.json({
      ok: true,
      payment,
      mode: "paypal",
      printfulOrderId: null,
      printfulStatus: null,
      email,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment could not be completed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
