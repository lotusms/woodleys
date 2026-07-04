import { toCheckoutCountry } from "@/lib/checkout-auth";
import { normalizeStateCodeForPrintful } from "@/lib/address/state";

/**
 * @param {{
 *   address1?: string;
 *   city?: string;
 *   state?: string;
 *   postalCode?: string;
 *   country?: string;
 * }} parts
 */
export function formatAddressAutocompleteLabel(parts) {
  const line1 = String(parts.address1 || "").trim();
  const city = String(parts.city || "").trim();
  let state = String(parts.state || "").trim();
  const postalCode = String(parts.postalCode || "").trim();
  const country = String(parts.country || "US").toUpperCase();

  if (country === "US" || country === "CA") {
    state = normalizeStateCodeForPrintful(country, state);
  }

  let locality = "";
  if (country === "US" || country === "CA") {
    if (city && state && postalCode) locality = `${city}, ${state} ${postalCode}`;
    else if (city && state) locality = `${city}, ${state}`;
    else locality = [city, state, postalCode].filter(Boolean).join(", ");
  } else {
    locality = [city, state, postalCode].filter(Boolean).join(", ");
  }

  if (line1 && locality) return `${line1} · ${locality}`;
  return line1 || locality;
}

/**
 * @param {Record<string, unknown>} suggestion
 * @param {{
 *   country: string;
 *   state: string;
 *   setAddress1: (value: string) => void;
 *   setCity: (value: string) => void;
 *   setState: (value: string) => void;
 *   setPostalCode: (value: string) => void;
 *   setCountry: (value: string) => void;
 * }} fields
 * @returns {string} Full display label for the single-field input
 */
export function applySuggestionToFields(suggestion, fields) {
  const nextCountry = suggestion.country
    ? toCheckoutCountry(String(suggestion.country))
    : fields.country;
  const rawState = String(suggestion.state ?? "").trim() || fields.state;
  const nextState =
    nextCountry === "US" || nextCountry === "CA"
      ? normalizeStateCodeForPrintful(nextCountry, rawState)
      : rawState;

  const address1 = String(suggestion.address1 ?? "").trim() || "";
  const city = String(suggestion.city ?? "").trim() || "";
  const postalCode = String(suggestion.postalCode ?? "").trim() || "";

  fields.setAddress1(address1);
  fields.setCity(city);
  fields.setState(nextState || fields.state);
  fields.setPostalCode(postalCode);
  fields.setCountry(nextCountry);

  return (
    String(suggestion.label || "").trim() ||
    formatAddressAutocompleteLabel({
      address1,
      city,
      state: nextState,
      postalCode,
      country: nextCountry,
    })
  );
}
