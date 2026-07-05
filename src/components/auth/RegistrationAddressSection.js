"use client";

import { useMemo, useState } from "react";
import AddressLine1Autocomplete from "@/components/checkout/AddressLine1Autocomplete";
import SelectListbox from "@/components/ui/SelectListbox";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import * as overlayChrome from "@/lib/overlayChrome";
import {
  CA_PROVINCE_SELECT_OPTIONS,
  normalizeStateCodeForPrintful,
  US_STATE_SELECT_OPTIONS,
} from "@/lib/address/state";
import { toCheckoutCountry } from "@/lib/checkout-auth";
import { CHECKOUT_COUNTRY_OPTIONS } from "@/lib/checkout-countries";
import { isUserAddressComplete } from "@/lib/user-account-address";

/**
 * Address block with autocomplete-first UX for registration / profile forms.
 *
 * @param {{
 *   idPrefix: string;
 *   heading: string;
 *   address1: string;
 *   setAddress1: (value: string) => void;
 *   address2: string;
 *   setAddress2: (value: string) => void;
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
 *   onApplySuggestion: (suggestion: Record<string, unknown>) => void;
 * }} props
 */
export default function RegistrationAddressSection({
  idPrefix,
  heading,
  address1,
  setAddress1,
  address2,
  setAddress2,
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
  onApplySuggestion,
}) {
  const { light } = useOverlayChrome();
  const [manualDetails, setManualDetails] = useState(false);

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

  const showDetailFields = manualDetails || addressComplete || Boolean(city || state || postalCode);

  function updateCountry(value) {
    setCountry(value);
    setState("");
  }

  return (
    <div>
      <h3 className={overlayChrome.formSectionHeading(light)}>{heading}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${light ? "text-stone-600" : "text-slate-400"}`}>
        Type your house number and street name. If you only know the number (like{" "}
        <span className="font-medium text-site-fg">123</span>), we still search
        common street matches, including St, Rd, Ave, and more.
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
          value={address1}
          onChange={setAddress1}
          country={country}
          onSelectSuggestion={onApplySuggestion}
          inputClassName={fieldClass(false)}
          required
        />

        <label className={overlayChrome.formFieldLabel(light)}>
          Apt, suite, or unit (optional)
          <input
            id={`${idPrefix}-address2`}
            type="text"
            autoComplete="address-line2"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            className={fieldClass(false)}
          />
        </label>

        {addressComplete && !manualDetails ? (
          <div
            className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
              light
                ? "border-stone-300/70 bg-stone-50 text-stone-700"
                : "border-slate-700/50 bg-slate-900/40 text-slate-300"
            }`}
          >
            <p className={`font-medium ${light ? "text-stone-900" : "text-stone-100"}`}>
              {address1}
            </p>
            {address2 ? <p>{address2}</p> : null}
            <p>
              {[city, state].filter(Boolean).join(", ")} {postalCode}
            </p>
            <button
              type="button"
              onClick={() => setManualDetails(true)}
              className={`mt-2 text-xs font-semibold ${overlayChrome.authLinkAccent(light)}`}
            >
              Edit city, state, or postal code
            </button>
          </div>
        ) : null}

        {showDetailFields ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <label className={overlayChrome.formFieldLabel(light)}>
              City
              <input
                id={`${idPrefix}-city`}
                type="text"
                autoComplete="address-level2"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={fieldClass(false)}
              />
            </label>
            <div className="min-w-0 xl:col-span-1">
              {country === "US" ? (
                <SelectListbox
                  id={`${idPrefix}-state`}
                  label="State"
                  placeholder="Select state"
                  options={US_STATE_SELECT_OPTIONS}
                  valueKey="code"
                  labelKey="label"
                  by="code"
                  value={state}
                  onChange={(code) => setState(code)}
                  buttonClassName={fieldClass(false)}
                />
              ) : country === "CA" ? (
                <SelectListbox
                  id={`${idPrefix}-province`}
                  label="Province"
                  placeholder="Select province"
                  options={CA_PROVINCE_SELECT_OPTIONS}
                  valueKey="code"
                  labelKey="label"
                  by="code"
                  value={state}
                  onChange={(code) => setState(code)}
                  buttonClassName={fieldClass(false)}
                />
              ) : (
                <label className={overlayChrome.formFieldLabel(light)}>
                  State / region
                  <input
                    id={`${idPrefix}-state`}
                    type="text"
                    autoComplete="address-level1"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={fieldClass(false)}
                  />
                </label>
              )}
            </div>
            <label
              className={`${overlayChrome.formFieldLabel(light)} sm:col-span-2 xl:col-span-1`}
            >
              {country === "US" ? "ZIP code" : "Postal code"}
              <input
                id={`${idPrefix}-postal`}
                type="text"
                autoComplete="postal-code"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={fieldClass(false)}
              />
            </label>
          </div>
        ) : (
          <p className={`text-xs ${light ? "text-stone-500" : "text-slate-500"}`}>
            City, state, and postal code appear after you select an address, or{" "}
            <button
              type="button"
              onClick={() => setManualDetails(true)}
              className={`font-semibold ${overlayChrome.authLinkAccent(light)}`}
            >
              enter them manually
            </button>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export { normalizeStateCodeForPrintful, toCheckoutCountry };
