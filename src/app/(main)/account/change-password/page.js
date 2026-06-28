"use client";

import ChangePasswordForm from "@/components/auth/ChangePasswordForm";
import { orgName } from "@/config";

export default function ChangePasswordPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h2 className="font-serif text-2xl font-medium tracking-[-0.02em] text-site-fg sm:text-3xl">
        Change password
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-site-secondary">
        Enter your current password, then choose a new one. This updates your
        sign-in for {orgName} only.
      </p>

      <ChangePasswordForm backHref="/account" backLabel="Back to account overview" />
    </div>
  );
}
