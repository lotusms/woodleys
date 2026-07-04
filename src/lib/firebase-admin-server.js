import { initializeApp, getApps, cert, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { FIRESTORE_DATABASE_ID } from "@firebase/config";

let dbInstance = null;

/** True when a service account JSON or ADC path is configured. */
export function hasFirebaseAdminCredentials() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()) return true;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) return true;
  return false;
}

/**
 * Auth / credential failures where Firestore reads should fall back instead of failing the page.
 *
 * @param {unknown} error
 */
export function isFirebaseAdminAuthError(error) {
  const msg = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const code =
    error && typeof error === "object" && "code" in error
      ? String(/** @type {{ code?: unknown }} */ (error).code).toLowerCase()
      : "";

  return (
    code === "2" ||
    code === "unknown" ||
    code === "unauthenticated" ||
    msg.includes("unable to detect a project id") ||
    msg.includes("could not load the default credentials") ||
    msg.includes("firebase_service_account") ||
    msg.includes("invalid_grant") ||
    msg.includes("invalid_rapt") ||
    msg.includes("getting metadata from plugin failed") ||
    msg.includes("error fetching access token") ||
    msg.includes("invalid jwt signature") ||
    msg.includes("account not found")
  );
}

function resolveProjectId() {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    process.env.GCLOUD_PROJECT?.trim() ||
    process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
    undefined
  );
}

/**
 * Server-only Firebase Admin. Requires one of:
 * - `FIREBASE_SERVICE_ACCOUNT_JSON` — full JSON object string (Vercel / .env.local)
 * - Google Application Default Credentials (e.g. Cloud environment)
 * - Project id only — enough for ID token verification in local dev
 */
export function getFirebaseAdminApp() {
  if (getApps().length > 0) return getApps()[0];

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (raw) {
    const cred = JSON.parse(raw);
    return initializeApp({ credential: cert(cred) });
  }

  const projectId = resolveProjectId();

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) {
    return initializeApp({
      credential: applicationDefault(),
      ...(projectId ? { projectId } : {}),
    });
  }

  if (projectId) {
    return initializeApp({ projectId });
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS.",
  );
}

export function getFirebaseAdminDb() {
  if (dbInstance) return dbInstance;
  const app = getFirebaseAdminApp();
  dbInstance = getFirestore(app, FIRESTORE_DATABASE_ID);
  return dbInstance;
}

export async function verifyFirebaseIdToken(idToken) {
  const auth = getAuth(getFirebaseAdminApp());
  return auth.verifyIdToken(idToken);
}
