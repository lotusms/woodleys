import { CATALOG_SECTIONS } from "./categories.js";

/**
 * @typedef {{ shopifyHandle: string; title: string; sectionKey: string; slug?: string }} CatalogCollectionOption
 */

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
