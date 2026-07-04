"use client";

import { useEffect, useState } from "react";
import ProfileAddressLookup from "@/components/account/ProfileAddressLookup";
import { normalizeStateCodeForPrintful } from "@/components/auth/RegistrationAddressSection";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import ProfileEditDialog from "@/components/account/ProfileEditDialog";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import { validateAddressFields } from "@/lib/account-profile-validation";
import { toCheckoutCountry } from "@/lib/checkout-auth";
import { buildUserAddress } from "@/lib/user-account-address";
import { updateUserBillingAddress } from "@/lib/user-profile-update";
import * as overlayChrome from "@/lib/overlayChrome";

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   profile: {
 *     firstName?: string;
 *     lastName?: string;
 *     shippingAddress?: Record<string, string | undefined> | null;
 *     billingAddress?: Record<string, string | undefined> | null;
 *     billingSameAsShipping?: boolean;
 *   };
 * }} props
 */
export default function EditBillingAddressDialog({ open, onClose, profile }) {
  const { light } = useOverlayChrome();
  const inputClass = overlayChrome.checkoutInputBase(light);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setBillingSameAsShipping(profile.billingSameAsShipping !== false);
    const ba = profile.billingAddress || profile.shippingAddress || {};
    setAddress1(String(ba.address1 || ""));
    setCity(String(ba.city || ""));
    setState(String(ba.state || ""));
    setPostalCode(String(ba.postalCode || ""));
    setCountry(toCheckoutCountry(String(ba.country || "US")));
    setError("");
  }, [open, profile.billingAddress, profile.billingSameAsShipping, profile.shippingAddress]);

  function fieldClass(invalid) {
    return `${inputClass} ${invalid ? "!border-rose-600 focus:!border-rose-600 focus:!ring-rose-600/35" : ""}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!billingSameAsShipping) {
      const validationError = validateAddressFields({
        address1,
        city,
        state,
        postalCode,
        country,
        label: "Billing address",
      });
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    const fullName =
      [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
      String(profile.billingAddress?.fullName || profile.shippingAddress?.fullName || "").trim();

    const shippingAddress = profile.shippingAddress
      ? buildUserAddress({
          fullName:
            String(profile.shippingAddress.fullName || fullName).trim() || fullName,
          address1: String(profile.shippingAddress.address1 || ""),
          address2: String(profile.shippingAddress.address2 || ""),
          city: String(profile.shippingAddress.city || ""),
          state: String(profile.shippingAddress.state || ""),
          postalCode: String(profile.shippingAddress.postalCode || ""),
          country: toCheckoutCountry(String(profile.shippingAddress.country || "US")),
        })
      : null;

    const billingAddress = billingSameAsShipping
      ? shippingAddress ||
        buildUserAddress({
          fullName,
          address1,
          address2: "",
          city,
          state,
          postalCode,
          country,
        })
      : buildUserAddress({
          fullName,
          address1,
          address2: "",
          city,
          state:
            country === "US" || country === "CA"
              ? normalizeStateCodeForPrintful(country, state)
              : state,
          postalCode,
          country,
        });

    setBusy(true);
    try {
      await updateUserBillingAddress({
        billingSameAsShipping,
        billingAddress,
        shippingAddress,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update billing address.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ProfileEditDialog open={open} onClose={onClose} title="Edit billing address">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <p className={overlayChrome.authInlineError(light)} role="alert">
            {error}
          </p>
        ) : null}

        <label className="flex items-start gap-3 rounded-xl border border-stone-200/80 bg-champagne/30 p-4">
          <input
            type="checkbox"
            checked={billingSameAsShipping}
            onChange={(e) => setBillingSameAsShipping(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-stone-300 text-warm-gold-dark focus:ring-warm-gold"
          />
          <span className="text-sm leading-relaxed text-site-fg">
            Billing address is the same as shipping address
          </span>
        </label>

        {!billingSameAsShipping ? (
          <ProfileAddressLookup
            idPrefix="profile-billing"
            heading="Billing address"
            address1={address1}
            setAddress1={setAddress1}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            country={country}
            setCountry={setCountry}
            fieldClass={fieldClass}
            inputBaseClass={inputClass}
          />
        ) : null}

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <SecondaryButton type="button" onClick={onClose} disabled={busy}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={busy} className="px-8">
            {busy ? "Saving…" : "Save address"}
          </PrimaryButton>
        </div>
      </form>
    </ProfileEditDialog>
  );
}
