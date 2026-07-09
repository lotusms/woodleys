"use client";

import Link from "next/link";
import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RiAddLine, RiSearchLine, RiStarFill, RiStarLine } from "react-icons/ri";
import {
  deleteDashboardProduct,
  updateDashboardProduct,
} from "@/lib/catalog/firestore-products-browser";
import { listAllCatalogCollectionOptions } from "@/lib/catalog/collections-meta";
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

const collectionTitleByHandle = Object.fromEntries(
  listAllCatalogCollectionOptions().map((c) => [c.shopifyHandle, c.title]),
);

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
 *   onToggle: (handle: string, patch: Record<string, unknown>) => Promise<void>;
 *   onRequestDelete?: (product: Record<string, unknown>) => void;
 *   busy: boolean;
 * }} props
 */
function ProductRow({ product, light, onToggle, onRequestDelete, busy }) {
  const handle = String(product.handle);
  const collections = Array.isArray(product.collectionHandles)
    ? product.collectionHandles
    : [];
  const isActive = Boolean(product.active);

  return (
    <div className={dash.ordersListRow(light)}>
      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 items-start gap-4">
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
                    .map((h) => collectionTitleByHandle[h] ?? h)
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
              onClick={() =>
                onToggle(handle, { featured: !product.featured, active: true })
              }
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
            onClick={() => onToggle(handle, { active: !product.active })}
            className={
              isActive
                ? dash.ordersGhostButton(light)
                : light
                  ? "rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-60"
                  : "rounded-xl bg-amber-400/90 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-60"
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
                  ? "rounded-xl border border-red-400/70 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:border-red-500 hover:bg-red-50 disabled:opacity-60"
                  : "rounded-xl border border-red-500/45 bg-slate-900/60 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-400/60 hover:bg-red-950/40 disabled:opacity-60"
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

function buildProductsPageHref({ section, collection, query, sort }) {
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
  const qs = params.toString();
  return qs ? `/dashboard/products?${qs}` : "/dashboard/products";
}

function DashboardProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const { user, loading: authLoading, accountLoading, isAdmin } = useAuth();
  const { products, loading, replaceProduct, removeProduct } =
    useDashboardProducts();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyHandle, setBusyHandle] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const activeSection = searchParams.get("section") || PRODUCTS_FILTER_ALL;
  const activeCollection = searchParams.get("collection") || PRODUCTS_FILTER_ALL;
  const searchQuery = searchParams.get("q") || "";
  const sortKey = normalizeProductsSort(searchParams.get("sort"));

  const handleToggle = useCallback(
    async (handle, patch) => {
      setBusyHandle(handle);
      setError("");
      setSuccess("");
      try {
        const data = await updateDashboardProduct(handle, patch);
        replaceProduct(data);
        setSuccess("Product updated.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not update product.");
      } finally {
        setBusyHandle("");
      }
    },
    [replaceProduct],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget?.handle) return;
    const handle = String(deleteTarget.handle);
    setDeleting(true);
    setBusyHandle(handle);
    setError("");
    setSuccess("");
    try {
      await deleteDashboardProduct(handle);
      removeProduct(handle);
      setDeleteTarget(null);
      setSuccess("Product deleted permanently.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete product.");
    } finally {
      setDeleting(false);
      setBusyHandle("");
    }
  }, [deleteTarget, removeProduct]);

  const filtered = useMemo(() => {
    const matched = filterDashboardProducts(products, {
      section: activeSection,
      collection: activeCollection,
      query: searchQuery,
    });
    return sortDashboardProducts(matched, sortKey);
  }, [products, activeSection, activeCollection, searchQuery, sortKey]);

  const activeCategoryLabel =
    activeCollection !== PRODUCTS_FILTER_ALL
      ? (collectionTitleByHandle[activeCollection] ?? activeCollection)
      : (PRODUCTS_CATEGORY_NAV.find((item) => item.key === activeSection)?.label ??
        "All products");

  function updateFilters({ section, collection, query, sort }) {
    router.push(
      buildProductsPageHref({
        section: section ?? activeSection,
        collection: collection ?? activeCollection,
        query: query ?? searchQuery,
        sort: sort ?? sortKey,
      }),
    );
  }

  const activeProducts = filtered.filter((p) => p.active);
  const inactiveProducts = filtered.filter((p) => !p.active);
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

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-md">
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

        <div className="w-full sm:w-72">
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
              <div className="mt-4 space-y-3">
                {activeProducts.length > 0 ? (
                  activeProducts.map((product) => (
                    <ProductRow
                      key={String(product.handle)}
                      product={product}
                      light={light}
                      onToggle={handleToggle}
                      busy={busyHandle === product.handle}
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
                {inactiveProducts.length > 0 ? (
                  inactiveProducts.map((product) => (
                    <ProductRow
                      key={String(product.handle)}
                      product={product}
                      light={light}
                      onToggle={handleToggle}
                      onRequestDelete={setDeleteTarget}
                      busy={busyHandle === product.handle}
                    />
                  ))
                ) : (
                  <div className={dash.ordersEmptyPanel(light)}>
                    <p>No deactivated products.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      <DashboardDeleteProductDialog
        open={Boolean(deleteTarget)}
        productTitle={String(deleteTarget?.title ?? "")}
        busy={deleting}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
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
