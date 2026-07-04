/** Detect whether a US-style query already ends with a street suffix. */
export const US_STREET_SUFFIX_PATTERN =
  /\b(st(reet)?|rd|road|ave(nue)?|blvd|boulevard|dr(ive)?|ln|lane|ct|court|pl(ace)?|way|cir(cle)?|ter(race)?|pkwy|parkway|hwy|highway)\.?$/i;

/** Common suffix abbreviations to expand partial queries like "123 main". */
export const US_STREET_SUFFIX_VARIANTS = [
  "st",
  "rd",
  "ave",
  "dr",
  "ct",
  "ln",
  "blvd",
  "way",
  "pl",
];

/**
 * Seed searches when the user has only typed a house number (e.g. "123").
 * @type {Array<[string, string | null]>}
 */
export const US_HOUSE_NUMBER_STREET_SEEDS = [
  ["Main", "St"],
  ["Main", "Rd"],
  ["Main", "Ave"],
  ["Oak", "St"],
  ["Oak", "Ave"],
  ["Maple", "St"],
  ["Park", "Ave"],
  ["First", "St"],
  ["Second", "St"],
  ["Washington", "St"],
  ["Lincoln", "Ave"],
  ["Broadway", null],
  ["Center", "St"],
  ["Lake", "Dr"],
  ["View", "Dr"],
];

/**
 * @param {string} query
 */
export function hasUsStreetSuffix(query) {
  return US_STREET_SUFFIX_PATTERN.test(String(query || "").trim());
}

/**
 * @param {string} query
 */
export function looksLikeUsHouseNumberStreetQuery(query) {
  return /^\d+\s+\S/.test(String(query || "").trim());
}

/**
 * @param {string} query
 */
export function isHouseNumberOnlyQuery(query) {
  return /^\d+$/.test(String(query || "").trim());
}

/**
 * @param {string} houseNumber
 * @param {string} [country]
 * @returns {string[]}
 */
export function buildHouseNumberSeedQueries(houseNumber, country = "US") {
  const num = String(houseNumber || "").trim();
  if (!num || String(country || "US").toUpperCase() !== "US") return [num];
  return US_HOUSE_NUMBER_STREET_SEEDS.map(([name, suffix]) =>
    suffix ? `${num} ${name} ${suffix}` : `${num} ${name}`,
  );
}

/**
 * When the user types a house number + street name without a suffix (e.g. "123 main"),
 * search common suffix variants so they see Main St, Main Rd, Main Ct, etc.
 *
 * @param {string} query
 * @param {string} [country]
 * @returns {string[]}
 */
export function buildExpandedStreetQueries(query, country = "US") {
  const base = String(query || "").trim();
  if (!base) return [base];
  if (String(country || "US").toUpperCase() !== "US") return [base];

  if (isHouseNumberOnlyQuery(base)) {
    return buildHouseNumberSeedQueries(base, country);
  }

  if (!looksLikeUsHouseNumberStreetQuery(base)) return [base];
  if (hasUsStreetSuffix(base)) return [base];
  return US_STREET_SUFFIX_VARIANTS.map((suffix) => `${base} ${suffix}`);
}

/**
 * @param {{ address1?: string }} suggestion
 * @param {string} query
 */
export function suggestionMatchesAddressSearch(suggestion, query) {
  const address1 = String(suggestion?.address1 || "").trim();
  if (!address1 || !/^\d+\s+\S/.test(address1)) return false;

  const q = String(query || "").trim();
  if (isHouseNumberOnlyQuery(q)) {
    return address1.startsWith(`${q} `);
  }
  if (looksLikeUsHouseNumberStreetQuery(q)) {
    return address1.toLowerCase().startsWith(q.toLowerCase());
  }
  return looksLikeUsHouseNumberStreetQuery(address1);
}

/**
 * Drop matches where the road is literally named "Main" (no St/Rd/etc.) when the
 * user typed "123 main" without a suffix — those are rarely what shoppers mean.
 *
 * @param {{ address1?: string }} suggestion
 * @param {string} originalQuery
 */
export function isBareRoadFalsePositive(suggestion, originalQuery) {
  const q = String(originalQuery || "").trim();
  if (isHouseNumberOnlyQuery(q)) return false;
  if (!looksLikeUsHouseNumberStreetQuery(q) || hasUsStreetSuffix(q)) return false;

  const qParts = q.split(/\s+/);
  const houseNum = qParts[0];
  const streetTokens = qParts.slice(1).join(" ").toLowerCase();
  if (!streetTokens) return false;

  const address1 = String(suggestion?.address1 || "").trim().toLowerCase();
  if (!address1.startsWith(houseNum.toLowerCase())) return false;

  const addrStreet = address1.slice(houseNum.length).trim();
  return addrStreet === streetTokens && !hasUsStreetSuffix(addrStreet);
}

/**
 * @param {{ id?: string; label?: string; address1?: string; city?: string; state?: string; postalCode?: string }} suggestion
 */
export function suggestionDedupeKey(suggestion) {
  return [
    String(suggestion.address1 || "").trim().toLowerCase(),
    String(suggestion.city || "").trim().toLowerCase(),
    String(suggestion.state || "").trim().toLowerCase(),
    String(suggestion.postalCode || "").trim().toLowerCase(),
  ].join("|");
}
