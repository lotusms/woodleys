"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/context/AuthContext";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import * as dash from "@/lib/dashboardChrome";
import * as overlayChrome from "@/lib/overlayChrome";
import { isLightThemeId } from "@/theme";

function GateEscapeBar() {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  return (
    <div className={dash.authGateBar(light)}>
      <Link href="/" className={dash.authGateLink(light)}>
        Home
      </Link>
      <Link href="/login" className={dash.authGateMutedLink(light)}>
        Sign in
      </Link>
    </div>
  );
}

function GateMessage({ children }) {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const muted = overlayChrome.pageMutedText(light);

  return (
    <div className={`flex min-h-[40vh] items-center justify-center ${muted}`}>
      <p className="text-sm tracking-wide">{children}</p>
    </div>
  );
}

export default function DashboardAuthGate({ children }) {
  const { user, loading, accountLoading, isAdmin, userAccount, signingOut } = useAuth();
  const router = useRouter();
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const muted = overlayChrome.pageMutedText(light);
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      redirectedRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (loading || accountLoading) return;
    if (!user && !signingOut) {
      if (redirectedRef.current) return;
      redirectedRef.current = true;
      router.replace("/login");
      return;
    }
    if (user && userAccount.status === "ready" && !isAdmin) {
      if (redirectedRef.current) return;
      redirectedRef.current = true;
      router.replace("/account");
    }
  }, [user, loading, accountLoading, isAdmin, userAccount.status, signingOut, router]);

  if (loading) {
    return (
      <>
        <GateEscapeBar />
        <div className={`flex min-h-dvh items-center justify-center ${muted}`}>
          <p className="text-sm tracking-wide">Loading…</p>
        </div>
      </>
    );
  }

  if (!user && signingOut) {
    return (
      <>
        <GateEscapeBar />
        <div className={`flex min-h-dvh items-center justify-center ${muted}`}>
          <p className="text-sm tracking-wide">Signing out…</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <GateEscapeBar />
        <div className={`flex min-h-dvh items-center justify-center ${muted}`}>
          <p className="text-sm tracking-wide">Redirecting to sign in…</p>
        </div>
      </>
    );
  }

  return (
    <DashboardShell>
      {accountLoading ? (
        <GateMessage>Verifying access…</GateMessage>
      ) : userAccount.status === "ready" && !isAdmin ? (
        <GateMessage>Opening your account…</GateMessage>
      ) : (
        children
      )}
    </DashboardShell>
  );
}
