import { normalizeStateCodeForPrintful } from "@/lib/address/state";

const GEOAPIFY_AUTOCOMPLETE = "https://api.geoapify.com/v1/geocode/autocomplete";

/**
 * @returns {boolean}
 */
export function hasGeoapifyCredentials() {
  return Boolean(process.env.GEOAPIFY_API_KEY?.trim());
}

/**
 * @param {string} checkoutCountry
 */
function geoapifyCountryFilter(checkoutCountry) {
  const n = String(checkoutCountry || "US").toUpperCase();
  if (n === "OTHER") return null;
  return n.toLowerCase();
}

/**
 * @param {{
 *   housenumber?: string;
 *   street?: string;
 *   address_line1?: string;
 *   city?: string;
 *   state?: string;
 *   state_code?: string;
 *   postcode?: string;
 *   country_code?: string;
 *   formatted?: string;
 *   place_id?: string;
 *   result_type?: string;
 * }} row
 * @param {number} index
 */
function geoapifyRowToSuggestion(row, index) {
  const houseNumber = String(row.housenumber || "").trim();
  const street = String(row.street || "").trim();
  let address1 = [houseNumber, street].filter(Boolean).join(" ").trim();

  if (!address1) {
    const line1 = String(row.address_line1 || "").trim();
    if (line1 && /^\d+\s/.test(line1)) {
      address1 = line1;
    }
  }

  const city = String(row.city || "").trim();
  let state = String(row.state_code || row.state || "").trim();
  const postalCode = String(row.postcode || "").trim();
  const cc = String(row.country_code || "US").toUpperCase();

  if (cc === "US" || cc === "CA") {
    state = normalizeStateCodeForPrintful(cc, state);
  }

  let locality = "";
  if (city && state && postalCode) locality = `${city}, ${state} ${postalCode}`;
  else if (city && state) locality = `${city}, ${state}`;
  else locality = [city, state, postalCode].filter(Boolean).join(", ");

  const label =
    address1 && locality
      ? `${address1} · ${locality}`
      : String(row.formatted || address1 || locality).trim();

  const id =
    row.place_id != null && String(row.place_id) !== ""
      ? String(row.place_id)
      : `geoapify-${index}-${address1}`.replace(/\s+/g, "-").toLowerCase();

  return {
    id,
    label,
    address1,
    city,
    state,
    postalCode,
    country: cc,
  };
}

/**
 * @param {unknown} data
 */
function extractGeoapifyRows(data) {
  if (!data || typeof data !== "object") return [];
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.features)) {
    return data.features.map((feature) => ({
      ...(feature?.properties || {}),
      place_id: feature?.properties?.place_id || feature?.id,
    }));
  }
  return [];
}

/**
 * Geoapify Address Autocomplete — free tier at https://www.geoapify.com/
 *
 * @param {string} query
 * @param {string} checkoutCountry
 * @param {{ maxResults?: number; biasProximity?: string }} [options]
 * @returns {Promise<Array<{ id: string; label: string; address1: string; city: string; state: string; postalCode: string; country: string }>>}
 */
export async function fetchGeoapifySuggestions(
  query,
  checkoutCountry,
  options = {},
) {
  const apiKey = process.env.GEOAPIFY_API_KEY?.trim();
  if (!apiKey) return [];

  const text = String(query || "").trim();
  if (!text) return [];

  const params = new URLSearchParams({
    text,
    format: "json",
    lang: "en",
    limit: String(Math.min(Math.max(options.maxResults || 10, 1), 20)),
    apiKey,
  });

  const countryFilter = geoapifyCountryFilter(checkoutCountry);
  if (countryFilter) {
    params.set("filter", `countrycode:${countryFilter}`);
  }

  const proximity =
    options.biasProximity ||
    process.env.GEOAPIFY_BIAS_PROXIMITY?.trim() ||
    "";
  if (proximity) {
    params.set("bias", `proximity:${proximity}`);
  }

  const url = `${GEOAPIFY_AUTOCOMPLETE}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("[address-autocomplete][geoapify]", response.status);
      return [];
    }

    const data = await response.json().catch(() => ({}));
    const rows = extractGeoapifyRows(data);

    return rows
      .map((row, index) => geoapifyRowToSuggestion(row, index))
      .filter((s) => s.id && s.label && s.address1);
  } catch (err) {
    console.error("[address-autocomplete][geoapify]", err);
    return [];
  }
}
