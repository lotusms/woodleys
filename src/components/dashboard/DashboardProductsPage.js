"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RiAddLine, RiSearchLine, RiStarFill, RiStarLine } from "react-icons/ri";
import { deleteAdminProduct, updateAdminProduct } from "@/lib/admin/products-client";
import { listAllCatalogCollectionOptions, getCatalogCollectionMeta } from "@/lib/catalog/collections-meta";
import { useAuth } from "@/context/AuthContext";
import { useDashboardProducts } from "@/context/DashboardProductsContext";
import DashboardDeleteProductDialog from "@/components/dashboard/DashboardDeleteProductDialog";
import DashboardProductsCategoryNav from "@/components/dashboard/DashboardProductsCategoryNav";
import SearchableSelectListbox from "@/components/ui/SearchableSelectListbox";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import {
  PRODUCTS_CATEGORY_NAV,
  PRODUCTS_FILTER_ALL,
  PRODUCTS_SORT_OPTIONS,
  PRODUCTS_SORT_TITLE_ASC,
  filterDashboardProducts,
  normalizeProductsSort,
  sortDashboardProducts,
} from "@/lib/dashboard-products-filter";
import * as dash from "@/lib/dashboardChrome";
import { isLightThemeId } from "@/theme";

const PRODUCTS_PER_PAGE_OPTIONS = [
  { value: "10", label: "10 per page" },
  { value: "25", label: "25 per page" },
  { value: "50", label: "50 per page" },
  { value: "100", label: "100 per page" },
];
const DEFAULT_PRODUCTS_PER_PAGE = 25;

/**
 * @param {unknown} raw
 * @returns {number}
 */
function normalizeProductsPerPage(raw) {
  const n = Number(raw);
  if (PRODUCTS_PER_PAGE_OPTIONS.some((opt) => Number(opt.value) === n)) return n;
  return DEFAULT_PRODUCTS_PER_PAGE;
}

const collectionTitleByHandle = Object.fromEntries(
  listAllCatalogCollectionOptions().map((c) => [c.shopifyHandle, c.title]),
);

/** @param {string} handle */
function collectionLabel(handle) {
  return collectionTitleByHandle[handle] ?? getCatalogCollectionMeta(handle).title ?? handle;
}

/**
 * @param {boolean} light
 * @param {string} label
 */
function StatusBadge({ light, label, tone = "neutral" }) {
  const tones = {
    neutral: light
      ? "bg-stone-100 text-stone-700 ring-stone-200"
      : "bg-slate-800 text-slate-200 ring-slate-700",
    success: light
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : "bg-emerald-950/40 text-emerald-100 ring-emerald-800",
    muted: light
      ? "bg-stone-200/70 text-stone-600 ring-stone-300"
      : "bg-slate-800/80 text-slate-400 ring-slate-700",
    gold: light
      ? "bg-amber-50 text-amber-900 ring-amber-200"
      : "bg-amber-950/40 text-amber-100 ring-amber-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] ring-1 ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

/**
 * @param {{
 *   product: Record<string, unknown>;
 *   light: boolean;
 *   selected?: boolean;
 *   onSelectChange?: (handle: string, selected: boolean) => void;
 *   onToggle: (handle: string, patch: Record<string, unknown>) => Promise<void>;
 *   onRequestDelete?: (product: Record<string, unknown>) => void;
 *   busy: boolean;
 * }} props
 */
function ProductRow({
  product,
  light,
  selected = false,
  onSelectChange,
  onToggle,
  onRequestDelete,
  busy,
}) {
  const handle = String(product.handle);
  const collections = Array.isArray(product.collectionHandles)
    ? product.collectionHandles
    : [];
  const isActive = Boolean(product.active);
  const checkboxId = `product-select-${handle}`;

  return (
    <div className={dash.ordersListRow(light)}>
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          {onSelectChange ? (
            <div className="flex shrink-0 items-center pt-5">
              <input
                id={checkboxId}
                type="checkbox"
                checked={selected}
                disabled={busy}
                onChange={(event) =>
                  onSelectChange(handle, event.target.checked)
                }
                className={
                  light
                    ? "size-4 rounded border-stone-400 text-amber-600 focus:ring-amber-500/40"
                    : "size-4 rounded border-slate-600 bg-slate-900 text-amber-400 focus:ring-amber-400/30"
                }
                aria-label={`Select ${String(product.title)}`}
              />
            </div>
          ) : null}
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-stone-200/70">
            {product.image?.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image.src}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[0.55rem] uppercase tracking-widest text-stone-500">
                No image
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/dashboard/products/${encodeURIComponent(handle)}`}
                className={dash.ordersLinkAccent(light)}
              >
                {String(product.title)}
              </Link>
              {product.featured ? (
                <StatusBadge light={light} label="Featured" tone="gold" />
              ) : null}
              {isActive ? (
                <StatusBadge light={light} label="Active" tone="success" />
              ) : (
                <StatusBadge light={light} label="Deactivated" tone="muted" />
              )}
            </div>
            <p className={`mt-1 text-sm ${light ? "text-stone-600" : "text-slate-400"}`}>
              {collections.length > 0
                ? collections
                    .map((h) => collectionLabel(h))
                    .join(" · ")
                : "No collection assigned"}
            </p>
            <p className={`mt-1 text-xs ${light ? "text-stone-500" : "text-slate-500"}`}>
              Stock: {Number(product.quantity ?? 0)} · Handle: {handle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isActive ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                void onToggle(handle, {
                  featured: !product.featured,
                  active: true,
                  ...(!product.featured ? { featuredOrder: Date.now() } : {}),
                });
              }}
              className={dash.ordersGhostButton(light)}
              aria-label={
                product.featured ? "Remove from featured" : "Mark as featured"
              }
            >
              {product.featured ? (
                <RiStarFill
                  className="mr-1.5 inline size-4 text-amber-600"
                  aria-hidden
                />
              ) : (
                <RiStarLine className="mr-1.5 inline size-4" aria-hidden />
              )}
              {product.featured ? "Unfeature" : "Feature"}
            </button>
          ) : null}
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              void onToggle(handle, { active: !product.active });
            }}
            className={
              isActive
                ? dash.ordersGhostButton(light)
                : light
                  ? "cursor-pointer rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                  : "cursor-pointer rounded-xl bg-amber-400/90 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            }
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
          <Link
            href={`/dashboard/products/${encodeURIComponent(handle)}`}
            className={dash.ordersGhostButton(light)}
          >
            Edit
          </Link>
          {!isActive && onRequestDelete ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => onRequestDelete(product)}
              className={
                light
                  ? "cursor-pointer rounded-xl border border-red-400/70 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  : "cursor-pointer rounded-xl border border-red-500/45 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/60 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
              }
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function buildProductsPageHref({ section, collection, query, sort, page, perPage }) {
  const params = new URLSearchParams();
  if (section && section !== PRODUCTS_FILTER_ALL) {
    params.set("section", section);
  }
  if (collection && collection !== PRODUCTS_FILTER_ALL) {
    params.set("collection", collection);
  }
  if (query?.trim()) {
    params.set("q", query.trim());
  }
  const normalizedSort = normalizeProductsSort(sort);
  if (normalizedSort !== PRODUCTS_SORT_TITLE_ASC) {
    params.set("sort", normalizedSort);
  }
  const normalizedPerPage = normalizeProductsPerPage(perPage);
  if (normalizedPerPage !== DEFAULT_PRODUCTS_PER_PAGE) {
    params.set("per", String(normalizedPerPage));
  }
  const pageNum = Math.max(1, Number(page) || 1);
  if (pageNum > 1) {
    params.set("page", String(pageNum));
  }
  const qs = params.toString();
  return qs ? `/dashboard/products?${qs}` : "/dashboard/products";
}

/**
 * @param {{
 *   light: boolean;
 *   label: string;
 *   page: number;
 *   totalPages: number;
 *   rangeStart: number;
 *   rangeEnd: number;
 *   total: number;
 *   onPrevious: () => void;
 *   onNext: () => void;
 * }} props
 */
function ProductsPagination({
  light,
  label,
  page,
  totalPages,
  rangeStart,
  rangeEnd,
  total,
  onPrevious,
  onNext,
}) {
  if (total <= 0) return null;
  return (
    <nav
      className={`mt-6 flex flex-col items-stretch gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between ${light ? "border-stone-300/55" : "border-slate-700/40"}`}
      aria-label={label}
    >
      <p
        className={`text-center text-sm sm:text-left ${light ? "text-stone-600" : "text-slate-500"}`}
      >
        Showing{" "}
        <span
          className={`tabular-nums ${light ? "text-stone-800" : "text-stone-400"}`}
        >
          {rangeStart} to {rangeEnd}
        </span>{" "}
        of{" "}
        <span
          className={`tabular-nums ${light ? "text-stone-800" : "text-stone-400"}`}
        >
          {total}
        </span>
      </p>
      <div className="flex items-center justify-center gap-2 sm:justify-end">
        <button
          type="button"
          disabled={page <= 1}
          onClick={onPrevious}
          className={dash.ordersPaginationButton(light)}
        >
          Previous
        </button>
        <span
          className={`min-w-28 text-center text-sm ${light ? "text-stone-700" : "text-stone-400"}`}
        >
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={onNext}
          className={dash.ordersPaginationButton(light)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

function DashboardProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const { user, loading: authLoading, accountLoading, isAdmin } = useAuth();
  const { products, loading, replaceProduct, removeProduct, refresh } =
    useDashboardProducts();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyHandle, setBusyHandle] = useState("");
  const [selectedHandles, setSelectedHandles] = useState(() => new Set());
  const [deleteTargets, setDeleteTargets] = useState(
    /** @type {Record<string, unknown>[]} */ ([]),
  );
  const [deleting, setDeleting] = useState(false);

  const activeSection = searchParams.get("section") || PRODUCTS_FILTER_ALL;
  const activeCollection = searchParams.get("collection") || PRODUCTS_FILTER_ALL;
  const searchQuery = searchParams.get("q") || "";
  const sortKey = normalizeProductsSort(searchParams.get("sort"));
  const perPage = normalizeProductsPerPage(searchParams.get("per"));
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [inactivePage, setInactivePage] = useState(1);

  useEffect(() => {
    if (searchParams.get("created") !== "1") return;
    setSuccess("Product created. It will appear on the storefront shortly.");
    router.replace(
      buildProductsPageHref({
        section: activeSection,
        collection: activeCollection,
        query: searchQuery,
        sort: sortKey,
        page: 1,
        perPage,
      }),
      { scroll: false },
    );
  }, [
    searchParams,
    router,
    activeSection,
    activeCollection,
    searchQuery,
    sortKey,
    perPage,
  ]);

  const handleToggle = useCallback(
    async (handle, patch) => {
      setBusyHandle(handle);
      setError("");
      setSuccess("");
      try {
        const { product } = await updateAdminProduct(handle, patch);
        replaceProduct(product);
        setSuccess("Product updated.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not update product.");
      } finally {
        setBusyHandle("");
      }
    },
    [replaceProduct],
  );

  const handleSelectChange = useCallback((handle, selected) => {
    setSelectedHandles((prev) => {
      const next = new Set(prev);
      if (selected) next.add(handle);
      else next.delete(handle);
      return next;
    });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTargets.length) return;
    setDeleting(true);
    setError("");
    setSuccess("");
    const handles = deleteTargets.map((product) => String(product.handle));
    const failed = [];
    try {
      for (const handle of handles) {
        setBusyHandle(handle);
        try {
          await deleteAdminProduct(handle);
          removeProduct(handle);
        } catch {
          failed.push(handle);
        }
      }
      setDeleteTargets([]);
      setSelectedHandles((prev) => {
        const next = new Set(prev);
        for (const handle of handles) {
          if (!failed.includes(handle)) next.delete(handle);
        }
        return next;
      });
      if (failed.length === 0) {
        setSuccess(
          handles.length === 1
            ? "Product deleted permanently."
            : `${handles.length} products deleted permanently.`,
        );
      } else if (failed.length === handles.length) {
        setError("Could not delete the selected products.");
      } else {
        setError(
          `Deleted ${handles.length - failed.length} of ${handles.length} products. Some could not be deleted.`,
        );
        setSuccess("");
      }
      void refresh();
    } finally {
      setDeleting(false);
      setBusyHandle("");
    }
  }, [deleteTargets, removeProduct, refresh]);

  const filtered = useMemo(() => {
    const matched = filterDashboardProducts(products, {
      section: activeSection,
      collection: activeCollection,
      query: searchQuery,
    });
    return sortDashboardProducts(matched, sortKey);
  }, [products, activeSection, activeCollection, searchQuery, sortKey]);

  const activeProducts = useMemo(
    () => filtered.filter((p) => p.active),
    [filtered],
  );
  const inactiveProducts = useMemo(
    () => filtered.filter((p) => !p.active),
    [filtered],
  );

  const activeTotalPages = Math.max(
    1,
    Math.ceil(activeProducts.length / perPage),
  );
  const safeActivePage = Math.min(page, activeTotalPages);
  const pagedActiveProducts = useMemo(() => {
    const start = (safeActivePage - 1) * perPage;
    return activeProducts.slice(start, start + perPage);
  }, [activeProducts, safeActivePage, perPage]);
  const activeRangeStart =
    activeProducts.length === 0 ? 0 : (safeActivePage - 1) * perPage + 1;
  const activeRangeEnd = Math.min(
    safeActivePage * perPage,
    activeProducts.length,
  );

  const inactiveTotalPages = Math.max(
    1,
    Math.ceil(inactiveProducts.length / perPage),
  );
  const safeInactivePage = Math.min(inactivePage, inactiveTotalPages);
  const pagedInactiveProducts = useMemo(() => {
    const start = (safeInactivePage - 1) * perPage;
    return inactiveProducts.slice(start, start + perPage);
  }, [inactiveProducts, safeInactivePage, perPage]);
  const inactiveRangeStart =
    inactiveProducts.length === 0 ? 0 : (safeInactivePage - 1) * perPage + 1;
  const inactiveRangeEnd = Math.min(
    safeInactivePage * perPage,
    inactiveProducts.length,
  );

  useEffect(() => {
    setInactivePage(1);
  }, [activeSection, activeCollection, searchQuery, sortKey, perPage]);

  useEffect(() => {
    if (page === safeActivePage) return;
    router.replace(
      buildProductsPageHref({
        section: activeSection,
        collection: activeCollection,
        query: searchQuery,
        sort: sortKey,
        page: safeActivePage,
        perPage,
      }),
      { scroll: false },
    );
  }, [
    page,
    safeActivePage,
    router,
    activeSection,
    activeCollection,
    searchQuery,
    sortKey,
    perPage,
  ]);

  const selectableHandles = useMemo(
    () => filtered.map((product) => String(product.handle)),
    [filtered],
  );

  useEffect(() => {
    setSelectedHandles((prev) => {
      if (prev.size === 0) return prev;
      const allowed = new Set(selectableHandles);
      let changed = false;
      const next = new Set();
      for (const handle of prev) {
        if (allowed.has(handle)) next.add(handle);
        else changed = true;
      }
      return changed ? next : prev;
    });
  }, [selectableHandles]);

  const selectedCount = selectedHandles.size;
  const allFilteredSelected =
    selectableHandles.length > 0 &&
    selectableHandles.every((handle) => selectedHandles.has(handle));
  const allActiveSelected =
    activeProducts.length > 0 &&
    activeProducts.every((product) =>
      selectedHandles.has(String(product.handle)),
    );
  const allActivePageSelected =
    pagedActiveProducts.length > 0 &&
    pagedActiveProducts.every((product) =>
      selectedHandles.has(String(product.handle)),
    );

  const selectedProducts = useMemo(
    () =>
      filtered.filter((product) =>
        selectedHandles.has(String(product.handle)),
      ),
    [filtered, selectedHandles],
  );

  function selectAllMatching() {
    setSelectedHandles(new Set(selectableHandles));
  }

  function selectAllActive() {
    setSelectedHandles(
      new Set(activeProducts.map((product) => String(product.handle))),
    );
  }

  function selectActivePage() {
    setSelectedHandles((prev) => {
      const next = new Set(prev);
      for (const product of pagedActiveProducts) {
        next.add(String(product.handle));
      }
      return next;
    });
  }

  function deselectActivePage() {
    setSelectedHandles((prev) => {
      const next = new Set(prev);
      for (const product of pagedActiveProducts) {
        next.delete(String(product.handle));
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedHandles(new Set());
  }

  function requestBulkDelete() {
    if (selectedProducts.length === 0) return;
    setDeleteTargets(selectedProducts);
  }

  const activeCategoryLabel =
    activeCollection !== PRODUCTS_FILTER_ALL
      ? collectionLabel(activeCollection)
      : (PRODUCTS_CATEGORY_NAV.find((item) => item.key === activeSection)?.label ??
        "All products");

  function updateFilters({ section, collection, query, sort, page: nextPage, perPage: nextPerPage }) {
    router.push(
      buildProductsPageHref({
        section: section ?? activeSection,
        collection: collection ?? activeCollection,
        query: query ?? searchQuery,
        sort: sort ?? sortKey,
        page: nextPage ?? 1,
        perPage: nextPerPage ?? perPage,
      }),
    );
  }

  const pageLoading = authLoading || accountLoading || loading;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={dash.dashboardPageTitle(light)}>Products</h1>
          <p className={dash.dashboardPageSubtitle(light)}>
            Manage storefront inventory, collections, featured homepage pieces,
            and product detail pages.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            light
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-amber-400/90 text-slate-950 hover:bg-amber-300"
          }`}
        >
          <RiAddLine className="size-5" aria-hidden />
          Add product
        </Link>
      </div>

      {error ? (
        <p className={dash.dashErrorBanner(light)} role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className={dash.dashSuccessBanner(light)} role="status">
          {success}
        </p>
      ) : null}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full lg:max-w-md">
          <label
            htmlFor="products-search"
            className={`mb-1.5 block text-xs font-medium uppercase tracking-wider ${light ? "text-stone-600" : "text-slate-500"}`}
          >
            Search products
          </label>
          <div className="relative">
            <RiSearchLine
              className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${light ? "text-stone-500" : "text-slate-500"}`}
              aria-hidden
            />
            <input
              id="products-search"
              type="search"
              value={searchQuery}
              onChange={(event) =>
                updateFilters({
                  query: event.target.value,
                })
              }
              placeholder="Search by product name or handle…"
              autoComplete="off"
              className={dash.ordersSearchInput(light)}
            />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-end lg:w-auto">
          <div className="w-full sm:w-56">
            <SearchableSelectListbox
              id="products-per-page"
              label="Per page"
              inlineLabel
              light={light}
              value={String(perPage)}
              onChange={(nextPerPage) =>
                updateFilters({ perPage: normalizeProductsPerPage(nextPerPage), page: 1 })
              }
              options={PRODUCTS_PER_PAGE_OPTIONS}
              searchPlaceholder="Search page sizes…"
              placeholder="25 per page"
              anchor={{ to: "bottom end", gap: 8, padding: 12 }}
            />
          </div>
          <div className="w-full sm:w-64">
            <SearchableSelectListbox
              id="products-sort"
              label="Sort by"
              inlineLabel
              light={light}
              value={sortKey}
              onChange={(nextSort) => updateFilters({ sort: nextSort })}
              options={PRODUCTS_SORT_OPTIONS}
              searchPlaceholder="Search sort options…"
              placeholder="A to Z"
              anchor={{ to: "bottom end", gap: 8, padding: 12 }}
            />
          </div>
        </div>
      </div>

      <p className={`mb-6 text-sm ${light ? "text-stone-600" : "text-slate-400"}`}>
        Showing {filtered.length} product{filtered.length === 1 ? "" : "s"} in{" "}
        <span className="font-medium text-site-fg">{activeCategoryLabel}</span>
        {searchQuery.trim() ? (
          <>
            {" "}
            matching &ldquo;{searchQuery.trim()}&rdquo;
          </>
        ) : null}
      </p>

      {!user || !isAdmin ? null : pageLoading ? (
        <p className={light ? "text-stone-600" : "text-slate-400"}>
          Loading products…
        </p>
      ) : (
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-8 lg:items-start">
          <aside className="mb-8 lg:mb-0 lg:sticky lg:top-6">
            <DashboardProductsCategoryNav light={light} />
          </aside>

          <div className="min-w-0">
            <section>
              <h2 className={dash.dashboardStatHeading(light)}>
                Active products
              </h2>

              {activeProducts.length > 0 || selectedCount > 0 ? (
                <div
                  className={`mt-4 flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${
                    light
                      ? "border-stone-300/60 bg-white/80"
                      : "border-slate-700/40 bg-slate-900/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={allActivePageSelected}
                        disabled={pagedActiveProducts.length === 0 || deleting}
                        onChange={(event) => {
                          if (event.target.checked) selectActivePage();
                          else deselectActivePage();
                        }}
                        className={
                          light
                            ? "size-4 rounded border-stone-400 text-amber-600 focus:ring-amber-500/40"
                            : "size-4 rounded border-slate-600 bg-slate-900 text-amber-400 focus:ring-amber-400/30"
                        }
                        aria-label="Select all products on this page"
                      />
                      <span className={light ? "text-stone-700" : "text-slate-300"}>
                        {allActivePageSelected
                          ? "Deselect page"
                          : "Select page"}
                      </span>
                    </label>
                    <span
                      className={`text-sm ${light ? "text-stone-500" : "text-slate-500"}`}
                    >
                      {selectedCount > 0
                        ? `${selectedCount} selected`
                        : "None selected"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={allActiveSelected || activeProducts.length === 0 || deleting}
                      onClick={selectAllActive}
                      className={dash.ordersGhostButton(light)}
                    >
                      Select all active
                    </button>
                    <button
                      type="button"
                      disabled={allFilteredSelected || selectableHandles.length === 0 || deleting}
                      onClick={selectAllMatching}
                      className={dash.ordersGhostButton(light)}
                    >
                      Select all matching
                    </button>
                    <button
                      type="button"
                      disabled={selectedCount === 0 || deleting}
                      onClick={clearSelection}
                      className={dash.ordersGhostButton(light)}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      disabled={selectedCount === 0 || deleting}
                      onClick={requestBulkDelete}
                      className={
                        light
                          ? "cursor-pointer rounded-xl border border-red-400/70 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:border-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          : "cursor-pointer rounded-xl border border-red-500/45 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/60 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-60"
                      }
                    >
                      Delete selected
                      {selectedCount > 0 ? ` (${selectedCount})` : ""}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="mt-4 space-y-3">
                {pagedActiveProducts.length > 0 ? (
                  pagedActiveProducts.map((product) => (
                    <ProductRow
                      key={String(product.handle)}
                      product={product}
                      light={light}
                      selected={selectedHandles.has(String(product.handle))}
                      onSelectChange={handleSelectChange}
                      onToggle={handleToggle}
                      busy={busyHandle === product.handle || deleting}
                    />
                  ))
                ) : (
                  <div className={dash.ordersEmptyPanel(light)}>
                    <p>No active products in this view.</p>
                    <Link
                      href="/dashboard/products/new"
                      className={dash.ordersLinkAccent(light)}
                    >
                      Add your first product
                    </Link>
                  </div>
                )}
              </div>

              <ProductsPagination
                light={light}
                label="Active products pagination"
                page={safeActivePage}
                totalPages={activeTotalPages}
                rangeStart={activeRangeStart}
                rangeEnd={activeRangeEnd}
                total={activeProducts.length}
                onPrevious={() =>
                  updateFilters({ page: Math.max(1, safeActivePage - 1) })
                }
                onNext={() =>
                  updateFilters({
                    page: Math.min(activeTotalPages, safeActivePage + 1),
                  })
                }
              />
            </section>

            <section className="mt-10">
              <h2 className={dash.dashboardStatHeading(light)}>
                Deactivated products
              </h2>
              <p
                className={`mt-2 text-sm ${light ? "text-stone-600" : "text-slate-400"}`}
              >
                Hidden from collection pages and the homepage slider, but kept
                in Firestore so you can activate them again.
              </p>
              <div className="mt-4 space-y-3">
                {pagedInactiveProducts.length > 0 ? (
                  pagedInactiveProducts.map((product) => (
                    <ProductRow
                      key={String(product.handle)}
                      product={product}
                      light={light}
                      selected={selectedHandles.has(String(product.handle))}
                      onSelectChange={handleSelectChange}
                      onToggle={handleToggle}
                      onRequestDelete={(target) => setDeleteTargets([target])}
                      busy={busyHandle === product.handle || deleting}
                    />
                  ))
                ) : (
                  <div className={dash.ordersEmptyPanel(light)}>
                    <p>No deactivated products.</p>
                  </div>
                )}
              </div>

              <ProductsPagination
                light={light}
                label="Deactivated products pagination"
                page={safeInactivePage}
                totalPages={inactiveTotalPages}
                rangeStart={inactiveRangeStart}
                rangeEnd={inactiveRangeEnd}
                total={inactiveProducts.length}
                onPrevious={() =>
                  setInactivePage((current) => Math.max(1, current - 1))
                }
                onNext={() =>
                  setInactivePage((current) =>
                    Math.min(inactiveTotalPages, current + 1),
                  )
                }
              />
            </section>
          </div>
        </div>
      )}

      <DashboardDeleteProductDialog
        open={deleteTargets.length > 0}
        productTitle={String(deleteTargets[0]?.title ?? "")}
        productTitles={deleteTargets.map((product) =>
          String(product.title ?? product.handle ?? "Untitled"),
        )}
        count={deleteTargets.length}
        busy={deleting}
        onClose={() => {
          if (!deleting) setDeleteTargets([]);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default function DashboardProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-stone-600">Loading products…</p>
        </div>
      }
    >
      <DashboardProductsPageContent />
    </Suspense>
  );
}
