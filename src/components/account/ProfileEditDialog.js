"use client";

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
 *   onClose: () => void;
 *   title: string;
 *   children: import("react").ReactNode;
 * }} props
 */
export default function ProfileEditDialog({ open, onClose, title, children }) {
  const { light } = useOverlayChrome();

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[200]">
      <DialogBackdrop transition className={overlayChrome.FAINT_BLUR_BACKDROP_CLASS} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`${overlayChrome.checkoutDialogModalPanel(light)} max-h-[min(92vh,880px)] w-full max-w-2xl overflow-y-auto`}
        >
          <DialogTitle className={overlayChrome.dialogTitleModal(light)}>
            {title}
          </DialogTitle>
          <div className="mt-6">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
