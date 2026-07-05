/** Public-folder watch images (temporary until Firebase Storage). */
export const BULOVA_WATCH_IMAGE_DIR = "/images/products/watches";

/** @param {string} filename */
export function bulovaWatchImage(filename) {
  return `${BULOVA_WATCH_IMAGE_DIR}/${filename}`;
}

/**
 * @param {Record<string, string>} fields
 * @returns {{ label: string; value: string }[]}
 */
function watchSpecs(fields) {
  return Object.entries(fields).map(([label, value]) => ({ label, value }));
}

/**
 * @typedef {{
 *   slug: string;
 *   sku: string;
 *   model: string;
 *   brand: string;
 *   title: string;
 *   description: string;
 *   priceUsd: number;
 *   condition: string;
 *   seoTitle: string;
 *   metaDescription: string;
 *   imageAlt: string;
 *   specs: { label: string; value: string }[];
 *   filenames: string[];
 *   availableForSale?: boolean;
 * }} BulovaProductDefinition
 */

/** @type {BulovaProductDefinition[]} */
const BULOVA_SAMPLE_PRODUCT_DEFINITIONS = [
  {
    slug: "98b446",
    sku: "610-10031",
    brand: "Bulova",
    model: "98B446",
    title: "Sea Turtle",
    description:
      "Green hybrid-ceramic case, brown luminous dial, green HNBR rubber strap, quartz movement, 100M water resistance.",
    priceUsd: 350,
    condition: "New",
    seoTitle: "Bulova Performance Snorkel 98B446 | Woodley's Jewelers",
    metaDescription:
      "Shop the Bulova Performance Snorkel 98B446 at Woodley's Jewelers.",
    imageAlt: "Bulova Performance Snorkel model 98B446.",
    specs: watchSpecs({
      Collection: "Performance Snorkel",
      Movement: "Quartz (2115)",
      Case: "41 mm Green Hybrid-Ceramic",
      Crystal: "Double Curved Mineral Box Crystal",
      Dial: "Brown",
      Strap: "Green HNBR Rubber",
      "Water Resistance": "100M",
      Functions: "3-Hand, Date",
    }),
    filenames: ["bulova.png", "bulova2.png", "bulova3.png"],
  },
  {
    slug: "98b448",
    sku: "610-10032",
    brand: "Bulova",
    model: "98B448",
    title: "Clownfish",
    description:
      "White hybrid-ceramic case, white luminous dial, orange HNBR rubber strap, quartz movement, 100M water resistance.",
    priceUsd: 350,
    condition: "New",
    seoTitle: "Bulova Performance Snorkel 98B448 | Woodley's Jewelers",
    metaDescription:
      "Shop the Bulova Performance Snorkel 98B448 at Woodley's Jewelers.",
    imageAlt: "Bulova Performance Snorkel model 98B448.",
    specs: watchSpecs({
      Collection: "Performance Snorkel",
      Movement: "Quartz (2115)",
      Case: "41 mm White Hybrid-Ceramic",
      Crystal: "Double Curved Mineral Box Crystal",
      Dial: "White",
      Strap: "Orange HNBR Rubber",
      "Water Resistance": "100M",
      Functions: "3-Hand, Date",
    }),
    filenames: ["bulova_orange.png", "bulova_orange2.png", "bulova_orange3.png"],
  },
  {
    slug: "98b445",
    sku: "610-10033",
    brand: "Bulova",
    model: "98B445",
    title: "Blue Tang",
    description:
      "Blue hybrid-ceramic case, blue luminous dial, blue HNBR rubber strap, quartz movement, 100M water resistance.",
    priceUsd: 350,
    condition: "New",
    seoTitle: "Bulova Performance Snorkel 98B445 | Woodley's Jewelers",
    metaDescription:
      "Shop the Bulova Performance Snorkel 98B445 at Woodley's Jewelers.",
    imageAlt: "Bulova Performance Snorkel model 98B445.",
    specs: watchSpecs({
      Collection: "Performance Snorkel",
      Movement: "Quartz (2115)",
      Case: "41 mm Blue Hybrid-Ceramic",
      Crystal: "Double Curved Mineral Box Crystal",
      Dial: "Blue",
      Strap: "Blue HNBR Rubber",
      "Water Resistance": "100M",
      Functions: "3-Hand, Date",
    }),
    filenames: ["bulova_blue.png", "bulova_blue2.png", "bulova_blue3.png"],
  },
  {
    slug: "98b474",
    sku: "610-10034",
    brand: "Bulova",
    model: "98B474",
    title: "Sail 4th S.E.",
    description:
      "White hybrid-ceramic case, red luminous dial, blue HNBR rubber strap, quartz movement, WR100 water resistance.",
    priceUsd: 375,
    condition: "New",
    seoTitle: "Bulova Performance Snorkel 98B474 | Woodley's Jewelers",
    metaDescription:
      "Shop the Bulova Performance Snorkel 98B474 at Woodley's Jewelers.",
    imageAlt: "Bulova Performance Snorkel model 98B474.",
    specs: watchSpecs({
      Collection: "Performance Snorkel",
      Movement: "Quartz (2115)",
      Case: "41 mm White Hybrid-Ceramic",
      Crystal: "Double Curved Mineral Box Crystal",
      Dial: "Red",
      Strap: "Blue HNBR Rubber",
      "Water Resistance": "WR100 / 10 Bar",
      Functions: "3-Hand, Date",
    }),
    filenames: ["bulova_patriot.png", "bulova_patriot2.png", "bulova_patriot3.png"],
  },
  {
    slug: "96b431",
    sku: "610-10026",
    brand: "Bulova",
    model: "96B431",
    title: "Marine Star C",
    description:
      "Silver-tone stainless steel case, yellow luminous dial, black silicone strap, HPQ Precisionist movement, sapphire crystal, 200M water resistance.",
    priceUsd: 695,
    condition: "New",
    seoTitle: "Bulova Marine Star Series C 96B431 | Woodley's Jewelers",
    metaDescription:
      "Shop the Bulova Marine Star Series C 96B431 at Woodley's Jewelers.",
    imageAlt: "Bulova Marine Star Series C model 96B431.",
    specs: watchSpecs({
      Collection: "Marine Star",
      Movement: "NM10 HPQ Precisionist",
      Case: "43 mm Stainless Steel",
      Crystal: "Sapphire Crystal",
      Dial: "Yellow",
      Strap: "Black Silicone",
      "Water Resistance": "WR200 / 20 Bar",
      Functions: "Calendar, 3-Hand",
    }),
    filenames: ["bulova_yellow.png", "bulova_yellow2.png", "bulova_yellow3.png"],
  },
];

export const BULOVA_CATEGORY_IMAGE = {
  src: bulovaWatchImage("bulova.png"),
  alt: "Bulova Performance Snorkel Sea Turtle model 98B446 at Woodley's Jewelers",
};

/** Preview handles replaced by real Bulova sample products. */
export const LEGACY_BULOVA_PREVIEW_HANDLES = [
  "preview-bulova-classic",
  "preview-bulova-signature",
  "preview-bulova-heritage",
  "preview-bulova-gallery",
  "preview-bulova-atelier",
  "preview-bulova-premier",
];

/** Earlier Bulova placeholder handles superseded by model-based product ids. */
export const LEGACY_BULOVA_PRODUCT_HANDLES = [
  "bulova-classic-dress",
  "bulova-blue-dial",
  "bulova-orange-accent",
  "bulova-patriot",
  "bulova-gold-tone",
];

/**
 * @returns {import("./product-types").CatalogProduct[]}
 */
export function buildBulovaSampleProducts() {
  return BULOVA_SAMPLE_PRODUCT_DEFINITIONS.map((def, index) => {
    const images = def.filenames.map((filename, imageIndex) => ({
      src: bulovaWatchImage(filename),
      alt: imageIndex === 0 ? def.imageAlt : `${def.imageAlt} Alternate view ${imageIndex}.`,
    }));

    return {
      id: `mock:bulova:${def.slug}`,
      handle: `bulova-${def.slug}`,
      title: def.title,
      description: def.description,
      priceUsd: def.priceUsd,
      maxPriceUsd: def.priceUsd,
      availableForSale: def.availableForSale !== false,
      createdAt: new Date(Date.UTC(2024, 8, 1 + index * 7)).toISOString(),
      popularity: BULOVA_SAMPLE_PRODUCT_DEFINITIONS.length - index,
      image: images[0],
      images,
      specs: def.specs,
      sku: def.sku,
      brand: def.brand,
      model: def.model,
      condition: def.condition,
      seoTitle: def.seoTitle,
      metaDescription: def.metaDescription,
      source: /** @type {const} */ ("mock"),
    };
  });
}

/** @param {string} handle */
export function isBulovaSampleProductHandle(handle) {
  return typeof handle === "string" && handle.startsWith("bulova-");
}

/** @returns {readonly string[]} */
export function allLegacyBulovaHandles() {
  return [...LEGACY_BULOVA_PREVIEW_HANDLES, ...LEGACY_BULOVA_PRODUCT_HANDLES];
}
