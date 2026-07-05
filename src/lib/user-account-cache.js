const STORAGE_KEY = "woodleys-user-account-cache";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * @typedef {{
 *   admin: boolean;
 *   guest: boolean;
 *   firstName: string;
 *   lastName: string;
 *   phone: string;
 *   shippingAddress: Record<string, unknown> | null;
 *   billingAddress: Record<string, unknown> | null;
 *   billingSameAsShipping: boolean;
 * }} CachedUserAccount
 */

/**
 * @param {string} uid
 * @returns {CachedUserAccount | null}
 */
export function readCachedUserAccount(uid) {
  if (typeof window === "undefined" || !uid) return null;

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.uid !== uid) return null;
    if (typeof parsed.cachedAt !== "number") return null;
    if (Date.now() - parsed.cachedAt > MAX_AGE_MS) return null;

    const account = parsed.account;
    if (!account || typeof account !== "object") return null;

    return {
      admin: Boolean(account.admin),
      guest: Boolean(account.guest),
      firstName: typeof account.firstName === "string" ? account.firstName : "",
      lastName: typeof account.lastName === "string" ? account.lastName : "",
      phone: typeof account.phone === "string" ? account.phone : "",
      shippingAddress:
        account.shippingAddress && typeof account.shippingAddress === "object"
          ? account.shippingAddress
          : null,
      billingAddress:
        account.billingAddress && typeof account.billingAddress === "object"
          ? account.billingAddress
          : null,
      billingSameAsShipping: account.billingSameAsShipping !== false,
    };
  } catch {
    return null;
  }
}

/**
 * @param {string} uid
 * @param {CachedUserAccount} account
 */
export function writeCachedUserAccount(uid, account) {
  if (typeof window === "undefined" || !uid) return;

  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        uid,
        cachedAt: Date.now(),
        account,
      }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function clearCachedUserAccount() {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * @param {Record<string, unknown>} data
 * @returns {CachedUserAccount}
 */
export function userAccountFromFirestoreData(data) {
  return {
    admin: Boolean(data.admin),
    guest: Boolean(data.guest),
    firstName: typeof data.firstName === "string" ? data.firstName : "",
    lastName: typeof data.lastName === "string" ? data.lastName : "",
    phone: typeof data.phone === "string" ? data.phone : "",
    shippingAddress:
      data.shippingAddress && typeof data.shippingAddress === "object"
        ? /** @type {Record<string, unknown>} */ (data.shippingAddress)
        : null,
    billingAddress:
      data.billingAddress && typeof data.billingAddress === "object"
        ? /** @type {Record<string, unknown>} */ (data.billingAddress)
        : null,
    billingSameAsShipping: data.billingSameAsShipping !== false,
  };
}
