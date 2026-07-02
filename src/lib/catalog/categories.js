/**
 * Catalog taxonomy — structured for Shopify collection handles when connected.
 * Each entry maps to a future Shopify collection handle via `shopifyHandle`.
 */

/** @typedef {{ slug: string; title: string; description: string; shopifyHandle: string; image?: { src: string; alt: string } }} CategoryEntry */

const editorialImages = {
  engagement:
    "https://woodleyjewelers.com/cdn/shop/files/129D2D0B-124A-47E7-9AAD-754D6F1BA1BB_1200x.jpg?v=1639025505",
  diamond:
    "https://woodleyjewelers.com/cdn/shop/files/FA6CB512-0FF4-43DE-A784-70382EBDA5AD_1200x.jpg?v=1639025505",
  custom:
    "https://woodleyjewelers.com/cdn/shop/files/blowtorch-shaping-ring_800x800@2x.jpg?v=1639027342",
  fine:
    "https://woodleyjewelers.com/cdn/shop/files/80522B83-4D72-4081-8DF7-1DB5494F34F4_800x800@2x.jpg?v=1639026958",
  watch:
    "https://woodleyjewelers.com/cdn/shop/files/open-timepiece-exposing-cogs-and-gear-wheels_800x800@2x.jpg?v=1639027083",
  service:
    "https://woodleyjewelers.com/cdn/shop/files/4DC717D9-AFDD-4A66-90A3-F442E4225EDF_800x800@2x.jpg?v=1639025504",
};

/** @type {Record<string, { title: string; eyebrow: string; description: string; shopifyHandle: string; intro: string; children: CategoryEntry[] }>} */
export const CATALOG_SECTIONS = {
  "engagement-wedding": {
    title: "Engagement & Wedding",
    eyebrow: "Bridal",
    description:
      "Engagement rings and wedding bands selected with patience and care—elegant, enduring, and personal.",
    shopifyHandle: "engagement-wedding",
    intro:
      "From solitaire classics to vintage-inspired settings, each ring is chosen to honor your story without chasing trends.",
    children: [
      {
        slug: "solitaire",
        title: "Solitaire",
        description:
          "A single center stone in a refined setting—timeless focus on the diamond you choose.",
        shopifyHandle: "solitaire-rings",
        image: {
          src: editorialImages.engagement,
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
          src: editorialImages.diamond,
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
          src: editorialImages.engagement,
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
          src: editorialImages.fine,
          alt: "Vintage-inspired engagement ring with intricate metalwork",
        },
      },
      {
        slug: "wedding-bands",
        title: "Wedding Bands",
        description:
          "Bands in precious metals—plain, pavé, or engraved—to complement your engagement ring.",
        shopifyHandle: "wedding-bands",
        image: {
          src: editorialImages.engagement,
          alt: "Matching wedding bands in gold",
        },
      },
    ],
  },
  diamonds: {
    title: "Diamonds",
    eyebrow: "Stones",
    description:
      "Natural and lab-grown diamonds, presented clearly so you can choose with confidence.",
    shopifyHandle: "diamonds",
    intro:
      "We guide you through origin, cut, and shape—never rushing a decision that deserves time.",
    children: [
      {
        slug: "natural-diamonds",
        title: "Natural Diamonds",
        description:
          "Earth-formed diamonds selected for beauty, proportion, and integrity of origin.",
        shopifyHandle: "natural-diamonds",
        image: {
          src: editorialImages.diamond,
          alt: "Natural diamond displayed for inspection",
        },
      },
      {
        slug: "lab-grown-diamonds",
        title: "Lab-Grown Diamonds",
        description:
          "Laboratory-grown diamonds with the same optical properties—offered with transparent guidance.",
        shopifyHandle: "lab-grown-diamonds",
        image: {
          src: editorialImages.diamond,
          alt: "Lab-grown diamond in a refined setting",
        },
      },
      {
        slug: "round",
        title: "Round",
        description: "Classic round brilliant cuts prized for even sparkle.",
        shopifyHandle: "round-diamonds",
        image: {
          src: editorialImages.diamond,
          alt: "Round brilliant diamond",
        },
      },
      {
        slug: "oval",
        title: "Oval",
        description: "Elongated silhouette with generous surface area and soft presence.",
        shopifyHandle: "oval-diamonds",
        image: {
          src: editorialImages.diamond,
          alt: "Oval diamond",
        },
      },
      {
        slug: "emerald",
        title: "Emerald Cut",
        description: "Step-cut facets and a quiet, architectural elegance.",
        shopifyHandle: "emerald-cut-diamonds",
        image: {
          src: editorialImages.diamond,
          alt: "Emerald cut diamond",
        },
      },
      {
        slug: "pear",
        title: "Pear",
        description: "Teardrop form that reads both romantic and distinctive.",
        shopifyHandle: "pear-diamonds",
        image: {
          src: editorialImages.diamond,
          alt: "Pear shaped diamond",
        },
      },
      {
        slug: "cushion",
        title: "Cushion",
        description: "Soft corners with a pillow-like facet pattern.",
        shopifyHandle: "cushion-diamonds",
        image: {
          src: editorialImages.diamond,
          alt: "Cushion cut diamond",
        },
      },
      {
        slug: "princess",
        title: "Princess",
        description: "Square outline with brilliant faceting for lively reflection.",
        shopifyHandle: "princess-diamonds",
        image: {
          src: editorialImages.diamond,
          alt: "Princess cut diamond",
        },
      },
    ],
  },
  "custom-jewelry": {
    title: "Custom Jewelry",
    eyebrow: "Bespoke",
    description:
      "Collaborative design for pieces that carry personal meaning—guided by experienced bench jewelers.",
    shopifyHandle: "custom-jewelry",
    intro:
      "Whether starting from a sketch or reimagining a family heirloom, we work beside you at every step.",
    children: [
      {
        slug: "custom-design",
        title: "Custom Design",
        description:
          "From first conversation to finished piece—a process built on clarity and craft.",
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
          "A dedicated design consultation—$200 applied toward your final design when you proceed.",
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
      "Refined pieces that sit comfortably in a jewelry wardrobe—understated, well made, and meant to last.",
    children: [
      {
        slug: "rings",
        title: "Rings",
        description: "Stackable bands, statement rings, and everyday gold and gemstone styles.",
        shopifyHandle: "fine-rings",
        image: { src: editorialImages.fine, alt: "Fine jewelry rings on display" },
      },
      {
        slug: "necklaces",
        title: "Necklaces",
        description: "Chains and necklaces in gold and platinum with thoughtful proportion.",
        shopifyHandle: "necklaces",
        image: { src: editorialImages.fine, alt: "Fine jewelry necklace" },
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
      },
      {
        slug: "bracelets",
        title: "Bracelets",
        description: "Bracelets and bangles with secure clasps and lasting finish.",
        shopifyHandle: "bracelets",
        image: { src: editorialImages.fine, alt: "Fine jewelry bracelet" },
      },
    ],
  },
  watches: {
    title: "Watches",
    eyebrow: "Timepieces",
    description: "Authorized styles from Bulova, Citizen, and Seiko—presented with informed guidance.",
    shopifyHandle: "watches",
    intro:
      "A watch is both instrument and personal statement. We help you select and care for yours.",
    children: [
      {
        slug: "bulova",
        title: "Bulova",
        description: "American heritage timepieces with classic and contemporary lines.",
        shopifyHandle: "bulova",
        image: { src: editorialImages.watch, alt: "Bulova watch" },
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
    ],
  },
  services: {
    title: "Services",
    eyebrow: "Care",
    description:
      "Repairs, sizing, cleaning, and appraisals performed by bench jewelers who respect your pieces.",
    shopifyHandle: "services",
    intro:
      "Your relationship with us continues long after a purchase. We inspect, restore, and maintain jewelry with the same care we bring to new designs.",
    children: [
      {
        slug: "jewelry-repairs",
        title: "Jewelry Repairs",
        description:
          "Prongs, shanks, clasps, and structural work—whether purchased here or elsewhere.",
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
        description: "Professional cleaning to restore brilliance—complimentary when you visit.",
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

/** @param {string} sectionKey @param {string} slug */
export function getCatalogEntry(sectionKey, slug) {
  const section = getCatalogSection(sectionKey);
  if (!section) return null;
  return section.children.find((c) => c.slug === slug) ?? null;
}

export function getAllCatalogPaths() {
  return Object.entries(CATALOG_SECTIONS).flatMap(([sectionKey, section]) =>
    section.children.map((child) => ({ sectionKey, slug: child.slug })),
  );
}

/**
 * @param {string} shopifyHandle
 * @returns {{ title: string; description: string; image?: { src: string; alt: string } }}
 */
export function getCatalogMetaByShopifyHandle(shopifyHandle) {
  for (const section of Object.values(CATALOG_SECTIONS)) {
    if (section.shopifyHandle === shopifyHandle) {
      const image = section.children[0]?.image;
      return {
        title: section.title,
        description: section.intro || section.description,
        image,
      };
    }
    for (const child of section.children) {
      if (child.shopifyHandle === shopifyHandle) {
        return {
          title: child.title,
          description: child.description,
          image: child.image,
        };
      }
    }
  }
  return { title: "Collection", description: "" };
}

export const HOME_FEATURED_CATEGORIES = [
  {
    title: "Engagement & Wedding",
    href: "/engagement-wedding",
    description: "Solitaires, halos, vintage-inspired settings, and wedding bands.",
    image: editorialImages.engagement,
    alt: "Engagement ring with diamond center stone",
  },
  {
    title: "Diamonds",
    href: "/diamonds",
    description: "Natural and lab-grown diamonds in every classic shape.",
    image: editorialImages.diamond,
    alt: "Brilliant cut diamond",
  },
  {
    title: "Custom Jewelry",
    href: "/custom-jewelry",
    description: "Collaborative design with bench jewelers who listen first.",
    image: editorialImages.custom,
    alt: "Custom jewelry being crafted at the bench",
  },
  {
    title: "Fine Jewelry",
    href: "/fine-jewelry",
    description: "Rings, necklaces, earrings, and bracelets for every day.",
    image: editorialImages.fine,
    alt: "Fine gold jewelry collection",
  },
  {
    title: "Watches",
    href: "/watches",
    description: "Bulova, Citizen, and Seiko timepieces.",
    image: editorialImages.watch,
    alt: "Luxury watch with visible movement",
  },
  {
    title: "Services",
    href: "/services",
    description: "Repairs, sizing, cleaning, watch service, and appraisals.",
    image: editorialImages.service,
    alt: "Jewelry service and care",
  },
];
