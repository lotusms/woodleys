import { NextResponse } from "next/server";
import { sendOrderConfirmationEmails } from "@/lib/email/order-emails.mjs";
import { sanitizeOrder } from "@/lib/order-sanitize.mjs";
import { roundUsd2 } from "@/lib/money";
import {
  cloverChargeId,
  cloverChargedAmountUsd,
  cloverCreateCharge,
  getCloverBrowserConfig,
  isCloverConfigured,
  usdToCloverCents,
} from "@/lib/clover/server";

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

function clientIpFromRequest(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return undefined;
}

export async function GET() {
  const config = getCloverBrowserConfig();
  if (!config.configured) {
    return NextResponse.json(
      { configured: false, error: "Clover is not configured on the server." },
      { status: 503 },
    );
  }
  return NextResponse.json({
    configured: true,
    environment: config.environment,
    sdkUrl: config.sdkUrl,
    publicKey: config.publicKey,
    merchantId: config.merchantId,
  });
}

export async function POST(request) {
  try {
    if (!isCloverConfigured()) {
      return NextResponse.json(
        { error: "Clover is not configured on the server." },
        { status: 503 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const source = body?.source;
    if (!source || typeof source !== "string") {
      return NextResponse.json(
        { error: "Clover card token is required." },
        { status: 400 },
      );
    }

    const order = validateOrderPayload(body?.order);
    const amountCents = usdToCloverCents(order.totalUsd);
    const charge = await cloverCreateCharge({
      amountCents,
      source,
      currency: "usd",
      description: `Woodley's Jewelers order ${order.id}`,
      externalReferenceId: String(order.id),
      receiptEmail: String(order.email),
      clientIp: clientIpFromRequest(request),
      idempotencyKey: `order-${order.id}`,
    });

    const chargedUsd = cloverChargedAmountUsd(charge);
    if (
      chargedUsd !== null &&
      Math.abs(roundUsd2(chargedUsd) - roundUsd2(order.totalUsd)) > 0.01
    ) {
      return NextResponse.json(
        { error: "Payment amount does not match the order total." },
        { status: 400 },
      );
    }

    const payment = {
      provider: "clover",
      cloverChargeId: cloverChargeId(charge),
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
      mode: "clover",
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
