/**
 * Ensures `useraccounts/{uid}` exists for the signed-in user (Firestore client write).
 */
export async function ensureUserAccountDocIfMissing() {
  try {
    const [
      { doc, getDoc, serverTimestamp, setDoc },
      { getFirebaseAuth },
      { getFirebaseDb },
    ] = await Promise.all([
      import("firebase/firestore"),
      import("@firebase/auth-client"),
      import("@firebase/db-client"),
    ]);

    const auth = getFirebaseAuth();
    const u = auth.currentUser;
    if (!u) return;

    const db = getFirebaseDb();
    const ref = doc(db, "useraccounts", u.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return;

    const parts = (u.displayName || "").trim().split(/\s+/);
    const firstName = parts[0] || "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

    await setDoc(ref, {
      uid: u.uid,
      email: u.email || "",
      firstName,
      lastName,
      admin: false,
      guest: false,
      orderHistory: [],
      orderDetails: {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("[ensureUserAccountDoc]", e);
  }
}
