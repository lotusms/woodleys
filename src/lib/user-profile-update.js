/**
 * Client-side profile updates — Firebase Auth + Firestore `useraccounts`.
 */

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@firebase/client";
import { USER_ACCOUNTS_COLLECTION } from "@/lib/user-accounts";
import { digitsFromTelInput } from "@/lib/checkout-auth";

/**
 * @param {import("firebase/auth").User} user
 */
function usesPasswordProvider(user) {
  return user.providerData.some((p) => p.providerId === "password");
}

/**
 * @param {import("firebase/auth").User} user
 * @param {string} password
 */
async function reauthenticatePasswordUser(user, password) {
  if (!user.email) {
    throw new Error("Sign in again to continue.");
  }
  if (!password) {
    throw new Error("Enter your current password to confirm this change.");
  }
  await reauthenticateWithCredential(
    user,
    EmailAuthProvider.credential(user.email, password),
  );
}

/**
 * @param {{
 *   firstName: string;
 *   lastName: string;
 *   phone: string;
 *   email: string;
 *   currentPassword?: string;
 * }} input
 */
export async function updateUserPersonalInfo(input) {
  const auth = getFirebaseAuth();
  let user = auth.currentUser;
  if (!user) throw new Error("Sign in again to update your profile.");

  const firstName = String(input.firstName || "").trim();
  const lastName = String(input.lastName || "").trim();
  const phoneDigits = digitsFromTelInput(input.phone || "");
  const nextEmail = String(input.email || "").trim();
  const currentEmail = String(user.email || "").trim();
  const emailChanging =
    nextEmail.toLowerCase() !== currentEmail.toLowerCase();
  const passwordUser = usesPasswordProvider(user);

  if (emailChanging) {
    if (!passwordUser) {
      throw new Error(
        "Email is managed by your sign-in provider and cannot be changed here.",
      );
    }
    await reauthenticatePasswordUser(user, String(input.currentPassword || ""));
    await updateEmail(user, nextEmail);
    await user.reload();
    await user.getIdToken(true);
    user = auth.currentUser;
    if (!user) throw new Error("Sign in again to update your profile.");
  }

  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  const db = getFirebaseDb();
  await updateDoc(doc(db, USER_ACCOUNTS_COLLECTION, user.uid), {
    firstName,
    lastName,
    phone: phoneDigits,
    email: user.email || nextEmail,
    updatedAt: serverTimestamp(),
  });
}

/**
 * @param {Record<string, string>} shippingAddress
 */
export async function updateUserShippingAddress(shippingAddress) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in again to update your profile.");

  const db = getFirebaseDb();
  const ref = doc(db, USER_ACCOUNTS_COLLECTION, user.uid);
  const snap = await getDoc(ref);
  const existing = snap.data() || {};
  const billingSameAsShipping = existing.billingSameAsShipping !== false;

  /** @type {Record<string, unknown>} */
  const patch = {
    shippingAddress,
    updatedAt: serverTimestamp(),
  };
  if (billingSameAsShipping) {
    patch.billingAddress = shippingAddress;
  }

  await updateDoc(ref, patch);
}

/**
 * @param {{
 *   billingSameAsShipping: boolean;
 *   billingAddress: Record<string, string>;
 *   shippingAddress?: Record<string, string> | null;
 * }} input
 */
export async function updateUserBillingAddress(input) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Sign in again to update your profile.");

  const db = getFirebaseDb();
  const ref = doc(db, USER_ACCOUNTS_COLLECTION, user.uid);
  const snap = await getDoc(ref);
  const existing = snap.data() || {};
  const shippingAddress =
    input.shippingAddress ||
    (existing.shippingAddress && typeof existing.shippingAddress === "object"
      ? existing.shippingAddress
      : null);

  const sameBilling = input.billingSameAsShipping !== false;

  await updateDoc(ref, {
    billingSameAsShipping: sameBilling,
    billingAddress: sameBilling
      ? shippingAddress || input.billingAddress
      : input.billingAddress,
    updatedAt: serverTimestamp(),
  });
}
