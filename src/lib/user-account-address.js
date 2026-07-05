import { formatUsPhoneMask } from "@/lib/checkout-auth";
import { EMPTY_VALUE_LABEL } from "@/lib/prose";

/**
 * @typedef {{
 *   fullName?: string;
 *   address1?: string;
 *   address2?: string;
 *   city?: string;
 *   state?: string;
 *   postalCode?: string;
 *   country?: string;
 * }} UserAddress
 */

/**
 * @param {UserAddress | null | undefined} addr
 */
export function formatUserAddressLines(addr) {
  if (!addr || typeof addr !== "object") return [];
  const lines = [];
  const street = [addr.address1, addr.address2].filter(Boolean).join(", ");
  if (street) lines.push(street);
  const locality = [addr.city, addr.state].filter(Boolean).join(", ");
  const tail = [locality, addr.postalCode].filter(Boolean).join(" ");
  if (tail) lines.push(tail);
  if (addr.country && addr.country !== "US") {
    lines.push(String(addr.country));
  }
  return lines;
}

/**
 * @param {UserAddress | null | undefined} addr
 */
export function formatUserAddressBlock(addr) {
  const lines = formatUserAddressLines(addr);
  return lines.length ? lines.join("\n") : EMPTY_VALUE_LABEL;
}

/**
 * @param {string | null | undefined} phone
 */
export function formatUserPhoneDisplay(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return EMPTY_VALUE_LABEL;
  return formatUsPhoneMask(digits);
}

/**
 * @param {{
 *   fullName?: string;
 *   address1: string;
 *   address2?: string;
 *   city: string;
 *   state: string;
 *   postalCode: string;
 *   country: string;
 * }} fields
 * @returns {UserAddress}
 */
export function buildUserAddress(fields) {
  return {
    fullName: String(fields.fullName || "").trim(),
    address1: String(fields.address1 || "").trim(),
    address2: String(fields.address2 || "").trim(),
    city: String(fields.city || "").trim(),
    state: String(fields.state || "").trim(),
    postalCode: String(fields.postalCode || "").trim(),
    country: String(fields.country || "US"),
  };
}

/**
 * @param {UserAddress | null | undefined} addr
 */
export function isUserAddressComplete(addr) {
  if (!addr) return false;
  return Boolean(
    addr.address1?.trim() &&
      addr.city?.trim() &&
      addr.state?.trim() &&
      addr.postalCode?.trim() &&
      addr.country?.trim(),
  );
}
