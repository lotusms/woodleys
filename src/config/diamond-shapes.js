/**
 * Diamond shape icons for navigation and category pages.
 * Assets live in /public/images/products/diamond-shapes.
 *
 * Shape browse lives under each origin so pricing can differ:
 * `/diamonds/natural-diamonds/{shape}` and `/diamonds/lab-grown-diamonds/{shape}`.
 */

const DIR = "/images/products/diamond-shapes";

/** @typedef {"natural-diamonds" | "lab-grown-diamonds"} DiamondOriginSlug */

/**
 * @typedef {{
 *   slug: string;
 *   label: string;
 *   href: string;
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
    href: "/diamonds/natural-diamonds/round",
    shopifyHandle: "round-diamonds",
    description: "Classic round brilliant cuts prized for even sparkle.",
    icon: { src: `${DIR}/round.webp`, alt: "" },
  },
  {
    slug: "oval",
    label: "Oval",
    href: "/diamonds/natural-diamonds/oval",
    shopifyHandle: "oval-diamonds",
    description: "Elongated silhouette with generous surface area and soft presence.",
    icon: { src: `${DIR}/oval.png`, alt: "" },
  },
  {
    slug: "emerald",
    label: "Emerald",
    href: "/diamonds/natural-diamonds/emerald",
    shopifyHandle: "emerald-cut-diamonds",
    description: "Step-cut facets and a quiet, architectural elegance.",
    icon: { src: `${DIR}/emerald.webp`, alt: "" },
  },
  {
    slug: "pear",
    label: "Pear",
    href: "/diamonds/natural-diamonds/pear",
    shopifyHandle: "pear-diamonds",
    description: "Teardrop form that reads both romantic and distinctive.",
    icon: { src: `${DIR}/pear.png`, alt: "" },
  },
  {
    slug: "cushion",
    label: "Cushion",
    href: "/diamonds/natural-diamonds/cushion",
    shopifyHandle: "cushion-diamonds",
    description: "Soft corners with a pillow-like facet pattern.",
    icon: { src: `${DIR}/cushion.webp`, alt: "" },
  },
  {
    slug: "princess",
    label: "Princess",
    href: "/diamonds/natural-diamonds/princess",
    shopifyHandle: "princess-diamonds",
    description: "Square outline with brilliant faceting for lively reflection.",
    icon: { src: `${DIR}/princess.webp`, alt: "" },
  },
  {
    slug: "radiant",
    label: "Radiant",
    href: "/diamonds/natural-diamonds/radiant",
    shopifyHandle: "radiant-diamonds",
    description: "Brilliant-cut sparkle with a rectangular outline and cropped corners.",
    icon: { src: `${DIR}/radiant.webp`, alt: "" },
  },
  {
    slug: "marquise",
    label: "Marquise",
    href: "/diamonds/natural-diamonds/marquise",
    shopifyHandle: "marquise-diamonds",
    description: "Elongated boat shape that maximizes apparent size and finger length.",
    icon: { src: `${DIR}/marquise.webp`, alt: "" },
  },
  {
    slug: "heart",
    label: "Heart",
    href: "/diamonds/natural-diamonds/heart",
    shopifyHandle: "heart-diamonds",
    description: "A romantic silhouette with distinctive cleft and pointed tip.",
    icon: { src: `${DIR}/heart.webp`, alt: "" },
  },
];

/**
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
 * Nav / category links for shapes under one diamond origin.
 * @param {DiamondOriginSlug} originSlug
 */
export function diamondShapeLinksForOrigin(originSlug) {
  const originPrefix =
    originSlug === "lab-grown-diamonds" ? "lab-grown" : "natural";

  return DIAMOND_SHAPE_NAV.map((shape) => ({
    slug: shape.slug,
    label: shape.label,
    title: shape.slug === "emerald" ? "Emerald Cut" : shape.label,
    href: diamondShapePath(originSlug, shape.slug),
    shopifyHandle: diamondOriginShapeHandle(originPrefix, shape.shopifyHandle),
    description: shape.description,
    icon: shape.icon,
    image: {
      src: shape.icon.src,
      alt: `${shape.label} cut diamond`,
    },
  }));
}
