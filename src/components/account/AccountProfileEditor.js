"use client";

import { useEffect, useMemo, useState } from "react";
import EditBillingAddressDialog from "@/components/account/EditBillingAddressDialog";
import EditPersonalInfoDialog from "@/components/account/EditPersonalInfoDialog";
import EditShippingAddressDialog from "@/components/account/EditShippingAddressDialog";
import MemberProfileView from "@/components/account/MemberProfileView";
import { useAuth } from "@/context/AuthContext";
import { fetchOrdersForCurrentUser } from "@/lib/orders-queries";

/**
 * Live member profile with edit modals — Firebase Auth + Firestore `useraccounts`.
 */
export default function AccountProfileEditor({
  ordersHref = "/account/orders",
  orderDetailBasePath = "/account/orders",
}) {
  const { user, userAccount } = useAuth();
  const [personalOpen, setPersonalOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);
  const [billingOpen, setBillingOpen] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user?.email || userAccount.status !== "ready") {
      setOrderCount(0);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const orders = await fetchOrdersForCurrentUser();
        if (!cancelled) setOrderCount(orders.length);
      } catch {
        if (!cancelled) setOrderCount(0);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.email, userAccount.status]);

  const profile = useMemo(
    () => ({
      id: user?.uid,
      firstName: userAccount.firstName,
      lastName: userAccount.lastName,
      email: user?.email ?? "",
      phone: userAccount.phone,
      shippingAddress: userAccount.shippingAddress,
      billingAddress: userAccount.billingAddress,
      billingSameAsShipping: userAccount.billingSameAsShipping,
      memberSince: user?.metadata?.creationTime,
      orderCount,
    }),
    [user, userAccount, orderCount],
  );

  const emailEditable = useMemo(
    () => user?.providerData?.some((p) => p.providerId === "password") ?? false,
    [user],
  );

  const showPasswordForm = emailEditable;

  if (userAccount.status !== "ready") {
    return (
      <p className="text-sm text-site-secondary">Loading your profile…</p>
    );
  }

  return (
    <>
      <MemberProfileView
        profile={profile}
        ordersHref={ordersHref}
        orderDetailBasePath={orderDetailBasePath}
        editable
        showPasswordForm={showPasswordForm}
        onEditPersonal={() => setPersonalOpen(true)}
        onEditShipping={() => setShippingOpen(true)}
        onEditBilling={() => setBillingOpen(true)}
      />

      <EditPersonalInfoDialog
        open={personalOpen}
        onClose={() => setPersonalOpen(false)}
        profile={profile}
        emailEditable={emailEditable}
      />
      <EditShippingAddressDialog
        open={shippingOpen}
        onClose={() => setShippingOpen(false)}
        profile={profile}
      />
      <EditBillingAddressDialog
        open={billingOpen}
        onClose={() => setBillingOpen(false)}
        profile={profile}
      />
    </>
  );
}
