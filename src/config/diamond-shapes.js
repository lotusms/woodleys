/**
 * Diamond shape icons for navigation and category pages.
 * Assets live in /public/images/products/diamond-shapes.
 *
 * Shape browse filters the origin page via `?shape=` so natural and lab-grown
 * keep separate pricing collections without nested shape routes.
 */

const DIR = "/images/products/diamond-shapes";

/** @typedef {"natural-diamonds" | "lab-grown-diamonds"} DiamondOriginSlug */

/**
 * @typedef {{
 *   slug: string;
 *   label: string;
 *   shopifyHandle: string;
 *   description: string;
 *   icon: { src: string; alt: string };
 * }} DiamondShapeNavItem
 */

/** @type {readonly DiamondShapeNavItem[]} */
export const DIAMOND_SHAPE_NAV = [
  {
    slug: "round",
    label: "Round",
    shopifyHandle: "round-diamonds",
    description: "Classic round brilliant cuts prized for even sparkle.",
    icon: { src: `${DIR}/round.webp`, alt: "" },
  },
  {
    slug: "oval",
    label: "Oval",
    shopifyHandle: "oval-diamonds",
    description: "Elongated silhouette with generous surface area and soft presence.",
    icon: { src: `${DIR}/oval.png`, alt: "" },
  },
  {
    slug: "emerald",
    label: "Emerald",
    shopifyHandle: "emerald-cut-diamonds",
    description: "Step-cut facets and a quiet, architectural elegance.",
    icon: { src: `${DIR}/emerald.webp`, alt: "" },
  },
  {
    slug: "pear",
    label: "Pear",
    shopifyHandle: "pear-diamonds",
    description: "Teardrop form that reads both romantic and distinctive.",
    icon: { src: `${DIR}/pear.png`, alt: "" },
  },
  {
    slug: "cushion",
    label: "Cushion",
    shopifyHandle: "cushion-diamonds",
    description: "Soft corners with a pillow-like facet pattern.",
    icon: { src: `${DIR}/cushion.webp`, alt: "" },
  },
  {
    slug: "princess",
    label: "Princess",
    shopifyHandle: "princess-diamonds",
    description: "Square outline with brilliant faceting for lively reflection.",
    icon: { src: `${DIR}/princess.webp`, alt: "" },
  },
  {
    slug: "radiant",
    label: "Radiant",
    shopifyHandle: "radiant-diamonds",
    description: "Brilliant-cut sparkle with a rectangular outline and cropped corners.",
    icon: { src: `${DIR}/radiant.webp`, alt: "" },
  },
  {
    slug: "marquise",
    label: "Marquise",
    shopifyHandle: "marquise-diamonds",
    description: "Elongated boat shape that maximizes apparent size and finger length.",
    icon: { src: `${DIR}/marquise.webp`, alt: "" },
  },
  {
    slug: "heart",
    label: "Heart",
    shopifyHandle: "heart-diamonds",
    description: "A romantic silhouette with distinctive cleft and pointed tip.",
    icon: { src: `${DIR}/heart.webp`, alt: "" },
  },
];

/**
 * @param {DiamondOriginSlug} originSlug
 * @param {string | null | undefined} shapeSlug
 */
export function buildShapeFilterHref(originSlug, shapeSlug) {
  const path = `/diamonds/${originSlug}`;
  if (!shapeSlug) return path;
  return `${path}?shape=${encodeURIComponent(shapeSlug)}`;
}

/**
 * Legacy nested path (kept for redirects).
 * @param {DiamondOriginSlug} originSlug
 * @param {string} shapeSlug
 */
export function diamondShapePath(originSlug, shapeSlug) {
  return `/diamonds/${originSlug}/${shapeSlug}`;
}

/**
 * Collection handle for origin + shape (separate pricing catalogs).
 * e.g. natural-round-diamonds, lab-grown-emerald-cut-diamonds
 *
 * @param {"natural" | "lab-grown"} originPrefix
 * @param {string} shapeShopifyHandle — e.g. round-diamonds
 */
export function diamondOriginShapeHandle(originPrefix, shapeShopifyHandle) {
  return `${originPrefix}-${shapeShopifyHandle}`;
}

/**
 * @param {string | null | undefined} value
 */
export function parseShapeParam(value) {
  if (!value) return undefined;
  return DIAMOND_SHAPE_NAV.find((shape) => shape.slug === String(value));
}

/**
 * Nav / category links for shapes under one diamond origin (`?shape=` filters).
 * @param {DiamondOriginSlug} originSlug
 */
export function diamondShapeLinksForOrigin(originSlug) {
  const originPrefix =
    originSlug === "lab-grown-diamonds" ? "lab-grown" : "natural";

  return DIAMOND_SHAPE_NAV.map((shape) => ({
    slug: shape.slug,
    label: shape.label,
    title: shape.slug === "emerald" ? "Emerald Cut" : shape.label,
    href: buildShapeFilterHref(originSlug, shape.slug),
    shopifyHandle: diamondOriginShapeHandle(originPrefix, shape.shopifyHandle),
    description: shape.description,
    icon: shape.icon,
    image: {
      src: shape.icon.src,
      alt: `${shape.label} cut diamond`,
    },
  }));
}
