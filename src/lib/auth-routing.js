/**
 * Post-authentication navigation for admin vs member roles.
 * Admins open the dashboard in a new tab on sign-in; members stay in the main site UI.
 */

const ADMIN_PORTAL_AUTO_OPEN_KEY = "woodleys:admin-portal-auto-opened";

/** Clears the auto-open guard (call on sign-out). */
export function clearAdminPortalSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ADMIN_PORTAL_AUTO_OPEN_KEY);
}

/**
 * Opens the admin dashboard in a new browser tab.
 * @param {{ force?: boolean }} [opts] — pass force:true for explicit user clicks (menu, login link).
 */
export function openAdminDashboard({ force = false } = {}) {
  if (typeof window === "undefined") return;
  if (!force && sessionStorage.getItem(ADMIN_PORTAL_AUTO_OPEN_KEY)) return;
  if (!force) {
    sessionStorage.setItem(ADMIN_PORTAL_AUTO_OPEN_KEY, "1");
  }
  window.open("/dashboard", "_blank", "noopener,noreferrer");
}

/**
 * @param {{ isAdmin: boolean, router: import("next/navigation").AppRouterInstance, memberPath?: string }} opts
 */
export function completePostAuthNavigation({ isAdmin, router, memberPath = "/account" }) {
  if (isAdmin) {
    openAdminDashboard();
    router.replace("/");
    return;
  }
  const safe =
    memberPath.startsWith("/") &&
    !memberPath.startsWith("//") &&
    !memberPath.startsWith("/dashboard")
      ? memberPath
      : "/account";
  router.replace(safe);
}

/**
 * @param {{ isAdmin: boolean, router: import("next/navigation").AppRouterInstance }} opts
 */
export function redirectSignedInVisitor({ isAdmin, router }) {
  router.replace(isAdmin ? "/" : "/account");
}
