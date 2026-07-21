/**
 * Catalog filter URL helpers — same-page filters update via replaceState
 * instead of a full Next.js navigation.
 */

/** @param {string} href */
export function parseCatalogFilterHref(href) {
  const url = new URL(href, "http://catalog.local");
  return {
    pathname: url.pathname.replace(/\/$/, "") || "/",
    metal: url.searchParams.get("metal"),
    shape: url.searchParams.get("shape"),
  };
}

/**
 * True when href targets the current pathname (filter applied in place).
 * @param {string} href
 * @param {string} currentPathname
 */
export function isSamePageCatalogFilter(href, currentPathname) {
  const { pathname } = parseCatalogFilterHref(href);
  const current = currentPathname.replace(/\/$/, "") || "/";
  return pathname === current;
}

/**
 * @param {string} pathname
 * @param {{ metal?: string | null; shape?: string | null }} filters
 */
export function buildCatalogFilterUrl(pathname, filters = {}) {
  const path = pathname.replace(/\/$/, "") || "/";
  const params = new URLSearchParams();
  if (filters.metal) params.set("metal", filters.metal);
  if (filters.shape) params.set("shape", filters.shape);
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/**
 * @param {string} pathname
 * @param {{ metal?: string | null; shape?: string | null }} filters
 */
export function replaceCatalogFilterUrl(pathname, filters) {
  if (typeof window === "undefined") return;
  const url = buildCatalogFilterUrl(pathname, filters);
  window.history.replaceState(window.history.state, "", url);
}

export const CATALOG_FILTER_EVENT = "catalog-filter-change";

/**
 * @param {{ metal?: string | null; shape?: string | null }} filters
 */
export function dispatchCatalogFilterChange(filters) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CATALOG_FILTER_EVENT, { detail: filters }),
  );
}

/**
 * @param {string | null | undefined} pathname
 */
export function readCatalogFiltersFromLocation(pathname) {
  if (typeof window === "undefined") {
    return { metal: null, shape: null };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    metal: params.get("metal"),
    shape: params.get("shape"),
  };
}
