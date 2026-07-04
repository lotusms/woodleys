"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import AccountProfileEditor from "@/components/account/AccountProfileEditor";
import MemberProfileView from "@/components/account/MemberProfileView";
import SignInToEditDialog from "@/components/account/SignInToEditDialog";
import { useAuth } from "@/context/AuthContext";

/**
 * @param {{
 *   sampleProfile: import("@/components/account/MemberProfileView").MemberProfile;
 *   subtitle?: string;
 *   returnTo?: string;
 *   demoProfileId?: string;
 * }} props
 */
export default function MemberProfilePage({
  sampleProfile,
  subtitle = "Saved contact and shipping details for quicker checkout and order support.",
  returnTo,
  demoProfileId,
}) {
  const { user, loading, userAccount } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const isDemoProfile = Boolean(demoProfileId);
  const demoOrdersHref = demoProfileId
    ? `/profile/${demoProfileId}/orders`
    : null;

  const canEditLive =
    !isDemoProfile &&
    Boolean(user) &&
    !loading &&
    userAccount.status === "ready" &&
    userAccount.guest !== true;

  const pageTitle = useMemo(() => {
    if (canEditLive) {
      return [userAccount.firstName, userAccount.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
    }
    return [sampleProfile.firstName, sampleProfile.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
  }, [canEditLive, sampleProfile, userAccount.firstName, userAccount.lastName]);

  const promptSignIn = () => setSignInOpen(true);

  return (
    <PageLayout
      eyebrow="Member profile"
      title={pageTitle || "Customer profile"}
      subtitle={subtitle}
    >
      {canEditLive ? (
        <AccountProfileEditor
          ordersHref="/account/orders"
          orderDetailBasePath="/account/orders"
        />
      ) : (
        <>
          {!user && !loading ? (
            <p className="mb-8 rounded-xl border border-stone-200/80 bg-champagne/40 px-4 py-3 text-sm leading-relaxed text-site-secondary">
              This page shows sample profile data.{" "}
              <Link
                href={returnTo ? `/login?next=${encodeURIComponent(returnTo)}` : "/login"}
                className="font-semibold text-warm-gold-dark hover:text-site-fg"
              >
                Sign in
              </Link>{" "}
              to view and edit your live profile, including email, password, and addresses.
            </p>
          ) : null}

          <MemberProfileView
            profile={sampleProfile}
            ordersHref={demoOrdersHref}
            orderDetailBasePath={
              demoProfileId ? `/profile/${demoProfileId}/orders` : null
            }
            editable
            showPasswordPrompt
            onEditPersonal={promptSignIn}
            onEditShipping={promptSignIn}
            onEditBilling={promptSignIn}
            onEditPassword={promptSignIn}
          />

          <SignInToEditDialog
            open={signInOpen}
            onClose={() => setSignInOpen(false)}
            returnTo={returnTo}
          />
        </>
      )}
    </PageLayout>
  );
}
