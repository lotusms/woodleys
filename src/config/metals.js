/**
 * Jewelry metals for navigation and category browse.
 * Symbols use chemical notation; gold color variants share Au with distinct styling.
 * Stainless steel uses Fe (iron) as the primary element in the alloy.
 *
 * Shop by Metal stays on the current category page via `?metal=` — it does not
 * create nested metal routes.
 */

/**
 * @typedef {{
 *   slug: string;
 *   label: string;
 *   symbol: string;
 *   symbolClass: string;
 *   shopifyHandle: string;
 *   description: string;
 *   matchTerms: string[];
 * }} JewelryMetal
 */

/** @type {readonly JewelryMetal[]} */
export const JEWELRY_METALS = [
  {
    slug: "yellow-gold",
    label: "Yellow Gold",
    symbol: "Au",
    symbolClass: "text-amber-800",
    shopifyHandle: "yellow-gold",
    description: "Warm classic yellow gold for timeless everyday and bridal pieces.",
    matchTerms: ["yellow gold", "y/g", "yellowgold", "14k yellow", "18k yellow", "10k yellow"],
  },
  {
    slug: "white-gold",
    label: "White Gold",
    symbol: "Au",
    symbolClass: "text-stone-500",
    shopifyHandle: "white-gold",
    description: "Bright white gold with a cool, modern finish.",
    matchTerms: ["white gold", "w/g", "whitegold", "14k white", "18k white", "10k white"],
  },
  {
    slug: "rose-gold",
    label: "Rose Gold",
    symbol: "Au",
    symbolClass: "text-rose-700",
    shopifyHandle: "rose-gold",
    description: "Soft rose gold with a romantic blush tone.",
    matchTerms: ["rose gold", "pink gold", "rosegold", "14k rose", "18k rose"],
  },
  {
    slug: "platinum",
    label: "Platinum",
    symbol: "Pt",
    symbolClass: "text-slate-600",
    shopifyHandle: "platinum",
    description: "Naturally white, durable platinum for heirloom pieces.",
    matchTerms: ["platinum", "plat."],
  },
  {
    slug: "sterling-silver",
    label: "Sterling Silver",
    symbol: "Ag",
    symbolClass: "text-zinc-500",
    shopifyHandle: "sterling-silver",
    description: "Bright sterling silver with a clean, luminous finish.",
    matchTerms: ["sterling silver", "sterling", "925 silver", ".925", "argentium"],
  },
  {
    slug: "stainless-steel",
    label: "Stainless Steel",
    symbol: "Fe",
    symbolClass: "text-neutral-500",
    shopifyHandle: "stainless-steel",
    description: "Durable stainless steel with a modern, low-maintenance polish.",
    matchTerms: ["stainless steel", "stainless", "surgical steel"],
  },
  {
    slug: "tungsten",
    label: "Tungsten",
    symbol: "W",
    symbolClass: "text-stone-700",
    shopifyHandle: "tungsten",
    description: "Hard tungsten carbide with lasting weight and a deep polish.",
    matchTerms: ["tungsten", "tungsten carbide"],
  },
  {
    slug: "titanium",
    label: "Titanium",
    symbol: "Ti",
    symbolClass: "text-slate-500",
    shopifyHandle: "titanium",
    description: "Lightweight titanium for a strong, contemporary feel.",
    matchTerms: ["titanium"],
  },
  {
    slug: "tantalum",
    label: "Tantalum",
    symbol: "Ta",
    symbolClass: "text-stone-800",
    shopifyHandle: "tantalum",
    description: "Dark, hypoallergenic tantalum with a distinctive matte or polished look.",
    matchTerms: ["tantalum"],
  },
];

/**
 * Precious metals common for engagement rings.
 * Wedding bands and fashion jewelry keep the full metal list.
 */
export const BRIDAL_METAL_SLUGS = [
  "yellow-gold",
  "white-gold",
  "rose-gold",
  "platinum",
];

/**
 * @param {string} metalSlug
 * @returns {JewelryMetal | undefined}
 */
export function getJewelryMetal(metalSlug) {
  return JEWELRY_METALS.find((metal) => metal.slug === metalSlug);
}

/**
 * @param {string[]} slugs
 */
export function metalsBySlug(slugs) {
  return JEWELRY_METALS.filter((metal) => slugs.includes(metal.slug));
}

/**
 * @param {string | null | undefined} value
 * @returns {JewelryMetal | undefined}
 */
export function parseMetalParam(value) {
  if (!value) return undefined;
  return getJewelryMetal(String(value));
}

/**
 * Build a category URL with an optional metal filter query.
 * @param {string} basePath — absolute path without trailing slash
 * @param {string | null | undefined} metalSlug
 */
export function buildMetalFilterHref(basePath, metalSlug) {
  const path = basePath.replace(/\/$/, "") || "/";
  if (!metalSlug) return path;
  return `${path}?metal=${encodeURIComponent(metalSlug)}`;
}

/**
 * True when product title, description, or Metal spec matches the metal.
 * @param {{ title?: string; description?: string; specs?: { label?: string; value?: string }[] }} product
 * @param {string} metalSlug
 */
export function productMatchesMetal(product, metalSlug) {
  const metal = getJewelryMetal(metalSlug);
  if (!metal) return true;

  const metalSpec = Array.isArray(product.specs)
    ? product.specs.find((spec) => /metal/i.test(String(spec?.label || "")))
    : null;

  const haystack = [
    product.title,
    product.description,
    metalSpec?.value,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return metal.matchTerms.some((term) => haystack.includes(term));
}

/**
 * Filter option list for on-page metal controls.
 * @param {string} basePath
 * @param {{ metals?: readonly JewelryMetal[] }} [options]
 */
export function metalFilterOptions(basePath, options = {}) {
  const metals = options.metals ?? JEWELRY_METALS;
  return metals.map((metal) => ({
    title: metal.label,
    href: buildMetalFilterHref(basePath, metal.slug),
    symbol: metal.symbol,
    symbolClass: metal.symbolClass,
    slug: metal.slug,
  }));
}

/**
 * Nav icon-grid section for Shop by Metal (query-param filters on parent path).
 * @param {string} parentPath
 * @param {string} contextLabel — e.g. "Rings" for accessible names
 * @param {{ metals?: readonly JewelryMetal[] }} [options]
 */
export function metalNavSection(parentPath, contextLabel, options = {}) {
  const metals = options.metals ?? JEWELRY_METALS;
  return {
    id: `metals-${parentPath.replace(/\//g, "-")}`,
    heading: "Shop by Metal",
    layout: /** @type {"iconGrid"} */ ("iconGrid"),
    links: metals.map((metal) => ({
      id: `${parentPath}-${metal.slug}`,
      label: metal.label,
      href: buildMetalFilterHref(parentPath, metal.slug),
      symbol: metal.symbol,
      symbolClass: metal.symbolClass,
      visuallyHiddenContext: `${contextLabel}, ${metal.label}`,
    })),
  };
}

/**
 * Categories that support on-page metal filtering.
 * @param {string} sectionKey
 * @param {string} entrySlug
 */
export function entrySupportsMetalFilter(sectionKey, entrySlug) {
  if (sectionKey === "fine-jewelry") {
    return ["rings", "necklaces", "earrings", "bracelets"].includes(entrySlug);
  }
  if (sectionKey === "women" || sectionKey === "men") {
    return [
      "rings",
      "necklaces",
      "earrings",
      "bracelets",
      "wedding-bands",
      "engagement-rings",
      "pendants",
    ].includes(entrySlug);
  }
  if (sectionKey === "engagement-wedding") {
    return [
      "solitaire",
      "halo",
      "three-stone",
      "vintage-inspired",
      "wedding-bands",
    ].includes(entrySlug);
  }
  return false;
}

/**
 * Which metal list to offer for a category.
 * @param {string} sectionKey
 * @param {string} entrySlug
 */
export function metalsForEntry(sectionKey, entrySlug) {
  if (
    sectionKey === "engagement-wedding" &&
    entrySlug !== "wedding-bands"
  ) {
    return metalsBySlug(BRIDAL_METAL_SLUGS);
  }
  if (sectionKey === "women" && entrySlug === "engagement-rings") {
    return metalsBySlug(BRIDAL_METAL_SLUGS);
  }
  return JEWELRY_METALS;
}
