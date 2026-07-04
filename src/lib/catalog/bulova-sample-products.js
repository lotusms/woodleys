/** Public-folder watch images (temporary until Firebase Storage). */
export const BULOVA_WATCH_IMAGE_DIR = "/images/products/watches";

/** @param {string} filename */
export function bulovaWatchImage(filename) {
  return `${BULOVA_WATCH_IMAGE_DIR}/${filename}`;
}

/** @type {Array<{ slug: string; title: string; description: string; priceUsd: number; maxPriceUsd?: number; filenames: string[]; availableForSale?: boolean }>} */
const BULOVA_SAMPLE_PRODUCT_DEFINITIONS = [
  {
    slug: "classic-dress",
    title: "Bulova Classic Dress Watch",
    description:
      "A refined Bulova dress watch with a clean dial and polished case, comfortable for everyday wear and easy to dress up.",
    priceUsd: 295,
    filenames: ["bulova.png", "bulova2.png", "bulova3.png"],
  },
  {
    slug: "blue-dial",
    title: "Bulova Blue Dial",
    description:
      "Sunray blue dial with luminous markers and a balanced profile, an approachable everyday Bulova with a crisp, modern look.",
    priceUsd: 349,
    filenames: ["bulova_blue.png", "bulova_blue2.png", "bulova_blue3.png"],
  },
  {
    slug: "orange-accent",
    title: "Bulova Orange Accent",
    description:
      "Bold orange accents on the dial and strap bring energy to a versatile Bulova sport-casual style.",
    priceUsd: 375,
    filenames: ["bulova_orange.png", "bulova_orange2.png", "bulova_orange3.png"],
  },
  {
    slug: "patriot",
    title: "Bulova Patriot",
    description:
      "Patriot collection styling with a confident dial layout and durable finish, built for daily wear with American heritage details.",
    priceUsd: 425,
    filenames: ["bulova_patriot.png", "bulova_patriot2.png", "bulova_patriot3.png"],
  },
  {
    slug: "gold-tone",
    title: "Bulova Gold Tone",
    description:
      "Warm gold-tone finishing with a luminous dial, an elevated Bulova option for dress and special occasions.",
    priceUsd: 495,
    maxPriceUsd: 525,
    filenames: ["bulova_yellow.png", "bulova_yellow2.png", "bulova_yellow3.png"],
  },
];

export const BULOVA_CATEGORY_IMAGE = {
  src: bulovaWatchImage("bulova.png"),
  alt: "Bulova watch collection at Woodley's Jewelers",
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

/**
 * @returns {import("./product-types").CatalogProduct[]}
 */
export function buildBulovaSampleProducts() {
  return BULOVA_SAMPLE_PRODUCT_DEFINITIONS.map((def, index) => {
    const images = def.filenames.map((filename, imageIndex) => ({
      src: bulovaWatchImage(filename),
      alt:
        imageIndex === 0
          ? def.title
          : `${def.title}, alternate view ${imageIndex}`,
    }));

    return {
      id: `mock:bulova:${def.slug}`,
      handle: `bulova-${def.slug}`,
      title: def.title,
      description: def.description,
      priceUsd: def.priceUsd,
      maxPriceUsd: def.maxPriceUsd ?? def.priceUsd,
      availableForSale: def.availableForSale !== false,
      createdAt: new Date(Date.UTC(2024, 8, 1 + index * 7)).toISOString(),
      popularity: BULOVA_SAMPLE_PRODUCT_DEFINITIONS.length - index,
      image: images[0],
      images,
      source: /** @type {const} */ ("mock"),
    };
  });
}

/** @param {string} handle */
export function isBulovaSampleProductHandle(handle) {
  return typeof handle === "string" && handle.startsWith("bulova-");
}
