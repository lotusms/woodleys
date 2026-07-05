"use client";

import Link from "next/link";
import { useMemo } from "react";
import DashboardFormSection from "@/components/dashboard/DashboardFormSection";
import { useAuth } from "@/context/AuthContext";
import {
  formatUserAddressBlock,
  formatUserPhoneDisplay,
} from "@/lib/user-account-address";
import * as dash from "@/lib/dashboardChrome";
import { EMPTY_VALUE_LABEL } from "@/lib/prose";

/**
 * @param {string | undefined} iso
 */
function formatWhen(iso) {
  if (!iso) return EMPTY_VALUE_LABEL;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return EMPTY_VALUE_LABEL;
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return EMPTY_VALUE_LABEL;
  }
}

/** @param {import("firebase/auth").User | null | undefined} user */
function signInMethodLabel(user) {
  const provider = user?.providerData?.[0]?.providerId;
  if (provider === "google.com") return "Google";
  if (provider === "password") return "Email & password";
  if (provider) return provider;
  return EMPTY_VALUE_LABEL;
}

/**
 * @param {boolean} light
 * @param {string} label
 * @param {import("react").ReactNode} value
 */
function DetailRow({ light, label, value }) {
  return (
    <div>
      <dt
        className={`text-xs font-medium uppercase tracking-wider ${
          light ? "text-stone-500" : "text-slate-500"
        }`}
      >
        {label}
      </dt>
      <dd
        className={`mt-1 text-sm whitespace-pre-line ${
          light ? "text-stone-800" : "text-stone-100"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * @param {{ light: boolean }} props
 */
export default function SettingsAccountOverview({ light }) {
  const { user, userAccount, accountLoading, isAdmin } = useAuth();

  const displayName = useMemo(() => {
    const first = userAccount.firstName?.trim();
    const last = userAccount.lastName?.trim();
    const combined = [first, last].filter(Boolean).join(" ");
    if (combined) return combined;
    return user?.displayName?.trim() || EMPTY_VALUE_LABEL;
  }, [userAccount.firstName, userAccount.lastName, user?.displayName]);

  const shippingText = useMemo(
    () => formatUserAddressBlock(userAccount.shippingAddress),
    [userAccount.shippingAddress],
  );

  const billingText = useMemo(() => {
    if (userAccount.billingSameAsShipping) {
      return "Same as shipping address";
    }
    return formatUserAddressBlock(userAccount.billingAddress);
  }, [userAccount.billingAddress, userAccount.billingSameAsShipping]);

  const phoneText = useMemo(
    () => formatUserPhoneDisplay(userAccount.phone),
    [userAccount.phone],
  );

  const roleLabel = isAdmin ? "Shop admin" : userAccount.guest ? "Guest" : "Member";
  const roleTone = isAdmin ? "gold" : userAccount.guest ? "muted" : "success";

  const roleClasses = {
    gold: light
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : "bg-amber-950/40 text-amber-100 ring-amber-800",
    success: light
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : "bg-emerald-950/40 text-emerald-100 ring-emerald-800",
    muted: light
      ? "bg-stone-100 text-stone-600 ring-stone-200"
      : "bg-slate-800 text-slate-300 ring-slate-700",
  };

  return (
    <DashboardFormSection light={light} title="Account overview">
      <p
        className={`mb-5 text-sm leading-relaxed ${
          light ? "text-stone-600" : "text-slate-400"
        }`}
      >
        Profile details from Firebase Auth and your{" "}
        <code className="rounded bg-black/5 px-1 py-0.5 text-xs">useraccounts</code>{" "}
        record, including addresses saved at registration.
      </p>

      {accountLoading ? (
        <p className={`text-sm ${light ? "text-stone-600" : "text-slate-400"}`}>
          Loading profile…
        </p>
      ) : (
        <dl className="space-y-4">
          <DetailRow light={light} label="Name" value={displayName} />
          <DetailRow light={light} label="Email" value={user?.email || EMPTY_VALUE_LABEL} />
          <DetailRow light={light} label="Phone" value={phoneText} />
          <div>
            <dt
              className={`text-xs font-medium uppercase tracking-wider ${
                light ? "text-stone-500" : "text-slate-500"
              }`}
            >
              Role
            </dt>
            <dd className="mt-1">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] ring-1 ${roleClasses[roleTone]}`}
              >
                {roleLabel}
              </span>
            </dd>
          </div>
          <DetailRow
            light={light}
            label="Shipping address"
            value={shippingText}
          />
          <DetailRow light={light} label="Billing address" value={billingText} />
          <DetailRow
            light={light}
            label="Sign-in method"
            value={signInMethodLabel(user)}
          />
          <DetailRow
            light={light}
            label="Email verified"
            value={user?.emailVerified ? "Yes" : "No"}
          />
          <DetailRow
            light={light}
            label="Last sign-in"
            value={formatWhen(user?.metadata?.lastSignInTime)}
          />
          <DetailRow
            light={light}
            label="User ID"
            value={
              user?.uid ? (
                <code className="break-all text-xs">{user.uid}</code>
              ) : (
                EMPTY_VALUE_LABEL
              )
            }
          />
        </dl>
      )}

      <div
        className={`mt-6 border-t pt-5 ${
          light ? "border-stone-300/50" : "border-slate-700/40"
        }`}
      >
        <Link
          href="/account"
          className={`text-sm font-semibold ${dash.ordersLinkAccent(light)}`}
        >
          View customer account →
        </Link>
      </div>
    </DashboardFormSection>
  );
}
