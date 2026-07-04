"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createDashboardProduct,
  getDashboardProductByHandle,
  updateDashboardProduct,
} from "@/lib/catalog/firestore-products-browser";
import { slugifyProductHandle } from "@/lib/catalog/product-handle";
import { normalizeProductPricingForSave, resolveProductPricing } from "@/lib/catalog/product-pricing";
import { listAllCatalogCollectionOptions } from "@/lib/catalog/collections-meta";
import ProductPhotoField from "@/components/dashboard/ProductPhotoField";
import DashboardFormSection from "@/components/dashboard/DashboardFormSection";
import Checkbox from "@/components/ui/Checkbox";
import { useAuth } from "@/context/AuthContext";
import { useDocumentThemeId } from "@/hooks/useDocumentThemeId";
import * as dash from "@/lib/dashboardChrome";
import { isLightThemeId } from "@/theme";

const collectionOptions = listAllCatalogCollectionOptions();

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
    collectionHandles: Array.isArray(product?.collectionHandles)
      ? [...product.collectionHandles]
      : [],
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
  const [form, setForm] = useState(buildFormState(null));
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !handle) return;
    if (authLoading || accountLoading || !user || !isAdmin) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const product = await getDashboardProductByHandle(handle);
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
      collectionHandles: form.collectionHandles,
      image: form.image.src.trim()
        ? {
            src: form.image.src.trim(),
            alt: form.image.alt.trim() || form.title.trim(),
          }
        : null,
      images: form.images
        .filter((img) => img.src.trim())
        .map((img) => ({
          src: img.src.trim(),
          alt: img.alt.trim() || form.title.trim(),
        })),
      specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
    };

    try {
      if (mode === "create") {
        const product = await createDashboardProduct(payload);
        router.push(`/dashboard/products/${encodeURIComponent(product.handle)}`);
        return;
      }

      await updateDashboardProduct(handle, payload);
      setSuccess("Product saved. Public product pages will update shortly.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = dash.dashFormInput(light);
  const textareaClass = dash.dashFormTextarea(light);

  const labelClass = `mb-2 block text-sm font-medium ${light ? "text-stone-700" : "text-slate-300"}`;

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

      <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Collections" light={light}>
          <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2">
            {collectionOptions.map((option) => (
              <Checkbox
                key={option.shopifyHandle}
                variant="card"
                checked={form.collectionHandles.includes(option.shopifyHandle)}
                onChange={() => toggleCollection(option.shopifyHandle)}
                label={option.title}
                light={light}
              />
            ))}
          </div>
        </DashboardFormSection>

        <DashboardFormSection title="Main photo" light={light}>
          <ProductPhotoField
            src={form.image.src}
            alt={form.image.alt}
            onSrcChange={(value) =>
              setForm((prev) => ({
                ...prev,
                image: { ...prev.image, src: value },
              }))
            }
            onAltChange={(value) =>
              setForm((prev) => ({
                ...prev,
                image: { ...prev.image, alt: value },
              }))
            }
            light={light}
            inputClassName={inputClass}
            previewLabel="Main product photo preview"
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

        <div className={`${dash.ordersPanel(light)} flex flex-wrap gap-3`}>
          <button
            type="submit"
            disabled={saving}
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 ${
              light
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-amber-400/90 text-slate-950 hover:bg-amber-300"
            }`}
          >
            {saving ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
          </button>
          <Link href="/dashboard/products" className={dash.ordersGhostButton(light)}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
