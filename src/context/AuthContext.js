"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@firebase/client";
import { signInWithGoogle as googleSignIn } from "@/lib/google-auth";
import { clearAdminPortalSession } from "@/lib/auth-routing";
import { ensureUserAccountDocIfMissing } from "@/lib/ensure-user-account";
import {
  clearCachedUserAccount,
  readCachedUserAccount,
  userAccountFromFirestoreData,
  writeCachedUserAccount,
} from "@/lib/user-account-cache";
import { USER_ACCOUNTS_COLLECTION } from "@/lib/user-accounts";

const AuthContext = createContext(null);

/** @typedef {{ uid?: string, status: 'idle' | 'loading' | 'ready', admin: boolean, guest: boolean, firstName: string, lastName: string, phone: string, shippingAddress: Record<string, unknown> | null, billingAddress: Record<string, unknown> | null, billingSameAsShipping: boolean }} UserAccountState */

const idleAccount = /** @type {UserAccountState} */ ({
  status: "idle",
  admin: false,
  guest: false,
  firstName: "",
  lastName: "",
  phone: "",
  shippingAddress: null,
  billingAddress: null,
  billingSameAsShipping: true,
});

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  /** True while intentionally signing out — auth gates skip /login so home can load. */
  const [signingOut, setSigningOut] = useState(false);
  /** @type {[UserAccountState, import('react').Dispatch<import('react').SetStateAction<UserAccountState>>]} */
  const [userAccount, setUserAccount] = useState(idleAccount);

  useEffect(() => {
    let cancelled = false;
    let unsub = () => {};

    try {
      const auth = getFirebaseAuth();
      unsub = onAuthStateChanged(auth, (u) => {
        if (cancelled) return;
        setUser(u);
        setLoading(false);
        if (u) {
          void ensureUserAccountDocIfMissing();
        }
      });
    } catch (e) {
      console.error("[auth]", e);
      if (!cancelled) {
        setUser(null);
        setLoading(false);
      }
    }

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  /* Firestore listener: set loading before first snapshot; snapshot/error callbacks update state. */
  useEffect(() => {
    if (!user) {
      setUserAccount(idleAccount);
      return;
    }

    const cached = readCachedUserAccount(user.uid);
    const emptyAccount = {
      admin: false,
      guest: false,
      firstName: "",
      lastName: "",
      phone: "",
      shippingAddress: null,
      billingAddress: null,
      billingSameAsShipping: true,
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrap listener + loading UI before first snapshot
    setUserAccount({
      uid: user.uid,
      status: cached ? "ready" : "loading",
      ...(cached ?? emptyAccount),
    });

    const db = getFirebaseDb();
    const ref = doc(db, USER_ACCOUNTS_COLLECTION, user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          const account = { ...emptyAccount };
          writeCachedUserAccount(user.uid, account);
          setUserAccount({
            uid: user.uid,
            status: "ready",
            ...account,
          });
          return;
        }
        const account = userAccountFromFirestoreData(snap.data());
        writeCachedUserAccount(user.uid, account);
        setUserAccount({
          uid: user.uid,
          status: "ready",
          ...account,
        });
      },
      (err) => {
        console.error("[auth] userAccount", err);
        setUserAccount({
          uid: user.uid,
          status: "ready",
          ...emptyAccount,
        });
      },
    );

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (pathname === "/" || pathname === "") {
      setSigningOut(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (user) {
      setSigningOut(false);
    }
  }, [user]);

  const signIn = useCallback(async (email, password) => {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await googleSignIn();
  }, []);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    clearAdminPortalSession();
    clearCachedUserAccount();
    try {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
      router.replace("/");
    } catch (e) {
      setSigningOut(false);
      throw e;
    }
  }, [router]);

  const resolvedAccount = user ? userAccount : idleAccount;
  const accountBelongsToUser =
    !user || resolvedAccount.uid === user.uid || resolvedAccount.status === "idle";
  const accountLoading = Boolean(
    user &&
      (!accountBelongsToUser ||
        resolvedAccount.status === "loading" ||
        resolvedAccount.status === "idle"),
  );
  const isAdmin =
    accountBelongsToUser &&
    resolvedAccount.status === "ready" &&
    resolvedAccount.admin === true &&
    resolvedAccount.guest !== true;

  const value = useMemo(
    () => ({
      user,
      loading,
      signingOut,
      signIn,
      signInWithGoogle,
      signOut,
      userAccount: resolvedAccount,
      accountLoading,
      isAdmin,
    }),
    [
      user,
      loading,
      signingOut,
      signIn,
      signInWithGoogle,
      signOut,
      resolvedAccount,
      accountLoading,
      isAdmin,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
