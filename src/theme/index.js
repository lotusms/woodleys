/**
 * Woodley's Jewelers — light luxury editorial theme.
 */

export const THEME_IDS = /** @type {const} */ (["woodleys"]);

export const LIGHT_THEME_IDS = /** @type {const} */ (["woodleys"]);

/** @param {string} [id] */
export function isLightThemeId(id) {
  return typeof id === "string" && LIGHT_THEME_IDS.includes(id);
}

export const ACTIVE_THEME_ID = "woodleys";
