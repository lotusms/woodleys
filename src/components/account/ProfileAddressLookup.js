"use client";

import { useEffect, useMemo, useState } from "react";
import AddressLine1Autocomplete from "@/components/checkout/AddressLine1Autocomplete";
import SelectListbox from "@/components/ui/SelectListbox";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import {
  applySuggestionToFields,
  formatAddressAutocompleteLabel,
} from "@/lib/apply-address-suggestion";
import { toCheckoutCountry } from "@/lib/checkout-auth";
import { CHECKOUT_COUNTRY_OPTIONS } from "@/lib/checkout-countries";
import { isUserAddressComplete } from "@/lib/user-account-address";
import * as overlayChrome from "@/lib/overlayChrome";

/**
 * Single-field address lookup for profile edit modals.
 * Shows the full selected address in one input (same format as suggestions).
 *
 * @param {{
 *   idPrefix: string;
 *   heading: string;
 *   address1: string;
 *   setAddress1: (value: string) => void;
 *   city: string;
 *   setCity: (value: string) => void;
 *   state: string;
 *   setState: (value: string) => void;
 *   postalCode: string;
 *   setPostalCode: (value: string) => void;
 *   country: string;
 *   setCountry: (value: string) => void;
 *   fieldClass: (invalid?: boolean) => string;
 *   inputBaseClass?: string;
 * }} props
 */
export default function ProfileAddressLookup({
  idPrefix,
  heading,
  address1,
  setAddress1,
  city,
  setCity,
  state,
  setState,
  postalCode,
  setPostalCode,
  country,
  setCountry,
  fieldClass,
  inputBaseClass,
}) {
  const { light } = useOverlayChrome();
  const [inputText, setInputText] = useState("");
  const [hasSelection, setHasSelection] = useState(false);

  const addressComplete = useMemo(
    () =>
      isUserAddressComplete({
        address1,
        city,
        state,
        postalCode,
        country,
      }),
    [address1, city, state, postalCode, country],
  );

  useEffect(() => {
    if (addressComplete) {
      setInputText(
        formatAddressAutocompleteLabel({
          address1,
          city,
          state,
          postalCode,
          country,
        }),
      );
      setHasSelection(true);
    }
  }, [address1, city, state, postalCode, country, addressComplete]);

  function updateCountry(value) {
    setCountry(value);
    setState("");
    setHasSelection(false);
    setInputText("");
    setAddress1("");
    setCity("");
    setPostalCode("");
  }

  function handleInputChange(next) {
    setInputText(next);
    setHasSelection(false);
    setAddress1(next);
    setCity("");
    setState("");
    setPostalCode("");
  }

  function handleSelectSuggestion(suggestion) {
    const label = applySuggestionToFields(suggestion, {
      country,
      state,
      setAddress1,
      setCity,
      setState,
      setPostalCode,
      setCountry,
    });
    setInputText(label);
    setHasSelection(true);
  }

  const searchQuery = hasSelection ? "" : inputText;

  return (
    <div>
      <h3 className={overlayChrome.formSectionHeading(light)}>{heading}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${light ? "text-stone-600" : "text-slate-400"}`}>
        Start typing your address and pick a match. The full street, city, state, and
        ZIP appear in this field once selected.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4">
        <div className="sm:max-w-md lg:max-w-none">
          <SelectListbox
            id={`${idPrefix}-country`}
            label="Country"
            placeholder="Select country"
            options={CHECKOUT_COUNTRY_OPTIONS}
            value={country}
            onChange={(v) => updateCountry(toCheckoutCountry(v))}
            buttonClassName={inputBaseClass || fieldClass(false)}
          />
        </div>

        <AddressLine1Autocomplete
          label="Find your address"
          value={inputText}
          onChange={handleInputChange}
          country={country}
          onSelectSuggestion={handleSelectSuggestion}
          inputClassName={fieldClass(false)}
          pauseSuggestions={hasSelection}
          required
        />
      </div>
    </div>
  );
}
