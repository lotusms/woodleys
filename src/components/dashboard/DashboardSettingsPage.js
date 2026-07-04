"use client";

import { useCallback, useEffect, useState } from "react";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import DashboardFormSection from "@/components/dashboard/DashboardFormSection";
import SettingsAccountOverview from "@/components/dashboard/SettingsAccountOverview";
import PrimaryButton from "@/components/ui/PrimaryButton";
import {
  fetchAdminSettings,
  saveAdminSettings,
  testAdminIntegration,
} from "@/lib/admin/settings-client";
import { SECRET_MASK } from "@/lib/site-integrations-constants";
import * as dash from "@/lib/dashboardChrome";
import * as overlayChrome from "@/lib/overlayChrome";

/**
 * @param {boolean} light
 * @param {"neutral" | "success" | "error"} tone
 * @param {string} message
 */
function StatusBanner({ light, tone, message }) {
  if (!message) return null;

  const classes =
    tone === "success"
      ? dash.changePasswordSuccess(light)
      : tone === "error"
        ? overlayChrome.checkoutBannerError(light)
        : light
          ? "rounded-xl border border-stone-300/60 bg-stone-50 px-4 py-3 text-sm text-stone-700"
          : "rounded-xl border border-slate-600/50 bg-slate-900/60 px-4 py-3 text-sm text-slate-300";

  return (
    <p className={classes} role={tone === "error" ? "alert" : "status"}>
      {message}
    </p>
  );
}

/**
 * @param {{
 *   light: boolean;
 *   id: string;
 *   label: string;
 *   value: string;
 *   onChange: (value: string) => void;
 *   type?: string;
 *   placeholder?: string;
 *   hint?: string;
 *   autoComplete?: string;
 * }} props
 */
function SettingsField({
  light,
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
  autoComplete,
}) {
  return (
    <div>
      <label htmlFor={id} className={overlayChrome.formFieldLabel(light)}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={dash.dashFormInput(light)}
      />
      {hint ? (
        <p className={`mt-1.5 text-xs ${light ? "text-stone-500" : "text-slate-400"}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * @param {{ light: boolean }} props
 */
export default function DashboardSettingsPage({ light }) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [testBusy, setTestBusy] = useState(null);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [shopifyTestMessage, setShopifyTestMessage] = useState("");
  const [stullerTestMessage, setStullerTestMessage] = useState("");

  const [shopifyStoreDomain, setShopifyStoreDomain] = useState("");
  const [shopifyStorefrontAccessToken, setShopifyStorefrontAccessToken] = useState("");
  const [shopifyClientId, setShopifyClientId] = useState("");
  const [shopifyClientSecret, setShopifyClientSecret] = useState("");
  const [shopifyCatalogEnabled, setShopifyCatalogEnabled] = useState(false);
  const [stullerEmbedUrl, setStullerEmbedUrl] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const applySettings = useCallback((settings) => {
    setShopifyStoreDomain(settings.shopifyStoreDomain || "");
    setShopifyCatalogEnabled(Boolean(settings.shopifyCatalogEnabled));
    setStullerEmbedUrl(settings.stullerEmbedUrl || "");
    setShopifyStorefrontAccessToken(settings.secrets?.shopifyStorefrontAccessToken || "");
    setShopifyClientId(settings.secrets?.shopifyClientId || "");
    setShopifyClientSecret(settings.secrets?.shopifyClientSecret || "");
    setUpdatedAt(settings.updatedAt || null);
  }, []);

  const formPayload = useCallback(
    () => ({
      shopifyStoreDomain,
      shopifyStorefrontAccessToken,
      shopifyClientId,
      shopifyClientSecret,
      shopifyCatalogEnabled,
      stullerEmbedUrl,
    }),
    [
      shopifyStoreDomain,
      shopifyStorefrontAccessToken,
      shopifyClientId,
      shopifyClientSecret,
      shopifyCatalogEnabled,
      stullerEmbedUrl,
    ],
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const settings = await fetchAdminSettings();
        if (!active) return;
        applySettings(settings);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Could not load settings.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [applySettings]);

  async function handleSave() {
    setBusy(true);
    setSaveMessage("");
    setError("");
    try {
      const result = await saveAdminSettings(formPayload());
      applySettings(result.settings);
      setSaveMessage("Settings saved. The storefront will use these values immediately.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save settings.");
    } finally {
      setBusy(false);
    }
  }

  async function handleTest(target, saveOnSuccess = false) {
    setTestBusy(target);
    setError("");
    if (target === "shopify") setShopifyTestMessage("");
    if (target === "stuller") setStullerTestMessage("");

    try {
      const result = await testAdminIntegration(target, formPayload(), {
        saveOnSuccess,
      });

      if (result.saved && result.settings) {
        applySettings(result.settings);
        setSaveMessage("Settings saved and connection verified.");
      }

      const message = result.message || (result.ok ? "Connection succeeded." : "Test failed.");
      if (target === "shopify") {
        setShopifyTestMessage(message);
      } else {
        setStullerTestMessage(message);
      }

      if (!result.ok && result.error) {
        setError(result.error);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Test failed.";
      if (target === "shopify") setShopifyTestMessage(msg);
      else setStullerTestMessage(msg);
    } finally {
      setTestBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="mb-8">
        <h1 className={dash.dashboardPageTitle(light)}>Settings</h1>
        <p className={`mt-3 max-w-3xl ${dash.dashboardPageSubtitle(light)}`}>
          Connect Shopify and Stuller for the storefront. Values saved here are
          stored securely in Firestore and applied across the site. No redeploy
          required.
        </p>
        {updatedAt ? (
          <p className={`mt-2 text-xs ${light ? "text-stone-500" : "text-slate-400"}`}>
            Last updated {new Date(updatedAt).toLocaleString()}
          </p>
        ) : null}
      </div>

      {loading ? (
        <p className={dash.dashboardPageSubtitle(light)}>Loading settings…</p>
      ) : null}

      {error ? (
        <StatusBanner light={light} tone="error" message={error} />
      ) : null}
      {saveMessage ? (
        <StatusBanner light={light} tone="success" message={saveMessage} />
      ) : null}

      {!loading ? (
        <>
          <div className="grid gap-8 lg:grid-cols-2">
          <DashboardFormSection
            light={light}
            title="Shopify"
            action={
              <span
                className={`text-xs uppercase tracking-wider ${
                  light ? "text-stone-500" : "text-slate-400"
                }`}
              >
                Storefront & checkout
              </span>
            }
          >
            <div className="space-y-5">
              <SettingsField
                light={light}
                id="shopify-store-domain"
                label="Store domain"
                value={shopifyStoreDomain}
                onChange={setShopifyStoreDomain}
                placeholder="your-store.myshopify.com"
                hint="From Shopify Admin or dev.shopify.com. No https prefix."
              />

              <SettingsField
                light={light}
                id="shopify-storefront-token"
                label="Storefront access token"
                value={shopifyStorefrontAccessToken}
                onChange={setShopifyStorefrontAccessToken}
                type="password"
                placeholder={shopifyStorefrontAccessToken === SECRET_MASK ? SECRET_MASK : "shpat_…"}
                hint="Public Storefront API token. Required for catalog sync and checkout."
                autoComplete="off"
              />

              <SettingsField
                light={light}
                id="shopify-client-id"
                label="App client ID (optional)"
                value={shopifyClientId}
                onChange={setShopifyClientId}
                type="password"
                placeholder={shopifyClientId === SECRET_MASK ? SECRET_MASK : "From dev.shopify.com"}
                autoComplete="off"
              />

              <SettingsField
                light={light}
                id="shopify-client-secret"
                label="App client secret (optional)"
                value={shopifyClientSecret}
                onChange={setShopifyClientSecret}
                type="password"
                placeholder={
                  shopifyClientSecret === SECRET_MASK ? SECRET_MASK : "Server-side only"
                }
                autoComplete="off"
              />

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 ${
                  light
                    ? "border-stone-300/70 bg-white"
                    : "border-slate-700/50 bg-slate-900/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={shopifyCatalogEnabled}
                  onChange={(e) => setShopifyCatalogEnabled(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500/30"
                />
                <span>
                  <span className={`block text-sm font-medium ${light ? "text-stone-800" : "text-stone-100"}`}>
                    Use Shopify for product catalog
                  </span>
                  <span className={`mt-1 block text-xs leading-relaxed ${light ? "text-stone-500" : "text-slate-400"}`}>
                    When enabled, collection pages read from Shopify when local
                    inventory is empty. Leave off to use Firestore products from
                    the dashboard.
                  </span>
                </span>
              </label>

              <StatusBanner
                light={light}
                tone={
                  shopifyTestMessage.includes("Connected") ||
                  shopifyTestMessage.includes("succeeded")
                    ? "success"
                    : shopifyTestMessage && !shopifyTestMessage.includes("required")
                      ? shopifyTestMessage.startsWith("Shopify returned")
                        ? "error"
                        : "neutral"
                      : "neutral"
                }
                message={shopifyTestMessage}
              />

              <div className="flex flex-wrap gap-3 pt-1">
                <PrimaryButton
                  type="button"
                  disabled={testBusy === "shopify"}
                  className="px-5 py-2.5"
                  onClick={() => handleTest("shopify", false)}
                >
                  {testBusy === "shopify" ? "Testing…" : "Test connection"}
                </PrimaryButton>
                <button
                  type="button"
                  disabled={testBusy === "shopify"}
                  onClick={() => handleTest("shopify", true)}
                  className={dash.ordersGhostButton(light)}
                >
                  Test & save
                </button>
              </div>
            </div>
          </DashboardFormSection>

          <DashboardFormSection light={light} title="Stuller showcase">
            <div className="space-y-5">
              <SettingsField
                light={light}
                id="stuller-embed-url"
                label="Embed URL"
                value={stullerEmbedUrl}
                onChange={setStullerEmbedUrl}
                placeholder="https://…jewelershowcase.com/"
                hint="From Stuller Showcase → Embed. Appears on Shop All inside your site layout."
              />

              <StatusBanner
                light={light}
                tone={stullerTestMessage.includes("reachable") || stullerTestMessage.includes("valid") ? "success" : "neutral"}
                message={stullerTestMessage}
              />

              <div className="flex flex-wrap gap-3 pt-1">
                <PrimaryButton
                  type="button"
                  disabled={testBusy === "stuller"}
                  className="px-5 py-2.5"
                  onClick={() => handleTest("stuller", false)}
                >
                  {testBusy === "stuller" ? "Testing…" : "Test URL"}
                </PrimaryButton>
                <button
                  type="button"
                  disabled={testBusy === "stuller"}
                  onClick={() => handleTest("stuller", true)}
                  className={dash.ordersGhostButton(light)}
                >
                  Test & save
                </button>
              </div>
            </div>
          </DashboardFormSection>
          </div>

          <div id="account-security" className="scroll-mt-8 grid gap-8 lg:grid-cols-2">
            <DashboardFormSection light={light} title="Account security">
              <p className={`mb-5 text-sm leading-relaxed ${light ? "text-stone-600" : "text-slate-400"}`}>
                Update your dashboard password. Credentials live in Firebase
                Authentication only. Never stored in Firestore.
              </p>
              <ChangePasswordForm embedded light={light} />
            </DashboardFormSection>

            <SettingsAccountOverview light={light} />
          </div>

          <div className="flex justify-end pt-2">
            <PrimaryButton
              type="button"
              disabled={busy}
              className="px-8 py-3.5"
              onClick={handleSave}
            >
              {busy ? "Saving…" : "Save all settings"}
            </PrimaryButton>
          </div>
        </>
      ) : null}
    </div>
  );
}
