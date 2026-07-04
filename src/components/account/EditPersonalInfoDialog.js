"use client";

import { useEffect, useMemo, useState } from "react";
import PasswordField from "@/components/ui/PasswordField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import ProfileEditDialog from "@/components/account/ProfileEditDialog";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import { validateProfilePersonalInfo } from "@/lib/account-profile-validation";
import {
  digitsFromTelInput,
  formatUsPhoneMask,
} from "@/lib/checkout-auth";
import { updateUserPersonalInfo } from "@/lib/user-profile-update";
import * as overlayChrome from "@/lib/overlayChrome";

/**
 * @param {{
 *   open: boolean;
 *   onClose: () => void;
 *   profile: {
 *     firstName?: string;
 *     lastName?: string;
 *     email?: string;
 *     phone?: string;
 *   };
 *   emailEditable?: boolean;
 * }} props
 */
export default function EditPersonalInfoDialog({
  open,
  onClose,
  profile,
  emailEditable = true,
}) {
  const { light } = useOverlayChrome();
  const inputClass = overlayChrome.checkoutInputBase(light);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFirstName(String(profile.firstName || ""));
    setLastName(String(profile.lastName || ""));
    setEmail(String(profile.email || ""));
    setPhone(
      profile.phone ? formatUsPhoneMask(digitsFromTelInput(profile.phone)) : "",
    );
    setCurrentPassword("");
    setError("");
  }, [open, profile]);

  const emailChanging = useMemo(() => {
    return (
      email.trim().toLowerCase() !== String(profile.email || "").trim().toLowerCase()
    );
  }, [email, profile.email]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const validationError = validateProfilePersonalInfo({
      firstName,
      lastName,
      email,
      phone,
      emailChanging: emailChanging && emailEditable,
      requiresPassword: emailEditable,
      currentPassword,
    });
    if (validationError) {
      setError(validationError);
      return;
    }

    setBusy(true);
    try {
      await updateUserPersonalInfo({
        firstName,
        lastName,
        phone,
        email,
        currentPassword: emailChanging ? currentPassword : undefined,
      });
      onClose();
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? err.code : "";
      if (code === "auth/email-already-in-use") {
        setError("That email is already in use on another account.");
      } else if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Current password is incorrect.");
      } else if (code === "auth/requires-recent-login") {
        setError("For security, sign out and sign in again, then retry.");
      } else {
        setError(err instanceof Error ? err.message : "Could not update profile.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <ProfileEditDialog open={open} onClose={onClose} title="Edit personal information">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <p className={overlayChrome.authInlineError(light)} role="alert">
            {error}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-first-name" className={overlayChrome.formFieldLabel(light)}>
              First name
            </label>
            <input
              id="profile-first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClass}
              autoComplete="given-name"
              required
            />
          </div>
          <div>
            <label htmlFor="profile-last-name" className={overlayChrome.formFieldLabel(light)}>
              Last name
            </label>
            <input
              id="profile-last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClass}
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="profile-email" className={overlayChrome.formFieldLabel(light)}>
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
            disabled={!emailEditable}
            required
          />
          {!emailEditable ? (
            <p className={`mt-2 text-xs ${overlayChrome.pageMutedText(light)}`}>
              Email is managed by your Google sign-in and cannot be changed here.
            </p>
          ) : emailChanging ? (
            <p className={`mt-2 text-xs ${overlayChrome.pageMutedText(light)}`}>
              Changing your email updates Firebase Auth so you can sign in with the
              new address.
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="profile-phone" className={overlayChrome.formFieldLabel(light)}>
            Phone
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(formatUsPhoneMask(digitsFromTelInput(e.target.value)))
            }
            className={inputClass}
            autoComplete="tel"
          />
        </div>

        {emailChanging && emailEditable ? (
          <PasswordField
            id="profile-current-password"
            label="Current password"
            name="current-password"
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            labelClassName={overlayChrome.formFieldLabel(light)}
            inputClassName={overlayChrome.authPasswordInputOverride(light)}
          />
        ) : null}

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <SecondaryButton type="button" onClick={onClose} disabled={busy}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={busy} className="px-8">
            {busy ? "Saving…" : "Save changes"}
          </PrimaryButton>
        </div>
      </form>
    </ProfileEditDialog>
  );
}
