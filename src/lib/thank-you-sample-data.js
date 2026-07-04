import sampleThankYouOrder from "@/data/sample-thank-you-order.json";

/** Static preview order for the thank-you page when checkout has not run yet. */
export function getSampleThankYouOrder() {
  return { ...sampleThankYouOrder };
}
