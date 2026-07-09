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
 *   productTitle: string;
 *   busy?: boolean;
 *   onClose: () => void;
 *   onConfirm: () => void | Promise<void>;
 * }} props
 */
export default function DashboardDeleteProductDialog({
  open,
  productTitle,
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

  const canDelete = confirmation.trim() === "DELETE" && !busy;

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
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`${overlayChrome.checkoutDialogModalPanel(light)} w-full max-w-md`}
        >
          <DialogTitle className={overlayChrome.dialogTitleModal(light)}>
            Delete product permanently?
          </DialogTitle>
          <p
            className={`mt-4 text-sm leading-relaxed ${overlayChrome.pageMutedText(light)}`}
          >
            This permanently removes{" "}
            <span className="font-medium text-site-fg">
              {productTitle || "this product"}
            </span>{" "}
            from Firestore. This cannot be undone.
          </p>
          <label htmlFor={inputId} className="mt-6 block">
            <span
              className={`mb-1.5 block text-xs font-medium uppercase tracking-wider ${light ? "text-stone-600" : "text-slate-400"}`}
            >
              Type DELETE to confirm
            </span>
            <input
              id={inputId}
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              disabled={busy}
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="DELETE"
              className={
                light
                  ? "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none ring-amber-400/40 placeholder:text-stone-400 focus:ring-2"
                  : "w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 outline-none ring-amber-400/30 placeholder:text-slate-500 focus:ring-2"
              }
            />
          </label>
          <div className="mt-8 flex flex-wrap justify-end gap-3">
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
              {busy ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
