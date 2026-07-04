"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSampleOrderById } from "@/lib/orders-sample-data";

function GateMessage({ children }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6 text-center text-site-secondary">
      <p className="text-sm tracking-wide">{children}</p>
    </div>
  );
}

function useDemoAccountAccess() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const demoProfileId = searchParams.get("demo");

  if (pathname === "/account/orders" && demoProfileId) {
    return { allowed: true, demoProfileId };
  }

  const orderMatch = pathname.match(/^\/account\/orders\/([^/]+)$/);
  if (orderMatch) {
    const orderId = decodeURIComponent(orderMatch[1]);
    const sample = getSampleOrderById(orderId);
    if (sample?.demoProfileId) {
      return { allowed: true, demoProfileId: sample.demoProfileId };
    }
  }

  return { allowed: false, demoProfileId: null };
}

export default function AccountAuthGate({ children }) {
  const { user, loading, accountLoading, isAdmin, signingOut } = useAuth();
  const router = useRouter();
  const adminRedirectedRef = useRef(false);
  const { allowed: demoAccess } = useDemoAccountAccess();

  useEffect(() => {
    if (!user) {
      adminRedirectedRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (loading || accountLoading) return;
    if (!user && !signingOut && !demoAccess) {
      router.replace("/login?next=/account");
      return;
    }
    if (user && isAdmin && !demoAccess && !adminRedirectedRef.current) {
      adminRedirectedRef.current = true;
      router.replace("/");
    }
  }, [user, loading, accountLoading, isAdmin, signingOut, router, demoAccess]);

  if (loading) {
    return <GateMessage>Loading…</GateMessage>;
  }

  if (!user && signingOut) {
    return <GateMessage>Signing out…</GateMessage>;
  }

  if (!user && !demoAccess) {
    return <GateMessage>Redirecting to sign in…</GateMessage>;
  }

  if (accountLoading && user) {
    return <GateMessage>Loading your account…</GateMessage>;
  }

  if (user && isAdmin && !demoAccess) {
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
