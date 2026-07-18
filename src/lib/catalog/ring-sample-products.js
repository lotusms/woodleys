/** Public-folder ring images. */
export const RING_IMAGE_DIR = "/images/products/rings";

/** @param {string} filename */
export function ringImage(filename) {
  return `${RING_IMAGE_DIR}/${filename}`;
}

/**
 * @param {Record<string, string>} fields
 * @returns {{ label: string; value: string }[]}
 */
function ringSpecs(fields) {
  return Object.entries(fields).map(([label, value]) => ({ label, value }));
}

/**
 * @typedef {{
 *   slug: string;
 *   sku: string;
 *   style: string;
 *   title: string;
 *   description: string;
 *   priceUsd: number;
 *   seoTitle: string;
 *   metaDescription: string;
 *   imageAlt: string;
 *   specs: { label: string; value: string }[];
 *   filenames: string[];
 *   availableForSale?: boolean;
 * }} RingProductDefinition
 */

/** @type {RingProductDefinition[]} */
const RING_SAMPLE_PRODUCT_DEFINITIONS = [
  {
    slug: "austin",
    sku: "BE2D371-18KW",
    style: "BE2D371-18KW",
    title:
      "Austin Diamond 5.5mm Wedding Ring (1/5 ct. tw.) in 18K White Gold",
    description:
      "This contemporary ring features pavé diamonds that extend half of the way around the high polished band. The softened inside edges of the ring provide increased comfort.",
    priceUsd: 2690,
    seoTitle:
      "Austin Diamond Wedding Ring BE2D371-18KW | Woodley's Jewelers",
    metaDescription:
      "Shop the Austin diamond wedding band in 18K white gold at Woodley's Jewelers in Beaumont.",
    imageAlt:
      "Austin diamond wedding ring in 18K white gold with micro-pavé diamonds.",
    specs: ringSpecs({
      Style: "BE2D371-18KW",
      Metal: "18K White Gold",
      Width: "5.5 mm",
      "Rhodium Plated": "Yes",
      "Gemstone Type": "Diamond",
      "Gemstone Shape": "Round",
      "Number of Stones": "27",
      "Total Carat Weight": "0.19 ct. tw. (minimum)",
      Setting: "Micro-pavé",
      "Average Color": "F/G",
      "Average Clarity": "SI",
      Includes:
        "Free FedEx shipping, discreet packaging, professional appraisal, lifetime warranty, FSC certified wood box",
    }),
    filenames: ["austin.webp", "austin2.webp"],
  },
  {
    slug: "avalon",
    sku: "BE2M2621-14KY",
    style: "BE2M2621-14KY",
    title:
      "Avalon Eternity Diamond 6mm Wedding Ring (2/5 ct. tw.) in 14K Yellow Gold",
    description:
      "Diamonds wrap around each side of this classic ring with a high polish finish. The interior has a rounded inside edge for increased comfort.",
    priceUsd: 3490,
    seoTitle:
      "Avalon Eternity Diamond Wedding Ring BE2M2621-14KY | Woodley's Jewelers",
    metaDescription:
      "Shop the Avalon eternity diamond wedding band in 14K yellow gold at Woodley's Jewelers in Beaumont.",
    imageAlt:
      "Avalon eternity diamond wedding ring in 14K yellow gold with micro-pavé diamonds.",
    specs: ringSpecs({
      Style: "BE2M2621-14KY",
      Metal: "14K Yellow Gold",
      Width: "6 mm",
      "Gemstone Type": "Diamond",
      "Gemstone Shape": "Round",
      "Number of Stones": "124-154",
      "Total Carat Weight": "0.37-0.46 ct. tw.",
      Setting: "Micro-pavé",
      "Average Color": "F/G",
      "Average Clarity": "SI1",
      Includes:
        "Free FedEx shipping, discreet packaging, professional appraisal, lifetime warranty, FSC certified wood box",
    }),
    filenames: ["avalon.webp", "avalon2.webp"],
  },
  {
    slug: "festivity",
    sku: "BE2GAM100-14KY",
    style: "BE2GAM100-14KY",
    title:
      "Festivity Prasiolite and Diamond Cocktail Ring in 14K Yellow Gold",
    description:
      "A prasiolite takes center stage in this cocktail ring while a diamond accented band, gallery, and prongs add extra glitz and glamour, creating a look reminiscent of spritely spring festivities (3/8 total diamond carat weight).",
    priceUsd: 2250,
    seoTitle:
      "Festivity Prasiolite Cocktail Ring BE2GAM100-14KY | Woodley's Jewelers",
    metaDescription:
      "Shop the Festivity prasiolite and diamond cocktail ring in 14K yellow gold at Woodley's Jewelers in Beaumont.",
    imageAlt:
      "Festivity prasiolite and diamond cocktail ring in 14K yellow gold.",
    specs: ringSpecs({
      Style: "BE2GAM100-14KY",
      Metal: "14K Yellow Gold",
      Width: "1.4 mm",
      "Diamond Count": "94",
      "Diamond Carat Weight": "0.38 ct. tw. (minimum)",
      "Diamond Setting": "Scalloped pavé",
      "Diamond Color": "F/G",
      "Diamond Clarity": "SI1",
      "Center Stone": "Prasiolite",
      "Center Stone Shape": "Emerald",
      "Center Stone Dimensions": "16 x 12 mm",
      "Center Stone Setting": "Claw prong basket",
      "Center Stone Color": "Light green",
      "Center Stone Clarity": "Eye clean",
      Includes:
        "Free FedEx shipping, discreet packaging, professional appraisal, lifetime warranty, FSC certified wood box",
    }),
    filenames: ["festivity.webp", "festivity2.webp"],
  },
  {
    slug: "marina",
    sku: "BE2BS32-14KW",
    style: "BE2BS32-14KW",
    title: "Marina Diamond Ring in 14K White Gold",
    description:
      "This unique ring showcases a stunning cluster of sapphire, London Blue topaz, aquamarine, and diamond gemstones that emit a radiant aura of light.",
    priceUsd: 1250,
    seoTitle:
      "Marina Diamond Ring BE2BS32-14KW | Woodley's Jewelers",
    metaDescription:
      "Shop the Marina diamond ring with sapphire, topaz, and aquamarine in 14K white gold at Woodley's Jewelers in Beaumont.",
    imageAlt:
      "Marina diamond ring with sapphire, topaz, and aquamarine cluster in 14K white gold.",
    specs: ringSpecs({
      Style: "BE2BS32-14KW",
      Metal: "14K White Gold",
      Width: "1.5 mm",
      "Diamond Count": "2",
      "Diamond Carat Weight": "0.02 ct. tw. (minimum)",
      "Diamond Setting": "Prong set",
      "Diamond Color": "F/G",
      "Diamond Clarity": "SI1",
      "Aquamarine Count": "1",
      "Aquamarine Shape": "Round",
      "Aquamarine Dimensions": "2 mm",
      "Aquamarine Setting": "Prong set",
      "Aquamarine Color": "Very slightly greenish blue",
      "Aquamarine Clarity": "Eye clean",
      "Sapphire Count": "1",
      "Sapphire Shape": "Round",
      "Sapphire Dimensions": "2.5 mm",
      "Sapphire Setting": "Prong set",
      "Sapphire Color": "Medium to intense blue",
      "Sapphire Clarity": "Eye clean",
      "Topaz Count": "1",
      "Topaz Shape": "Round",
      "Topaz Dimensions": "3.5 mm",
      "Topaz Setting": "Prong set",
      "Topaz Color": "Intense greenish blue (London Blue)",
      "Topaz Clarity": "Eye clean",
      Includes:
        "Free FedEx shipping, discreet packaging, professional appraisal, lifetime warranty, FSC certified wood box",
    }),
    filenames: ["marina.webp", "marina2.webp"],
  },
  {
    slug: "samba",
    sku: "BE2EM600LC-14KY",
    style: "BE2EM600LC-14KY",
    title:
      "Samba Lab Emerald and Diamond Cocktail Ring in 14K Yellow Gold",
    description:
      "This cocktail ring features a rich green lab emerald center stone and a diamond accented band, gallery, and prongs for a truly eye-catching, romantic look (1/3 total diamond carat weight).",
    priceUsd: 2390,
    seoTitle:
      "Samba Lab Emerald Cocktail Ring BE2EM600LC-14KY | Woodley's Jewelers",
    metaDescription:
      "Shop the Samba lab emerald and diamond cocktail ring in 14K yellow gold at Woodley's Jewelers in Beaumont.",
    imageAlt:
      "Samba lab emerald and diamond cocktail ring in 14K yellow gold.",
    specs: ringSpecs({
      Style: "BE2EM600LC-14KY",
      Metal: "14K Yellow Gold",
      Width: "1.4 mm",
      "Diamond Count": "68",
      "Diamond Carat Weight": "0.30 ct. tw. (minimum)",
      "Diamond Setting": "Scalloped pavé",
      "Diamond Color": "F/G",
      "Diamond Clarity": "SI1",
      "Center Stone": "Lab grown emerald",
      "Center Stone Shape": "Emerald",
      "Center Stone Dimensions": "10 x 8 mm",
      "Center Stone Setting": "Claw prong basket",
      "Center Stone Color": "Medium green",
      "Center Stone Clarity": "Eye clean",
      Includes:
        "Free FedEx shipping, discreet packaging, professional appraisal, lifetime warranty, FSC certified wood box",
    }),
    filenames: ["samba.webp", "samba2.webp"],
  },
];

export const RING_CATEGORY_IMAGE = {
  src: ringImage("austin.webp"),
  alt: "Austin diamond wedding ring in 18K white gold",
};

/** Generic preview handles replaced by real ring sample products. */
export const LEGACY_WEDDING_BAND_PREVIEW_HANDLES = [
  "preview-wedding-bands-classic",
  "preview-wedding-bands-signature",
  "preview-wedding-bands-heritage",
  "preview-wedding-bands-gallery",
  "preview-wedding-bands-atelier",
  "preview-wedding-bands-premier",
];

export const LEGACY_FINE_RINGS_PREVIEW_HANDLES = [
  "preview-fine-rings-classic",
  "preview-fine-rings-signature",
  "preview-fine-rings-heritage",
  "preview-fine-rings-gallery",
  "preview-fine-rings-atelier",
  "preview-fine-rings-premier",
];

/** Collections that list real ring sample products instead of generic previews. */
export const RING_SAMPLE_COLLECTION_HANDLES = ["wedding-bands", "fine-rings"];

/**
 * @returns {import("./product-types").CatalogProduct[]}
 */
export function buildRingSampleProducts() {
  return RING_SAMPLE_PRODUCT_DEFINITIONS.map((def, index) => {
    const images = def.filenames.map((filename, imageIndex) => ({
      src: ringImage(filename),
      alt:
        imageIndex === 0
          ? def.imageAlt
          : `${def.imageAlt} Alternate view ${imageIndex}.`,
    }));

    return {
      id: `mock:ring:${def.slug}`,
      handle: `ring-${def.slug}`,
      title: def.title,
      description: def.description,
      priceUsd: def.priceUsd,
      maxPriceUsd: def.priceUsd,
      availableForSale: def.availableForSale !== false,
      createdAt: new Date(Date.UTC(2024, 10, 1 + index * 7)).toISOString(),
      popularity: RING_SAMPLE_PRODUCT_DEFINITIONS.length - index,
      image: images[0],
      images,
      specs: def.specs,
      sku: def.sku,
      model: def.style,
      condition: "New",
      seoTitle: def.seoTitle,
      metaDescription: def.metaDescription,
      source: /** @type {const} */ ("mock"),
      audience: /** @type {const} */ ("women"),
    };
  });
}

/** @param {string} handle */
export function isRingSampleProductHandle(handle) {
  return typeof handle === "string" && handle.startsWith("ring-");
}

/** @returns {readonly string[]} */
export function allLegacyRingHandles() {
  return [...LEGACY_WEDDING_BAND_PREVIEW_HANDLES, ...LEGACY_FINE_RINGS_PREVIEW_HANDLES];
}

const legacyRingPreviewHandleSet = new Set(allLegacyRingHandles());

/** @param {string} handle */
export function isLegacyRingPreviewHandle(handle) {
  return legacyRingPreviewHandleSet.has(handle);
}

/**
 * Keep catalog imagery and copy from sample definitions; overlay admin pricing/stock.
 *
 * @param {import("./product-types").CatalogProduct} catalogProduct
 * @param {import("./product-types").CatalogProduct} firestoreProduct
 */
export function overlayRingFirestoreFields(catalogProduct, firestoreProduct) {
  return {
    ...catalogProduct,
    priceUsd: firestoreProduct.priceUsd ?? catalogProduct.priceUsd,
    maxPriceUsd: firestoreProduct.maxPriceUsd ?? catalogProduct.maxPriceUsd,
    salePriceUsd: firestoreProduct.salePriceUsd ?? catalogProduct.salePriceUsd,
    availableForSale:
      firestoreProduct.availableForSale ?? catalogProduct.availableForSale,
    source: /** @type {const} */ ("local"),
  };
}
