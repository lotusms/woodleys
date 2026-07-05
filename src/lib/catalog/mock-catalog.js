import { buildBulovaSampleProducts } from "./bulova-sample-products.js";
import {
  buildRingSampleProducts,
  RING_SAMPLE_COLLECTION_HANDLES,
} from "./ring-sample-products.js";
import { CATALOG_SECTIONS } from "./categories.js";
import { HOME_FEATURED_PRODUCT_HANDLES } from "../../config/featured-products.js";

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

const IMAGE_POOL = Object.values(editorialImages);

const STYLE_NAMES = [
  "Classic",
  "Signature",
  "Heritage",
  "Gallery",
  "Atelier",
  "Premier",
];

const SERVICE_STYLE_NAMES = [
  "Standard",
  "Express",
  "Full Service",
  "Premium",
  "Complimentary Inspection",
  "Written Estimate",
];

/** @param {string} handle */
function isServiceCollection(handle) {
  const section = CATALOG_SECTIONS.services;
  if (section.shopifyHandle === handle) return true;
  return section.children.some((c) => c.shopifyHandle === handle);
}

/** @param {string} str */
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/**
 * @param {string} collectionHandle
 * @param {number} index
 */
function imageFor(collectionHandle, index) {
  const h = hashString(collectionHandle);
  return IMAGE_POOL[(h + index) % IMAGE_POOL.length];
}

/**
 * @param {string} collectionHandle
 * @param {number} index
 * @param {boolean} service
 */
function priceFor(collectionHandle, index, service) {
  if (service) {
    return [45, 75, 95, 125, 150, 200][index] ?? 99;
  }
  const base = 1200 + (hashString(collectionHandle) % 800);
  return base + index * 725;
}

/**
 * @param {{
 *   collectionHandle: string;
 *   collectionTitle: string;
 *   collectionDescription?: string;
 *   image?: { src: string; alt: string };
 *   count?: number;
 * }} opts
 * @returns {import("./product-types").CatalogProduct[]}
 */
export function buildMockProductsForCollection({
  collectionHandle,
  collectionTitle,
  collectionDescription = "",
  image,
  count = 6,
}) {
  const service = isServiceCollection(collectionHandle);
  const names = service ? SERVICE_STYLE_NAMES : STYLE_NAMES;
  const desc =
    collectionDescription ||
    `A refined ${collectionTitle.toLowerCase()} selection from Woodley's Jewelers in Beaumont.`;

  return names.slice(0, count).map((style, index) => {
    const imgSrc = image?.src || imageFor(collectionHandle, index);
    const price = priceFor(collectionHandle, index, service);
    const slug = style.toLowerCase().replace(/\s+/g, "-");
    const handle = `preview-${collectionHandle}-${slug}`;

    return {
      id: `mock:${collectionHandle}:${slug}`,
      handle,
      title: service
        ? `${collectionTitle}, ${style}`
        : `${style} ${collectionTitle}`,
      description: desc,
      priceUsd: price,
      maxPriceUsd: service ? price : price + (index % 2 === 0 ? 400 : 0),
      availableForSale: index < names.length - 1,
      createdAt: new Date(Date.UTC(2024, 5, 1 + index * 9)).toISOString(),
      popularity: names.length - index,
      image: {
        src: imgSrc,
        alt: image?.alt || `${style} ${collectionTitle}`,
      },
      source: /** @type {const} */ ("mock"),
    };
  });
}

/** @type {Map<string, import("./product-types").CatalogProduct[]>} */
const mockByHandle = new Map();

/** @type {Map<string, import("./product-types").CatalogProduct>} */
const mockByProductHandle = new Map();

function registerCollection(handle, meta) {
  const products = buildMockProductsForCollection({
    collectionHandle: handle,
    collectionTitle: meta.title,
    collectionDescription: meta.description,
    image: meta.image,
  });
  mockByHandle.set(handle, products);
  for (const p of products) {
    mockByProductHandle.set(p.handle, p);
  }
}

for (const section of Object.values(CATALOG_SECTIONS)) {
  const sectionImage = section.children[0]?.image;
  registerCollection(section.shopifyHandle, {
    title: section.title,
    description: section.intro || section.description,
    image: sectionImage,
  });

  for (const child of section.children) {
    if (child.shopifyHandle === "bulova") {
      const products = buildBulovaSampleProducts();
      mockByHandle.set("bulova", products);
      for (const product of products) {
        mockByProductHandle.set(product.handle, product);
      }
      continue;
    }

    if (RING_SAMPLE_COLLECTION_HANDLES.includes(child.shopifyHandle)) {
      const products = buildRingSampleProducts();
      mockByHandle.set(child.shopifyHandle, products);
      for (const product of products) {
        mockByProductHandle.set(product.handle, product);
      }
      continue;
    }

    registerCollection(child.shopifyHandle, {
      title: child.title,
      description: child.description,
      image: child.image,
    });
  }
}

/**
 * @param {string} collectionHandle
 * @returns {import("./product-types").CatalogProduct[]}
 */
export function getMockProductsByCollectionHandle(collectionHandle) {
  return mockByHandle.get(collectionHandle) ?? [];
}

/**
 * @param {string} handle
 * @returns {import("./product-types").CatalogProductDetail | null}
 */
export function getMockProductByHandle(handle) {
  const product = mockByProductHandle.get(handle);
  if (!product) return null;

  const images = Array.isArray(product.images) && product.images.length
    ? product.images.filter((img) => img?.src)
    : product.image?.src
      ? [product.image]
      : [];

  return {
    ...product,
    descriptionHtml: `<p>${product.description}</p>`,
    images,
    variants: [
      {
        id: `${product.id}:default`,
        title: "Default",
        priceUsd: product.priceUsd,
        availableForSale: product.availableForSale,
      },
    ],
  };
}

/**
 * Mock catalog product handles generated for preview mode.
 *
 * @param {string} handle
 * @returns {boolean}
 */
export function isMockPreviewHandle(handle) {
  return typeof handle === "string" && handle.startsWith("preview-");
}

/**
 * All unique preview catalog products with merged collection handles.
 * Used to seed Firestore inventory for the admin Products page.
 *
 * @returns {Array<import("./product-types").CatalogProduct & { collectionHandles: string[]; quantity: number; active: boolean; featured: boolean }>}
 */
export function listAllMockCatalogProducts() {
  const featuredSet = new Set(HOME_FEATURED_PRODUCT_HANDLES);
  /** @type {Map<string, import("./product-types").CatalogProduct & { collectionHandles: string[]; quantity: number; active: boolean; featured: boolean }>} */
  const byHandle = new Map();

  for (const [collectionHandle, products] of mockByHandle.entries()) {
    for (const product of products) {
      const existing = byHandle.get(product.handle);
      if (existing) {
        if (!existing.collectionHandles.includes(collectionHandle)) {
          existing.collectionHandles.push(collectionHandle);
        }
        continue;
      }

      byHandle.set(product.handle, {
        ...product,
        collectionHandles: [collectionHandle],
        quantity: product.availableForSale ? 6 : 0,
        active: true,
        featured: featuredSet.has(product.handle),
        featuredOrder: featuredSet.has(product.handle)
          ? HOME_FEATURED_PRODUCT_HANDLES.indexOf(product.handle)
          : undefined,
      });
    }
  }

  return [...byHandle.values()];
}
