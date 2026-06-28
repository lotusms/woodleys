"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  completePostAuthNavigation,
  redirectSignedInVisitor,
} from "@/lib/auth-routing";

/**
 * Redirects after sign-in/register or when a signed-in user visits an auth page.
 *
 * @param {boolean} pending — set true after a sign-in/register action completes
 * @param {() => void} [onComplete] — clears pending state after redirect is scheduled
 * @param {string} [memberPath] — member redirect target after sign-in
 */
export function usePostAuthRedirect(pending, onComplete, memberPath = "/account") {
  const router = useRouter();
  const { user, loading, accountLoading, isAdmin } = useAuth();
  const onCompleteRef = useRef(onComplete);
  const postAuthHandledRef = useRef(false);
  const visitorHandledRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!user) {
      postAuthHandledRef.current = false;
      visitorHandledRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (!pending || loading || accountLoading || !user) return;
    if (postAuthHandledRef.current) return;
    postAuthHandledRef.current = true;

    completePostAuthNavigation({ isAdmin, router, memberPath });

    const id = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, 0);
    return () => window.clearTimeout(id);
  }, [pending, loading, accountLoading, user, isAdmin, router, memberPath]);

  useEffect(() => {
    if (pending || loading || accountLoading || !user) return;
    if (visitorHandledRef.current) return;
    visitorHandledRef.current = true;
    redirectSignedInVisitor({ isAdmin, router });
  }, [pending, loading, accountLoading, user, isAdmin, router]);
}
