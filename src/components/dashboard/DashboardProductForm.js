"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  createAdminProduct,
  fetchAdminProduct,
  updateAdminProduct,
} from "@/lib/admin/products-client";
import { buildMainProductImagePayload } from "@/lib/admin/product-image-input";
import { slugifyProductHandle } from "@/lib/catalog/product-handle";
import { normalizeProductPricingForSave, resolveProductPricing } from "@/lib/catalog/product-pricing";
import {
  filterAssignableCollectionHandles,
} from "@/lib/catalog/collections-meta";
import { CATALOG_SECTIONS } from "@/lib/catalog/categories";
import {
  PRODUCT_AUDIENCES,
  audienceLabel,
  normalizeProductAudience,
} from "@/lib/catalog/product-audience";
import ProductPhotoField from "@/components/dashboard/ProductPhotoField";
import DashboardFormSection from "@/components/dashboard/DashboardFormSection";
import Checkbox from "@/components/ui/Checkbox";
import { useAuth } from "@/context/AuthContext";
import { useDashboardProducts } from "@/context/DashboardProductsContext";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import * as dash from "@/lib/dashboardChrome";
import { isLightThemeId } from "@/theme";

const catalogSections = Object.entries(CATALOG_SECTIONS).filter(
  ([, section]) => section.hub !== "audience",
);

const emptySpec = () => ({ label: "", value: "" });
const emptyImage = () => ({ src: "", alt: "" });

/**
 * @param {Record<string, unknown> | null | undefined} product
 */
function buildFormState(product) {
  const pricing = product ? resolveProductPricing(product) : null;
  return {
    title: String(product?.title ?? ""),
    handle: String(product?.handle ?? ""),
    description: String(product?.description ?? ""),
    priceUsd: String(pricing?.regularUsd ?? product?.priceUsd ?? ""),
    salePriceUsd: String(
      pricing?.onSale && pricing.saleUsd != null ? pricing.saleUsd : "",
    ),
    quantity: String(product?.quantity ?? "0"),
    active: product?.active !== false,
    featured: Boolean(product?.featured),
    audience: normalizeProductAudience(product?.audience) ?? "unisex",
    collectionHandles: filterAssignableCollectionHandles(
      Array.isArray(product?.collectionHandles) ? product.collectionHandles : [],
    ),
    image: product?.image?.src
      ? { src: String(product.image.src), alt: String(product.image.alt ?? "") }
      : emptyImage(),
    images: Array.isArray(product?.images) && product.images.length > 0
      ? product.images.map((img) => ({
          src: String(img.src ?? ""),
          alt: String(img.alt ?? ""),
        }))
      : [emptyImage()],
    specs: Array.isArray(product?.specs) && product.specs.length > 0
      ? product.specs.map((s) => ({
          label: String(s.label ?? ""),
          value: String(s.value ?? ""),
        }))
      : [emptySpec()],
  };
}

/**
 * @param {{
 *   mode: "create" | "edit";
 *   handle?: string;
 * }} props
 */
export default function DashboardProductForm({ mode, handle }) {
  const router = useRouter();
  const themeId = useDocumentThemeId();
  const light = isLightThemeId(themeId);
  const { user, loading: authLoading, accountLoading, isAdmin } = useAuth();
  const { refresh, addProduct, replaceProduct } = useDashboardProducts();
  const [form, setForm] = useState(buildFormState(null));
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [mainPhotoUploading, setMainPhotoUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const mainPhotoSrcRef = useRef("");

  const hasMainImage = Boolean(form.image.src.trim());
  const canSubmit = hasMainImage && !mainPhotoUploading && !saving;

  useEffect(() => {
    mainPhotoSrcRef.current = form.image.src;
  }, [form.image.src]);

  useEffect(() => {
    if (mode !== "edit" || !handle) return;
    if (authLoading || accountLoading || !user || !isAdmin) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { product } = await fetchAdminProduct(handle);
        if (!cancelled) setForm(buildFormState(product));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load product.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, handle, authLoading, accountLoading, user, isAdmin]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCollection(shopifyHandle) {
    setForm((prev) => {
      const set = new Set(prev.collectionHandles);
      if (set.has(shopifyHandle)) set.delete(shopifyHandle);
      else set.add(shopifyHandle);
      return { ...prev, collectionHandles: [...set] };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const domImageSrc =
      event.currentTarget instanceof HTMLFormElement
        ? event.currentTarget
            .querySelector("[data-main-photo-url]")
            ?.value?.trim() ?? ""
        : "";

    const mainImage = buildMainProductImagePayload(form, domImageSrc || mainPhotoSrcRef.current);
    if (!mainImage?.src) {
      setError("Add a main product photo before saving.");
      return;
    }
    if (mainPhotoUploading) {
      setError("Wait for the main photo upload to finish.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const pricing = normalizeProductPricingForSave(form.priceUsd, form.salePriceUsd);

    const payload = {
      title: form.title.trim(),
      handle:
        mode === "create"
          ? form.handle.trim() || slugifyProductHandle(form.title)
          : undefined,
      description: form.description.trim(),
      priceUsd: pricing.priceUsd,
      salePriceUsd: pricing.salePriceUsd,
      maxPriceUsd: pricing.maxPriceUsd,
      quantity: Math.max(0, Number.parseInt(form.quantity || "0", 10) || 0),
      active: form.active,
      featured: form.featured,
      audience: form.audience,
      ...(form.featured ? { featuredOrder: Date.now() } : { featuredOrder: 0 }),
      collectionHandles: filterAssignableCollectionHandles(form.collectionHandles),
      image: mainImage,
      images: form.images
        .filter((img) => img.src.trim() && img.src.trim() !== mainImage.src)
        .map((img) => ({
          src: img.src.trim(),
          alt: img.alt.trim() || form.title.trim(),
        })),
      specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
    };

    try {
      if (mode === "create") {
        const { product } = await createAdminProduct(payload);
        addProduct(product);
        await refresh();
        setForm(buildFormState(null));
        router.replace("/dashboard/products?created=1");
        return;
      }

      const { product } = await updateAdminProduct(handle, payload);
      replaceProduct(product);
      void refresh();
      setSuccess("Product saved. Storefront pages will update shortly.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = dash.dashFormInput(light);
  const textareaClass = dash.dashFormTextarea(light);

  const labelClass = `mb-2 block text-sm font-medium ${light ? "text-stone-700" : "text-slate-300"}`;

  const productStorageFolder =
    mode === "edit"
      ? String(handle ?? "")
      : form.handle.trim() || slugifyProductHandle(form.title);

  if (loading) {
    return <p className={light ? "text-stone-600" : "text-slate-400"}>Loading product…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <Link href="/dashboard/products" className={dash.ordersLinkAccent(light)}>
          ← Back to products
        </Link>
        <h1 className={`mt-4 ${dash.dashboardPageTitle(light)}`}>
          {mode === "create" ? "Add product" : "Edit product"}
        </h1>
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

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <DashboardFormSection title="Product details" light={light}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={labelClass}>Product name</span>
              <input
                required
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClass}
              />
            </label>

            {mode === "create" ? (
              <label className="block sm:col-span-2">
                <span className={labelClass}>URL handle</span>
                <input
                  value={form.handle}
                  onChange={(e) => updateField("handle", e.target.value)}
                  placeholder={slugifyProductHandle(form.title) || "product-handle"}
                  className={inputClass}
                />
              </label>
            ) : (
              <p className={`sm:col-span-2 text-sm ${light ? "text-stone-600" : "text-slate-400"}`}>
                Public URL: /products/{handle}
              </p>
            )}

            <label className="block sm:col-span-2">
              <span className={labelClass}>Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className={textareaClass}
              />
            </label>

            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block">
                <span className={labelClass}>Regular price (USD)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.priceUsd}
                  onChange={(e) => updateField("priceUsd", e.target.value)}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Sale price (USD, optional)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.salePriceUsd}
                  onChange={(e) => updateField("salePriceUsd", e.target.value)}
                  placeholder="Leave empty if not on sale"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>Quantity in stock</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={(e) => updateField("quantity", e.target.value)}
                  className={inputClass}
                />
              </label>

              <div className="block">
                <span className={labelClass}>Options</span>
                <div className="flex flex-col gap-3">
                  <Checkbox
                    checked={form.active}
                    onChange={(checked) => updateField("active", checked)}
                    label="Active on storefront"
                    light={light}
                  />
                  <Checkbox
                    checked={form.featured}
                    onChange={(checked) => updateField("featured", checked)}
                    label="Featured on homepage slider"
                    light={light}
                  />
                </div>
              </div>

              <fieldset className="block">
                <legend className={labelClass}>Audience</legend>
                <p
                  className={`mb-3 text-sm ${
                    light ? "text-stone-600" : "text-slate-400"
                  }`}
                >
                  Controls whether this piece appears under Women, Men, or both
                  (unisex). Type collections above still apply.
                </p>
                <div
                  className="flex flex-col gap-2"
                  role="radiogroup"
                  aria-label="Product audience"
                >
                  {PRODUCT_AUDIENCES.map((value) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-3 rounded-sm border px-3 py-2 text-sm transition ${
                        form.audience === value
                          ? light
                            ? "border-warm-gold bg-champagne/50 text-site-fg"
                            : "border-warm-gold bg-white/5 text-white"
                          : light
                            ? "border-stone-200 text-stone-700 hover:border-stone-300"
                            : "border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <input
                        type="radio"
                        name="product-audience"
                        value={value}
                        checked={form.audience === value}
                        onChange={() => updateField("audience", value)}
                        className="h-4 w-4 accent-[var(--site-primary,#b08d57)]"
                      />
                      <span>{audienceLabel(value)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Collections" light={light}>
          <p className={`mb-4 text-sm ${light ? "text-stone-600" : "text-slate-400"}`}>
            Choose one or more sub-categories. Women and Men menus reuse these
            collections and filter by audience. Parent sections are labels only.
          </p>
          <div className="max-h-72 space-y-5 overflow-y-auto pr-1">
            {catalogSections.map(([sectionKey, section]) => (
              <div key={sectionKey}>
                <p
                  className={`mb-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                    light ? "text-stone-500" : "text-slate-400"
                  }`}
                >
                  {section.title}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {section.children.flatMap((child) => {
                    const self = (
                      <Checkbox
                        key={child.shopifyHandle}
                        variant="card"
                        checked={form.collectionHandles.includes(child.shopifyHandle)}
                        onChange={() => toggleCollection(child.shopifyHandle)}
                        label={child.title}
                        light={light}
                      />
                    );
                    const nested = (child.children ?? []).map((shape) => (
                      <Checkbox
                        key={shape.shopifyHandle}
                        variant="card"
                        checked={form.collectionHandles.includes(shape.shopifyHandle)}
                        onChange={() => toggleCollection(shape.shopifyHandle)}
                        label={`${child.title} · ${shape.title}`}
                        light={light}
                      />
                    ));
                    return [self, ...nested];
                  })}
                </div>
              </div>
            ))}
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Main photo (required)" light={light}>
          <ProductPhotoField
            src={form.image.src}
            alt={form.image.alt}
            required
            markAsMainPhoto
            onUploadingChange={setMainPhotoUploading}
            onSrcChange={(value) => {
              mainPhotoSrcRef.current = value;
              setError("");
              setForm((prev) => ({
                ...prev,
                image: { ...prev.image, src: value },
              }));
            }}
            onAltChange={(value) =>
              setForm((prev) => ({
                ...prev,
                image: { ...prev.image, alt: value },
              }))
            }
            light={light}
            inputClassName={inputClass}
            previewLabel="Main product photo preview"
            storageFolder={productStorageFolder}
          />
        </DashboardFormSection>

        <DashboardFormSection
          title="Additional photos"
          light={light}
          action={
            <button
              type="button"
              className={dash.dashFormAddButton(light)}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  images: [...prev.images, emptyImage()],
                }))
              }
            >
              Add photo
            </button>
          }
        >
          <div className="space-y-4">
            {form.images.map((img, index) => (
              <ProductPhotoField
                key={`image-${index}`}
                src={img.src}
                alt={img.alt}
                onSrcChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    images: prev.images.map((item, i) =>
                      i === index ? { ...item, src: value } : item,
                    ),
                  }))
                }
                onAltChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    images: prev.images.map((item, i) =>
                      i === index ? { ...item, alt: value } : item,
                    ),
                  }))
                }
                light={light}
                inputClassName={inputClass}
                previewLabel={`Additional photo ${index + 1} preview`}
                storageFolder={productStorageFolder}
                showRemove
                onRemove={() =>
                  setForm((prev) => ({
                    ...prev,
                    images: prev.images.filter((_, i) => i !== index),
                  }))
                }
              />
            ))}
          </div>
        </DashboardFormSection>

        <DashboardFormSection
          title="Product specs"
          light={light}
          action={
            <button
              type="button"
              className={dash.dashFormAddButton(light)}
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  specs: [...prev.specs, emptySpec()],
                }))
              }
            >
              Add spec
            </button>
          }
        >
          <div className="space-y-3">
            {form.specs.map((spec, index) => (
              <div key={`spec-${index}`} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  value={spec.label}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      specs: prev.specs.map((item, i) =>
                        i === index ? { ...item, label: e.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Label (e.g. Metal)"
                  className={inputClass}
                />
                <input
                  value={spec.value}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      specs: prev.specs.map((item, i) =>
                        i === index ? { ...item, value: e.target.value } : item,
                      ),
                    }))
                  }
                  placeholder="Value (e.g. 14k yellow gold)"
                  className={inputClass}
                />
                <button
                  type="button"
                  className={dash.dashFormRemoveButton(light)}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      specs: prev.specs.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </DashboardFormSection>

        <div className={`${dash.ordersPanel(light)} flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center`}>
          <button
            type="submit"
            disabled={!canSubmit}
            title={
              !hasMainImage
                ? "Add a main product photo to continue"
                : mainPhotoUploading
                  ? "Wait for the photo upload to finish"
                  : undefined
            }
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              light
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-amber-400/90 text-slate-950 hover:bg-amber-300"
            }`}
          >
            {saving ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
          </button>
          {!hasMainImage ? (
            <p className={`text-sm ${light ? "text-stone-600" : "text-slate-400"}`}>
              Upload or paste a main photo to enable {mode === "create" ? "Create product" : "Save changes"}.
            </p>
          ) : null}
          <Link href="/dashboard/products" className={dash.ordersGhostButton(light)}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
