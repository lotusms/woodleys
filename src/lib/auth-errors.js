/**
 * @param {unknown} err
 * @param {string} [fallback]
 */
export function formatAuthError(err, fallback = "Could not sign in.") {
  const code =
    err && typeof err === "object" && "code" in err ? String(err.code) : "";

  if (
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request"
  ) {
    return "Sign-in was cancelled.";
  }
  if (code === "auth/popup-blocked") {
    return "Pop-up was blocked. Allow pop-ups for this site and try again.";
  }
  if (code === "auth/account-exists-with-different-credential") {
    return "An account already exists with this email using a different sign-in method.";
  }
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "Email or password is incorrect.";
  }
  if (code === "auth/user-not-found") {
    return "No account found for that email.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Try again shortly.";
  }
  if (code === "auth/email-already-in-use") {
    return "That email is already registered. Try signing in instead.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Use at least 6 characters.";
  }

  if (err instanceof Error && err.message) return err.message;
  return fallback;
}
