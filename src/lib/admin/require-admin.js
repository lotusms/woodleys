import { NextResponse } from "next/server";
import {
  getFirebaseAdminDb,
  verifyFirebaseIdToken,
} from "@/lib/firebase-admin-server";
import { USER_ACCOUNTS_COLLECTION } from "@/lib/user-accounts";

/**
 * @param {Request} request
 * @returns {Promise<{ uid: string } | Response>}
 */
export async function requireAdmin(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded;
  try {
    decoded = await verifyFirebaseIdToken(authHeader.slice(7));
  } catch (e) {
    console.error("[admin] verifyIdToken:", e);
    return NextResponse.json(
      { error: "Invalid or expired session" },
      { status: 401 },
    );
  }

  const uid = decoded.uid;
  if (!uid || typeof uid !== "string") {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  try {
    const db = getFirebaseAdminDb();
    const userSnap = await db
      .collection(USER_ACCOUNTS_COLLECTION)
      .doc(uid)
      .get();
    const ua = userSnap.data();
    const isAdmin = Boolean(ua?.admin) && ua?.guest !== true;

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Only shop administrators can perform this action." },
        { status: 403 },
      );
    }

    return { uid };
  } catch (e) {
    console.error("[admin] user lookup:", e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg || "Server error" }, { status: 500 });
  }
}
