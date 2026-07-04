"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { getFirebaseAuth } from "@firebase/client";
import RegistrationAddressSection, {
  normalizeStateCodeForPrintful,
  toCheckoutCountry,
} from "@/components/auth/RegistrationAddressSection";
import PasswordField from "@/components/ui/PasswordField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import { applySuggestionToFields } from "@/lib/apply-address-suggestion";
import { formatAuthError } from "@/lib/auth-errors";
import * as overlayChrome from "@/lib/overlayChrome";
import { validateAccountRegistration } from "@/lib/account-registration";
import {
  digitsFromTelInput,
  formatUsPhoneMask,
  registerUserWithProfile,
} from "@/lib/checkout-auth";
import { buildUserAddress } from "@/lib/user-account-address";

/**
 * @param {{
 *   variant: "page" | "drawer";
 *   onCancel?: () => void;
 *   onRegistered?: (patch: Record<string, string>) => void;
 * }} props
 */
export default function RegisterAccountForm({
  variant = "page",
  onCancel,
  onRegistered,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("US");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const { light } = useOverlayChrome();
  const INPUT_BASE = overlayChrome.checkoutInputBase(light);

  function fieldClass(invalid) {
    return `${INPUT_BASE} ${invalid ? "!border-rose-600 focus:!border-rose-600 focus:!ring-rose-600/35" : ""}`;
  }

  function handlePhoneChange(e) {
    const digits = digitsFromTelInput(e.target.value);
    setPhone(formatUsPhoneMask(digits));
  }

  function applyShippingSuggestion(suggestion) {
    applySuggestionToFields(suggestion, {
      country,
      state,
      setAddress1,
      setCity,
      setState,
      setPostalCode,
      setCountry,
    });
  }

  function applyBillingSuggestion(suggestion) {
    applySuggestionToFields(suggestion, {
      country: billingCountry,
      state: billingState,
      setAddress1: setBillingAddress1,
      setCity: setBillingCity,
      setState: setBillingState,
      setPostalCode: setBillingPostalCode,
      setCountry: setBillingCountry,
    });
  }

  function buildShippingAddress(fullName) {
    return buildUserAddress({
      fullName,
      address1,
      address2,
      city,
      state:
        country === "US" || country === "CA"
          ? normalizeStateCodeForPrintful(country, state)
          : state,
      postalCode,
      country,
    });
  }

  function buildBillingAddress(fullName) {
    return buildUserAddress({
      fullName,
      address1: billingAddress1,
      address2: billingAddress2,
      city: billingCity,
      state:
        billingCountry === "US" || billingCountry === "CA"
          ? normalizeStateCodeForPrintful(billingCountry, billingState)
          : billingState,
      postalCode: billingPostalCode,
      country: billingCountry,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validateAccountRegistration({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      address1,
      city,
      state,
      postalCode,
      country,
      billingSameAsShipping,
      billingAddress1,
      billingCity,
      billingState,
      billingPostalCode,
      billingCountry,
    });
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setBusy(true);
    try {
      const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
      const shippingAddress = buildShippingAddress(fullName);
      const billingAddress = billingSameAsShipping
        ? shippingAddress
        : buildBillingAddress(fullName);

      await registerUserWithProfile({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone,
        shippingAddress,
        billingSameAsShipping,
        billingAddress,
      });

      const auth = getFirebaseAuth();
      await auth.authStateReady();
      if (!auth.currentUser) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      const phoneDigits = digitsFromTelInput(phone);
      onRegistered?.({
        email: email.trim(),
        phone: phoneDigits ? formatUsPhoneMask(phoneDigits) : "",
        fullName,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      });
    } catch (err) {
      setError(formatAuthError(err, "Could not create account."));
    } finally {
      setBusy(false);
    }
  }

  const formBody = (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-0 xl:gap-x-14">
        <section className="min-w-0">
          <h3 className={overlayChrome.formSectionHeading(light)}>Account</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={`${overlayChrome.formFieldLabel(light)} sm:col-span-2`}>
              Email
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass(false)}
              />
            </label>
            <div className="min-w-0 sm:col-span-1">
              <PasswordField
                label="Password"
                name="new-password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                labelClassName={overlayChrome.formFieldLabel(light)}
                inputClassName={overlayChrome.checkoutPasswordInputClass(light)}
              />
            </div>
            <div className="min-w-0 sm:col-span-1">
              <PasswordField
                label="Confirm password"
                name="confirm-password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                labelClassName={overlayChrome.formFieldLabel(light)}
                inputClassName={overlayChrome.checkoutPasswordInputClass(light)}
              />
            </div>
            <label className={overlayChrome.formFieldLabel(light)}>
              First name
              <input
                type="text"
                autoComplete="given-name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={fieldClass(false)}
              />
            </label>
            <label className={overlayChrome.formFieldLabel(light)}>
              Last name
              <input
                type="text"
                autoComplete="family-name"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={fieldClass(false)}
              />
            </label>
            <label className={`${overlayChrome.formFieldLabel(light)} sm:col-span-2`}>
              Phone (optional)
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="(555) 123-4567"
                maxLength={14}
                value={phone}
                onChange={handlePhoneChange}
                className={fieldClass(false)}
              />
            </label>
          </div>
        </section>

        <section className={`min-w-0 ${overlayChrome.formSectionColumnBorder(light)}`}>
          <RegistrationAddressSection
            idPrefix="shipping"
            heading="Shipping address"
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            country={country}
            setCountry={setCountry}
            fieldClass={fieldClass}
            inputBaseClass={INPUT_BASE}
            onApplySuggestion={applyShippingSuggestion}
          />

          <label
            className={`mt-6 flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${
              light
                ? "border-stone-300/70 bg-white"
                : "border-slate-700/50 bg-slate-900/40"
            }`}
          >
            <input
              type="checkbox"
              checked={billingSameAsShipping}
              onChange={(e) => setBillingSameAsShipping(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500/30"
            />
            <span>
              <span
                className={`block text-sm font-medium ${light ? "text-stone-800" : "text-stone-100"}`}
              >
                Billing address is the same as shipping
              </span>
              <span
                className={`mt-1 block text-xs leading-relaxed ${light ? "text-stone-500" : "text-slate-400"}`}
              >
                Uncheck to enter a separate billing address for invoices and
                payment records.
              </span>
            </span>
          </label>

          {!billingSameAsShipping ? (
            <div
              className={`mt-6 border-t pt-6 ${
                light ? "border-stone-300/50" : "border-slate-700/40"
              }`}
            >
              <RegistrationAddressSection
                idPrefix="billing"
                heading="Billing address"
                address1={billingAddress1}
                setAddress1={setBillingAddress1}
                address2={billingAddress2}
                setAddress2={setBillingAddress2}
                city={billingCity}
                setCity={setBillingCity}
                state={billingState}
                setState={setBillingState}
                postalCode={billingPostalCode}
                setPostalCode={setBillingPostalCode}
                country={billingCountry}
                setCountry={setBillingCountry}
                fieldClass={fieldClass}
                inputBaseClass={INPUT_BASE}
                onApplySuggestion={applyBillingSuggestion}
              />
            </div>
          ) : null}
        </section>

        {error ? (
          <p className={`lg:col-span-2 ${overlayChrome.registerErrorText(light)}`} role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );

  const footer = (
    <div className={overlayChrome.registerFormFooter(light)}>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-4">
        {variant === "drawer" && onCancel ? (
          <SecondaryButton
            type="button"
            onClick={onCancel}
            className={`w-full justify-center py-3 sm:w-auto sm:px-6 sm:py-2.5 ${overlayChrome.secondaryButtonLightOutline(light)}`.trim()}
          >
            Cancel
          </SecondaryButton>
        ) : null}
        {variant === "page" ? (
          <SecondaryButton
            type="button"
            href="/login"
            className={`w-full justify-center py-3 sm:w-auto sm:px-6 sm:py-2.5 ${overlayChrome.secondaryButtonLightOutline(light)}`.trim()}
          >
            Back to sign in
          </SecondaryButton>
        ) : null}
        <PrimaryButton
          type="submit"
          disabled={busy}
          className="w-full min-w-[12rem] justify-center px-8 py-3.5 sm:w-auto"
        >
          {busy ? "Creating account…" : "Create account"}
        </PrimaryButton>
      </div>
    </div>
  );

  if (variant === "drawer") {
    return (
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        {formBody}
        {footer}
      </form>
    );
  }

  return (
    <form
      id="register-account-form"
      onSubmit={handleSubmit}
      className="flex min-h-0 flex-1 flex-col"
    >
      {formBody}
      {footer}
    </form>
  );
}
