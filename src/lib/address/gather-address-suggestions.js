import { normalizeStateCodeForPrintful } from "@/lib/address/state";
import {
  fetchGeoapifySuggestions,
  hasGeoapifyCredentials,
} from "@/lib/address/geoapify-autocomplete";
import {
  buildExpandedStreetQueries,
  isBareRoadFalsePositive,
  isHouseNumberOnlyQuery,
  suggestionDedupeKey,
  suggestionMatchesAddressSearch,
} from "@/lib/address/street-query";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";
const MAPBOX_GEOCODE = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const PHOTON_BASE = "https://photon.komoot.io/api/";

const USER_AGENT =
  "WoodleysJewelers/1.0 (checkout-address-autocomplete; +https://woodleysjewelers.com)";

const MAX_SUGGESTIONS = 10;
const EXPANDED_PER_QUERY_LIMIT = 3;

function allowedCountryCodes(country) {
  const normalized = String(country || "").toUpperCase();
  if (normalized === "US") return "us";
  if (normalized === "CA") return "ca";
  if (normalized === "GB") return "gb";
  return "us,ca,gb";
}

function mapboxCountryFilter(checkoutCountry) {
  const n = String(checkoutCountry || "US").toUpperCase();
  if (n === "OTHER") return null;
  return n.toLowerCase();
}

function photonBbox(checkoutCountry) {
  const n = String(checkoutCountry || "US").toUpperCase();
  if (n === "CA") return "-141,41,-52,83";
  if (n === "GB") return "-8,49,2,61";
  if (n === "US") return "-125,18,-66,72";
  return null;
}

function regionFromIso(address) {
  const iso = address?.["ISO3166-2-lvl4"];
  if (typeof iso !== "string" || !iso.includes("-")) return "";
  const part = iso.split("-").pop();
  return part && /^[A-Za-z]{2,3}$/.test(part) ? part.toUpperCase() : "";
}

function humanReadableSuggestionLabel({
  address1,
  city,
  state,
  postalCode,
  country,
  nominatimDisplay,
}) {
  const line1 = String(address1 || "").trim();
  const c = String(city || "").trim();
  let st = String(state || "").trim();
  const zip = String(postalCode || "").trim();
  const cc = String(country || "").toUpperCase();

  if (cc === "US" || cc === "CA") {
    st = normalizeStateCodeForPrintful(cc, st);
  }

  let locality = "";
  if (cc === "US" || cc === "CA") {
    if (c && st && zip) locality = `${c}, ${st} ${zip}`;
    else if (c && st) locality = `${c}, ${st}`;
    else if (c && zip) locality = `${c} ${zip}`;
    else locality = [c, st, zip].filter(Boolean).join(", ");
  } else {
    locality = [c, st, zip].filter(Boolean).join(", ");
  }

  if (line1 && locality) return `${line1} · ${locality}`;
  if (line1) return line1;
  if (locality) return locality;

  const raw = String(nominatimDisplay || "").trim();
  if (!raw) return "";
  const chunks = raw.split(",").map((x) => x.trim()).filter(Boolean);
  if (chunks.length <= 3) return chunks.join(" · ");
  return `${chunks.slice(0, 2).join(" · ")} · ${chunks.slice(-2).join(", ")}`;
}

function parseMapboxContext(context) {
  const out = {
    city: "",
    state: "",
    postalCode: "",
    countryCode: "",
  };
  if (!Array.isArray(context)) return out;

  for (const item of context) {
    const id = String(item?.id || "");
    if (id.startsWith("postcode.")) {
      out.postalCode = String(item.text || "").trim();
    } else if (id.startsWith("region.")) {
      const sc = String(item.short_code || "");
      if (sc.includes("-")) {
        out.state = sc.split("-").pop()?.toUpperCase() || String(item.text || "").trim();
      } else {
        out.state = String(item.text || "").trim();
      }
    } else if (
      id.startsWith("place.") ||
      id.startsWith("locality.") ||
      id.startsWith("district.")
    ) {
      if (!out.city) out.city = String(item.text || "").trim();
    } else if (id.startsWith("country.")) {
      const sc = String(item.short_code || "").toLowerCase();
      if (sc.length >= 2) {
        out.countryCode = sc.slice(0, 2).toUpperCase();
      }
    }
  }
  return out;
}

function mapboxFeatureToSuggestion(feature, index) {
  const placeName = String(feature?.place_name || "").trim();
  const num =
    feature?.address != null && feature.address !== ""
      ? String(feature.address).trim()
      : "";
  const street = String(feature?.text || "").trim();
  let address1 = [num, street].filter(Boolean).join(" ").trim();
  if (!address1 && placeName) {
    address1 = placeName.split(",")[0].trim();
  }

  const ctx = parseMapboxContext(feature?.context);
  let cc = ctx.countryCode || "";
  if (cc === "UK") cc = "GB";

  let state = ctx.state;
  if (cc === "US" || cc === "CA") {
    state = normalizeStateCodeForPrintful(cc, state);
  }

  const label = humanReadableSuggestionLabel({
    address1,
    city: ctx.city,
    state,
    postalCode: ctx.postalCode,
    country: cc,
    nominatimDisplay: placeName,
  });

  const id =
    feature?.id != null && String(feature.id) !== ""
      ? String(feature.id)
      : `mapbox-${index}`;

  return {
    id,
    label: label || placeName,
    address1,
    city: ctx.city,
    state,
    postalCode: ctx.postalCode,
    country: cc,
  };
}

function photonFeatureToSuggestion(feature, index) {
  const p = feature?.properties || {};
  const houseNumber = String(p.housenumber || "").trim();
  const street = String(p.street || "").trim();
  let address1 = [houseNumber, street].filter(Boolean).join(" ").trim();
  if (!address1) {
    address1 = String(p.name || "").trim();
  }

  const city = String(
    p.city || p.locality || p.district || p.county || "",
  ).trim();
  let state = String(p.state || "").trim();
  const postalCode = String(p.postcode || "").trim();
  let cc = String(p.countrycode || "").toUpperCase();
  if (cc === "UK") cc = "GB";

  if (cc === "US" || cc === "CA") {
    state = normalizeStateCodeForPrintful(cc, state);
  }

  const label = humanReadableSuggestionLabel({
    address1,
    city,
    state,
    postalCode,
    country: cc,
  });

  const id =
    p.osm_id != null
      ? `photon-${String(p.osm_type || "n")}-${p.osm_id}-${index}`
      : `photon-${index}`;

  return {
    id,
    label: label || address1,
    address1,
    city,
    state,
    postalCode,
    country: cc,
  };
}

function normalizeNominatimRow(item, index = 0) {
  const address = item?.address ?? {};
  const cc = String(address.country_code || "").toUpperCase();

  const streetParts = [address.house_number, address.road].filter(Boolean);
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.municipality ||
    address.suburb ||
    address.city_district ||
    (cc === "gb" || cc === "ie" ? address.county : null) ||
    "";

  const isoRegion = regionFromIso(address);
  const stateFromName = String(address.state || address.region || "").trim();
  const state =
    cc === "US" || cc === "CA"
      ? isoRegion || stateFromName
      : stateFromName;

  const postalCode = String(address.postcode || "").trim();
  const countryCode = cc;

  const id =
    item?.place_id != null && String(item.place_id) !== ""
      ? String(item.place_id)
      : item?.osm_id != null
        ? `osm-${String(item.osm_type || "rel")}-${item.osm_id}`
        : `nom-${index}`;

  const address1 = streetParts.join(" ").trim();
  const cityStr = String(city || "").trim();
  const nominatimDisplay = String(item?.display_name ?? "");

  const label = humanReadableSuggestionLabel({
    address1,
    city: cityStr,
    state,
    postalCode,
    country: countryCode,
    nominatimDisplay,
  });

  return {
    id,
    label: label || nominatimDisplay,
    address1,
    city: cityStr,
    state,
    postalCode,
    country: countryCode || "",
  };
}

function matchesCheckoutCountry(suggestion, checkoutCountry) {
  const wanted = String(checkoutCountry || "US").toUpperCase();
  if (wanted === "OTHER") return true;
  const got = String(suggestion.country || "").toUpperCase();
  return !got || got === wanted;
}

function filterSuggestions(list, query, checkoutCountry) {
  return list.filter(
    (s) =>
      s.id &&
      s.label &&
      matchesCheckoutCountry(s, checkoutCountry) &&
      suggestionMatchesAddressSearch(s, query),
  );
}

async function fetchMapboxSuggestions(q, checkoutCountry, limit = 8) {
  const token = process.env.MAPBOX_ACCESS_TOKEN?.trim();
  if (!token) return [];

  const path = encodeURIComponent(q);
  const params = new URLSearchParams({
    access_token: token,
    autocomplete: "true",
    limit: String(Math.min(limit, 10)),
    types: "address",
  });
  const country = mapboxCountryFilter(checkoutCountry);
  if (country) params.append("country", country);

  const url = `${MAPBOX_GEOCODE}/${path}.json?${params.toString()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return [];

  const data = await response.json().catch(() => ({}));
  const features = Array.isArray(data?.features) ? data.features : [];

  return features.map((f, i) => mapboxFeatureToSuggestion(f, i));
}

async function fetchPhotonSuggestions(q, checkoutCountry, limit = 8) {
  const params = new URLSearchParams({
    q,
    limit: String(Math.min(limit, 15)),
    lang: "en",
  });
  const bbox = photonBbox(checkoutCountry);
  if (bbox) params.set("bbox", bbox);

  const url = `${PHOTON_BASE}?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) return [];

  const data = await response.json().catch(() => ({}));
  const features = Array.isArray(data?.features) ? data.features : [];

  return features.map((f, i) => photonFeatureToSuggestion(f, i));
}

async function fetchNominatimSuggestions(q, checkoutCountry, limit = 8) {
  const countrycodes = allowedCountryCodes(checkoutCountry);
  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    addressdetails: "1",
    limit: String(Math.min(limit, 10)),
    countrycodes,
  });
  const url = `${NOMINATIM_BASE}?${params.toString()}`;

  let response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    cache: "no-store",
  });
  if (response.status === 429) {
    await new Promise((r) => setTimeout(r, 1000));
    response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      cache: "no-store",
    });
  }
  if (!response.ok) return [];

  const data = await response.json().catch(() => []);
  const rows = Array.isArray(data) ? data : [];

  return rows.map((row, i) => normalizeNominatimRow(row, i));
}

function dedupeSuggestions(list, max = MAX_SUGGESTIONS) {
  const seenKeys = new Set();
  const out = [];
  for (const s of list) {
    const key = suggestionDedupeKey(s);
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}

async function fetchOpenDataSuggestions(q, checkoutCountry, limit, originalQuery) {
  const hasMapbox = Boolean(process.env.MAPBOX_ACCESS_TOKEN?.trim());
  let list = [];

  if (hasMapbox) {
    list = await fetchMapboxSuggestions(q, checkoutCountry, limit);
  }
  if (list.length < Math.min(limit, 4)) {
    list = [...list, ...(await fetchPhotonSuggestions(q, checkoutCountry, limit))];
  }
  if (list.length === 0) {
    list = await fetchNominatimSuggestions(q, checkoutCountry, limit);
  }

  return filterSuggestions(list, originalQuery, checkoutCountry);
}

/**
 * @param {string} q
 * @param {string} checkoutCountry
 * @param {{ preferState?: string }} [options]
 */
export async function gatherAddressSuggestions(q, checkoutCountry, options = {}) {
  const country = String(checkoutCountry || "US").trim() || "US";

  if (hasGeoapifyCredentials()) {
    const geoapify = await fetchGeoapifySuggestions(q, country, {
      maxResults: MAX_SUGGESTIONS,
      biasProximity: options.biasProximity,
    });
    const filtered = geoapify.filter(
      (s) =>
        suggestionMatchesAddressSearch(s, q) &&
        !isBareRoadFalsePositive(s, q),
    );
    if (filtered.length > 0) {
      return dedupeSuggestions(filtered, MAX_SUGGESTIONS);
    }
  }

  const queries = buildExpandedStreetQueries(q, country);
  const limit = queries.length > 1 ? EXPANDED_PER_QUERY_LIMIT : MAX_SUGGESTIONS;

  let merged = [];
  if (queries.length === 1) {
    merged = await fetchOpenDataSuggestions(q, country, limit, q);
  } else {
    const batches = await Promise.all(
      queries.map((query) =>
        fetchOpenDataSuggestions(query, country, limit, q),
      ),
    );
    merged = batches.flat();
  }

  const filtered = merged.filter((s) => !isBareRoadFalsePositive(s, q));
  return dedupeSuggestions(filtered, MAX_SUGGESTIONS);
}

/**
 * @param {string} q
 */
export function isAddressAutocompleteQueryAllowed(q) {
  const query = String(q || "").trim();
  if (!query) return false;
  if (isHouseNumberOnlyQuery(query)) return query.length >= 1;
  return query.length >= 3;
}
