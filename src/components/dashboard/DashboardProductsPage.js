"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiAddLine, RiStarFill, RiStarLine } from "react-icons/ri";
import {
  listDashboardProducts,
  updateDashboardProduct,
} from "@/lib/catalog/firestore-products-browser";
import { listAllCatalogCollectionOptions } from "@/lib/catalog/collections-meta";
import { useAuth } from "@/context/AuthContext";
import SearchableSelectListbox from "@/components/ui/SearchableSelectListbox";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import * as dash from "@/lib/dashboardChrome";
import { isLightThemeId } from "@/theme";

const collectionOptions = listAllCatalogCollectionOptions();
const collectionTitleByHandle = Object.fromEntries(
  collectionOptions.map((c) => [c.shopifyHandle, c.title]),
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
 *   busy: boolean;
 * }} props
 */
function ProductRow({ product, light, onToggle, busy }) {
  const handle = String(product.handle);
  const collections = Array.isArray(product.collectionHandles)
    ? product.collectionHandles
    : [];

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
              {product.active ? (
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
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              onToggle(handle, { featured: !product.featured, active: true })
            }
            className={dash.ordersGhostButton(light)}
            aria-label={product.featured ? "Remove from featured" : "Mark as featured"}
          >
            {product.featured ? (
              <RiStarFill className="mr-1.5 inline size-4 text-amber-600" aria-hidden />
            ) : (
              <RiStarLine className="mr-1.5 inline size-4" aria-hidden />
            )}
            {product.featured ? "Unfeature" : "Feature"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onToggle(handle, { active: !product.active })}
            className={dash.ordersGhostButton(light)}
          >
            {product.active ? "Deactivate" : "Activate"}
          </button>
          <Link
            href={`/dashboard/products/${encodeURIComponent(handle)}`}
            className={dash.ordersGhostButton(light)}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardProductsPage() {
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const { user, loading: authLoading, accountLoading, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyHandle, setBusyHandle] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const items = await listDashboardProducts();
      setProducts(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || accountLoading || !user || !isAdmin) return;
    void load();
  }, [authLoading, accountLoading, user, isAdmin, load]);

  const handleToggle = useCallback(
    async (handle, patch) => {
      setBusyHandle(handle);
      setError("");
      setSuccess("");
      try {
        const data = await updateDashboardProduct(handle, patch);
        setProducts((prev) =>
          prev.map((p) => (p.handle === handle ? data : p)),
        );
        setSuccess("Product updated.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not update product.");
      } finally {
        setBusyHandle("");
      }
    },
    [],
  );

  const filtered = useMemo(() => {
    if (collectionFilter === "all") return products;
    return products.filter((p) =>
      Array.isArray(p.collectionHandles)
        ? p.collectionHandles.includes(collectionFilter)
        : false,
    );
  }, [products, collectionFilter]);

  const activeProducts = filtered.filter((p) => p.active);
  const inactiveProducts = filtered.filter((p) => !p.active);

  const collectionFilterOptions = useMemo(
    () => [
      { value: "all", label: "All collections" },
      ...collectionOptions.map((option) => ({
        value: option.shopifyHandle,
        label: option.title,
      })),
    ],
    [],
  );

  return (
    <div className="mx-auto max-w-6xl">
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

      <div className="mb-8 flex justify-end">
        <SearchableSelectListbox
          id="products-collection-filter"
          label="Filter by collection"
          inlineLabel
          light={light}
          value={collectionFilter}
          onChange={setCollectionFilter}
          options={collectionFilterOptions}
          searchPlaceholder="Search collections…"
          placeholder="All collections"
          anchor={{ to: "bottom end", gap: 8, padding: 12 }}
        />
      </div>

      {authLoading || accountLoading || loading ? (
        <p className={light ? "text-stone-600" : "text-slate-400"}>Loading products…</p>
      ) : (
        <>
          <section>
            <h2 className={dash.dashboardStatHeading(light)}>Active products</h2>
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
                  <Link href="/dashboard/products/new" className={dash.ordersLinkAccent(light)}>
                    Add your first product
                  </Link>
                </div>
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className={dash.dashboardStatHeading(light)}>Deactivated products</h2>
            <p className={`mt-2 text-sm ${light ? "text-stone-600" : "text-slate-400"}`}>
              Hidden from collection pages and the homepage slider, but kept in
              Firestore so you can activate them again.
            </p>
            <div className="mt-4 space-y-3">
              {inactiveProducts.length > 0 ? (
                inactiveProducts.map((product) => (
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
                  <p>No deactivated products.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
