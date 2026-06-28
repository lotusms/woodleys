/**
 * Site-wide values — brand, location, navigation.
 */

export const orgName = "Woodley's Jewelers";
export const orgNameShort = "Woodley's";
export const orgTagline = "Fine jewelry trusted since 1948";
export const orgLocation = "Beaumont, California";
export const orgEstablished = 1948;
export const orgPhone = "(951) 845-1234";
export const orgEmail = "info@woodleyjewelers.com";
export const orgAddress = "Beaumont, California";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://woodleyjewelers.com";

/**
 * @param {string} segment Page title segment (e.g. "Engagement & Wedding")
 * @returns {string} e.g. "Engagement & Wedding | Woodley's Jewelers"
 */
export function sitePageTitle(segment) {
  const s = String(segment ?? "").trim();
  if (!s) return `${orgName} | ${orgTagline}`;
  return `${s} | ${orgName}`;
}

export const defaultMetadata = {
  title: sitePageTitle(),
  description:
    "Family-owned fine jewelry in Beaumont, California since 1948. Engagement rings, diamonds, custom design, watches, and expert jewelry services.",
  keywords: [
    "fine jewelry",
    "engagement rings",
    "diamonds",
    "custom jewelry",
    "Beaumont California jeweler",
    "Woodley's Jewelers",
  ],
};
