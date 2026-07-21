import {
  CATALOG_SECTIONS,
  walkCategoryEntries,
} from "./categories.js";
import { diamondShapeLinksForOrigin } from "@/config/diamond-shapes";

/**
 * @typedef {{ shopifyHandle: string; title: string; sectionKey: string; slug?: string }} CatalogCollectionOption
 */

/** Shape-specific diamond collections (query-filtered on the origin PLP). */
function diamondShapeCollectionOptions() {
  /** @type {CatalogCollectionOption[]} */
  const options = [];
  for (const origin of /** @type {const} */ ([
    "natural-diamonds",
    "lab-grown-diamonds",
  ])) {
    const originLabel =
      origin === "lab-grown-diamonds" ? "Lab-Grown Diamonds" : "Natural Diamonds";
    for (const shape of diamondShapeLinksForOrigin(origin)) {
      options.push({
        shopifyHandle: shape.shopifyHandle,
        title: `${originLabel} · ${shape.title}`,
        sectionKey: "diamonds",
        slug: `${origin}?shape=${shape.slug}`,
      });
    }
  }
  return options;
}

/** @param {string} shopifyHandle */
export function isParentCatalogSectionHandle(shopifyHandle) {
  return Object.values(CATALOG_SECTIONS).some(
    (section) => section.shopifyHandle === shopifyHandle,
  );
}

/**
 * Leaf collections only — products cannot be assigned to a parent section handle.
 * Parent diamond origins (`natural-diamonds`, `lab-grown-diamonds`) remain assignable
 * for “all stones of this origin”; origin+shape Shopify handles are also assignable
 * (browsed via `?shape=` on the origin page).
 * @param {string[]} handles
 */
export function filterAssignableCollectionHandles(handles) {
  return [
    ...new Set(
      handles
        .map(String)
        .filter(Boolean)
        .filter((handle) => !isParentCatalogSectionHandle(handle)),
    ),
  ];
}

/** @returns {CatalogCollectionOption[]} */
export function listAssignableCatalogCollectionOptions() {
  /** @type {CatalogCollectionOption[]} */
  const options = [];
  /** @type {Set<string>} */
  const seen = new Set();

  for (const [sectionKey, section] of Object.entries(CATALOG_SECTIONS)) {
    if (section.hub === "audience") continue;

    walkCategoryEntries(section.children, (child, slugPath) => {
      if (child.derived || seen.has(child.shopifyHandle)) return;
      seen.add(child.shopifyHandle);
      const parentTitle =
        slugPath.length > 1
          ? section.children.find((c) => c.slug === slugPath[0])?.title
          : null;
      options.push({
        shopifyHandle: child.shopifyHandle,
        title: parentTitle ? `${parentTitle} · ${child.title}` : child.title,
        sectionKey,
        slug: slugPath.join("/"),
      });
    });
  }

  for (const shapeOption of diamondShapeCollectionOptions()) {
    if (seen.has(shapeOption.shopifyHandle)) continue;
    seen.add(shapeOption.shopifyHandle);
    options.push(shapeOption);
  }

  return options;
}

/** @returns {CatalogCollectionOption[]} */
export function listAllCatalogCollectionOptions() {
  /** @type {CatalogCollectionOption[]} */
  const options = [];
  /** @type {Set<string>} */
  const seen = new Set();

  for (const [sectionKey, section] of Object.entries(CATALOG_SECTIONS)) {
    if (!seen.has(section.shopifyHandle)) {
      seen.add(section.shopifyHandle);
      options.push({
        shopifyHandle: section.shopifyHandle,
        title: section.title,
        sectionKey,
      });
    }

    walkCategoryEntries(section.children, (child, slugPath) => {
      if (child.derived || seen.has(child.shopifyHandle)) return;
      seen.add(child.shopifyHandle);
      options.push({
        shopifyHandle: child.shopifyHandle,
        title: `${section.title}, ${child.title}`,
        sectionKey,
        slug: slugPath.join("/"),
      });
    });
  }

  for (const shapeOption of diamondShapeCollectionOptions()) {
    if (seen.has(shapeOption.shopifyHandle)) continue;
    seen.add(shapeOption.shopifyHandle);
    options.push(shapeOption);
  }

  return options;
}

/**
 * @param {string} shopifyHandle
 */
export function getCatalogCollectionMeta(shopifyHandle) {
  for (const [sectionKey, section] of Object.entries(CATALOG_SECTIONS)) {
    if (section.shopifyHandle === shopifyHandle) {
      return {
        shopifyHandle,
        title: section.title,
        sectionKey,
        description: section.description,
      };
    }
    /** @type {ReturnType<typeof getCatalogCollectionMeta> | null} */
    let found = null;
    walkCategoryEntries(section.children, (child, slugPath) => {
      if (found) return;
      if (child.shopifyHandle === shopifyHandle) {
        found = {
          shopifyHandle,
          title: child.title,
          sectionKey,
          slug: slugPath.join("/"),
          description: child.description,
        };
      }
    });
    if (found) return found;
  }

  const shapeMeta = diamondShapeCollectionOptions().find(
    (option) => option.shopifyHandle === shopifyHandle,
  );
  if (shapeMeta) {
    return {
      shopifyHandle,
      title: shapeMeta.title,
      sectionKey: shapeMeta.sectionKey,
      slug: shapeMeta.slug,
      description: "",
    };
  }

  return {
    shopifyHandle,
    title: shopifyHandle,
    sectionKey: "custom",
    description: "",
  };
}
