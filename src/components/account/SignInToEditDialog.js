"use client";

import Link from "next/link";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useOverlayChrome } from "@/hooks/useOverlayChrome";
import * as overlayChrome from "@/lib/overlayChrome";

/**
 * @param {{ open: boolean; onClose: () => void; returnTo?: string }} props
 */
export default function SignInToEditDialog({ open, onClose, returnTo }) {
  const { light } = useOverlayChrome();
  const loginHref = returnTo
    ? `/login?next=${encodeURIComponent(returnTo)}`
    : "/login";

  return (
    <Dialog open={open} onClose={onClose} className="relative z-[200]">
      <DialogBackdrop transition className={overlayChrome.FAINT_BLUR_BACKDROP_CLASS} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className={`${overlayChrome.checkoutDialogModalPanel(light)} w-full max-w-md`}
        >
          <DialogTitle className={overlayChrome.dialogTitleModal(light)}>
            Sign in to edit your profile
          </DialogTitle>
          <p className={`mt-4 text-sm leading-relaxed ${overlayChrome.pageMutedText(light)}`}>
            Profile updates sync with Firebase Auth and your saved account details so
            you can sign in and check out with the latest information.
          </p>
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <SecondaryButton type="button" onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton href={loginHref} className="px-6">
              Sign in
            </PrimaryButton>
          </div>
          <p className={`mt-6 text-center text-sm ${overlayChrome.pageMutedText(light)}`}>
            New here?{" "}
            <Link href="/register" className={overlayChrome.authLinkAccent(light)}>
              Create an account
            </Link>
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
