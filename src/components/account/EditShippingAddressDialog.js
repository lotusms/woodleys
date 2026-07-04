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
import { updateUserShippingAddress } from "@/lib/user-profile-update";
import * as overlayChrome from "@/lib/overlayChrome";

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   profile: {
 *     firstName?: string;
 *     lastName?: string;
 *     shippingAddress?: Record<string, string | undefined> | null;
 *   };
 * }} props
 */
export default function EditShippingAddressDialog({ open, onClose, profile }) {
  const { light } = useOverlayChrome();
  const inputClass = overlayChrome.checkoutInputBase(light);

  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    const sa = profile.shippingAddress || {};
    setAddress1(String(sa.address1 || ""));
    setCity(String(sa.city || ""));
    setState(String(sa.state || ""));
    setPostalCode(String(sa.postalCode || ""));
    setCountry(toCheckoutCountry(String(sa.country || "US")));
    setError("");
  }, [open, profile.shippingAddress]);

  function fieldClass(invalid) {
    return `${inputClass} ${invalid ? "!border-rose-600 focus:!border-rose-600 focus:!ring-rose-600/35" : ""}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validateAddressFields({
      address1,
      city,
      state,
      postalCode,
      country,
      label: "Shipping address",
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    const fullName =
      [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
      String(profile.shippingAddress?.fullName || "").trim();

    const shippingAddress = buildUserAddress({
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
      await updateUserShippingAddress(shippingAddress);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update shipping address.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ProfileEditDialog open={open} onClose={onClose} title="Edit shipping address">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <p className={overlayChrome.authInlineError(light)} role="alert">
            {error}
          </p>
        ) : null}

        <ProfileAddressLookup
          idPrefix="profile-shipping"
          heading="Shipping address"
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
