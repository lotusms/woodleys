import { randomUUID } from "node:crypto";
import { roundUsd2 } from "@/lib/money";

/**
 * Clover Ecommerce server helpers (charges via scl*.clover.com).
 * @see https://docs.clover.com/dev/docs/ecommerce-api-payments-flow
 */

function cloverEnvironment() {
  const raw = (
    process.env.CLOVER_ENVIRONMENT ||
    process.env.NEXT_PUBLIC_CLOVER_ENVIRONMENT ||
    "production"
  )
    .trim()
    .toLowerCase();
  return raw === "sandbox" || raw === "dev" ? "sandbox" : "production";
}

/** Ecommerce charges API base (no trailing slash). */
export function cloverChargesApiBase() {
  return cloverEnvironment() === "sandbox"
    ? "https://scl-sandbox.dev.clover.com"
    : "https://scl.clover.com";
}

/** Hosted iframe SDK URL for the browser. */
export function cloverSdkUrl() {
  return cloverEnvironment() === "sandbox"
    ? "https://checkout.sandbox.dev.clover.com/sdk.js"
    : "https://checkout.clover.com/sdk.js";
}

export function cloverPrivateKey() {
  return (
    process.env.CLOVER_PRIVATE_KEY?.trim() ||
    process.env.CLOVER_ACCESS_TOKEN?.trim() ||
    ""
  );
}

export function cloverPublicKey() {
  return (
    process.env.NEXT_PUBLIC_CLOVER_PAKMS_KEY?.trim() ||
    process.env.NEXT_PUBLIC_CLOVER_PUBLIC_KEY?.trim() ||
    ""
  );
}

export function cloverMerchantId() {
  return (
    process.env.NEXT_PUBLIC_CLOVER_MERCHANT_ID?.trim() ||
    process.env.CLOVER_MERCHANT_ID?.trim() ||
    ""
  );
}

export function isCloverBrowserConfigured() {
  return Boolean(cloverPublicKey() && cloverMerchantId());
}

export function isCloverConfigured() {
  return Boolean(cloverPrivateKey() && isCloverBrowserConfigured());
}

/** Public config safe to expose to the browser. */
export function getCloverBrowserConfig() {
  return {
    configured: isCloverBrowserConfigured(),
    environment: cloverEnvironment(),
    sdkUrl: cloverSdkUrl(),
    publicKey: cloverPublicKey(),
    merchantId: cloverMerchantId(),
  };
}

/**
 * @param {number} amountUsd
 * @returns {number} amount in cents
 */
export function usdToCloverCents(amountUsd) {
  const usd = roundUsd2(amountUsd);
  if (!Number.isFinite(usd) || usd <= 0) {
    throw new Error("Invalid amount for Clover charge.");
  }
  return Math.round(usd * 100);
}

/**
 * @param {number} cents
 * @returns {number}
 */
export function cloverCentsToUsd(cents) {
  const n = Number(cents);
  if (!Number.isFinite(n)) return NaN;
  return roundUsd2(n / 100);
}

/**
 * @param {{
 *   amountCents: number;
 *   source: string;
 *   currency?: string;
 *   description?: string;
 *   externalReferenceId?: string;
 *   receiptEmail?: string;
 *   clientIp?: string;
 *   idempotencyKey?: string;
 * }} params
 */
export async function cloverCreateCharge({
  amountCents,
  source,
  currency = "usd",
  description,
  externalReferenceId,
  receiptEmail,
  clientIp,
  idempotencyKey,
}) {
  const privateKey = cloverPrivateKey();
  if (!privateKey) {
    throw new Error("Clover is not configured (private key).");
  }
  if (!source || typeof source !== "string" || !source.startsWith("clv_")) {
    throw new Error("A valid Clover card token is required.");
  }
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new Error("Invalid charge amount.");
  }

  /** @type {Record<string, unknown>} */
  const body = {
    amount: amountCents,
    currency: String(currency || "usd").toLowerCase(),
    source,
    capture: true,
  };
  if (description) body.description = description;
  if (externalReferenceId) body.external_reference_id = externalReferenceId;
  if (receiptEmail) body.receipt_email = receiptEmail;

  /** @type {Record<string, string>} */
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${privateKey}`,
    "Idempotency-Key": idempotencyKey || randomUUID(),
    "User-Agent": "WoodleysJewelersStorefront/1.0",
  };
  if (clientIp) {
    headers["x-forwarded-for"] = clientIp;
  }

  const res = await fetch(`${cloverChargesApiBase()}/v1/charges`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      data?.message ||
      data?.error?.message ||
      (typeof data?.error === "string" ? data.error : null) ||
      `Clover charge failed (${res.status}).`;
    throw new Error(detail);
  }

  return data;
}

/**
 * @param {unknown} chargeResponse
 * @returns {string | null}
 */
export function cloverChargeId(chargeResponse) {
  if (!chargeResponse || typeof chargeResponse !== "object") return null;
  const id = /** @type {{ id?: unknown }} */ (chargeResponse).id;
  return typeof id === "string" && id ? id : null;
}

/**
 * @param {unknown} chargeResponse
 * @returns {number | null} USD amount charged
 */
export function cloverChargedAmountUsd(chargeResponse) {
  if (!chargeResponse || typeof chargeResponse !== "object") return null;
  const amount = /** @type {{ amount?: unknown }} */ (chargeResponse).amount;
  if (typeof amount !== "number" || !Number.isFinite(amount)) return null;
  return cloverCentsToUsd(amount);
}
