import { orderTotal, shippingForSubtotal } from "@/lib/checkout";
import { digitsFromTelInput, toCheckoutCountry } from "@/lib/checkout-auth";
import { makeOrderId } from "@/lib/make-order-id";
import { roundUsd2 } from "@/lib/money";
import { cartRequiresShopifyCheckout } from "@/lib/cart-checkout";

export function emptyCheckoutForm() {
  return {
    email: "",
    phone: "",
    fullName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    notes: "",
  };
}

/**
 * @param {ReturnType<typeof emptyCheckoutForm>} form
 */
export function validateCheckoutForm(form) {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!String(form.email || "").trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email).trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!String(form.fullName || "").trim()) {
    errors.fullName = "Full name is required.";
  }
  if (!String(form.address1 || "").trim()) {
    errors.address1 = "Address is required.";
  }
  if (!String(form.city || "").trim()) {
    errors.city = "City is required.";
  }
  if (!String(form.state || "").trim()) {
    errors.state = "State / province is required.";
  }
  if (!String(form.postalCode || "").trim()) {
    errors.postalCode = "Postal code is required.";
  }

  return errors;
}

/**
 * @param {{
 *   form: ReturnType<typeof emptyCheckoutForm>;
 *   cartLines: Array<Record<string, unknown>>;
 * }} params
 */
export function buildCheckoutOrder({ form, cartLines }) {
  if (!Array.isArray(cartLines) || cartLines.length === 0) {
    throw new Error("Your cart is empty.");
  }
  if (cartRequiresShopifyCheckout(cartLines)) {
    throw new Error("Shopify items must be checked out on Shopify.");
  }

  const errors = validateCheckoutForm(form);
  if (Object.keys(errors).length > 0) {
    const err = new Error("Please complete all required fields.");
    err.fieldErrors = errors;
    throw err;
  }

  const subtotalUsd = roundUsd2(
    cartLines.reduce((sum, line) => sum + line.priceUsd * line.quantity, 0),
  );
  const shippingUsd = shippingForSubtotal(subtotalUsd, cartLines);
  const totalUsd = orderTotal(subtotalUsd, cartLines);

  return {
    id: makeOrderId(),
    createdAt: new Date().toISOString(),
    email: String(form.email).trim(),
    phone: digitsFromTelInput(form.phone),
    shippingAddress: {
      fullName: String(form.fullName).trim(),
      address1: String(form.address1).trim(),
      address2: String(form.address2 || "").trim(),
      city: String(form.city).trim(),
      state: String(form.state).trim(),
      postalCode: String(form.postalCode).trim(),
      country: toCheckoutCountry(form.country),
    },
    lines: cartLines.map((line) => ({
      productId: line.productId ?? null,
      printfulProductId: line.printfulProductId ?? null,
      variantId: line.variantId ?? null,
      catalogVariantId: line.catalogVariantId ?? null,
      externalId: line.externalId ?? null,
      slug: line.slug ?? null,
      title: line.title ?? null,
      artist: line.artist ?? null,
      priceUsd: roundUsd2(line.priceUsd),
      sku: line.sku ?? null,
      quantity: line.quantity,
      image: line.image ?? null,
      originalImage: line.originalImage ?? null,
      source: line.source ?? "local",
    })),
    subtotalUsd,
    shippingUsd,
    totalUsd,
    notes: String(form.notes || "").trim(),
  };
}
