import sampleOrders from "@/data/sample-orders.json";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** @param {string | undefined} iso */
function parseCreatedAt(iso) {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

/** @param {Record<string, unknown>} order */
export function isSampleOrder(order) {
  return Boolean(order?.isSample) || String(order?.id || "").startsWith("SAMPLE-ORD-");
}

/** Orders from the bundled JSON within the last 30 days, newest first. */
export function getSampleOrdersPastMonth() {
  const cutoff = Date.now() - THIRTY_DAYS_MS;
  return sampleOrders
    .filter((order) => parseCreatedAt(order.createdAt) >= cutoff)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

/** @param {string} orderId */
export function getSampleOrderById(orderId) {
  if (!orderId) return null;
  const match = sampleOrders.find((order) => order.id === orderId);
  return match ? { ...match } : null;
}

/** Demo profile id on `/profile/1` with bundled sample orders. */
export const DEMO_PROFILE_ID = "1";

/** @param {string} profileId */
export function getSampleOrdersForProfile(profileId) {
  if (!profileId) return [];
  return sampleOrders
    .filter((order) => order.demoProfileId === profileId)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}
