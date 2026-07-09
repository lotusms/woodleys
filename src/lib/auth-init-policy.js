/** Routes that should resolve Firebase auth before rendering gated UI. */
const AUTH_EAGER_PATH_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/dashboard",
  "/account",
  "/profile",
];

/** @param {string} pathname */
export function pathNeedsEagerAuth(pathname) {
  return AUTH_EAGER_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** @param {string} pathname */
export function authDeferTimeoutMs(pathname) {
  if (pathNeedsEagerAuth(pathname)) return 0;
  if (pathname === "/" || pathname === "") return 10000;
  return 6000;
}
