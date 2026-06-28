/**
 * Seeds useraccounts/{uid} with admin: true using Firebase CLI credentials.
 * Run after `firebase login` (same auth as `firebase deploy`).
 *
 *   node scripts/seed-admin-firestore.mjs lotusms@outlook.com
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const firebaseAuth = require("firebase-tools/lib/auth");
const scopes = require("firebase-tools/lib/scopes");

const PROJECT_ID = "woodleys-3c319";
const DB = process.env.FIRESTORE_DATABASE_ID?.trim() || "main";
const COLLECTION = "useraccounts";

function parseEmail(argv) {
  const email = argv.find((a) => a.includes("@"));
  if (!email) {
    throw new Error("Usage: node scripts/seed-admin-firestore.mjs user@example.com");
  }
  return email.trim().toLowerCase();
}

function firestoreValue(v) {
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (Array.isArray(v)) {
    return { arrayValue: { values: v.map(firestoreValue) } };
  }
  if (v && typeof v === "object") {
    const fields = {};
    for (const [k, val] of Object.entries(v)) {
      fields[k] = firestoreValue(val);
    }
    return { mapValue: { fields } };
  }
  throw new Error(`Unsupported value type: ${typeof v}`);
}

async function getAccessToken() {
  const account = firebaseAuth.getGlobalDefaultAccount();
  if (!account?.tokens?.refresh_token) {
    throw new Error("Not logged in. Run: firebase login");
  }
  const token = await firebaseAuth.getAccessToken(account.tokens.refresh_token, [
    scopes.CLOUD_PLATFORM,
    scopes.FIREBASE_PLATFORM,
  ]);
  return typeof token === "string" ? token : token?.access_token;
}

async function listAuthUserByEmail(email) {
  const token = await getAccessToken();
  const url = `https://identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: [email] }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Auth lookup failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  const user = data.users?.[0];
  if (!user?.localId) {
    throw new Error(`No Firebase Auth user found for ${email}`);
  }
  return user;
}

async function upsertUserAccountDoc(uid, email, displayName) {
  const token = await getAccessToken();
  const parts = String(displayName || "").trim().split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

  const fields = {
    uid: firestoreValue(uid),
    email: firestoreValue(email),
    firstName: firestoreValue(firstName),
    lastName: firestoreValue(lastName),
    admin: firestoreValue(true),
    guest: firestoreValue(false),
    orderHistory: firestoreValue([]),
    orderDetails: firestoreValue({}),
  };

  const docName = `projects/${PROJECT_ID}/databases/${DB}/documents/${COLLECTION}/${uid}`;
  const patchUrl = `https://firestore.googleapis.com/v1/${docName}?updateMask.fieldPaths=uid&updateMask.fieldPaths=email&updateMask.fieldPaths=firstName&updateMask.fieldPaths=lastName&updateMask.fieldPaths=admin&updateMask.fieldPaths=guest&updateMask.fieldPaths=orderHistory&updateMask.fieldPaths=orderDetails`;

  const patchRes = await fetch(patchUrl, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (patchRes.ok) {
    console.log(`Updated ${COLLECTION}/${uid} (admin: true)`);
    return;
  }

  if (patchRes.status !== 404) {
    const text = await patchRes.text();
    throw new Error(`Firestore patch failed (${patchRes.status}): ${text}`);
  }

  const createUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DB}/documents/${COLLECTION}?documentId=${uid}`;
  const createRes = await fetch(createUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!createRes.ok) {
    const text = await createRes.text();
    throw new Error(`Firestore create failed (${createRes.status}): ${text}`);
  }

  console.log(`Created ${COLLECTION}/${uid} (admin: true)`);
}

async function main() {
  const email = parseEmail(process.argv.slice(2));
  const uidArg = process.argv.slice(2).find((a) => !a.includes("@") && a.length > 10);

  let uid = uidArg;
  let displayName = "";

  if (!uid) {
    try {
      const authUser = await listAuthUserByEmail(email);
      uid = authUser.localId;
      displayName = authUser.displayName || "";
    } catch {
      const exported = await lookupUidFromAuthExport(email);
      uid = exported.uid;
      displayName = exported.displayName || "";
    }
  }

  if (!uid) {
    throw new Error(`Could not resolve Auth uid for ${email}`);
  }

  await upsertUserAccountDoc(uid, email, displayName);
  console.log(`Done. Admin user ready: ${email} (${uid})`);
}

async function lookupUidFromAuthExport(email) {
  const { execSync } = await import("node:child_process");
  const { mkdtempSync, readFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");

  const dir = mkdtempSync(join(tmpdir(), "fb-auth-"));
  const file = join(dir, "users.json");
  try {
    execSync(`firebase auth:export "${file}" --project ${PROJECT_ID}`, {
      stdio: "pipe",
    });
    const data = JSON.parse(readFileSync(file, "utf8"));
    const user = data.users?.find(
      (u) => String(u.email || "").toLowerCase() === email,
    );
    if (!user?.localId) {
      throw new Error(`No Firebase Auth user found for ${email}`);
    }
    return { uid: user.localId, displayName: user.displayName || "" };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
