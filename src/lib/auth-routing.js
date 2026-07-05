/**
 * Post-authentication navigation for admin vs member roles.
 * Admins open the dashboard in a new tab on sign-in; members stay in the main site UI.
 */

import { clearCachedUserAccount } from "@/lib/user-account-cache";

/** Named target so repeat opens focus the same tab instead of spawning new ones. */
const ADMIN_PORTAL_WINDOW_NAME = "woodleys-admin-portal";

/** @type {Window | null} */
let adminPortalWindow = null;

/** Resets the cached portal window reference (call on sign-out). */
export function clearAdminPortalSession() {
  adminPortalWindow = null;
  clearCachedUserAccount();
}

/**
 * Opens the admin dashboard in a new tab, or focuses and navigates an existing portal tab.
 * @returns {boolean} true when a separate tab/window was opened or reused
 */
export function openAdminDashboard() {
  if (typeof window === "undefined") return false;

  const opened = window.open("/dashboard", ADMIN_PORTAL_WINDOW_NAME);

  if (opened) {
    adminPortalWindow = opened;
    opened.focus();
    return true;
  }

  return false;
}

/**
 * @param {{ isAdmin: boolean, router: import("next/navigation").AppRouterInstance, memberPath?: string }} opts
 */
export function completePostAuthNavigation({ isAdmin, router, memberPath = "/account" }) {
  if (isAdmin) {
    const openedInNewTab = openAdminDashboard();
    router.replace(openedInNewTab ? "/" : "/dashboard");
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

/**
 * Opens the portal in a new tab when possible; otherwise navigates the current tab.
 * @param {import("next/navigation").AppRouterInstance} router
 */
export function openAdminDashboardOrNavigate(router) {
  if (openAdminDashboard()) return;
  router.push("/dashboard");
}
