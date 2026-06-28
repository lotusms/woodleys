"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

function GateMessage({ children }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 text-center text-site-secondary">
      <p className="text-sm tracking-wide">{children}</p>
    </div>
  );
}

export default function AccountAuthGate({ children }) {
  const { user, loading, accountLoading, isAdmin, signingOut } = useAuth();
  const router = useRouter();
  const adminRedirectedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      adminRedirectedRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (loading || accountLoading) return;
    if (!user && !signingOut) {
      router.replace("/login?next=/account");
      return;
    }
    if (user && isAdmin && !adminRedirectedRef.current) {
      adminRedirectedRef.current = true;
      router.replace("/");
    }
  }, [user, loading, accountLoading, isAdmin, signingOut, router]);

  if (loading) {
    return <GateMessage>Loading…</GateMessage>;
  }

  if (!user && signingOut) {
    return <GateMessage>Signing out…</GateMessage>;
  }

  if (!user) {
    return <GateMessage>Redirecting to sign in…</GateMessage>;
  }

  if (accountLoading) {
    return <GateMessage>Loading your account…</GateMessage>;
  }

  if (isAdmin) {
    return (
      <GateMessage>
        The member account area is for customers.{" "}
        <Link href="/" className="text-warm-gold-dark underline underline-offset-4">
          Return to the site
        </Link>
        .
      </GateMessage>
    );
  }

  return children;
}
