import { CATALOG_SECTIONS } from "./categories.js";

/**
 * @typedef {{ shopifyHandle: string; title: string; sectionKey: string; slug?: string }} CatalogCollectionOption
 */

/** @param {string} shopifyHandle */
export function isParentCatalogSectionHandle(shopifyHandle) {
  return Object.values(CATALOG_SECTIONS).some(
    (section) => section.shopifyHandle === shopifyHandle,
  );
}

/**
 * Leaf collections only — products cannot be assigned to a parent section handle.
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

  for (const [sectionKey, section] of Object.entries(CATALOG_SECTIONS)) {
    for (const child of section.children) {
      options.push({
        shopifyHandle: child.shopifyHandle,
        title: child.title,
        sectionKey,
        slug: child.slug,
      });
    }
  }

  return options;
}

/** @returns {CatalogCollectionOption[]} */
export function listAllCatalogCollectionOptions() {
  /** @type {CatalogCollectionOption[]} */
  const options = [];

  for (const [sectionKey, section] of Object.entries(CATALOG_SECTIONS)) {
    options.push({
      shopifyHandle: section.shopifyHandle,
      title: section.title,
      sectionKey,
    });

    for (const child of section.children) {
      options.push({
        shopifyHandle: child.shopifyHandle,
        title: `${section.title}, ${child.title}`,
        sectionKey,
        slug: child.slug,
      });
    }
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
    for (const child of section.children) {
      if (child.shopifyHandle === shopifyHandle) {
        return {
          shopifyHandle,
          title: child.title,
          sectionKey,
          slug: child.slug,
          description: child.description,
        };
      }
    }
  }
  return {
    shopifyHandle,
    title: shopifyHandle,
    sectionKey: "custom",
    description: "",
  };
}
