import { diamondShapeLinksForOrigin } from "../../config/diamond-shapes.js";
import {
  BRIDAL_METAL_SLUGS,
  metalCategoryChildren,
  metalsBySlug,
} from "../../config/metals.js";
import { BULOVA_CATEGORY_IMAGE } from "./bulova-sample-products.js";
import { RING_CATEGORY_IMAGE } from "./ring-sample-products.js";

/** Local category hero for Women's Engagement Rings. */
const ENGAGEMENT_RINGS_HERO = {
  src: "/images/heroes/engagement-rings.png",
  alt: "Diamond engagement rings in yellow, white, and rose gold on stone",
};

/** Local category hero for Women's Wedding Bands. */
const WOMEN_WEDDING_BANDS_HERO = {
  src: "/images/heroes/women-wedding-bands.png",
  alt: "Women's diamond wedding bands in yellow gold, white gold, and rose gold",
};

/** Local category hero for Men's Wedding Bands. */
const MEN_WEDDING_BANDS_HERO = {
  src: "/images/heroes/mens-wedding-bands.png",
  alt: "Men's wedding bands in yellow gold, white gold, and alternative metals",
};

/** Local category hero for Wedding Bands (bridal hub). */
const WEDDING_BANDS_HERO = {
  src: "/images/heroes/wedding-bands.png",
  alt: "Wedding bands in yellow gold, white gold, and rose gold",
};
/**
 * Catalog taxonomy — structured for Shopify collection handles when connected.
 * Each entry maps to a future Shopify collection handle via `shopifyHandle`.
 *
 * Audience hubs (`women`, `men`) reuse type collection handles and filter by
 * product `audience`. Their children are `derived` so they are not duplicated
 * in the admin collection checklist.
 *
 * Diamond origins nest shape children so natural vs lab-grown can be priced
 * separately per cut (`natural-round-diamonds`, `lab-grown-round-diamonds`, …).
 */

/**
 * @typedef {{
 *   slug: string;
 *   title: string;
 *   description: string;
 *   shopifyHandle: string;
 *   image?: { src: string; alt: string };
 *   audience?: import("./product-audience").ProductAudience;
 *   sourceHandles?: string[];
 *   derived?: boolean;
 *   metalFilter?: string;
 *   symbol?: string;
 *   symbolClass?: string;
 *   children?: CategoryEntry[];
 * }} CategoryEntry
 */

/**
 * @typedef {{
 *   title: string;
 *   eyebrow: string;
 *   description: string;
 *   shopifyHandle: string;
 *   intro: string;
 *   children: CategoryEntry[];
 *   audience?: import("./product-audience").ProductAudience;
 *   hub?: "audience";
 *   presentation?: "catalog" | "service";
 * }} CatalogSection
 */

const editorialImages = {
  engagement:
    "https://woodleyjewelers.com/cdn/shop/files/129D2D0B-124A-47E7-9AAD-754D6F1BA1BB_1200x.jpg?v=1639025505",
  diamond:
    "https://woodleyjewelers.com/cdn/shop/files/FA6CB512-0FF4-43DE-A784-70382EBDA5AD_1200x.jpg?v=1639025505",
  custom:
    "https://woodleyjewelers.com/cdn/shop/files/blowtorch-shaping-ring_800x800@2x.jpg?v=1639027342",
  fine: "/images/products/rings/festivity.webp",
  watch:
    "https://woodleyjewelers.com/cdn/shop/files/open-timepiece-exposing-cogs-and-gear-wheels_800x800@2x.jpg?v=1639027083",
  service:
    "https://woodleyjewelers.com/cdn/shop/files/4DC717D9-AFDD-4A66-90A3-F442E4225EDF_800x800@2x.jpg?v=1639025504",
};

/** @type {Record<string, CatalogSection>} */
export const CATALOG_SECTIONS = {
  women: {
    title: "Women",
    eyebrow: "Her collection",
    description:
      "Fine jewelry, watches, and bridal pieces selected for women, from everyday gold to engagement styles.",
    shopifyHandle: "women",
    hub: "audience",
    audience: "women",
    intro:
      "Browse by jewelry type or begin with bridal. Every piece can also be explored under Engagement, Fine Jewelry, and Watches when you prefer shopping by category.",
    children: [
      {
        slug: "rings",
        title: "Rings",
        description: "Stackable bands, statement rings, and everyday gold and gemstone styles for her.",
        shopifyHandle: "fine-rings",
        audience: "women",
        derived: true,
        image: RING_CATEGORY_IMAGE,
      },
      {
        slug: "necklaces",
        title: "Necklaces",
        description: "Chains and necklaces in gold and platinum with thoughtful proportion.",
        shopifyHandle: "necklaces",
        audience: "women",
        derived: true,
        image: { src: editorialImages.fine, alt: "Fine jewelry necklace" },
      },
      {
        slug: "pendants",
        title: "Pendants",
        description: "Pendants and charms with room for personalization.",
        shopifyHandle: "pendants",
        audience: "women",
        derived: true,
        image: { src: editorialImages.fine, alt: "Gold pendant on a chain" },
      },
      {
        slug: "earrings",
        title: "Earrings",
        description: "Studs, drops, and hoops in balanced scale for daily wear.",
        shopifyHandle: "earrings",
        audience: "women",
        derived: true,
        image: { src: editorialImages.fine, alt: "Fine jewelry earrings" },
      },
      {
        slug: "bracelets",
        title: "Bracelets",
        description: "Bracelets and bangles with secure clasps and lasting finish.",
        shopifyHandle: "bracelets",
        audience: "women",
        derived: true,
        image: { src: editorialImages.fine, alt: "Fine jewelry bracelet" },
      },
      {
        slug: "watches",
        title: "Watches",
        description: "Women's timepieces from Bulova, Citizen, and Seiko.",
        shopifyHandle: "watches",
        sourceHandles: ["bulova", "citizen", "seiko"],
        audience: "women",
        derived: true,
        image: BULOVA_CATEGORY_IMAGE,
      },
      {
        slug: "engagement-rings",
        title: "Engagement Rings",
        description: "Solitaire, halo, three-stone, and vintage-inspired engagement styles.",
        shopifyHandle: "engagement-wedding",
        sourceHandles: [
          "solitaire-rings",
          "halo-rings",
          "three-stone-rings",
          "vintage-inspired-rings",
        ],
        audience: "women",
        derived: true,
        image: ENGAGEMENT_RINGS_HERO,
      },
      {
        slug: "wedding-bands",
        title: "Wedding Bands",
        description: "Women's wedding bands in precious metals, plain, pavé, or engraved.",
        shopifyHandle: "wedding-bands",
        audience: "women",
        derived: true,
        image: WOMEN_WEDDING_BANDS_HERO,
      },
    ],
  },
  men: {
    title: "Men",
    eyebrow: "His collection",
    description:
      "Rings, bracelets, watches, and wedding bands selected for men, refined pieces meant for daily wear and lasting occasions.",
    shopifyHandle: "men",
    hub: "audience",
    audience: "men",
    intro:
      "Start with rings and watches, or choose a wedding band. Prefer shopping by brand or category? Fine Jewelry and Watches remain available on their own.",
    children: [
      {
        slug: "rings",
        title: "Rings",
        description: "Signets, bands, and everyday rings sized and styled for him.",
        shopifyHandle: "fine-rings",
        audience: "men",
        derived: true,
        image: RING_CATEGORY_IMAGE,
      },
      {
        slug: "bracelets",
        title: "Bracelets",
        description: "Bracelets and cuffs with secure clasps and lasting finish.",
        shopifyHandle: "bracelets",
        audience: "men",
        derived: true,
        image: { src: editorialImages.fine, alt: "Men's bracelet" },
      },
      {
        slug: "necklaces",
        title: "Necklaces",
        description: "Chains and pendants with clean proportion for everyday wear.",
        shopifyHandle: "necklaces",
        audience: "men",
        derived: true,
        image: { src: editorialImages.fine, alt: "Men's necklace" },
      },
      {
        slug: "earrings",
        title: "Earrings",
        description: "Studs and hoops sized for a confident, everyday look.",
        shopifyHandle: "earrings",
        audience: "men",
        derived: true,
        image: { src: editorialImages.fine, alt: "Men's earrings" },
      },
      {
        slug: "watches",
        title: "Watches",
        description: "Men's timepieces from Bulova, Citizen, and Seiko.",
        shopifyHandle: "watches",
        sourceHandles: ["bulova", "citizen", "seiko"],
        audience: "men",
        derived: true,
        image: BULOVA_CATEGORY_IMAGE,
      },
      {
        slug: "wedding-bands",
        title: "Wedding Bands",
        description: "Men's wedding bands in precious metals, classic and contemporary.",
        shopifyHandle: "wedding-bands",
        audience: "men",
        derived: true,
        image: MEN_WEDDING_BANDS_HERO,
      },
    ],
  },
  "engagement-wedding": {
    title: "Engagement & Wedding",
    eyebrow: "Bridal",
    description:
      "Engagement rings and wedding bands selected with patience and care, elegant, enduring, and personal.",
    shopifyHandle: "engagement-wedding",
    intro:
      "From solitaire classics to vintage-inspired settings, each ring is chosen to honor your story without chasing trends.",
    children: [
      {
        slug: "solitaire",
        title: "Solitaire",
        description:
          "A single center stone in a refined setting, timeless focus on the diamond you choose.",
        shopifyHandle: "solitaire-rings",
        image: {
          src: "/images/heroes/solitaire.png",
          alt: "Solitaire engagement ring with a single center diamond",
        },
      },
      {
        slug: "halo",
        title: "Halo",
        description:
          "A center stone framed by a delicate halo of accent diamonds for gentle brilliance.",
        shopifyHandle: "halo-rings",
        image: {
          src: "/images/heroes/halo.png",
          alt: "Halo engagement ring with accent diamonds surrounding the center stone",
        },
      },
      {
        slug: "three-stone",
        title: "Three-Stone",
        description:
          "Past, present, and future represented in a balanced trilogy of stones.",
        shopifyHandle: "three-stone-rings",
        image: {
          src: "/images/heroes/three-stone.png",
          alt: "Three-stone engagement ring",
        },
      },
      {
        slug: "vintage-inspired",
        title: "Vintage-Inspired",
        description:
          "Heritage details and milgrain finishes with the comfort of modern craftsmanship.",
        shopifyHandle: "vintage-inspired-rings",
        image: {
          src: "/images/heroes/vintage-inspired.png",
          alt: "Vintage-inspired engagement ring with intricate metalwork",
        },
      },
      {
        slug: "wedding-bands",
        title: "Wedding Bands",
        description:
          "Bands in precious metals, plain, pavé, or engraved, to complement your engagement ring.",
        shopifyHandle: "wedding-bands",
        image: WEDDING_BANDS_HERO,
        children: metalCategoryChildren(
          "/engagement-wedding/wedding-bands",
          "wedding-bands",
        ),
      },
      ...metalCategoryChildren("/engagement-wedding", "engagement-wedding", {
        metals: metalsBySlug(BRIDAL_METAL_SLUGS),
      }).map((entry) => ({
        ...entry,
        sourceHandles: [
          "solitaire-rings",
          "halo-rings",
          "three-stone-rings",
          "vintage-inspired-rings",
          "engagement-wedding",
        ],
        description: `${entry.description} Browse engagement styles in ${entry.title.toLowerCase()}.`,
      })),
    ],
  },
  diamonds: {
    title: "Diamonds",
    eyebrow: "Stones",
    description:
      "Natural and lab-grown diamonds, presented clearly so you can choose with confidence. Browse by origin, then by shape to compare cuts and pricing.",
    shopifyHandle: "diamonds",
    intro:
      "Start with natural or lab-grown, then choose a shape. Each cut has its own collection so pricing stays clear and specific.",
    children: [
      {
        slug: "natural-diamonds",
        title: "Natural Diamonds",
        description:
          "Earth-formed diamonds selected for beauty, proportion, and integrity of origin. Browse by shape to compare cuts and pricing.",
        shopifyHandle: "natural-diamonds",
        image: {
          src: "/images/heroes/natural-diamonds.png",
          alt: "Natural diamond displayed for inspection",
        },
        children: diamondShapeLinksForOrigin("natural-diamonds").map((shape) => ({
          slug: shape.slug,
          title: shape.title,
          description: shape.description,
          shopifyHandle: shape.shopifyHandle,
          image: shape.image,
        })),
      },
      {
        slug: "lab-grown-diamonds",
        title: "Lab-Grown Diamonds",
        description:
          "Laboratory-grown diamonds with the same optical properties, offered with transparent guidance. Browse by shape to compare cuts and pricing.",
        shopifyHandle: "lab-grown-diamonds",
        image: {
          src: "/images/heroes/lab-grown.png",
          alt: "Lab-grown diamond in a refined setting",
        },
        children: diamondShapeLinksForOrigin("lab-grown-diamonds").map((shape) => ({
          slug: shape.slug,
          title: shape.title,
          description: shape.description,
          shopifyHandle: shape.shopifyHandle,
          image: shape.image,
        })),
      },
    ],
  },
  "custom-jewelry": {
    title: "Custom Jewelry",
    eyebrow: "Bespoke",
    description:
      "Collaborative design for pieces that carry personal meaning, guided by experienced bench jewelers.",
    shopifyHandle: "custom-jewelry",
    presentation: "service",
    intro:
      "Whether starting from a sketch or reimagining a family heirloom, we work beside you at every step.",
    children: [
      {
        slug: "custom-design",
        title: "Custom Design",
        description:
          "From first conversation to finished piece, a process built on clarity and craft.",
        shopifyHandle: "custom-design",
        image: {
          src: editorialImages.custom,
          alt: "Jeweler shaping a ring at the bench",
        },
      },
      {
        slug: "redesign",
        title: "Redesign Existing Jewelry",
        description:
          "Transform inherited or outdated pieces into jewelry you will wear with pride.",
        shopifyHandle: "redesign-jewelry",
        image: {
          src: editorialImages.custom,
          alt: "Jewelry redesign consultation at the bench",
        },
      },
      {
        slug: "consultation",
        title: "Consultation",
        description:
          "A dedicated design consultation. $200 applied toward your final design when you proceed.",
        shopifyHandle: "design-consultation",
        image: {
          src: editorialImages.custom,
          alt: "Custom jewelry design consultation",
        },
      },
    ],
  },
  "fine-jewelry": {
    title: "Fine Jewelry",
    eyebrow: "Collection",
    description:
      "Rings, necklaces, earrings, and bracelets chosen for everyday elegance and special occasions.",
    shopifyHandle: "fine-jewelry",
    intro:
      "Refined pieces that sit comfortably in a jewelry wardrobe, understated, well made, and meant to last.",
    children: [
      {
        slug: "rings",
        title: "Rings",
        description: "Stackable bands, statement rings, and everyday gold and gemstone styles.",
        shopifyHandle: "fine-rings",
        image: RING_CATEGORY_IMAGE,
        children: metalCategoryChildren("/fine-jewelry/rings", "fine-rings"),
      },
      {
        slug: "necklaces",
        title: "Necklaces",
        description: "Chains and necklaces in gold and platinum with thoughtful proportion.",
        shopifyHandle: "necklaces",
        image: { src: editorialImages.fine, alt: "Fine jewelry necklace" },
        children: metalCategoryChildren("/fine-jewelry/necklaces", "necklaces"),
      },
      {
        slug: "pendants",
        title: "Pendants",
        description: "Pendants and charms with room for personalization.",
        shopifyHandle: "pendants",
        image: { src: editorialImages.fine, alt: "Gold pendant on a chain" },
      },
      {
        slug: "earrings",
        title: "Earrings",
        description: "Studs, drops, and hoops in balanced scale for daily wear.",
        shopifyHandle: "earrings",
        image: { src: editorialImages.fine, alt: "Fine jewelry earrings" },
        children: metalCategoryChildren("/fine-jewelry/earrings", "earrings"),
      },
      {
        slug: "bracelets",
        title: "Bracelets",
        description: "Bracelets and bangles with secure clasps and lasting finish.",
        shopifyHandle: "bracelets",
        image: { src: editorialImages.fine, alt: "Fine jewelry bracelet" },
        children: metalCategoryChildren("/fine-jewelry/bracelets", "bracelets"),
      },
    ],
  },
  watches: {
    title: "Watches",
    eyebrow: "Timepieces",
    description:
      "Authorized styles from Bulova, Citizen, and Seiko, plus carefully selected vintage watches.",
    shopifyHandle: "watches",
    intro:
      "A watch is both instrument and personal statement. Browse new authorized brands or explore our vintage selection by maker.",
    children: [
      {
        slug: "bulova",
        title: "Bulova",
        description: "American heritage timepieces with classic and contemporary lines.",
        shopifyHandle: "bulova",
        image: BULOVA_CATEGORY_IMAGE,
      },
      {
        slug: "citizen",
        title: "Citizen",
        description: "Reliable everyday watches including Eco-Drive solar technology.",
        shopifyHandle: "citizen",
        image: { src: editorialImages.watch, alt: "Citizen watch" },
      },
      {
        slug: "seiko",
        title: "Seiko",
        description: "Japanese precision from dress watches to sport models.",
        shopifyHandle: "seiko",
        image: { src: editorialImages.watch, alt: "Seiko watch" },
      },
      {
        slug: "vintage-watches",
        title: "Vintage Watches",
        description:
          "Pre-owned and estate timepieces selected for character, condition, and lasting appeal. Browse by brand.",
        shopifyHandle: "vintage-watches",
        image: {
          src: editorialImages.watch,
          alt: "Vintage watch with exposed movement",
        },
        children: [
          {
            slug: "rolex",
            title: "Rolex",
            description: "Vintage Rolex watches chosen for presence and provenance.",
            shopifyHandle: "vintage-rolex",
            image: {
              src: editorialImages.watch,
              alt: "Vintage Rolex watch",
            },
          },
          {
            slug: "omega",
            title: "Omega",
            description: "Classic Omega timepieces with enduring design.",
            shopifyHandle: "vintage-omega",
            image: {
              src: editorialImages.watch,
              alt: "Vintage Omega watch",
            },
          },
          {
            slug: "movado",
            title: "Movado",
            description: "Distinctive vintage Movado watches with modernist character.",
            shopifyHandle: "vintage-movado",
            image: {
              src: editorialImages.watch,
              alt: "Vintage Movado watch",
            },
          },
          {
            slug: "bulova",
            title: "Bulova",
            description: "Heritage Bulova watches from earlier eras of American watchmaking.",
            shopifyHandle: "vintage-bulova",
            image: BULOVA_CATEGORY_IMAGE,
          },
          {
            slug: "accutron",
            title: "Accutron",
            description: "Vintage Accutron timepieces known for their distinctive tuning-fork precision.",
            shopifyHandle: "vintage-accutron",
            image: {
              src: editorialImages.watch,
              alt: "Vintage Accutron watch",
            },
          },
          {
            slug: "other",
            title: "Other",
            description: "Additional vintage watches beyond our featured brands.",
            shopifyHandle: "vintage-other",
            image: {
              src: editorialImages.watch,
              alt: "Vintage watch",
            },
          },
        ],
      },
    ],
  },
  services: {
    title: "Services",
    eyebrow: "Care",
    description:
      "Repairs, sizing, cleaning, and appraisals performed by bench jewelers who respect your pieces.",
    shopifyHandle: "services",
    presentation: "service",
    intro:
      "Your relationship with us continues long after a purchase. We inspect, restore, and maintain jewelry with the same care we bring to new designs.",
    children: [
      {
        slug: "jewelry-repairs",
        title: "Jewelry Repairs",
        description:
          "Prongs, shanks, clasps, and structural work, whether purchased here or elsewhere.",
        shopifyHandle: "jewelry-repairs",
        image: { src: editorialImages.service, alt: "Jewelry repair at the bench" },
      },
      {
        slug: "ring-sizing",
        title: "Ring Sizing",
        description: "Precise sizing to preserve the integrity of your band and setting.",
        shopifyHandle: "ring-sizing",
        image: { src: editorialImages.service, alt: "Ring sizing service" },
      },
      {
        slug: "rhodium-plating",
        title: "Rhodium Plating",
        description: "Renew white gold with a bright, durable rhodium finish.",
        shopifyHandle: "rhodium-plating",
        image: { src: editorialImages.service, alt: "Rhodium plating service" },
      },
      {
        slug: "jewelry-cleaning",
        title: "Jewelry Cleaning",
        description: "Professional cleaning to restore brilliance, complimentary when you visit.",
        shopifyHandle: "jewelry-cleaning",
        image: { src: editorialImages.service, alt: "Jewelry cleaning service" },
      },
      {
        slug: "watch-services",
        title: "Watch Services",
        description: "Battery replacement, pressure testing, and movement service.",
        shopifyHandle: "watch-services",
        image: { src: editorialImages.watch, alt: "Watch repair service" },
      },
      {
        slug: "appraisals",
        title: "Appraisals",
        description: "Written appraisals for insurance, estate, and documentation needs.",
        shopifyHandle: "appraisals",
        image: { src: editorialImages.service, alt: "Jewelry appraisal service" },
      },
    ],
  },
};

/** @param {string} sectionKey */
export function getCatalogSection(sectionKey) {
  return CATALOG_SECTIONS[sectionKey] ?? null;
}

/** @param {string} sectionKey */
export function isAudienceCatalogSection(sectionKey) {
  return getCatalogSection(sectionKey)?.hub === "audience";
}

/**
 * @param {string | CatalogSection | null | undefined} sectionOrKey
 */
export function isServiceCatalogSection(sectionOrKey) {
  const section =
    typeof sectionOrKey === "string"
      ? getCatalogSection(sectionOrKey)
      : sectionOrKey;
  return section?.presentation === "service";
}

/**
 * Walk every category entry (including nested children).
 * @param {CategoryEntry[]} entries
 * @param {(entry: CategoryEntry, slugPath: string[]) => void} visit
 * @param {string[]} [prefix]
 */
export function walkCategoryEntries(entries, visit, prefix = []) {
  if (!Array.isArray(entries)) return;
  for (const entry of entries) {
    const slugPath = [...prefix, entry.slug];
    visit(entry, slugPath);
    if (entry.children?.length) {
      walkCategoryEntries(entry.children, visit, slugPath);
    }
  }
}

/**
 * Resolve a nested catalog path such as `["natural-diamonds", "round"]`.
 * @param {string} sectionKey
 * @param {string[] | undefined} slugParts
 * @returns {{
 *   entry: CategoryEntry;
 *   ancestors: CategoryEntry[];
 *   slugPath: string[];
 *   href: string;
 * } | null}
 */
export function resolveCatalogEntry(sectionKey, slugParts) {
  const section = getCatalogSection(sectionKey);
  if (!section || !Array.isArray(slugParts) || slugParts.length === 0) {
    return null;
  }

  /** @type {CategoryEntry[]} */
  let list = section.children;
  /** @type {CategoryEntry[]} */
  const trail = [];

  for (const part of slugParts) {
    const next = list.find((c) => c.slug === part) ?? null;
    if (!next) return null;
    trail.push(next);
    list = next.children ?? [];
  }

  const entry = trail[trail.length - 1];
  return {
    entry,
    ancestors: trail.slice(0, -1),
    slugPath: slugParts,
    href: `/${sectionKey}/${slugParts.join("/")}`,
  };
}

/** @param {string} sectionKey @param {string} slug */
export function getCatalogEntry(sectionKey, slug) {
  return resolveCatalogEntry(sectionKey, [slug])?.entry ?? null;
}

export function getAllCatalogPaths() {
  /** @type {{ sectionKey: string; slug: string; slugPath: string[] }[]} */
  const paths = [];
  for (const [sectionKey, section] of Object.entries(CATALOG_SECTIONS)) {
    walkCategoryEntries(section.children, (_entry, slugPath) => {
      paths.push({
        sectionKey,
        slug: slugPath[slugPath.length - 1],
        slugPath,
      });
    });
  }
  return paths;
}

/**
 * @param {string} shopifyHandle
 * @returns {{ title: string; description: string; image?: { src: string; alt: string } }}
 */
export function getCatalogMetaByShopifyHandle(shopifyHandle) {
  for (const section of Object.values(CATALOG_SECTIONS)) {
    if (section.hub === "audience") continue;
    if (section.shopifyHandle === shopifyHandle) {
      const image = section.children[0]?.image;
      return {
        title: section.title,
        description: section.intro || section.description,
        image,
      };
    }
    /** @type {{ title: string; description: string; image?: { src: string; alt: string } } | null} */
    let found = null;
    walkCategoryEntries(section.children, (child) => {
      if (found || child.derived) return;
      if (child.shopifyHandle === shopifyHandle) {
        found = {
          title: child.title,
          description: child.description,
          image: child.image,
        };
      }
    });
    if (found) return found;
  }
  return { title: "Collection", description: "" };
}

/**
 * @param {string} shopifyHandle
 * @returns {{ href: string; label: string } | null}
 */
export function getCatalogPathForShopifyHandle(shopifyHandle) {
  for (const [sectionKey, section] of Object.entries(CATALOG_SECTIONS)) {
    if (section.hub === "audience") continue;
    if (section.shopifyHandle === shopifyHandle) {
      return {
        href: `/${sectionKey}`,
        label: section.title,
      };
    }

    /** @type {{ href: string; label: string } | null} */
    let found = null;
    walkCategoryEntries(section.children, (child, slugPath) => {
      if (found || child.derived) return;
      if (child.shopifyHandle === shopifyHandle) {
        found = {
          href: `/${sectionKey}/${slugPath.join("/")}`,
          label: child.title,
        };
      }
    });
    if (found) return found;
  }

  return null;
}

/** Hero and shared copy for the Shop All catalog landing page. */
export const SHOP_ALL_HERO = {
  src: RING_CATEGORY_IMAGE.src,
  alt: RING_CATEGORY_IMAGE.alt,
};

export const HOME_FEATURED_CATEGORIES = [
  {
    title: "Engagement",
    href: "/engagement-wedding",
    description: "Solitaires, halos, vintage-inspired settings, and custom design.",
    image: ENGAGEMENT_RINGS_HERO.src,
    alt: ENGAGEMENT_RINGS_HERO.alt,
  },
  {
    title: "Rings",
    href: "/fine-jewelry/rings",
    description: "Women's and men's rings, from everyday gold to statement styles.",
    image: RING_CATEGORY_IMAGE.src,
    alt: RING_CATEGORY_IMAGE.alt,
  },
  {
    title: "Necklaces",
    href: "/fine-jewelry/necklaces",
    description: "Chains, pendants, and necklaces for her and for him.",
    image: editorialImages.fine,
    alt: "Fine jewelry necklace",
  },
  {
    title: "Watches",
    href: "/watches",
    description: "Bulova, Citizen, and Seiko timepieces for women and men.",
    image: BULOVA_CATEGORY_IMAGE.src,
    alt: BULOVA_CATEGORY_IMAGE.alt,
  },
  {
    title: "Custom Jewelry",
    href: "/custom-jewelry",
    description: "Collaborative design with bench jewelers who listen first.",
    image: editorialImages.custom,
    alt: "Custom jewelry being crafted at the bench",
  },
  {
    title: "Services",
    href: "/services",
    description: "Repairs, sizing, cleaning, watch service, and appraisals.",
    image: editorialImages.service,
    alt: "Jewelry service and care",
  },
];
