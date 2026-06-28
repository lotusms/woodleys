/**
 * Grants or revokes admin access for a user by email.
 *
 * Admin roles can only be assigned with the Firebase Admin SDK (this script or
 * the Firebase Console). The app never allows self-promotion.
 *
 *   pnpm set:admin lotusms@outlook.com
 *   pnpm set:admin --revoke lotusms@outlook.com
 *
 * Requires GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON.
 */
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const DB = process.env.FIRESTORE_DATABASE_ID?.trim() || "main";
const COLLECTION = "useraccounts";

function initAdmin() {
  if (getApps().length) return;
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    initializeApp({ credential: cert(JSON.parse(json)) });
    return;
  }
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) {
    initializeApp();
    return;
  }
  throw new Error(
    "Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON in .env.local",
  );
}

function parseArgs(argv) {
  const revoke = argv.includes("--revoke");
  const email = argv.find((a) => a.includes("@"));
  if (!email) {
    throw new Error("Usage: pnpm set:admin -- [--revoke] user@example.com");
  }
  return { email: email.trim().toLowerCase(), revoke };
}

async function main() {
  const { email, revoke } = parseArgs(process.argv.slice(2));
  initAdmin();

  const auth = getAuth();
  const db = getFirestore(getApp(), DB);

  const user = await auth.getUserByEmail(email);
  const ref = db.collection(COLLECTION).doc(user.uid);
  const snap = await ref.get();

  if (!snap.exists) {
    const parts = String(user.displayName || "").trim().split(/\s+/);
    await ref.set({
      uid: user.uid,
      email: user.email || email,
      firstName: parts[0] || "",
      lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
      admin: !revoke,
      guest: false,
      orderHistory: [],
      orderDetails: {},
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(
      `Created useraccounts/${user.uid} with admin=${!revoke} for ${email}`,
    );
    return;
  }

  await ref.update({
    admin: !revoke,
    guest: false,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log(
    `Updated useraccounts/${user.uid}: admin=${!revoke} for ${email}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
