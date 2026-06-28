"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthOrDivider from "@/components/auth/AuthOrDivider";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import PasswordField from "@/components/ui/PasswordField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { orgName, siteBelowHeaderMinHeightClass } from "@/config";
import { usePostAuthRedirect } from "@/hooks/usePostAuthRedirect";
import { formatAuthError } from "@/lib/auth-errors";
import { openAdminDashboardOrNavigate } from "@/lib/auth-routing";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import * as overlayChrome from "@/lib/overlayChrome";
import { isLightThemeId } from "@/theme";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className={`flex ${siteBelowHeaderMinHeightClass} items-center justify-center text-sm text-site-secondary`}>
          Loading…
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const searchParams = useSearchParams();
  const memberPath = searchParams.get("next") || "/account";
  const { user, loading, accountLoading, isAdmin, signIn, signInWithGoogle } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [authPending, setAuthPending] = useState(false);
  const clearAuthPending = useCallback(() => setAuthPending(false), []);

  usePostAuthRedirect(authPending, clearAuthPending, memberPath);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      setAuthPending(true);
    } catch (err) {
      setError(
        formatAuthError(err, "Sign-in failed. Check Email/Password in Firebase Console."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
      setAuthPending(true);
    } catch (err) {
      setError(formatAuthError(err));
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
        <p className="text-sm tracking-wide">Signing you in…</p>
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
    <main
      id="main-content"
      className={`flex ${siteBelowHeaderMinHeightClass} flex-col items-center justify-center px-6 py-16`}
    >
      <div className={overlayChrome.authCardPanel(light)}>
        <h1 className={overlayChrome.authTitle(light)}>Sign in</h1>
        <p className={overlayChrome.authSubtitle(light)}>
          Sign in with Google or use the email and password for your {orgName}{" "}
          member account.
        </p>

        {error ? (
          <p className={`mt-4 ${overlayChrome.authInlineError(light)}`} role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-8">
          <GoogleSignInButton
            light={light}
            busy={googleBusy}
            disabled={submitting}
            onClick={handleGoogleSignIn}
          />
        </div>

        <AuthOrDivider light={light} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label
              htmlFor="login-email"
              className={overlayChrome.authLabelUppercase(light)}
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={overlayChrome.authEmailInput(light)}
              placeholder="you@example.com"
            />
          </div>
          <PasswordField
            id="login-password"
            label="Password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            labelClassName={overlayChrome.authLabelUppercase(light)}
            inputClassName={overlayChrome.authPasswordInputOverride(light)}
          />

          <PrimaryButton
            type="submit"
            disabled={submitting || googleBusy}
            className="mt-2 w-full justify-center"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </PrimaryButton>
        </form>

        <div
          className={`mt-6 flex flex-col gap-3 text-center text-sm ${overlayChrome.authFooterMuted(light)}`}
        >
          <Link href="/forgot-password" className={overlayChrome.authLinkAccent(light)}>
            Forgot password?
          </Link>
          <p>
            New here?{" "}
            <Link href="/register" className={overlayChrome.authLinkAccent(light)}>
              Create an account
            </Link>
          </p>
        </div>

        <p
          className={`mt-8 text-center text-sm ${overlayChrome.authFooterMuted(light)}`}
        >
          <Link href="/" className={overlayChrome.authLinkAccent(light)}>
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}
