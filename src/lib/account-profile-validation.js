import { validateAddressFields } from "@/lib/account-registration";
import { digitsFromTelInput } from "@/lib/checkout-auth";

/**
 * @param {{
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 *   phone: string;
 *   emailChanging?: boolean;
 *   requiresPassword?: boolean;
 *   currentPassword?: string;
 * }} fields
 */
export function validateProfilePersonalInfo(fields) {
  if (!String(fields.firstName || "").trim()) return "First name is required.";
  if (!String(fields.lastName || "").trim()) return "Last name is required.";

  const email = String(fields.email || "").trim();
  if (!email) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)) {
    return "Enter a valid email address.";
  }

  const phoneDigits = digitsFromTelInput(fields.phone || "");
  if (phoneDigits.length > 0 && phoneDigits.length < 10) {
    return "Enter all 10 digits for phone, or leave it blank.";
  }

  if (
    fields.emailChanging &&
    fields.requiresPassword &&
    !String(fields.currentPassword || "")
  ) {
    return "Enter your current password to change your email.";
  }

  return "";
}

export { validateAddressFields };
