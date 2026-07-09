/**
 * Confirms Firebase Admin can reach Firestore (main database).
 *
 *   pnpm verify:firebase-admin
 */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const DB = process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID?.trim() || "main";

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

  console.error(
    "Firebase Admin is not configured.\n\nRun:\n  pnpm setup:firebase-admin <path-to-json>\n",
  );
  process.exit(1);
}

try {
  initAdmin();
  const db = getFirestore(getApps()[0], DB);
  const snap = await db.collection("products").limit(1).get();

  console.log("Firebase Admin OK.");
  console.log(`  Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "(from key)"}`);
  console.log(`  Database: ${DB}`);
  console.log(`  products collection readable (${snap.size} doc sampled)`);
} catch (error) {
  console.error("Firebase Admin check failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
