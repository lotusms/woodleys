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
import { pathNeedsEagerAuth } from "@/lib/auth-init-policy";
import { deferUntilIdle } from "@/lib/defer-until-idle";
import { clearAdminPortalSession } from "@/lib/auth-routing";
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
  const eagerAuth = pathNeedsEagerAuth(pathname);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(eagerAuth);
  /** True while intentionally signing out — auth gates skip /login so home can load. */
  const [signingOut, setSigningOut] = useState(false);
  /** @type {[UserAccountState, import('react').Dispatch<import('react').SetStateAction<UserAccountState>>]} */
  const [userAccount, setUserAccount] = useState(idleAccount);

  useEffect(() => {
    let cancelled = false;
    let unsub = () => {};

    const startAuth = async () => {
      if (cancelled) return;

      try {
        const [{ onAuthStateChanged }, { getFirebaseAuth }] = await Promise.all([
          import("firebase/auth"),
          import("@firebase/client"),
        ]);
        if (cancelled) return;

        const auth = getFirebaseAuth();
        unsub = onAuthStateChanged(auth, (u) => {
          if (cancelled) return;
          setUser(u);
          setLoading(false);
          if (u) {
            deferUntilIdle(() => {
              if (!cancelled) {
                void import("@/lib/ensure-user-account").then((mod) =>
                  mod.ensureUserAccountDocIfMissing(),
                );
              }
            }, { timeout: 5000 });
          }
        });
      } catch (e) {
        console.error("[auth]", e);
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    if (eagerAuth) {
      void startAuth();
      return () => {
        cancelled = true;
        unsub();
      };
    }

    const cancelDefer = deferUntilIdle(() => {
      void startAuth();
    }, { timeout: 3500 });
    return () => {
      cancelled = true;
      cancelDefer();
      unsub();
    };
  }, [eagerAuth]);

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

    let cancelled = false;
    let unsub = () => {};

    const attachListener = async () => {
      const [{ doc, onSnapshot }, { getFirebaseDb }] = await Promise.all([
        import("firebase/firestore"),
        import("@firebase/client"),
      ]);
      if (cancelled) return;

      const db = getFirebaseDb();
      const ref = doc(db, USER_ACCOUNTS_COLLECTION, user.uid);

      unsub = onSnapshot(
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
    };

    if (cached && !eagerAuth) {
      const cancelDefer = deferUntilIdle(() => {
        void attachListener();
      }, { timeout: 5000 });

      return () => {
        cancelled = true;
        cancelDefer();
        unsub();
      };
    }

    void attachListener();
    return () => {
      cancelled = true;
      unsub();
    };
  }, [user, eagerAuth]);

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
    const [{ signInWithEmailAndPassword }, { getFirebaseAuth }] = await Promise.all([
      import("firebase/auth"),
      import("@firebase/client"),
    ]);
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { signInWithGoogle: googleSignIn } = await import("@/lib/google-auth");
    await googleSignIn();
  }, []);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    clearAdminPortalSession();
    clearCachedUserAccount();
    try {
      const [{ signOut: firebaseSignOut }, { getFirebaseAuth }] = await Promise.all([
        import("firebase/auth"),
        import("@firebase/client"),
      ]);
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
