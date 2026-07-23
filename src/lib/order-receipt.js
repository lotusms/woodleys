/**
 * Shared order receipt helpers (transaction id, address formatting).
 */

/**
 * @param {{ id?: string; payment?: {
 *   cloverChargeId?: string;
 *   paypalCaptureId?: string;
 *   paypalOrderId?: string;
 * } | null }} order
 */
export function getOrderTransactionId(order) {
  const payment = order?.payment;
  if (payment && typeof payment === "object") {
    if (payment.cloverChargeId) return String(payment.cloverChargeId);
    if (payment.paypalCaptureId) return String(payment.paypalCaptureId);
    if (payment.paypalOrderId) return String(payment.paypalOrderId);
  }
  return String(order?.id || "");
}

/**
 * @param {{ provider?: string } | null | undefined} payment
 */
export function getPaymentMethodLabel(payment) {
  if (!payment || typeof payment !== "object") return "Payment received";
  if (payment.provider === "clover") return "Card";
  if (payment.provider === "paypal") return "PayPal";
  return String(payment.provider || "Payment received");
}

/**
 * @param {{ shippingAddress?: Record<string, string | undefined> }} order
 */
export function formatShippingAddress(order) {
  const a = order?.shippingAddress;
  if (!a || typeof a !== "object") return "";
  return [
    a.fullName,
    a.address1,
    a.address2,
    [a.city, a.state, a.postalCode].filter(Boolean).join(", "),
    a.country,
  ]
    .filter(Boolean)
    .join("\n");
}
