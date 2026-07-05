/**
 * Site-wide values — brand, location, navigation.
 */

export const orgName = "Woodley's Jewelers";
export const orgNameShort = "Woodley's";
export const orgTagline = "Fine jewelry trusted since 1948";
export const orgLocation = "Beaumont, California";
export const orgEstablished = 1948;
export const orgPhone = "(951) 845-1234";
export const orgPhoneTel = orgPhone.replace(/\D/g, "");
export const orgEmail = "info@woodleyjewelers.com";
export const orgAddress = "Beaumont, California";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://woodleyjewelers.com";

/** Fixed header — top bar (logo + CTAs). */
export const siteHeaderTopOffset = "4.5rem";
/** Additional secondary nav row on xl+ viewports. */
export const siteHeaderNavOffset = "3rem";

/** Tailwind classes — clear fixed header on main-site pages. */
export const siteHeaderClearanceClass = "pt-[4.5rem] xl:pt-[7.5rem]";
/** Fixed hero slide progress — sits flush under the header. */
export const siteHeaderProgressBarTopClass = "top-[4.5rem] xl:top-[7.5rem]";
/** Full-height content area below the fixed header. */
export const siteBelowHeaderMinHeightClass =
  "min-h-[calc(100dvh-4.5rem)] xl:min-h-[calc(100dvh-7.5rem)]";

/**
 * Page shell layout — main content has no default horizontal inset.
 * Apply `sitePageInsetClass` (or `sitePageInsetContainerClass`) at page level
 * when content should not run edge-to-edge.
 */
export const sitePageInsetClass = "px-6 sm:px-10 lg:px-12";

/** Centered editorial width for standard pages. */
export const sitePageContainerClass = "mx-auto w-full max-w-7xl";

/** Typical inner page: centered container + horizontal inset. */
export const sitePageInsetContainerClass = `${sitePageContainerClass} ${sitePageInsetClass}`;

/** Wide editorial container (product detail, large grids). */
export const sitePageWideContainerClass = "mx-auto w-full max-w-[90rem]";

/** Edge-media shell — no horizontal inset; left column can bleed to viewport. */
export const sitePageEdgeMediaShellClass = "relative w-full min-w-0";

/** Inset for the meta/purchase column on edge-media pages. */
export const sitePageEdgeMediaAsideInsetClass =
  "px-6 sm:px-10 lg:px-12 lg:pl-0 xl:pr-16";

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
