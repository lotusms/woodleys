"use client";

import { useEffect, useId, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import * as overlayChrome from "@/lib/overlayChrome";

/**
 * @param {{
 *   open: boolean;
 *   productTitle?: string;
 *   productTitles?: string[];
 *   count?: number;
 *   busy?: boolean;
 *   onClose: () => void;
 *   onConfirm: () => void | Promise<void>;
 * }} props
 */
export default function DashboardDeleteProductDialog({
  open,
  productTitle = "",
  productTitles = [],
  count = 0,
  busy = false,
  onClose,
  onConfirm,
}) {
  const { light } = useOverlayChrome();
  const inputId = useId();
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    if (!open) setConfirmation("");
  }, [open]);

  const bulkCount = Math.max(
    count,
    Array.isArray(productTitles) ? productTitles.length : 0,
    productTitle ? 1 : 0,
  );
  const isBulk = bulkCount > 1;
  const canDelete =
    confirmation.trim().toLowerCase() === "delete" && !busy && bulkCount > 0;

  const previewTitles = (
    Array.isArray(productTitles) && productTitles.length > 0
      ? productTitles
      : productTitle
        ? [productTitle]
        : []
  ).slice(0, 8);
  const remaining = Math.max(0, bulkCount - previewTitles.length);

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!busy) onClose();
      }}
      className="relative z-[200]"
    >
      <DialogBackdrop
        transition
        className={overlayChrome.FAINT_BLUR_BACKDROP_CLASS}
      />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          transition
          className={
            light
              ? "flex h-full w-full max-w-[min(100vw,28rem)] flex-col border-l border-stone-300/70 bg-white shadow-2xl shadow-stone-400/20 transition duration-300 data-closed:translate-x-full data-closed:opacity-0"
              : "flex h-full w-full max-w-[min(100vw,28rem)] flex-col border-l border-slate-700/50 bg-slate-950 shadow-2xl transition duration-300 data-closed:translate-x-full data-closed:opacity-0"
          }
        >
          <div className={overlayChrome.checkoutDialogDrawerHeaderBorder(light)}>
            <DialogTitle className={overlayChrome.dialogTitleDrawer(light)}>
              {isBulk
                ? `Delete ${bulkCount} products permanently?`
                : "Delete product permanently?"}
            </DialogTitle>
            <p
              className={`mt-2 text-sm leading-relaxed ${overlayChrome.pageMutedText(light)}`}
            >
              {isBulk ? (
                <>
                  This permanently removes{" "}
                  <span className="font-medium text-site-fg">{bulkCount}</span>{" "}
                  products from Firestore. This cannot be undone.
                </>
              ) : (
                <>
                  This permanently removes{" "}
                  <span className="font-medium text-site-fg">
                    {productTitle || previewTitles[0] || "this product"}
                  </span>{" "}
                  from Firestore. This cannot be undone.
                </>
              )}
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 py-5 sm:px-6">
            {isBulk && previewTitles.length > 0 ? (
              <ul
                className={`space-y-2 rounded-xl border p-3 text-sm ${
                  light
                    ? "border-stone-200 bg-stone-50 text-stone-800"
                    : "border-slate-700 bg-slate-900/60 text-slate-200"
                }`}
              >
                {previewTitles.map((title) => (
                  <li key={title} className="truncate">
                    {title}
                  </li>
                ))}
                {remaining > 0 ? (
                  <li
                    className={
                      light ? "text-stone-500" : "text-slate-500"
                    }
                  >
                    +{remaining} more
                  </li>
                ) : null}
              </ul>
            ) : null}

            <label htmlFor={inputId} className="block">
              <span
                className={`mb-1.5 block text-xs font-medium uppercase tracking-wider ${light ? "text-stone-600" : "text-slate-400"}`}
              >
                Type delete to confirm
              </span>
              <input
                id={inputId}
                type="text"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                disabled={busy}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="delete"
                className={
                  light
                    ? "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-amber-400/40 placeholder:text-stone-400 focus:ring-2"
                    : "w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-amber-400/30 placeholder:text-slate-500 focus:ring-2"
                }
              />
            </label>
          </div>

          <div
            className={`mt-auto flex flex-wrap justify-end gap-3 border-t px-4 py-4 sm:px-6 ${
              light ? "border-stone-200" : "border-slate-700/50"
            }`}
          >
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              className={
                light
                  ? "rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-60"
                  : "rounded-xl border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5 disabled:opacity-60"
              }
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canDelete}
              onClick={() => void onConfirm()}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy
                ? "Deleting…"
                : isBulk
                  ? `Delete ${bulkCount} products`
                  : "Delete permanently"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
