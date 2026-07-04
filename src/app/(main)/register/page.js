"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import AuthOrDivider from "@/components/auth/AuthOrDivider";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import RegisterAccountForm from "@/components/auth/RegisterAccountForm";
import { useAuth } from "@/context/AuthContext";
import { usePostAuthRedirect } from "@/hooks/usePostAuthRedirect";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import { siteBelowHeaderMinHeightClass } from "@/config";
import { openAdminDashboardOrNavigate } from "@/lib/auth-routing";
import { formatAuthError } from "@/lib/auth-errors";
import * as overlayChrome from "@/lib/overlayChrome";
import { isLightThemeId } from "@/theme";

export default function RegisterPage() {
  const router = useRouter();
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const { user, loading, accountLoading, isAdmin, signInWithGoogle } = useAuth();
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [authPending, setAuthPending] = useState(false);
  const clearAuthPending = useCallback(() => setAuthPending(false), []);

  usePostAuthRedirect(authPending, clearAuthPending);

  async function handleGoogleSignIn() {
    setGoogleError("");
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
      setAuthPending(true);
    } catch (err) {
      setGoogleError(formatAuthError(err));
    } finally {
      setGoogleBusy(false);
    }
  }

  const muted = overlayChrome.pageMutedText(light);

  if (loading) {
    return (
      <div className={`flex ${siteBelowHeaderMinHeightClass} items-center justify-center ${muted}`}>
        <p className="text-sm">Loading…</p>
      </div>
    );
  }

  if ((user && accountLoading) || authPending) {
    return (
      <div
        className={`flex ${siteBelowHeaderMinHeightClass} flex-col items-center justify-center gap-4 px-6 text-center ${muted}`}
      >
        <p className="text-sm tracking-wide">Setting up your account…</p>
      </div>
    );
  }

  if (user) {
    return (
      <div
        className={`flex ${siteBelowHeaderMinHeightClass} flex-col items-center justify-center gap-6 px-6 text-center ${muted}`}
      >
        <p className="text-sm tracking-wide">You are already signed in.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => openAdminDashboardOrNavigate(router)}
              className={overlayChrome.authLinkAccent(light)}
            >
              Open portal
            </button>
          ) : (
            <Link href="/account" className={overlayChrome.authLinkAccent(light)}>
              Go to My Account
            </Link>
          )}
          <Link href="/" className={overlayChrome.authLinkAccent(light)}>
            Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${siteBelowHeaderMinHeightClass} flex-col px-4 py-10 sm:px-6 sm:py-14`}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col pt-8">
        <header className="shrink-0 text-center sm:text-left">
          <h1 className={overlayChrome.registerHeroTitle(light)}>Create account</h1>
          <p className={overlayChrome.registerHeroBody(light)}>
            Create your member profile with name, contact details, shipping and
            billing addresses. Start typing an address to search. No need to
            fill every field by hand. You can update these anytime in My Account.
          </p>
          <p className={overlayChrome.registerHeroMeta(light)}>
            Already registered?{" "}
            <Link href="/login" className={overlayChrome.authLinkAccent(light)}>
              Sign in
            </Link>
          </p>
        </header>

        <div className="mx-auto mt-8 w-full max-w-md shrink-0">
          {googleError ? (
            <p className={overlayChrome.authInlineError(light)} role="alert">
              {googleError}
            </p>
          ) : null}
          <GoogleSignInButton
            light={light}
            busy={googleBusy}
            onClick={handleGoogleSignIn}
            className={googleError ? "mt-3" : ""}
          />
          <AuthOrDivider light={light} />
          <p className={`text-center text-sm ${overlayChrome.authFooterMuted(light)}`}>
            Or register with email below
          </p>
        </div>

        <div className={overlayChrome.registerFormShell(light)}>
          <RegisterAccountForm
            variant="page"
            onRegistered={() => setAuthPending(true)}
          />
        </div>
      </div>
    </div>
  );
}
